---
title: "Decision boundary"
tags:
  - machine_learning
  - classification
aliases: []
---

# Decision Boundary ?

Decision boundary 는 label 값 $y$ 가 0 인지 1 인지 결정하는 영역을 나누는 선이다.

# Logistic Regression 의 Decision Boundary

모델 $h_\theta(x)$ 이 가지는 값의 의미를 정확히 판단하기 위해서, 다음과 같은 규칙을 정했다고 하자.

$$
\begin{aligned}
&h_{\theta}(x) \geq 0.5 \rightarrow y=1 \\
&h_{\theta}(x)<0.5 \rightarrow y=0
\end{aligned}
$$

$h_\theta(x)\ge0.5$ 라는 의미를 해석해보자. $h_\theta(x)$ 는 [[sigmoid function]] $g(z)$ 를 사용하기 때문에, $h_\theta(x)\ge0.5$ 라는 의미는 $z\geq0$ 와 같다.

왜 $z\ge0$ 인가? 그 이유는 식 $g(z)=\dfrac{1}{1+e^{-z}}$ 에서 찾을 수 있다.

$$
\displaystyle z=0,e^{0}=1\Rightarrow g(z)=\frac{1}{1+e^{0}}=\frac{1}{2}
$$

$h_\theta(x)$ 가 다른 값 ($1$ 또는 $0$) 일 때는 어떠한가?

	- $\displaystyle z\rightarrow\infty,e^{-\infty}\rightarrow0\Rightarrow g(z)=\frac{1}{1+e^{-\infty}}=1$

	- $\displaystyle z \rightarrow-\infty,e^{\infty}\rightarrow\infty\Rightarrow g(z)=\frac{1}{1+e^{\infty}}=0$

다시 $h_\theta(x)\ge0.5$ 라는 의미를 해석해보자.

$$
\begin{aligned}
&h_{\theta}(x)=g\left(\theta^{T} x\right) \geq 0.5 \\
&\theta^{T} x \geq 0 \Rightarrow y=1 \\
&\theta^{T} x<0 \Rightarrow y=0
\end{aligned}$$
$h_\theta(x)\ge0.5$의 의미를 활용하면, 다음과 같은 Decision boundary를 생각해볼 수 있다.
1. Predict $h_\theta(x)$ if
- $h_\theta(x)=g(\theta_0+\theta_1x_1+\theta_2x_2)\ge0.5\Rightarrow-3+x_1+x_2\ge0$
- $\theta_0=-3,\theta_1=1,\theta_2=1$

![[img-df7bc53c7a.png|image-20200929003231626]]


1. Predict $h_\theta(x)$ if
$h_\theta(x)=g(\theta_0+\theta_1x_1+\theta_2x_2+\theta_3x_2^2+\theta_4x_2^2)\ge0.5\Rightarrow-1+x_1^2+x_2^2\ge0$  
$(\theta_0=-1,\theta_1=0,\theta_2=0,\theta_3=1,\theta_4=1)$
![[img-4a223650da.png|image-20200929003459783]]


# References
