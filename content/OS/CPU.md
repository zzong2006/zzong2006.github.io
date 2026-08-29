---
title: "CPU"
tags:
  - operating_system
  - computer_architecture
aliases: [processor, central processing unit]
---

# A) CPU ?

CPU(Central Processing Unit)는 프로그램의 명령어를 해석하고 실행하는 핵심 연산 장치다. OS 관점에서는 [[Process]] 와 [[thread]] 가 실제로 실행 시간을 할당받는 물리적 자원으로 볼 수 있다.

# B) OS에서 보는 CPU

여러 process 가 동시에 실행되는 것처럼 보이지만, 하나의 core 는 한 순간에 하나의 실행 흐름만 처리한다. OS 는 [[CPU Scheduling]] 을 통해 어떤 process/thread 에 CPU 시간을 줄지 결정하고, 필요할 때 [[Context Switching]] 으로 실행 대상을 바꾼다.

# C) Core 와 Processor

일상적으로 CPU 라고 할 때는 물리적인 processor package 를 말하기도 하고, 실제 실행 단위인 core 를 말하기도 한다. scheduling, concurrency, parallelism 을 읽을 때는 “논리 CPU인지, 물리 core 인지, processor package 인지”를 구분해야 한다.

# D) Related

* [[Process]]
* [[thread]]
* [[Context Switching]]
* [[CPU Scheduling]]

