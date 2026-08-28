# AGENTS.md

이 저장소는 [zzong2006.github.io](https://zzong2006.github.io/) 를 발행하는 Quartz
사이트다. 노트 원본은 **별도의 private vault 저장소**(`zzong2006/obsidian-vault`)에
있고 여기 `content/` 는 그 사본이다.

아래 규칙은 실제로 사고가 났던 것들만 적었다. 지키지 않으면 같은 일이 다시 난다.

## A) content/ 는 산출물이다

`content/` 는 vault 에서 복사된다. **노트 내용은 vault 원본에서 고친다.**
`content/` 를 직접 고치면 다음 동기화 때 덮여 사라진다.

예외는 사이트 전용 파일 두 개다. 이건 vault 에 없으므로 여기서 고친다.

- `content/index.md`
- `content/resume/index.md`

동기화는 vault 기준 단방향이다. 자세한 흐름은 vault 의 `PUBLISHING.md` 를 본다.

```bash
# rsync 가 있는 환경
VAULT_DIR=~/Documents/obsidian/valut6807 bash scripts/sync-vault.sh --delete --normalize

# rsync 가 없는 환경(Windows + Git Bash)
python scripts/sync_vault.py --vault ~/Documents/obsidian/valut6807 --dry-run --delete
python scripts/sync_vault.py --vault ~/Documents/obsidian/valut6807 --delete
```

`--dry-run` 의 '갱신' 수가 거의 전체로 나오는 것은 정상이다. `content/` 는 Quartz
형식으로 정규화돼 있고 vault 는 Obsidian 형식이라 바이트 비교가 항상 달라진다.
실제 변경은 동기화 후 `git diff` 로 판단한다.

### A.1) 동기화 전에 반드시 확인할 것

동기화는 vault 로 `content/` 를 덮는다. 그래서 **`content/` 에만 있는 개선이
있으면 그게 사라진다.** 과거에 이렇게 잃을 뻔한 것들이 있다.

- 이미지 로컬화: 외부 hotlink 를 저장소 내 이미지(`![[img-....png]]`)로 바꾼 작업.
  166개 파일 315개 임베드가 되돌아갈 상황이었다.
- 사이트에서만 개선한 노트: KL-Divergence 등 4건이 본문이 줄어들 상황이었다.
- 사이트에서만 작성한 노트: TabFM, GKD, KL 다이어그램 svg.

동기화 후 push 전에 다음을 확인한다.

```bash
# 본문(frontmatter 제외)이 줄어든 파일이 있는지 — 있으면 vault 로 역반영이 먼저다
git diff --stat -- content | tail -3
```

`content/` 에만 있는 것을 발견하면 **먼저 vault 로 역반영**하고 다시 동기화한다.

## B) title frontmatter 는 필수다

모든 노트 frontmatter 에 `title:` 이 있어야 한다. Quartz 는 `title` 이 없으면
첫 헤딩을 제목으로 쓰는데, 이 vault 는 `# A) 핵심 요약` 처럼 섹션 헤딩으로
시작하는 노트가 900개다. title 이 빠지면 페이지 제목·breadcrumb·사이드바가
전부 "핵심 요약" 같은 값이 된다. 실제로 1288개 페이지가 그렇게 깨진 적 있다.

vault 의 Obsidian Linter 가 파일명으로 채워주고, 안전장치로
`scripts/normalize-frontmatter.mjs` 도 없으면 파일명으로 채운다.

## C) 사내 정보는 배포 게이트가 막는다

`deploy.yml` 의 `Check for internal information in content` 단계가 발행 전에
`content/` 전체를 검사한다. 걸리면 배포가 실패한다.

- 패턴 목록은 **이 저장소에 없다.** 사내 코드네임과 호스트명 목록 자체가 사내
  정보이므로 public 저장소에 두면 막으려는 것과 같은 유출이 된다.
  런타임에 `PRIVATE_PATTERNS_JSON` secret 을 파일로 풀어서 넘긴다.
- 원본은 vault 의 `private-patterns.json` 이다. 패턴이나 allowlist 를 고치면
  secret 도 갱신해야 한다.
- secret 이 비면 검사를 건너뛰지 않고 **실패**한다(fail-closed). 게이트가 조용히
  사라지는 것이 가장 위험하다.

공개해도 되는지 애매한 노트는 vault 의 `private/` 에 둔다. 이 검사는 최후
방어선이고, 목록에 없는 새 사내 이름은 잡지 못한다.

## D) 여러 세션이 동시에 작업할 때

이 저장소는 에이전트 세션 여러 개가 동시에 붙는 일이 있다. 실제로 한 세션의
커밋이 다른 세션의 기능 브랜치 위에 올라간 사고가 있었다.

### D.1) 자기 worktree 에서 작업한다

같은 클론에서 브랜치를 갈아타면 다른 세션의 HEAD 를 움직인다. 세션마다 worktree 를
따로 쓴다.

```bash
git worktree list                      # 이미 있는 worktree 확인
git worktree add ../site-<용도> -b <브랜치>
```

worktree 는 `.git` 을 공유하므로 **ref 와 객체는 공유된다.** 즉 브랜치 충돌은
막아주지만 push 경쟁은 그대로다.

### D.2) 커밋 전에 브랜치를 확인한다

```bash
git rev-parse --abbrev-ref HEAD
```

내가 두고 간 브랜치가 그대로일 것이라고 가정하지 않는다.

### D.3) push 는 fetch → rebase → push

```bash
git fetch origin && git rebase origin/main && git push origin main
```

`--force` 는 쓰지 않는다. 불가피하면 `--force-with-lease` 를 쓴다.

### D.4) 히스토리 rewrite 는 worktree 로 해결되지 않는다

`filter-repo` 같은 히스토리 재작성은 **전용 fresh clone 에서, 저장소를 독점한
상태로만** 한다. worktree 는 객체와 ref 를 공유하므로 도움이 되지 않는다.

과거에 공유 클론에서 rewrite 를 돌렸다가 다른 세션의 `pull` 로 결과가 원본으로
덮여 836초 작업이 그대로 버려졌다. force push 였다면 그 세션의 커밋을 날렸다.

rewrite 가 필요하면 다른 세션이 작업을 끝내고 push 를 완료했는지 먼저 확인한다.

## E) 이 환경에서 없는 것

개발 머신(Windows)에 다음이 없을 수 있다. 있다고 가정하고 명령을 만들지 않는다.

- `rsync` → `scripts/sync_vault.py` 를 쓴다
- `node` / `npm` → 로컬 빌드와 `normalize-frontmatter` 를 돌릴 수 없다.
  배포 워크플로가 매 빌드마다 정규화를 실행하므로 사이트 결과는 같다.

PowerShell 5.1 은 `<` 입력 리다이렉션을 지원하지 않고, 한글이 든 파일을 native
exe 로 파이프하면 인코딩이 깨질 수 있다. 그런 경우 Git Bash 를 쓰거나 ASCII 로
이스케이프한 사본을 만든다.

# References

- vault 의 `AGENTS.md` — 노트 작성 규칙, 폴더 구조
- vault 의 `PUBLISHING.md` — 발행 흐름 정본
