---
title: "Laplace approximation"
aliases: []
tags:
  - statistic
  - bayesian_inference
---

# A) Laplace Approximation ?

* Tags
	* [[Maximum Likelihood Estimation]],

Laplace approximation 은 [[approximate posterior inference]] 를 위한 방식이다.

Quadratic approximation 이라고도 불리며, 연속 랜덤 변수에 대한 posterior 를 multivariate Gaussian 을 활용해서 approximate 하기 위한 방법이다. 즉, Laplace 방식은 true distribution $p(z)$ 의 [[mode]] 를 중심으로하는 Gaussian approximation $q(z)$ 를 찾는 것으로 생각할 수 있다.

![|500](https://i.imgur.com/YEbD9rW.png)

* 빨간색이 Laplace approximation, 노란색이 true distribution

# B) 방법 (single Dimension 의 경우)

단일 continuous variable $z$ 가 존재하고, 우리가 추정하고자 하는 $z$ 에 대한 분포 $p(z)$ 는 다음과 같이 정의된다고 가정한다

$$
\displaystyle p(z)=\frac{1}{Z}f(z)
$$

* 여기서 $Z=\int f(z)\mathrm{d}z$ 는 [[normalizing constant]] 인데, $Z$ 의 값을 알 필요는 없다.

첫번째 step 은 $p(z)$ 의 mode 를 찾는건데, 다른 말로하면 $p^{\prime}\left(z_{0}\right)=0$ 를 만족하는 point $z_0$ 를 찾는거라고 생각하면 된다.

$$
\displaystyle\left.\frac{df(z)}{dz}\right|_{z=z_{0}}=0
$$

여기서 mode 는 일반적으로 [[maximum a posteriori probability|MAP]] 를 통해 찾는다.

그럼 $f(z)$ 는 어떻게 식을 세우는가?

[[Gaussian distribution]] 의 특징 중, pdf 함수의 logarithm 이 랜덤 변수에 대한 quadratic function 으로 표현될 수 있다는 성질이 존재한다. 그래서, mode $z_0$ 을 중심으로 하는 $\ln f(z)$ 를 [[Taylor Approximation]] 으로 표현하면 다음과 같다.

$$
\displaystyle \ln f(z)\simeq\ln f\left(z_{0}\right)-\frac{1}{2}A\left(z-z_{0}\right)^{2}
$$

* $\displaystyle A=-\left.\frac{d^{2}}{dz^{2}}\ln f(z)\right|_{z=z_{0}}$
* 위 Taylor expansion 에서 first-order term 은 포함하지 않았는데, 그 이유는 해당 분포가 $z_0$ 에서 local maximum 이기 때문이다.
* 또한, Gaussian approximation 은 항상 $A>0$ 을 만족해야 하는데, 그 이유는 $z_0$ 에서 반드시 local maximum 을 가지므로, $f(z)$ 의 이차 미분 값은 $z_0$ 에서 음수여야 하기 때문이다.

위 식에다 exponential 을 적용하면 다음과 같다.

$$
f(z)\simeq f\left(z_{0}\right)\exp\left\{-\frac{A}{2}\left(z-z_{0}\right)^{2}\right\}
$$

그리고 일반적인 Gaussian 정규화 결과를 활용하면, normalized 분포인 $q(z)$ 를 얻을 수 있다.

$$
\displaystyle q(z)=\left(\frac{A}{2\pi}\right)^{1/2}\exp\left\{-\frac{A}{2}\left(z-z_{0}\right)^{2}\right\}
$$

## B.1) 방법 ($M$-dimension 의 경우)

$$
\ln f(\mathbf{z})\simeq\ln f\left(\mathbf{z}_{0}\right)-\frac{1}{2}\left(\mathbf{z}-\mathbf{z}_{0}\right)^{\mathrm{T}}\mathbf{A}\left(\mathbf{z}-\mathbf{z}_{0}\right)
$$

* $\mathbf{A}=-\left.\nabla\nabla\ln f(\mathbf{z})\right|_{\mathbf{z}=\mathbf{z}_{0}}$ ([[Hessian matrix]] at the mode)
	* 위 식에다 exponential 을 적용: $f(\mathbf{z})\simeq f\left(\mathbf{z}_{0}\right)\exp\left\{-\frac{1}{2}\left(\mathbf{z}-\mathbf{z}_{0}\right)^{\mathrm{T}}\mathbf{A}\left(\mathbf{z}-\mathbf{z}_{0}\right)\right\}$

즉, Gaussian approximation $q(\mathbf{z})$ 는 다음과 같다.

$$
\displaystyle q(\mathbf{z})=\frac{|\mathbf{A}|^{1/2}}{(2\pi)^{M/2}}\exp\left\{-\frac{1}{2}\left(\mathbf{z}-\mathbf{z}_{0}\right)^{\mathrm{T}}\mathbf{A}\left(\mathbf{z}-\mathbf{z}_{0}\right)\right\}=\mathcal{N}\left(\mathbf{z}\mid\mathbf{z}_{0},\mathbf{A}^{-1}\right)
$$

# C) Related

* [[BPR - Bayesian Personalized Ranking from Implicit Feedback]]

# D) References

* [[Probabilistic Machine Learning - An Introduction]] - 4.6.8.2, 10.5 Bayesian [[logistic regression]]
* Pattern Recognition and Machine Learning - 4.4. The Laplace Approximation
* Tutorial on Thompson Sampling - 5.2. Laplace Approximation
* Advanced Statistical Computing: https://bookdown.org/rdpeng/advstatcomp/integration.html
