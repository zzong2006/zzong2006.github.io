---
tags: ["reinforcement_learning"]
---

# 1. Advantage Function ?

advantage function 은 [[action-value function|q-value]] 값과 [[state-value function]] 값의 차이를 의미한다.

$$
A^{\pi}(s, a)=Q^{\pi}(s, a)-V^{\pi}(s)
$$

이 함수는 $\mathbb{E}_{a \sim \pi(s)}\left[A^{\pi}(s, a)\right]=0$ 를 만족하는 특징이 있다.

advantage 함수는 각 action 의 상대적 중요성을 판단하기 위해 사용하는 값이다.

# 2. Related

# 3. References
