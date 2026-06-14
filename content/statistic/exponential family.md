---
title: "exponential family"
tags: ["statistic", "probability_distribution"]
---

# A) Exponential Family ?

랜덤 변수 $x$ 의 분포가 exponential family 를 따른다고 했을때, pdf 는 다음과 같이 쓰여질 수 있다.

$$
\displaystyle p(x\mid\eta)=h(x)e^{\{\eta^{T}T(x)-A(\eta)\}}
$$

* $\boldsymbol{\eta}\in\mathbb{R}^{K}$ 은 vector of parameters
* $h(x)$ 는 scaling 상수. base measure 로도 불리며, 주로 $1$ 의 값을 가짐
* $T(x)$ 은 [[sufficient statistics]]
* $A(\eta)$ 은 the log partition function
* $T(x)$ 하고 $A(\eta)$ 는 뭔지 잘 모르겠음

# B) 예시

랜덤 변수 $\theta$ 가 $\alpha$ 를 parameter 로 가지는 [[Dirichlet distribution]] 를 따른다고 가정하면, pdf 는 다음과 같이 쓸 수 있다.

$$
\begin{aligned}p(\theta\mid\alpha)&=\frac{\Gamma\left(\sum_{k}\alpha_{k}\right)}{\prod_{k}\Gamma\left(\alpha_{k}\right)}\prod_{k}\theta_{k}^{\alpha_{k}-1}\\&=\exp\left\{\sum_{k}\left(\alpha_{k}-1\right)\log\theta_{k}-\left[\sum_{k}\log\Gamma\left(\alpha_{k}\right)-\log\Gamma\left(\sum_{k}\alpha_{k}\right)\right]\right\}\end{aligned}
$$

위 식은 계산을 편하게 만들기 위해 $p(\theta\mid\alpha)$ 에 log 를 붙이고 exp 에 올린듯 하다: $\displaystyle e^{log{p(\theta\mid\alpha)}}$

				- $\eta=\alpha-1$

				- $A(\eta)=\sum_{k}\log\Gamma\left(\alpha_{k}\right)-\log\Gamma\left(\sum_{k}\alpha_{k}\right)$

				- $T(\theta)=\log\theta$

* Properties
	* $A(\eta)$ 는 정의를 활용하면 다음과 같이 쓰여질 수 있다.
		* $\displaystyle\int p(x\mid\eta)dx=e^{-A(\eta)}\int h(x)\exp\left\{\eta^{T}T(x)\right\}dx=1$
		* $\displaystyle A(\eta)=\log\int h(x)\exp\left\{\eta^{T}T(x)\right\}dx$
	* $A(\eta)$ 를 $\eta$ 에 대해 한번 미분하면 $T(x)$ 에 대한 [[expectation]] 을 찾을 수 있다:
$\displaystyle\frac{\partial A(\eta)}{\partial\eta}=E[T(x)]$
		* ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FHWpoUkgb93.png?alt=media&token=8e1161a2-dac4-4b6a-be3d-7883f8deaff7)
	* $A(\eta)$ 를 $\eta$ 에 대해 두번 미분하면 $T(x)$ 에 대한 [[variance]] 을 찾을 수 있다:
$\displaystyle\frac{\partialA(\eta)}{\partial\eta}=V[T(x)]$
		* ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FlHhYIqtaLG.png?alt=media&token=9b714da8-208f-4f6f-a5c0-9686c353d7e2)
	* 예시: Dirichlet distribution
		* 위 예시에서 Dirichlet 분포를 따르는 log 랜덤 변수의 expectation 은 다음과 같이 계산할 수 있다.
			* $\begin{aligned}E\left[\log\theta_{k}\right]&=E\left[T_{k}(\theta)\right]=\frac{\partial}{\partial\eta_{k}}A(\eta)\\&=\Psi\left(\alpha_{k}\right)-\Psi\left(\sum_{j}\alpha_{j}\right)\end{aligned}$
				* $\Psi(\cdot)$ 는 digamma function 으로, log gamma 의 first derivative 다.
* notation of other paper
	* [[Generalized Linear Model]] 을 다루는 논문에서는 exponential family 분포의 density 가 다음과 같이 표현된다.
		* $\displaystyle\mathbb{P}(Y\midX)=\exp\left\{\frac{YX^{\prime}\theta^{*}-m\left(X^{\prime}\theta^{*}\right)}{g(\eta)}+h(Y,\eta)\right\}$
			* 여기서 $X$ 는 context feature vector 이고, $Y$ 는 response 를 의미한다.
				* 주로 이런 관계가 성립한다: $Y_{t}=\mu\left(X_{t}^{\prime}\theta^{*}\right)+\epsilon_{t}$
					* $\mu$ 는 strictly increasing link function (e.g. linear, sigmoid etc.)
		* $\displaystyle p(x\mid\eta)=h(x)e^{\{\eta^{T}T(x)-A(\eta)\}}$ 와 비교
			* 위 식에서 $-\frac{m\left(X^{\prime}\theta^{*}\right)}{g(\eta)}$ 는 $-A(\eta)$ 와 같다.
				* 그래서 $\dot{m}\left(X^{\prime}\theta^{*}\right)=\mathbb{E}[Y\mid X]=\mu\left(X^{\prime}\theta^{*}\right)$ 그리고 $\ddot{m}\left(X^{\prime}\theta^{*}\right)=\mathbb{V}(Y\mid X)$ 를 만족한다고 한다.

# C) Related

# D) References

* https://zhiyzuo.github.io/Exponential-Family-Distributions/
