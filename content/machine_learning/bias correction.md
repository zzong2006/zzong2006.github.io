---
title: "bias correction"
tags: ["optimization"]
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
\frac{v_{t}}{1-\beta^{t}} = \beta v_{t-1} + (1-\beta) \theta_t
$$

상기 수식에서 $t=2$ 일 때의 bias correction 결과는 다음과 같다.

$$
\begin{aligned}
t=2: \quad 1-\beta^{t} =1-(0.98)^{2}=0.0396 \\
\frac{v_{2}}{0.0396}=\frac{0.0196 \theta_1+0.02 \theta_{2}}{0.0396}
\end{aligned}
$$

* 여기서 $v_2$ 는 이전보다 훨씬 큰 값을 가질것이다.
* 또한, $t$ 가 증가할수록, $1-\beta^t\approx1$ 에 가까워지므로, 보통의 지수이동평균과 같게된다 (보라색, 초록색 그래프 일치).

실제로는 optimization 알고리즘에 bias correction 을 잘 적용하지 않는데, 그 이유는 그냥 몇 번 더 학습하면 알아서 bias 가 사라지기 때문이다.

# B) References
