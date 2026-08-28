---
title: "action-value function"
tags: ["reinforcement_learning"]
aliases: ["q-value function", "q-value"]
---

# A) Action-value Function ?

Action-value function $q_{\pi}(s, a)$ 는 다음과 같은 질문에 대한 답을 지닌 함수다.

“ 만약 내가 현재 state $s$ 에서 action $a$ 를 취한 이후 policy $\pi$ 를 따른다면 얻을 수 있는 expected cumulative return([[expected return]]) 은 얼마인가?”

정의는 다음과 같다.

$$
\begin{aligned}
 q_{\pi}(s, a) &\triangleq E_{\pi}\left[G_{t} \mid S_{t}=s, A_{t}=a\right] \\
&= E_{\pi}\left[\sum_{k=0}^{\infty} \gamma^{k} R_{t+k+1} \mid S_{t}=s, A_{t}=a\right] \\
&= E\left[R_{t+1}+\gamma v_{\pi}\left(s^{\prime}\right) \mid S_{t}=s, A_{t}=a\right] \\
&= \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]
\end{aligned}$$

마지막 [[Bellman Equation]]에서 $v_\pi(s')$ 는 state $s'$ 에 대한 [[state-value function]]을 의미한다.

# B) Vs. State-value Function

$q_{\pi}(s, a)$ 는 사실상 선택할 수 있는 $a$가 하나밖에 없고, $\sum_{a} \pi(a \mid s)=1$ 을 만족하는 경우의 $v_\pi(s)$ 값으로 생각할 수 있다.
# C) References
