---
title: "Markov Reward Process"
tags: ["reinforcement_learning"]
aliases: ["MRP"]
---

# Markov Reward Process ?

[[Markov Chain]] 에 reward 를 추가한 시스템

어떤 state 에 도달할 때마다 reward 를 개별적으로 부여한다고 생각하면 편하다.

MRP 는 tuple $(S, P, R, \gamma)$ 로 충분히 표현이 가능하다. 여기서 $S$ 는 states 집합, $P$ 는 전이 확률 행렬, $R$ 은 보상 함수 그리고 $\gamma \in [0, 1]$ 은 [[discount factor]] 이다.

# References
