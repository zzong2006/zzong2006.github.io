---
tags: ["reinforcement_learning"]
---

# Value Function ?

state $s$ 에서 policy $\pi$ 를 따를 경우 [[state-value function]] 은 $v_{\pi}(s)$ 다.

$$
\displaystyle v_{\pi}(s)\doteq\mathbb{E}_{\pi}\left[G_{t}\mid S_{t}=s\right]=\mathbb{E}_{\pi}\left[\sum_{k=0}^{\infty}\gamma^{k}R_{t+k+1}\mid S_{t}=s\right],\text{forall}s\in\mathcal{S}
$$

terminal state 의 $v_{\pi}(s)$ 값은 항상 $0$ 임을 기억하자.

비슷하게, $s$ 에서 $\pi$ 를 따르는 경우 $a$ 를 취할 때의 [[action-value function]] $q_{\pi}(s,a)$ 는 다음과 같이 정의된다.

$$
\displaystyle q_{\pi}(s,a)\doteq\mathbb{E}_{\pi}\left[G_{t}\mid S_{t}=s,A_{t}=a\right]=\mathbb{E}_{\pi}\left[\sum_{k=0}^{\infty}\gamma^{k}R_{t+k+1}\mid S_{t}=s,A_{t}=a\right]
$$

state-value function 와 action-value function 의 function 간 recursive 관계는 매우 중요하다.

$$
\begin{aligned}v_{\pi}(s)&\doteq\mathbb{E}_{\pi}\left[G_{t}\mid S_{t}=s\right]\\&=\mathbb{E}_{\pi}\left[R_{t+1}+\gamma G_{t+1}\mid S_{t}=s\right]\\&=\sum_{a}\pi(a\mid s)\sum_{s^{\prime}}\sum_{r}p\left(s^{\prime},r\mid s,a\right)\left[r+\gamma \mathbb{E}_{\pi}\left[G_{t+1}\mid S_{t+1}=s^{\prime}\right]\right]\\&=\sum_{a}\pi(a\mid s)\sum_{s^{\prime},r}p\left(s^{\prime},r\mid s,a\right)\left[r+ \gamma v_{\pi}\left(s^{\prime}\right)\right]\\&=\mathbb{E}_{\pi}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right) \mid S_{t}=s\right],\quad\text{for all} \ s\in \mathcal{S}\end{aligned}
$$

위의 가장 마지막 수식을 [[Bellman Equation]] 이라 한다.

[[expectation]] 을 구하는 것이기 때문에, 발생할 수 있는 모든 경우의 확률을 구하는 것이 필요하다.

![[img-2914f3cae4.png]]

그래서 위의 그림 (backup diagrams) 처럼 $a$ 에 대해서, $s'$ 에 대해서, $r$ 에 대해서, 총 3 개에 대한 확률을 구할 필요가 있다 ($\pi(a\mid s)p\left(s^{\prime},r\mid s,a\right)$)

> the value of the start state ($s$) must equal the (discounted) value of the expected next state ($s'$), plus the reward expected along the way.

state-value function $v_\pi(s)$ 와 action-value function $q_\pi(s,a)$ 의 의존관계는 다음과 같이 표현될 수 있다.

![[img-d3d8855fcb.png|image-20201021212620725]]

![[img-3bffb1d4e5.png]]

# Optimal Value Function

optimal [[state-value function]]

$$
\displaystyle v_{*}(s)\doteq\max_{\pi}v_{\pi}(s)
$$

최적의 policy $\pi_*$ 에 대한 [[state-value function]]

$\pi_\ast$ 는 모든 policy $\pi$ 에 대해서 $\pi_\ast\ge\pi$ 를 만족한다.

$\pi\geq\pi^{\prime}$ if and only if $v_{\pi}(s)\geq v_{\pi^{\prime}}(s)$ for all $s\in\mathcal{S}$

optimal action-value function

$$
\displaystyle q_{*}(s,a)\doteq\max_{\pi}q_{\pi}(s,a)
$$

# References
