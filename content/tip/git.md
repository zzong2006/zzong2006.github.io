---
tags: ["tip", "github"]
---

# A) Save Id & Password

메모리에 아이디와 패스워드 저장해놓는 방법은 아래와 같다. 이렇게 하면 `git pull` 과 같은 credential 정보가 필요할때마다 매번 입력하는 귀찮음은 발생하지 않는다.

```bash
git config credential.helper cache
```

# B) Tags

신규 태그를 릴리즈 하지않고 기존 태그에 새로운 커밋을 덮어씌울 수 있다.

```bash
git tag -f -a <tagname> [<commit> | <object>]
git push -f <remotename> refs/tags/<tagname>
```

[git - Change connected commit on release github - Stack Overflow](https://stackoverflow.com/questions/24849362/change-connected-commit-on-release-github)

# C) Remote Branch 로 Checkout

```bash
git remote add update git@<git-host>:<org>/<repo>.git
git fetch update
git checkout -t update/master
```

# D) Pull

* 현재 branch 따오기
	* `git rev-parse --abbrev-ref HEAD`
* 현재 branch 최신으로 유지
	* `git pull`

# E) Merge

* merge 잘못했을 때 복구하는 방법: `git reset --merge`

# F) Commit

* 최근 `2` 개의 commit 보기: `git log -2`
	* 최근 commit 에서 어떤 부분이 수정되었는지 확인하기: `git log -p`
* add 와 같이 commit 하기
	* `git commit -am "message"`

# G) Submodules

가끔 git 을 살펴보면 화살표가 달려있는 폴더가 있다. 해당 폴더는 submodule entry 로, 해당 폴더 자체가 또 다른 git repo 를 가리키고 있다는 것을 의미한다 ([stackoverflow](https://stackoverflow.com/questions/62056294/github-folders-have-a-white-arrow-on-them)).

모듈 building 을 하는데 이 폴더들이 필요한 경우가 있지만, submodule 폴더는 일반적으로 비어있다. 그래서 이 폴더를 다시 활성화 (받아오기) 해야 한다.

* `git submodule update --init`

# H) Reflog

* `git reflog`: commit 내역을 포함한 git 전체 history 를 볼 수 있음

# I) Local Change

* 로컬에 수정된 사항 확인하기: `git diff`
* 스테이지된 파일의 수정된 사항 확인하기: `git diff --staged`

# J) References
