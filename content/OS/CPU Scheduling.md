---
title: "CPU Scheduling"
tags:
  - operating_system
aliases: [scheduler, process scheduling]
---

# A) CPU Scheduling ?

CPU Scheduling 은 OS 가 어떤 [[Process]] 또는 thread 에 [[CPU]] 실행 시간을 줄지 결정하는 정책이다. 여러 작업이 동시에 실행되는 것처럼 보이게 하려면, OS 는 짧은 시간 단위로 실행 대상을 바꾸고 [[Context Switching]] 을 수행한다.

# B) 무엇을 최적화하나

Scheduling 정책은 보통 다음 목표 사이에서 trade-off 를 가진다.

| 목표 | 의미 |
| --- | --- |
| Throughput | 단위 시간에 끝내는 작업 수 |
| Turnaround time | 작업 제출부터 완료까지 걸리는 시간 |
| Waiting time | ready queue 에서 기다린 시간 |
| Response time | 요청 후 첫 응답까지 걸리는 시간 |
| Fairness | 특정 작업이 굶주리지 않게 하는 정도 |

# C) Related

* [[CPU]]
* [[Process]]
* [[Context Switching]]

