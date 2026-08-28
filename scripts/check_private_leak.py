#!/usr/bin/env python3
"""content/ 에 사내 정보가 섞였는지 검사한다.

발행 여부는 폴더로 정하지만(content/ 에 있는 것만 나간다), 공개 폴더 안의
정상적인 노트 본문에 사내 링크나 내부 호스트명이 섞이는 것은 폴더로 막을 수
없다. 실제로 statistic/ 의 통계 노트 한 건이 그렇게 발행된 적이 있다.
이 검사는 그 경우를 잡는 최후 방어선이다.

패턴은 이 저장소에 두지 않는다. 사내 코드네임과 호스트명 목록 자체가 사내
정보이므로 public 저장소에 커밋하면 막으려는 것과 같은 유출이 된다. CI 에서는
Actions secret(PRIVATE_PATTERNS_JSON)을 런타임에 파일로 풀어서 넘긴다.
원본은 private vault 저장소의 private-patterns.json 이다.

    PRIVATE_PATTERNS_FILE=/tmp/p.json python scripts/check_private_leak.py
    python scripts/check_private_leak.py --patterns /tmp/p.json --strict

한계: 목록에 있는 것만 잡는다. 새 사내 프로젝트명은 목록에 추가해야 걸린다.
주 방어는 여전히 "애매하면 vault 의 private/ 에 둔다" 이다.
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys
from pathlib import Path


if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {".md", ".mdx", ".txt"}


def load_patterns(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--patterns",
        type=Path,
        default=os.environ.get("PRIVATE_PATTERNS_FILE"),
        help="패턴 JSON 경로 (기본: $PRIVATE_PATTERNS_FILE)",
    )
    parser.add_argument("--content", type=Path, default=REPO_ROOT / "content")
    parser.add_argument("--strict", action="store_true", help="warning 도 실패로 취급")
    args = parser.parse_args()

    if not args.patterns:
        print("error: 패턴 파일이 지정되지 않았다 (--patterns 또는 $PRIVATE_PATTERNS_FILE).")
        print("       CI 라면 PRIVATE_PATTERNS_JSON secret 이 비어 있는지 확인할 것.")
        print("       검사를 건너뛰지 않고 실패로 처리한다. 게이트가 조용히 사라지면 의미가 없다.")
        return 2

    patterns_path = Path(args.patterns)
    if not patterns_path.is_file():
        print(f"error: 패턴 파일을 찾을 수 없다: {patterns_path}")
        return 2

    config = load_patterns(patterns_path)
    compiled = [
        (p["name"], re.compile(p["regex"], re.IGNORECASE), p.get("severity", "error"))
        for p in config["patterns"]
    ]
    # allowlist 의 path 는 content/ 기준 상대경로다. vault 저장소와 같은 JSON 을 쓴다.
    allowlist = {(entry["path"], entry["pattern"]) for entry in config.get("allowlist", [])}

    content_root = args.content
    if not content_root.is_dir():
        print(f"error: content/ 를 찾을 수 없다: {content_root}")
        return 2

    errors: list[str] = []
    warnings: list[str] = []
    checked = skipped = 0

    for path in sorted(content_root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        rel = path.relative_to(content_root).as_posix()
        checked += 1
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except UnicodeDecodeError:
            warnings.append(f"{rel}: UTF-8 로 읽을 수 없어 검사하지 못했다")
            continue

        for line_no, line in enumerate(lines, start=1):
            for name, regex, severity in compiled:
                match = regex.search(line)
                if not match:
                    continue
                if (rel, name) in allowlist:
                    skipped += 1
                    continue
                message = f"{rel}:{line_no}: [{name}] {match.group(0)}"
                (errors if severity == "error" else warnings).append(message)

    print(f"files_checked={checked}")
    print(f"allowlisted={skipped}")
    print(f"warnings={len(warnings)}")
    print(f"errors={len(errors)}")

    for message in warnings:
        print(f"warning: {message}")
    for message in errors:
        print(f"error: {message}")

    if errors:
        print()
        print("content/ 에 사내 정보가 있다. 배포를 중단한다.")
        print("vault 에서 해당 노트를 private/ 로 옮기거나 그 참조를 제거한 뒤 다시 동기화할 것.")
        print("공개해도 되는 참조라면 vault 의 private-patterns.json allowlist 에 근거와 함께")
        print("추가하고 PRIVATE_PATTERNS_JSON secret 을 갱신할 것.")
        return 1
    if args.strict and warnings:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
