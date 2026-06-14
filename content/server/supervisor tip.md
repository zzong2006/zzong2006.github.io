---
tags: ["tip", "linux"]
---

# A) 서버에서 Supervisord 어디서 도는지 확인하기

1. `ps aux | grep supervisord` 입력해서 `supervisord` 의 `pid` 확인
2. `sudo ls -al /proc/<pid> | grep cwd` 으로 알아내기

## A.1) 예시

```bash
# ls -al /proc/1 | grep cwd : 실행할 경우 다음과 virtual link가 나옴
lrwxrwxrwx   1 root root 0 Dec  8 23:38 cwd -> /daum/toros/contextual_bandit_pilot.git/...
```

## A.2) 해보면서 느낀점

대부분 프로세스 PID 가 1 번이고, `cwd` 는 supervisor 가 돌고있는 폴더에 대한 하이퍼링크라 단순히 `cd /proc/1/cwd` 만 해도 충분한 듯 하다.

# B) Related

# C) References
