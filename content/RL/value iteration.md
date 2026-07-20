---
title: "value iteration"
aliases: []
tags:
  - reinforcement_learning
  - DP
---

# Value Iteration ?

[[policy iteration]] 과정에서 [[policy evaluation]] 높은 계산 비용이 필요하다. 이러한 이슈를 해소하기 위해 value iteration 알고리즘을 활용한다. 이 알고리즘은 [[Bellman optimality equation]] 을 활용하여 policy evaluation 과 improvement 를 동시에 수행할 수 있다.

value iteration 은 모든 $s\in\mathcal{S}$ 에 대하여 다음과 같이 수행된다.

$$
\begin{aligned}v_{k+1}(s)&\doteq \max _{a} q_{k}(s, a) \\ &=\max_{a}\mathbb{E}\left[R_{t+1}+\gamma v _{k}\left(S_{t+1}\right)\mid S_{t}=s,A_{t}=a\right]\\&=\max_{a}\sum_{s^{\prime},r}p\left(s^{\prime},r\mid s,a\right)\left[r+\gamma v_{k}\left(s^{\prime}\right)\right]\end{aligned}
$$

policy iteration 과 마찬가지로 value iteration 도 정확히 $v_*$ 로 수렴하기 위해서 형식적으로는 무한번의 반복이 필요하다. 하지만 실제로는 거의 한번 정도의 수행으로 멈춘다.

## Algorithm

![[img-56c508a4c9.png|image-20201022004354693]]

# References
