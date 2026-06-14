---
title: "state-value function"
tags: ["reinforcement_learning"]
---

# A) State-value Function ?

state 의 value 를 state-value function $v_{\pi}(s)$ 이라 부른다. 이는 state $s$ 에서 시작할 때 얻을 수 있는 expected [[expected return|discounted return]] 값을 의미한다.

그리고 [[Markov Decision Process|MDP]] 에서 이 함수는 [[policy]] 를 위해 정의된 것이다. policy 에 의해 전이 확률 행렬이 결정되는 것을 고려해볼 때, policy 를 변경한다는 것은 결국 다른 state-value function 을 가진다는 것을 의미한다.

정의는 아래와 같다.

$$
v_{\pi}(s) \triangleq E_{\pi}\left[G_{t} \mid S_{t}=s\right]=E_{\pi}\left[\sum_{k=0}^{\infty} \gamma^{k} R_{t+k+1} \mid S_{t}=s\right]
$$

그리고 $v_\pi(s)$ 에 대한 [[Bellman Equation]] 은 다음과 같이 표현 가능하다.

$$
v_{\pi}(s) \triangleq \sum_{a} \pi(a \mid s) \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]
$$

$\sum_a \pi(a |s)$ 는 state $s$ 에서 policy $\pi$ 에 의해 제안된 모든 action 을 고려한다는 것을 의미한다.

# B) Optimal State-value and Action-value Function

최적의 policy $\pi_{*}$ 는 최적의 state-value function 알려줘야 한다.

$$
v_{*}(s) \triangleq \max _{\pi} v_{\pi}(s), \quad \text { for all } s \in S
$$

optimal [[action-value function]] 역시 다음과 같이 정의된다.

$$
q_{*}(s, a) \triangleq \max _{\pi} q_{\pi}(s, a)
$$

그리고 두 optimal function 간 관계는 다음과 같이 표현될 수 있다.

$$
q_{*}(s, a)=E\left[R_{t+1}+\gamma v_{*}\left(S_{t+1}\right) \mid S_{t}=s, A_{t}=a\right]
$$ ^8111ef

# Related

# References
