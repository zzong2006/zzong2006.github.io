---
title: "poetry"
tags: ["python"]
---

# A) Poetry ?

poetry 를 사용하는 경우에 vscode 에서 python interpreter 를 잘 잡지 못한다. 이로 인해 내가 겪은 문제는 `linter` 나 `formatter` 를 vscode 에서 제공하는 방법으로 쓸 수 없는 것이다.

해결법은 간단하다 poetry 는 virtualenv 환경을 프로젝트 내부가 아닌 홈 디렉토리에 구축하는데 이를 프로젝트 내부로 변경하면 된다. 변경한 이후에 vscode 를 재시작하면 알아서 `./.venv/bin/python` 을 인터프리터로 인식해서 원하는대로 동작한다. 수정하는 방법은 다음과 같다.

```bash
poetry config virtualenvs.in-project true
poetry config virtualenvs.path "./.venv"

# 프로젝트 내부에 venv 새로 설치
poetry install && poetry update
```

		마지막으로 vscode 를 재시작하고 `Python: Select Interpreter` 로 `.venv/bin/python` 을 선택하면 된다.

경로가 어딘지 모르겠다면 아래 내용을 입력한다.

```bash
poetry env info
```

# B) Related

# C) References

참고: [https://github.com/microsoft/vscode-python/issues/1871](https://github.com/microsoft/vscode-python/issues/1871)
