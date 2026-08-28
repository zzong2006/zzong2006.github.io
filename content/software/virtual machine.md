---
title: "virtual machine"
aliases: ["가상 머신", "VM"]
tags:
  - software
---

# A) Virtual Machine ?

물리 하드웨어가 하는 일을 소프트웨어로 흉내 내어, 그 위에서 프로그램이 진짜 기계 위에서처럼 돌게 만드는 계층이다. "가상"이라는 말이 붙는 이유는 프로그램이 보는 명령어 집합·메모리·레지스터가 실제 CPU 의 것이 아니라 VM 이 정의한 것이기 때문이다.

같은 이름으로 성격이 꽤 다른 두 가지를 부른다.

# B) Process VM (언어 가상 머신)

프로그램 하나를 실행하기 위한 VM 이다. 언어가 정의한 bytecode 를 읽어 한 명령씩 해석·실행하는 루프가 핵심이고, JVM 과 CPython 의 실행 엔진이 여기에 속한다.

[[software/Interpreted language|인터프리터 언어]] 가 이 구조를 쓰는 이유는 이식성이다. 소스를 기계어로 바로 컴파일하면 CPU 아키텍처마다 결과물이 달라지지만, bytecode 로 컴파일해 두면 각 플랫폼에 맞는 VM 만 있으면 같은 파일이 그대로 돈다. [[Python]] 이 `.py` 를 `.pyc` 로 바꿔 두고 실행하는 것이 이 단계다.

대신 명령마다 해석 비용이 붙어 네이티브 코드보다 느리다. 이 손해를 줄이려고 자주 도는 구간만 실행 중에 기계어로 컴파일하는 JIT 을 얹기도 한다.

# C) System VM (하드웨어 가상화)

운영체제 전체를 올리기 위한 VM 이다. hypervisor 가 CPU·메모리·디스크·네트워크를 쪼개서 각 guest OS 에게 독립된 기계처럼 보여준다. VMware, VirtualBox, 클라우드의 인스턴스가 이 방식이다.

Docker 같은 container 와 자주 비교되는데, container 는 guest OS 를 따로 올리지 않고 host 커널을 공유한다. 그래서 기동이 빠르고 가볍지만 격리 수준은 System VM 보다 약하다.

# D) References
