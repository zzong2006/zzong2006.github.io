---
tags: ["operating_system"]
aliases: ["프로세스"]
---

# A) Process 란

OS 로 부터 시스템 자원을 할당받고 메모리에 적재되어 실행되고 있는 프로그램 (program) 의 인스턴스를 의미하며, 여기서 프로그램은 실행 가능한 파일을 뜻한다.

# B) Process 가 할당 받는 시스템 자원

[[CPU]]

* 주소 공간
* 4 개의 [[Memory|메모리]] 공간: code, data, stack, heap (아래 그림 참조, 순서도 중요)

ℹ️ CPU 의 프로세서 (Processor, single core) 는 하나의 프로세스 ([[Process]]) 만 구동할 수 있다.

* 하나의 CPU 로 여러 프로세스를 구동하기 위해 [[시분할 방식]] 을 이용함
* 자세한 내용은 [[CPU Scheduling]] 참조

# C) 프로세스의 생명 주기 (process states)

총 5 개: new, ready, running, waiting, terminated
![https://i.loli.net/2020/10/19/nwYzpmhc7rS6eid.jpg](https://i.loli.net/2020/10/19/nwYzpmhc7rS6eid.jpg)

# D) Related

# E) References
