---
title: "policy improvement"
tags: ["reinforcement_learning"]
---

# 1. Policy Improvement (theorem)?

현재 policy $\pi$ 보다 더 좋은 policy 는 어떻게 찾을까?

만약 state $s$ 에서 $a$ 를 선택하고 $\pi$ 를 따르는 것이 $s$ 에서 바로 $\pi$ 를 따르는 것보다 좋은 선택이라면, $s$ 를 만날때마다 $a$ 를 선택하는 것이 $\pi$ 보다 좋은 policy 가 될 것이다.

다른 말로 하면, 만약 $q_{\pi}(s, a)>v_{\pi}(s)$ 를 만족할 경우, 우리는 $s$ 에서 $a$ 를 선택하고 나머지 states 에서는 $\pi$ 를 따름으로써 더 나은 policy 를 얻을 수 있다.

위 내용을 조금 더 일반화해보자.

만약 어떤 두 policy $\pi$ 와 $\pi'$ 가 존재하고, 모든 $s\in\mathcal{S}$ 에 대해서 다음을 만족한다고 하자.

$$
q_{\pi}\left(s,\pi^{\prime}(s)\right)\geq v_{\pi}(s)
$$

여기서 $\pi^{\prime}(s)$ 는 $s$ 에서 취할수 있는 policy $\pi'$ 의 action 을 의미한다. 그리고 위 식을 만족하는 $\pi'$ 는 $\pi$ 보다 반드시 모든 $s\in\mathcal{S}$ 에 대해서 better or 같은 policy 다.

$$
v_{\pi^{\prime}}(s)\geq v_{\pi}(s)
$$

이제, policy $\pi$ 를 향상시키기 위해서는 각 state 에 대하여 [[action-value function]] 를 최대화 할 수 있는 action 을 선택하는 것을 고르면 된다 (일종의 $\pi'$ action 따라하기).

$$
\pi^{\prime}(s) \triangleq \arg \max _{a} q_{\pi}(s, a)
$$

## 1.1. 증명

“ 가장 큰 $q_\pi(s,a)$ 를 보이는 $a$ 를 선택하기만 해도 $\pi'$ 를 찾아낼 수 있다 (i.e. $v_{\pi}(s)=v_{\pi'}(s)$) ” 는 주장에 대한 증명은 다음과 같다.

$q_{\pi}\left(s,\pi^{\prime}(s)\right)\geq v_{\pi}(s)$ 임을 가정하고, 이를 활용하여 계속 확장해 나가면서 $v_\pi'(s)$ 로 수렴할때 까지 계산하면 된다.

$$
\begin{aligned}v_{\pi}(s)&\leq q_{\pi}\left(s,\pi^{\prime}(s)\right)\\&=\mathbb{E}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right)\mid S_{t}=s,A_{t}=\pi^{\prime}(s)\right]\\&=\mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right)\mid S_{t}=s\right]\\&\leq\mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma q_{\pi}\left(S_{t+1},\pi^{\prime}\left(S_{t+1}\right)\right)\mid S_{t}=s\right]\\&=\mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma \mathbb{E}\left[R_{t+2}+\gamma v_{\pi}\left(S_{t+2}\right)\mid S_{t+1},A_{t+1}=\pi^{\prime}\left(S_{t+1}\right)\right]\mid S_{t}=s\right]\\&=\mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma R_{t+2}+\gamma^{2}v_{\pi}\left(S_{t+2}\right)\mid S_{t}=s\right]\\&\leq\mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma R_{t+2}+\gamma^{2}R_{t+3}+\gamma^{3}v_{\pi}\left(S_{t+3}\right)\mid S_{t}=s\right]\\\vdots&\\&\leq\mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma R_{t+2}+\gamma^{2}R_{t+3}+\gamma^{3}R_{t+4}+\cdots\mid S_{t}=s\right]\\&=v_{\pi^{\prime}}(s)\end{aligned}
$$

이러한 결론은 다음과 같은 greedy policy $\pi'$ 의 전략으로 귀결된다.

$$
\begin{aligned}\pi^{\prime}(s)&\doteq\underset{a}{\arg\max}\ q_{\pi}(s,a)\\&=\underset{a}{\arg\max}\ \mathbb{E}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right)\mid S_{t}=s,A_{t}=a\right]\\&=\underset{a}{\arg\max}\sum_{s^{\prime},r}p\left(s^{\prime},r\mid s,a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]\end{aligned}
$$

다수의 action 이 허용되는 stochastic case 에서는 하나만 선택하지 않고, 동일한 $q$ value 값을 가지는 모든 $a$ 에 대해 비율을 나눠준다. 예를 들어 grid 의 경우 동서남북 중, 남북이 같다면 0.5, 0.5 비율로

이렇게 기존의 policy 에 대한 value function 을 이용하여 greedy 하게 action 을 선택하는 방법을 **policy improvement** 라고 한다.

$\pi$ 와 $\pi'$ 이 서로 같다고 해보자. 즉, $v_{\pi}=v_{\pi^{\prime}}$ 인 경우, 모든 $s\in\mathcal{S}$ 에 대해서 다음을 만족한다.

$$
\begin{aligned}v_{\pi^{\prime}}(s)&=\max_{a}\mathbb{E}\left[R_{t+1}+\gamma v_{\pi^{\prime}}\left(S_{t+1}\right)\mid S_{t}=s,A_{t}=a\right]\\&=\max_{a}\sum_{s^{\prime},r}p\left(s^{\prime},r\mid s,a\right)\left[r+\gamma v_{\pi^{\prime}}\left(s^{\prime}\right)\right]\end{aligned}
$$

그런데, 위의 식은 그냥 [[Bellman optimality equation]] 이다. 즉, $v_\pi'$ 는 반드시 $v_*$ 가 된다.

# 2. Related

# 3. References
