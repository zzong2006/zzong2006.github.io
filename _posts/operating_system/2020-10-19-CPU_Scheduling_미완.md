---
layout: post
title:  "Operating System: CPU Scheduling"
date:   2020-10-19 20:50
categories: operatingsystem
series: 3
---

## CPU 스케쥴링의 필요성

* 자원 점유의 상황을 줄여서 CPU의 활용을 최대화를 통해 시스템의 성능 개선을 유도
  * 프로세스가 CPU를 통해서 작업을 수행하는 도중 I/O 또는 Interrupt가 발생하면, 일시적으로 그 프로세스는 CPU를 사용하지 않고 waiting 상태가 되는데, 이 상태에서도 OS의 자원(code, stack, data, heap 등)을 계속 점유하고 있다.

## CPU 스케줄링의 종류

### 선점 (preemptive) 스케줄링

* 특징
  * CPU가 어떤 프로세스에 의해 점유 중일 때, 우선 순위가 높은 프로세스가 CPU를 차지할 수 있음
  * 선점이 일어날 경우, context switching에 의한 오버헤드가 발생하며 처리시간을 예측하기 힘듦
  * 스케줄링이 일어나는 상황: I/O요청, I/O응답, Interrupt발생, 작업완료
  * 빠른 응답시간을 요하는 대화식 시분할 시스템에 적합

### 비선점 (Non-preemptive) 스케줄링

* 특징
  * 선점 스케줄링과 반대
  * 어떤 프로세스가 CPU를 할당 받으면 그 프로세스가 종료되거나 입출력 요구가 발생하여 자발적으로 중지될 때까지 계속 실행되도록 보장
  * 응답 시간 예상 가능
  * 스케줄링이 일어나는 상황: 작업완료
  * 일괄 처리(batch processing) 시스템에 적합
    * 일괄 처리: 컴퓨터 프로그램 흐름에 따라 순차적으로 자료를 처리하는 방식

## CPU 스케줄링 알고리즘 

### 선점 스케줄링

1. Shortest Remaining Time(SRT) 스케줄링
   * 처리 시간이 짧은 프로세스가 우선순위를 보유한 스케줄링
   * 요구 시간이 긴 프로세스가 요구 시간이 짧은 프로세스에게 항상 양보되어 기아 상태가 발생할 수 있음
2.  라운드  로빈(Round-Robin, RR) 스케줄링
   * 모든 프로세스가 동일한 CPU 시간을 할당 받고, 선입선출(FIFO)에 의해 진행됨
3. 다단계 큐(Multi-Level Queue) 스케줄링
   * ㅇㅇ
4. 다단계 피드백 큐(Multi-Level Feedback Queue) 스케줄링
   * 

### 비선점 스케줄링

1. Shortest Job First(SJF) 스케줄링

   * Queue 에서 대기중인 프로세스 중, 처리시간이 가장 짧은 것을 먼저 수행 
   * SRT와 마찬가지로, 요구 시간이 긴 프로세스가 요구 시간이 짧은 프로세스에게 항상 양보되어 기아 상태가 발생할 수 있음
     * 이를 해결하기 위해 도입한 것이 HRN 스케줄링 

2. HRRN(Highest response ratio next) 스케줄링

   * 우선 순위를 CPU 처리 기간과 해당 프로세스의 대기 시간을 동시에 고려해 선정하는 스케줄링 알고리즘

   * $$
     {\displaystyle Priority={\frac {\text{waiting time}+\text{estimated run time}}{\text{estimated run time}}}}
     $$

     * waiting time: 대기 시간, estimated run time:처리 시간
     * 대기 시간이 길어질수록 우선순위가 높아짐

3. FCFS 스케줄링

   * 먼저 자원 사용을 요청한 프로세스에게 자원을 할당해 주는 방식

   * 프로세스에

4. 데드라인(Deadline) 스케줄링

   * rde

5. * 