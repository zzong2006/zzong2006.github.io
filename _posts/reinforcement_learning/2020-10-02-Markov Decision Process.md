---
layout: post
title:  "Reinforcement learning: Markov Decision Process(MDP)"
date:   2020-10-14 22:55:30 +0900
categories: deeplearning
series: 1
---

## Problem Statement of MDP

* States : $s$
* Model: $T(s, a, s')$ ~ $Pr(s' | s, a)$

  * $a$ : action, $s'$ : next state
* Action: $A(s)$, $A$
  * $A(s)$ : 특정 state $s$에서 할 수 있는 행동 (예. 남극탐험 게임: 상하좌우 가능)

* Reward: $R(s)$, $R(s,a)$, $R(s,a,s')$

----

* Policy : $\pi(s) \rightarrow a$
  * 위에 주어진 4개의 정의들을 이용해 최적의 policy를 찾는것이 MDP의 목적
  * Policy $\pi$ is function. It takes a state $s$ and returns action $a$
  * $\pi^*$ : Optimal policy

### Markovian property

* Markov 모델은 현재만 다룸(only present matters, $Pr(s' | s, a)$)

* 모든것이 stationary함 (설정한 시스템에 대한 확률이 변하지 않음)
  * Real-world도 stationary함 (physics)



* Delayed Reward
  * 

* Temporal credit assignment

 