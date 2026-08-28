#!/usr/bin/env bash
#
# sync-vault.sh — Obsidian vault의 공개 폴더를 repo의 content/ 로 복사한다.
#
# 동작 방식
#   - content/ 에 "이미 존재하는" 하위 폴더만 동기화 대상으로 삼는다(화이트리스트).
#     vault 의 비공개 노트는 private/ 하위에 모여 있고 content/ 에 대응 폴더가 없으므로
#     자동으로 제외된다. 새 폴더를 공개하려면 먼저 content/ 에 그 폴더를 만든다.
#   - .obsidian, .trash, .DS_Store, templates 등 런타임/비공개 산출물은 제외한다.
#   - 기본은 추가/갱신만 한다. vault 에서 지운 파일을 content/ 에서도 지우려면
#     --delete 를 준다.
#
# 사용법
#   VAULT_DIR=~/Documents/obsidian/valut6807 bash scripts/sync-vault.sh            # 복사
#   bash scripts/sync-vault.sh --dry-run                                  # 미리보기
#   bash scripts/sync-vault.sh --delete                                   # vault 기준 미러링
#   bash scripts/sync-vault.sh --normalize                                # 복사 후 frontmatter 정규화
#
# 복사 후에는 보통 다음을 이어서 돌린다.
#   npm run normalize-frontmatter   # Obsidian frontmatter → Quartz 형식 정리
#   git add content && git commit && git push   # push 시 Actions 가 자동 배포

# rsync 가 없는 환경(Windows + Git Bash 등)에서는 같은 규칙의 Python 버전을 쓴다.
#   python scripts/sync_vault.py --vault ~/Documents/obsidian/valut6807 --delete

set -euo pipefail

VAULT_DIR="${VAULT_DIR:-$HOME/Documents/obsidian/valut6807}"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTENT_DIR="$REPO_DIR/content"

DRY_RUN=""
DELETE=""
NORMALIZE=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN="--dry-run" ;;
    --delete) DELETE="--delete" ;;
    --normalize) NORMALIZE="1" ;;
    *) echo "알 수 없는 옵션: $arg" >&2; exit 1 ;;
  esac
done

if [ ! -d "$VAULT_DIR" ]; then
  echo "vault 를 찾을 수 없습니다: $VAULT_DIR" >&2
  echo "VAULT_DIR 환경변수로 경로를 지정하세요." >&2
  exit 1
fi

if [ ! -d "$CONTENT_DIR" ]; then
  echo "content/ 디렉토리를 찾을 수 없습니다: $CONTENT_DIR" >&2
  exit 1
fi

echo "vault   : $VAULT_DIR"
echo "content : $CONTENT_DIR"
[ -n "$DRY_RUN" ] && echo "(dry-run: 실제로 복사하지 않음)"
[ -n "$DELETE" ] && echo "(--delete: vault 에 없는 파일은 content 에서 삭제)"
echo ""

synced=0
skipped=0
for dir in "$CONTENT_DIR"/*/; do
  name="$(basename "$dir")"
  src="$VAULT_DIR/$name"
  if [ -d "$src" ]; then
    echo "▶ $name"
    rsync -a $DRY_RUN $DELETE \
      --exclude='.obsidian/' \
      --exclude='.trash/' \
      --exclude='.git/' \
      --exclude='.DS_Store' \
      --exclude='templates/' \
      "$src/" "$CONTENT_DIR/$name/"
    synced=$((synced + 1))
  else
    echo "· $name (vault 에 없음 → 건너뜀)"
    skipped=$((skipped + 1))
  fi
done

echo ""
echo "동기화 완료: $synced 폴더 처리, $skipped 폴더 건너뜀"

if [ -n "$NORMALIZE" ] && [ -z "$DRY_RUN" ]; then
  echo ""
  echo "▶ frontmatter 정규화 (npm run normalize-frontmatter)"
  (cd "$REPO_DIR" && npm run normalize-frontmatter)
fi
