---
tags: ["optimization"]
---

Momentum(모멘텀)은 최적화 알고리즘에서 사용되는 기법으로, 이전 단계의 업데이트 방향을 일정 비율로 반영하여 학습의 속도를 높이고 진동을 줄이는 역할을 합니다.

Momentum의 수식은 다음과 같습니다.

$$
\begin{aligned}
&v_t = \gamma v_{t-1} + \eta \nabla_{\theta_t} J(\theta_t) \\
&\theta_{t+1} = \theta_t - v_t
\end{aligned}
$$

여기서 $v_t$는 현재 모멘텀 값, $\gamma$는 모멘텀 계수(일반적으로 0.9 등으로 설정), $\eta$는 학습률, $\nabla_{\theta_t} J(\theta_t)$는 파라미터 $\theta_t$에 대한 손실 함수 $J$의 그래디언트입니다. 이 수식에 따라, 파라미터 $\theta$는 단순히 그래디언트만을 이용해 갱신하지 않고, 이전 업데이트 방향도 함께 반영하여 더 효율적으로 최적점을 찾아갈 수 있습니다.
