---
title: "Bias Correction"
tags: optimization 
aliases: []
---

# A) Bias Correction ?

bias correction 은 지수이동평균을 구할 때, 처음에 평균에 발생한 bias 부분을 고쳐주는 역할을 하는 방법이다.

$\beta=0.98$ 의 경우, 이전 예제에서의 지수이동평균 값은 아래와 같이 보인다.

![[img-8a8bee996a.png|image-20201028231820932]]

* 여기서 보라색은 $\beta=0.98$ 일 때, bias correction 을 적용하지 않은 그래프이고, 초록색은 적용한 그래프이다.

bias correction 이 없는 경우를 살펴보자.

$$
\begin{aligned}
v_{t}&=\beta v_{t-1}+(1-\beta) \theta_{t} \\
v_{0}&=0 \\
v_1&=0.02\theta_1\\
v_2&=0.98 v_1 + 0.02\ \theta_2 \\
&=0.98*0.02*\theta_1 +0.02\theta_2 \\
&=0.0196 \theta_1 + 0.02 \theta_2
\end{aligned}
$$

* $v_1$ 에서 $v_0$ 는 0 이므로 $0.02\theta_1$ 만 남았다.
* 만약, $v_2$ 가 앞의 둘째 날의 평균값만 확인한것이라면, 매우 작은 값이 될것이다.

이를 막기위해 bias correction 은 다음과 같이 계산된다.

$$
\hat v_t = \frac{v_{t}}{1-\beta^{t}}, \qquad v_t = \beta v_{t-1} + (1-\beta) \theta_t
$$

이동평균 $v_t$ 는 원래 식대로 계속 갱신하고, 값을 쓸 때만 $1-\beta^t$ 로 나눈 $\hat v_t$ 를 쓴다.

상기 수식에서 $t=2$ 일 때의 bias correction 결과는 다음과 같다.

$$
\begin{aligned}
t=2: \quad 1-\beta^{t} =1-(0.98)^{2}=0.0396 \\
\frac{v_{2}}{0.0396}=\frac{0.0196 \theta_1+0.02 \theta_{2}}{0.0396}
\end{aligned}
$$

* 여기서 $v_2$ 는 이전보다 훨씬 큰 값을 가질것이다.
* 또한, $t$ 가 증가할수록, $1-\beta^t\approx1$ 에 가까워지므로, 보통의 지수이동평균과 같게된다 (보라색, 초록색 그래프 일치).

Momentum 처럼 이동평균 하나만 쓰는 optimizer 에서는 bias correction 을 생략하는 경우가 많다. 몇십 step 만 지나면 $1-\beta^t$ 가 1 에 가까워져 치우침이 저절로 사라지기 때문이다.

Adam 은 bias correction 을 기본으로 적용한다. gradient 제곱의 이동평균은 $\beta_2 = 0.999$ 로 아주 천천히 움직여서, 보정하지 않으면 수백 step 동안 0 쪽으로 치우친다. 이 값으로 나누면 학습 초반 업데이트가 지나치게 커진다 ([[optimization algorithms]] 노트의 Adam 절).
