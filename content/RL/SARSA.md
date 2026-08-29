---
title: "SARSA"
tags:
  - reinforcement_learning
aliases: []
---

# A) SARSA ?

SARSA 는 [[state-value function]] 값 말고, [[action-value function]] 값을 이용하여 policy 를 improve 하는 [[temporal difference]] 방법이다.

즉, state-action 쌍으로 부터 다른 state-action 쌍으로 넘어가는 transition 을 고려한다. TD(0) 에서 state 대신 action 값을 이용한것이라 생각하면 된다.

![[img-d6cd510a5e.png|image-20201023172332416]]

<img src="https://i.loli.net/2020/10/23/u2LqvWVTtze8Ujr.png" width=10%>

여기서 $S_{t+1}$ 가 terminal 이면, $Q\left(S_{t+1},A_{t+1}\right)$ 은 0 으로 정한다.

매 학습마다 $\left(S_{t},A_{t},R_{t+1},S_{t+1},A_{t+1}\right)$ 를 사용하기 때문에 SARSA 라 불린다.

# B) Algorithm

![[img-f76cf77c72.png|image-20201023173337312|700]]

# C) References
