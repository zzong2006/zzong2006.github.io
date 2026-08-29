---
title: "process control block"
aliases: ["PCB"]
tags:
  - operating_system
---

# A) PCB ?

각 [[Process]] 는 OS 내에서 PCB 에 의해 구분된다.

# B) Process Control Block 에 저장되는 정보들

* process states
	* 총 5 가지: new, ready, running, waiting, terminated
* program counter (PC): 프로세스가 다음에 실행할 명령어 주소
* [[CPU]] registers: accumulator, stack register, index register
* stack register(Extended Stack Pointer, ESP)
	* 스택 영역을 표시하기 위한 레지스터인 pointer register 의 한 종류
	* 사용하고 있는 [[stack]] 의 최상단 주소 (lowest memory address) 를 저장하는데 사용함
* Index register
	* 문자열의 조작에 사용되는 레지스터로 문자열의 시작 주소를 저장함
* Accumulator (EAX)
	* 모든 연산 명령에 사용되는 레지스터
	* 주로 산술 연산을 통한 함수의 결과값을 저장하는데 사용함
