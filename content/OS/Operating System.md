---
tags: ["OS"]
aliases: ["OS"]
---

# A) Operating System

Operating System은 application과 hardware 사이에서 resource를 관리하는 시스템 소프트웨어다. 사용자는 process, file, network 같은 추상화를 통해 hardware를 직접 다루지 않고도 계산 자원을 사용할 수 있다.

# B) 무엇을 관리하나

| 영역 | 역할 |
| --- | --- |
| [[OS/CPU]] | process/thread scheduling |
| Memory | virtual memory, page, cache |
| Storage | file system, block device |
| I/O | device driver, interrupt |
| Concurrency | lock, [[OS/Critical Section]], synchronization |

# C) 공부할 때의 축

OS 개념은 보통 “resource를 어떻게 나누고, 보호하고, 빠르게 쓰게 할 것인가”로 읽으면 흐름이 잡힌다. [[OS/CPU Scheduling|CPU Scheduling]]은 시간 자원을 나누는 문제이고, page replacement는 memory 공간을 제한된 cache처럼 쓰는 문제다.

# References
