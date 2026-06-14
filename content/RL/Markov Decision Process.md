---
title: "Markov Decision Process"
tags: ["reinforcement_learning"]
aliases: ["MDP"]
---

# A) Markov Decision Process ?

MDP 는 sequential decision-making 문제를 풀기위한 모델을 설정할 때 사용할 수 있는 프레임워크를 의미한다.

## A.1) MDP 구성 요소

MDP 는 [[Markov Reward Process]] 와 다르게 Action 이 추가된 구성을 가진다.

$$
\langle S, A, P, R, \gamma\rangle
$$

![image-20201021193635194](https://i.loli.net/2020/10/21/8yVZe96DBAClqJE.png)

* States : $S_{t}\in\mathcal{S}$ (states 는 다양한 형태로 존재할 수 있음)
* Action: $A_{t}\in\mathcal{A}(s)$
* Reward : $R_{t+1}\in\mathcal{R}\subset\mathbb{R}$

MDP 의 time $t$ 는 굳이 시간에 대한 개념이 아니라 stages 로 생각하면 좋다.

## A.2) Markov Property

[[Markov property]]: MDP 의 $S_t$ 와 $A_t$ 는 무조건 $S_{t-1}$ 와 $A_{t-1}$ 에 의해서만 영향을 받음

# B) Dynamics of the MDP

time step $t$ 에서 $a$ 를 통해 $s$ 에서 $s'$ 으로 옮겨서 $r$ 를 받을 확률

$$
p\left(s^{\prime},r\mid s,a\right)\doteq\operatorname{Pr}\left\{S_{t}=s^{\prime},R_{t}=r\mid S_{t-1}=s,A_{t-1}=a\right\}
$$

* $\doteq$ 는 definition 이라는 뜻

가능한 모든 dynamics $p$ 를 더하면 1 이 된다.

$$
\displaystyle\sum_{s^{\prime}\in\mathcal{S}}\sum_{r\in\mathcal{R}}p\left(s^{\prime},r \mid s,a\right)=1,\text{for all }s\in\mathcal{S},a\in\mathcal{A}(s)
$$

# C) State-transition Probabilities

상태 전이 확률은 다음과 같이 계산된다.

$$
\displaystyle p\left(s^{\prime}\mid s,a\right)\doteq\operatorname{Pr}\left\{S_{t}=s^{\prime}\mid S_{t-1}=s,A_{t-1}=a\right\}=\sum_{r\in\mathcal{R}}p\left(s^{\prime},r\mid s,a\right)
$$

* dynamics of the MDP($p\left(s^{\prime},r\mid s,a\right)$) 의 three-arguments 버전
* $s'$ 에서 받을 수 있는 reward $r$ 에 대한 확률을 다 합친 것임

Expected rewards

$$
\displaystyle r(s,a)\doteq\mathbb{E}\left[R_{t}\mid S_{t-1}=s,A_{t-1}=a\right]=\sum_{r\in\mathcal{R}}r\sum_{s^{\prime}\in\mathcal{S}}p\left(s^{\prime},r\mid s,a\right)
$$

 $s$ 에서 $a$ 를 수행했을 때, 받을 수 있는 reward 의 기댓값 ([[expectation]])

* $s$ 에서 $a$ 를 수행하여 $s'$ 로 이동했을 때, 받을 수 있는 reward 의 기댓값

$r(s,a,s')$ 는 다음과 같음

$$
\displaystyle r\left(s,a,s^{\prime}\right)\doteq\mathbb{E}\left[R_{t}\mid S_{t-1}=s,A_{t-1}=a,S_{t}=s^{\prime}\right]=\sum_{r\in\mathcal{R}}r\cdot\frac{p\left(s^{\prime},r\mid s,a\right)}{p\left(s^{\prime}\mid s,a\right)}
$$

# D) MDP in Recommendation Scenario

$$
<\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma>
$$

* States: time step $t$ 에 존재하는 interaction history 의 representation $S_t$
* actions: 추천 가능한 후보 아이템들의 전체 집합
* Transition probability: agent 가 사용자 feedback $r$ 을 받고 state $s$ 에서 $s'$ 으로 넘어갈 확률 $p\left(s^{\prime}, r \mid s, a\right)$
* Reward Function $\mathcal{R}$: user’s feedback $r(s, a)$
* $\gamma$: Discount Factor

# E) Related

# F) References
