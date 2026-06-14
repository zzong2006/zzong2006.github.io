---
tags: ["reinforcement_learning"]
aliases: ["dynamic programming", "DP"]
---

# A) DP?

DP 방식은 [[Markov Decision Process|MDP]] 에 대한 optimal solution 을 제공하는 방법이다. 일반적으로 MDP 와 같은 환경에 대한 완벽한 모델이 주어졌을 때 사용하는 알고리즘의 총칭을 의미한다.

DP 방식이 optimal solution 을 제공하긴 하지만 굉장히 제한적이고 비현실적이기 때문에, 이후의 강화학습 방법은 DP 를 얼마나 효율적으로 수행하는지에 대한 접근이라고 봐도 좋다.

## A.1) 단점

1. The [[curse of dimensionality]]:  
   복잡한 환경일수록 states 에 대한 가능한 값들의 수가 기하급수적으로 증가한다. 이런 이슈를 해소하기 위해 [[asynchronous dynamic programming]] 또는 [[Deep Q-Network|DQN]] 과 같은 function approximator 를 활용한다.

# B) Related

* [[policy evaluation]] (Prediction)
* [[policy iteration]]
* [[value iteration]]
* [[policy improvement]]
* [[bootstrapping]]

# C) Related

# D) References
