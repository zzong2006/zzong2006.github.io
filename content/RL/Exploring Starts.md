---
title: "Exploring Starts"
tags:
  - reinforcement_learning
aliases: []
---

# A) Exploring Starts ?

Exploring starts 는 GPI 방식을 진행할 때, $(s)$ 에서 시작하는 것이 아니라, $(s,a)$ 쌍에서 시작하는 것을 의미한다.

[[statistic/Monte Carlo Method|MC]] 에서 최적의 policy 를 찾기 위해서는 모든 $(s,a)$ 를 무한히 visit 해야 한다.

결과적으로, exploring starts 를 이용한 방법에는 반드시 모든 $(s,a)$ 가 무한히 visit 할 수 있다는 보장이 필요하다.

# B) References
