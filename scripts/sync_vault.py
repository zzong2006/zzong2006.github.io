#!/usr/bin/env python3
"""sync-vault.sh 와 같은 일을 하는 Python 버전 (rsync 가 없는 환경용).

sync-vault.sh 는 rsync 에 의존한다. Windows + Git Bash 에는 rsync 가 없어서
그 환경에서는 이 스크립트를 쓴다. 동기화 규칙은 sync-vault.sh 와 동일하다.

동작 방식
  - content/ 에 "이미 존재하는" 하위 폴더만 동기화 대상으로 삼는다(화이트리스트).
    vault 의 private/ 같은 비공개 폴더는 content/ 에 대응 폴더가 없으므로 자동
    제외된다. 새 영역을 공개하려면 먼저 content/<폴더> 를 만든다.
  - content/ 에만 있고 vault 에 없는 폴더(images 를 뺀 resume 등 사이트 전용)는
    건드리지 않는다.
  - .obsidian, .trash, templates 등 런타임/도구 산출물은 제외한다.
  - 기본은 추가/갱신만 한다. vault 에서 지운 파일을 content/ 에서도 지우려면
    --delete 를 준다.

사용법
  python scripts/sync_vault.py --vault ~/Documents/obsidian/valut6807 --dry-run
  python scripts/sync_vault.py --vault ~/Documents/obsidian/valut6807 --delete

frontmatter 정규화는 이 스크립트가 하지 않는다. 정본은
scripts/normalize-frontmatter.mjs 이고 배포 워크플로(deploy.yml)가 매 빌드마다
실행한다. Node 가 있는 환경이면 로컬에서도 `npm run normalize-frontmatter` 로
같은 결과를 얻을 수 있다.
"""

from __future__ import annotations

import argparse
import filecmp
import io
import os
import shutil
import sys
from pathlib import Path


if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parents[1]
EXCLUDE_DIRS = {
    ".obsidian",
    ".trash",
    ".git",
    ".claude",
    ".smart-env",
    "templates",
    "_publish",
    "_site",
    "node_modules",
    "__pycache__",
}
EXCLUDE_FILES = {".DS_Store", "Thumbs.db"}


def relative_files(base: Path) -> set[str]:
    found: set[str] = set()
    for root, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for name in files:
            if name in EXCLUDE_FILES:
                continue
            found.add(Path(root, name).relative_to(base).as_posix())
    return found


def prune_empty_dirs(base: Path) -> None:
    for root, _dirs, _files in os.walk(base, topdown=False):
        path = Path(root)
        if path == base:
            continue
        if not any(path.iterdir()):
            path.rmdir()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--vault",
        type=Path,
        default=Path(os.environ.get("VAULT_DIR", "~/Documents/obsidian/valut6807")),
        help="vault 경로 (기본: $VAULT_DIR 또는 ~/Documents/obsidian/valut6807)",
    )
    parser.add_argument("--content", type=Path, default=REPO_ROOT / "content")
    parser.add_argument("--dry-run", action="store_true", help="복사하지 않고 미리보기")
    parser.add_argument("--delete", action="store_true", help="vault 에 없는 파일을 content 에서 제거")
    parser.add_argument("--limit", type=int, default=12, help="목록으로 보여줄 최대 항목 수")
    args = parser.parse_args()

    vault = args.vault.expanduser().resolve()
    content = args.content.expanduser().resolve()

    if not vault.is_dir():
        print(f"vault 를 찾을 수 없습니다: {vault}", file=sys.stderr)
        return 2
    if not content.is_dir():
        print(f"content/ 를 찾을 수 없습니다: {content}", file=sys.stderr)
        return 2

    print(f"vault   : {vault}")
    print(f"content : {content}")
    if args.dry_run:
        print("(dry-run: 실제로 복사하지 않음)")
    if args.delete:
        print("(--delete: vault 에 없는 파일은 content 에서 제거)")
    print()

    added: list[str] = []
    updated: list[str] = []
    removed: list[str] = []
    skipped: list[str] = []

    for target_dir in sorted(p for p in content.iterdir() if p.is_dir()):
        name = target_dir.name
        source_dir = vault / name
        if not source_dir.is_dir():
            skipped.append(name)
            continue

        source_files = relative_files(source_dir)
        target_files = relative_files(target_dir)

        for rel in sorted(source_files - target_files):
            added.append(f"{name}/{rel}")
            if not args.dry_run:
                destination = target_dir / rel
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source_dir / rel, destination)

        for rel in sorted(source_files & target_files):
            source, destination = source_dir / rel, target_dir / rel
            if filecmp.cmp(source, destination, shallow=False):
                continue
            updated.append(f"{name}/{rel}")
            if not args.dry_run:
                shutil.copy2(source, destination)

        if args.delete:
            for rel in sorted(target_files - source_files):
                removed.append(f"{name}/{rel}")
                if not args.dry_run:
                    (target_dir / rel).unlink()

    if args.delete and not args.dry_run:
        prune_empty_dirs(content)

    print(f"추가 {len(added)} / 갱신 {len(updated)} / 삭제 {len(removed)}")
    print(f"vault 에 없어 건너뛴 content 폴더: {skipped}")
    if len(updated) > len(added) + len(removed) + 50:
        print()
        print("참고: '갱신' 이 거의 전체로 나오는 것은 정상이다. content/ 는 Quartz 형식으로")
        print("      정규화돼 있고(tags: [\"x\"]) vault 는 Obsidian 형식(블록 리스트)이라")
        print("      바이트 비교가 항상 달라진다. 실제 변경은 동기화 후 git diff 로 판단할 것.")

    for label, items in (("추가", added), ("삭제", removed), ("갱신", updated)):
        if not items:
            continue
        print(f"\n--- {label} {len(items)}건 ---")
        for item in items[: args.limit]:
            print("   " + item)
        if len(items) > args.limit:
            print(f"   ... {len(items) - args.limit}건 더")

    if not args.dry_run:
        print("\n다음 단계: git diff 로 확인한 뒤 `git add content && git commit && git push`")
        print("push 하면 deploy.yml 이 frontmatter 정규화와 Quartz 빌드를 실행한다.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
