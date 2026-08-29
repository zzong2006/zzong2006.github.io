---
title: "Bellman optimality equation"
aliases: []
tags:
  - reinforcement_learning
---

# A) Bellman Optimality Equation ?

[[state-value function]] $v_\pi(s)$ 에 대한 [[Bellman Equation]] 은 다음과 같다.

$$
v_{\pi}(s) \triangleq \sum_{a} \pi(a \mid s) \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]
$$

하지만 optimal state-value function $v_*$ 는 $\pi(a | s)$ 가 필요없다. 왜냐하면 항상 최적의 policy 는 누적 보상을 최대화하는 action 을 이미 알고있기 때문이다.

결과적으로 optimal policy 에 대한 state-value function 에 대한 bellman 수식, 즉, bellman optimality equation 은 다음과 같이 바꿔쓸 수 있다.

$$
\begin{align}
v_{*}(s) =&\max _{a} q_{*}(s, a) \\
 =& \max _{a} E\left[R_{t+1}+\gamma v_{*}\left(s^{\prime}\right) \mid S_{t}=s, A_{t}=a\right] \\
=&\max _{a} \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{*}\left(s^{\prime}\right)\right]
\end{align}
$$

## A.1) 식 풀어 쓰기

$$
\begin{aligned}v_{*}(s)&=\max_{a\in\mathcal{A}(s)}q_{\pi_{*}}(s,a)\\&=\max_{a}\mathbb{E}_{\pi_{*}}\left[G_{t}\mid S_{t}=s,A_{t}=a\right]\\&=\max_{a}\mathbb{E}_{\pi_{*}}\left[R_{t+1}+\gamma G_{t+1}\mid S_{t}=s,A_{t}=a\right]\\&=\max_{a}\mathbb{E}\left[R_{t+1}+\gamma v_{*}\left(S_{t+1}\right)\mid S_{t}=s,A_{t}=a\right]\\&=\max_{a}\sum_{s^{\prime},r}p\left(s^{\prime},r\mid s,a\right)\left[r+\gamma v_{*}\left(s^{\prime}\right)\right]\end{aligned}
$$

여기서 $G_t\rightarrow R_{t+1}+\gamma G_{t+1}$ 는 이전에 수식을 활용하여 유도된다.

$$

\begin{aligned}G_{t}&\doteq R_{t+1}+\gamma R_{t+2}+\gamma^{2}R_{t+3}+\gamma^{3}R_{t+4}+\cdots\\&=R_{t+1}+\gamma\left(R_{t+2}+\gamma R_{t+3}+\gamma^{2}R_{t+4}+\cdots\right)\\&=R_{t+1}+\gamma G_{t+1}\end{aligned}

$$

## A.2) For Action-value Function

optimal [[action-value function]] $q_*$ 에 대한 Bellman Optimality Equation 은 다음과 같다.
$$

\begin{aligned}q_{*}(s,a)&=E\left[R_{t+1}+\gamma v_{*}\left(s^{\prime}\right) \mid S_{t}=s, A_{t}=a\right]\\

&=E\left[R_{t+1}+\gamma \max_{a^{\prime}} q_{*}\left(S_{t+1}, a^{\prime}\right) \mid S_{t}=s, A_{t}=a\right]

\\&=\sum_{s^{\prime},r}p\left(s^{\prime},r\mid s,a\right)\left[r+\gamma\max_{a^{\prime}}q_{*}\left(s^{\prime},a^{\prime}\right)\right]\end{aligned}
$$

![[img-d2e2214471.png||500]]

Bellman Optimality Equation 을 푸는 것은 optimal policy 를 찾는데 사용할 수 있다. 하지만 실제로는 그렇게 유용하지 못한데, 왜냐하면 다음과 같은 세가지 조건이 만족되어야 하기 때문이다.

1. 환경에 대한 [[dynamics]] 를 정확히 알아야 한다.
2. 계산을 위한 충분한 자원이 있어야 할 것
3. state 가 Markov property 를 따를 것

예를 들어 벡가몬 게임의 경우 (1), (3) 은 만족하지만 (2) 의 경우 $10^{20}$ 에 대한 경우의 수를 처리해야 한다.

# B) References
