---
layout: post
title:  "Operating System: Conext Switching"
date:   2020-09-27 20:05
categories: operatingsystem
series: 1
---

## Context Switching이란?

* 하나의 프로세스가 CPU를 사용 중인 상태에서 다른 프로세스가 CPU를 사용하도록 하기 위해, 이전의 프로세스의 상태(문맥, context)를 보관하고 새로운 프로세스의 상태를 적재하는 작업
  * 프로세스의 context
    * CPU가 해당 프로세스를 실행하기 위한 그 프로세스의 정보들 
    * context는 해당 프로세스의 데이터 구조인 Process Control Block (PCB)에 저장됨
    * PCB에 저장되는 정보들
      * process states: new, ready, running, waiting, terminated
      * program counter (PC): 프로세스가 다음에 실행할 명령어 주소
      * CPU registers: accumulator, stack register, index register
    * process number

## context switching이 필요한 이유

* multi-tasking
  * 한 process가 끝날때까지 다른 process는 기다려야 하므로 처리속도가 늦기 때문
  * 이 경우 context switching은 주로 scheduling scheme/scheduler 에 의해 발생한다.
* Interrupt handling

## context switching 발생 과정 

1.  모든 context switching은 interrupt에 의해 발생
    * interrupt는 driver에 의한 hardware interrupt 또는 system call 등 다양하다.
2.  현재 CPU에 구동중인 프로세스의 context를 저장하고, PCB의 정보를 업데이트
3.  PCB를 ready queue, I/O queue와 같은 queue로 옮김
4.  실행할 프로세스의 저장된 context를 복구하고, 복구된 PCB의 정보를 업데이트
5.  프로세스 실행

## :warning: context switching의 단점 

* 비용(cost): context switching을 수행하기 위해서 작업 스케쥴러의 구동이 필요함 

  :arrow_right: 잦은 context switching은 오버헤드 발생으로 시스템의 성능 저하를 일으킬 수 있음