---
title: "Mortal Multi Armed Bandit (2008)"
aliases: []
tags:
  - MAB
---

# A) Mortal Multi Armed Bandit (2008) ?

[[papers/bandit/Mortal Multi-Armed Bandits|Mortal MAB]]

Related Reference: [[Mortal Multi-Armed Bandits]]

* Body: 논문을 간략하게 읽고 다시 정리해보는 것이 좋을 것 같다.
	* Reward Function 이 binary classification 문제로 생각
	* continuously explore new arms
	* Death 를 modeling 하는 방법
		* budgeted death
			* $k$ 번 당기면 죽음
			* geometric distribution 으로 모델링
				* 죽을 확률이 $p$ 일 때 몇번 당겨야지 죽는지를 확률적으로 표현
		* timed death
			* $k$ 시간 이후에 죽음
	* Modeling reward function
		* state-aware
			* stationary 가정: reward 가 시간이 지나도 바뀌지 않음
				* reward distribution 을 알고 있다고 가정
			* deterministic 하다: 한번만 arm 을 play 하면 reward 를 바로 알 수 있음
		* state-
	* UCB1 $\text{K/C}$
	* 논문의 본질
		* $\mu^*$ 를 찾고, 죽을때까지 당기는 것
		* 적절한 $\mu^*$ 를 어떻게 찾을까

# B) References

  * Link: https://www.youtube.com/watch?v=KuAmR8aA1oc&ab_channel=Recotechkakao
