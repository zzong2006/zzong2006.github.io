---
title: "policy iteration"
tags: ["reinforcement_learning", "DP"]
aliases: ["정책 반복 알고리즘", "generalized policy iteration", "GPI"]
---

# A) Policy Iteration ?

policy iteration 알고리즘은 [[policy improvement]] 이론에 기반한 방식으로, 단순히 임의의 policy 에서 시작해서 [[policy evaluation]] step $\mathrm{E}$ 와 improvement step $\mathrm{I}$ 를 반복적으로 밟아가며 최종적으로 optimal policy 에 도달하는 방식을 의미한다.

이를 수식화하면 아래와 같다.

$$
\pi_{0}\stackrel{\mathrm{E}}{\longrightarrow}v_{\pi_{0}}\stackrel{\mathrm{I}}{\longrightarrow}\pi_{1}\stackrel{\mathrm{E}}{\longrightarrow}v_{\pi_{1}}\stackrel{\mathrm{I}}{\longrightarrow}\pi_{2}\stackrel{\mathrm{E}}{\longrightarrow}\cdots\stackrel{\mathrm{I}}{\longrightarrow}\pi_{*}\stackrel{\mathrm{E}}{\longrightarrow}v_{*}
$$

여기서 evaluation 또는 improvement 단계를 sweep 이라 표현한다 (e.g. 네번 반복하면 4 sweeps).

아래는 위 과정을 도식화한 모습이다.

![300](https://i.imgur.com/KcRdr9L.png)

## A.1) 알고리즘

![[img-eb855a2aee.png|image-20201022003841657]]

## A.2) 단점

policy improvement step 전에 항상 policy evaluation 을 수행해야하므로 높은 계산 비용이 요구된다. 이러한 이슈를 완화하기 위해 [[value iteration]] 알고리즘을 이용할 수 있다.

# B) References
