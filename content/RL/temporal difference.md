---
title: "temporal difference"
tags: ["reinforcement_learning"]
aliases: ["TD", "temporal-difference learning"]
---

# A) Temporal Difference ?

Temporal Difference(TD)는 [[Monte Carlo Method(RL)|Monte Carlo]] 처럼 실제 경험에서 배우면서도, episode 가 끝날 때까지 기다리지 않고 다음 상태의 추정값을 이용해 바로 업데이트하는 강화학습 방법이다.

# B) 핵심 아이디어

TD target 은 현재 reward 와 다음 상태의 value estimate 를 섞어서 만든다.

$$
V(S_t) \leftarrow V(S_t) + \alpha \left(R_{t+1} + \gamma V(S_{t+1}) - V(S_t)\right)
$$

괄호 안의 값은 TD error 라고 부른다.

$$
\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)
$$

# C) Monte Carlo 와 DP 사이

TD 는 sample 로부터 배우기 때문에 model-free 로 쓸 수 있고, 다음 상태의 추정값을 사용한다는 점에서 [[bootstrapping]] 을 한다. 그래서 Monte Carlo 와 [[DP (Reinforcement Learning)|Dynamic Programming]] 사이에 있는 방법처럼 볼 수 있다.

# D) Related

* [[SARSA]]
* [[Q-learning]]
* [[Expected SARSA]]

