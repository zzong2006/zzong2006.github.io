# CLAUDE.md

이 저장소의 작업 지침은 [AGENTS.md](AGENTS.md) 에 정본으로 관리한다.
Claude Code 를 포함한 모든 에이전트는 `AGENTS.md` 를 따른다.

특히 다음 네 가지는 실제로 사고가 났던 항목이다. 작업 전에 확인할 것.

- `content/` 는 vault 산출물이다. 노트 내용은 vault 에서 고친다 (AGENTS.md A)
- frontmatter `title:` 은 필수다 (AGENTS.md B)
- 사내 정보는 배포 게이트가 막는다. 패턴은 secret 이다 (AGENTS.md C)
- 세션이 여러 개 동시에 붙는다. 자기 worktree 에서 작업하고, 히스토리 rewrite 는
  전용 clone 에서 독점 상태로만 한다 (AGENTS.md D)

# References

- [AGENTS.md](AGENTS.md)
