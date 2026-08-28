---
title: "Markov Chain"
tags: ["reinforcement_learning", "probability_distribution"]
---

# 1. Markov Chain ?

Markov chain 은 일련의 이벤트를 통해 state 간의 전이 확률을 나타낸 확률적 모델 (stochastic model) 이다.
![](https://i.imgur.com/xoRfgRb.png)

Markov Chain 은 transition Matrix 을 이용해 표현된다.

Markov chain 을 이해하는 것이 [[Markov Decision Process|MDP]] 의 근간을 이해하는 것이다.

# 2. States 에 따른 분류

## 2.1. Communicate

state $i$ 에서 $j$ 로 도달할 수 있다면, reachable 하다고 표현한다. 만약, $j$ 에서 $i$ 로도 도달할 수 있다면 이는 communicate 하다고 표현한다.

## 2.2. Irreducible

만약, 마르코프 체인의 모든 state 가 서로 communicate 하는 경우, 그 체인은 irreducible 하다고 할 수 있다.

## 2.3. Absorbing

반대로, 어떤 state 에서 움직일 수 없는 경우 ($P\left(s_{t+1}=s \mid s_{t}=s\right)=1$) 이를 absorbing(terminal) state 라고 표현한다.

## 2.4. Recurrent State

state $s$ 에서 $s'$ 로 단방향 접근만 가능할 경우 transient state 라고 표현한다. 그리고 어떤 state 가 transient 이 아닐경우 recurrent state 라고 불린다.

## 2.5. Periodic and Aperiodic State

어떤 state $s$ 에서 출발하여 $k>1$ steps 이후 다시 $s$ 로 돌아올 수 있는 경우, state 가 periodic 하다고 표현한다. recurrent state 는 aperiodic 한데, 이는 $k=1$ 인 경우를 의미한다.

![|320](https://i.imgur.com/SV5hVQV.png)

## 2.6. Ergodicity

Markov chain 의 모든 state 가 다음 조건을 만족한다면 체인 자체가 ergodic 하다고 불린다.

* 서로 communicate 하다 (irreducible)
* recurrent 하다.
* aperiodic 하다.

ergodic markov chain 은 충분히 긴 시간이 지날 경우, 시스템 내 어떤 state 에 위치할 확률을 계산할 수 있다. 이를 steady state 확률 분포라 부른다.

# 3. Transition Probability

state $i$ (row) 에서 state $j$ (column) 갈 확률을 나타내는 matrix

$$
P_{i j}=P\left(s_{t+1}=j \mid s_{t}=i\right)
$$

만약 $n$ steps 이후 state $i$ 에 위치할 확률은 다음과 같이 계산된다.

$$
p_{n}=q P^{n}
$$

여기서 $q$ 는 초기 확률 분포를 의미하며, $P^n$ 은 전이 확률 행렬에 $n$ 승을 곱한것이다. 그리고 $P^n_{ij}$ 는 state $i$ 에서 시작하여 $n$ steps 이후 $j$ state 에 위치할 확률을 의미하게 된다.

# 4. Semi-Markov Process

$n$ steps 대신 $T$ 시간 이후의 transition 확률을 계산할 수 있는 시스템으로, 이 시스템은 discrete time step 대신 continuous 한 time step 을 고려한다.

예시) queuing system (고객 센터에서 손님이 언제든 껴들을 수 있음)

# 5. Related

# 6. References
