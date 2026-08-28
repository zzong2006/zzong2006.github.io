---
title: "asynchronous dynamic programming"
tags: ["reinforcement_learning", "DP"]
aliases: ["ADP"]
---

# 1. Asynchronous Dynamic Programming ?

일반적으로 [[Reinforcement Learning]] 에서 [[DP (Reinforcement Learning)|DP]] 를 얘기하면, synchronous DP (동기 DP) 를 의미하는 것이다.

동기 DP 는 state set 전체에 대한 [[sweep]]s 이 필요하다는 것이 단점이다: [[policy evaluation]]

Asynchronous(비동기) DP 는 state 의 value 값의 갱신 여부에 관계없이 다른 state 의 value 가 available 할 경우 바로 사용한다.

# 2. Vs. 일반적인 DP

* This approach suggests not sweeping over the entire state space in each iteration of policy improvement but focusing on the states that are more likely to be encountered.
* For many problems, not all parts of the state space are of equal importance. Therefore, it is wasteful to wait for a complete sweep of the state space before there is an update to the policy.

*

# 3. Related

# 4. References
