---
title: "Expected SARSA"
tags: ["reinforcement_learning"]
---

# A) Expected SARSA ?

[[SARSA]] 에서 [[expectation|기대값]] 을 사용한 SARSA 버전  

즉, $Q \left(S_{t+1},A_{t+1}\right)$ 대신 $\mathbb{E}_{\pi}[Q(S_{t+1},A_{t+1})\mid S_{t+1}]$ 를 사용한다.

Expected SARSA 는 SARSA 보다 계산이 복잡하지만, $A_{t+1}$ 를 무작위로 선택할 때 발생하는 분산을 없애준다.

일반적으로 Expected SARSA 는 action 을 결정하기 위해서 $\pi$ 와는 다른 정책 (Expected value) 을 사용할 것이고, 이 경우에는 off-policy algorithm 이 된다.

# B) References
