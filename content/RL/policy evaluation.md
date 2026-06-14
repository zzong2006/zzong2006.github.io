---
title: "policy evaluation"
tags: ["reinforcement_learning"]
---

# Policy Evaluation ?

강화학습에서 주어진 policy 를 평가하는 것은 다양한 방법이 존재한다. 그중에서 policy $\pi$ 의 [[state-value function]] $v_\pi$ 을 계산하여 비교하는 방법이 있다.

# Iterative Policy Evaluation

state-value function 을 analytic 하면서 iterative 하게 계산하는 방법을 의미한다.

모든 state $s\in\mathcal{S}$ 에 대해, iterative 계산 방식은 다음과 같다.

$$
\begin{aligned}v_{k+1}(s)& \doteq\mathbb{E}_{\pi}\left [R_{t+1}+\gamma v_{k}\left(S_{t+1}\right)\mid S_{t}=s\right]\\&=\sum_{a}\pi(a\mid s)\sum_{s^{\prime},r}p\left(s^{\prime},r\mid s,a\right)\left[r+\gamma v_{k}\left(s^{\prime}\right)\right]\end{aligned}
$$

쉽게 생각하면, $v_0(s)$ 를 통해 $v_1(s)$ 를 찾고, $v_1(s)$ 를 통해 $v_2(s)$ 를 찾고.. 를 반복하는 식이다.

여기서 $k=0$ 경우, $v_0(s)$ 는 임의의 값으로 정하는데, 일반적으로 $v_0(s)=0$ 이다.

위와 같은 update rule 은 $k \rightarrow \infty$ 이면 $v_{k}(s)$ 값이 수렴하는 것이 증명되었다.

## Algorithm

![image-20201021230717161](https://i.loli.net/2020/10/21/a2IZTniG8OmtyWv.png)

위 알고리즘에 대한 구현에는 $v_k(s)$ 그리고 $v_{k+1}(s)$ 를 위한 두 가지 array 를 사용한다. 하나의 array 를 사용해서 즉석으로 바꾸는 방법도 있는데, 이런 경우 가끔 더 빠르게 수렴한다.

# Policy Comparison

두 policy $\pi$ 와 $\pi'$ 를 비교하는 방법은 가능한 모든 state $s$ 에서 얻을 수 있는 state-value function 값을 비교하면 된다.

$$
v_{\pi^{\prime}}(s) \geq v_{\pi}(s) \quad \forall s \in S
$$

$\pi$ 보다 $\pi'$ 가 좋다는 걸 알았다면, 과연 어떻게 $\pi$ 에서 $\pi'$ 로 갈 수 있는가? 이에 대한 해답은 [[policy improvement]] 를 참고할 것.

# Related

# References
