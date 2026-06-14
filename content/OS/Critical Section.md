---
tags: ["operating_system", "concurrency"]
aliases: ["critical section"]
---

# A) Critical Section ?

Critical Section 은 여러 [[thread]] 또는 [[Process]] 가 동시에 접근하면 안 되는 shared resource 를 다루는 코드 구간이다.

예를 들어 공유 counter 를 증가시키는 코드는 읽기, 증가, 쓰기 단계가 분리되어 있어 동시에 실행되면 race condition 이 생길 수 있다. 이런 구간은 [[Mutex]], semaphore, lock 같은 동기화 도구로 보호한다.

# B) 핵심 조건

| 조건 | 의미 |
| --- | --- |
| Mutual exclusion | 한 번에 하나의 실행 흐름만 critical section 에 들어감 |
| Progress | 들어갈 수 있는 실행 흐름이 있으면 무한히 미루지 않음 |
| Bounded waiting | 특정 실행 흐름이 영원히 기다리지 않음 |

# C) Related

* [[Mutex]]
* [[Semaphore]]
* [[deadlock]]

