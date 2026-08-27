---
tags: ["probability_distribution", "statistic"]
aliases: ["normal distribution", "정규 분포", "gaussian"]
---

# A) Gaussian Distribution ?

## A.1) Single Variable

$$
\displaystyle\mathcal{N}\left(x\mid\mu,\sigma^{2}\right)=\frac{1}{\left(2\pi\sigma^{2}\right)^{1/2}}\exp\left\{-\frac{1}{2\sigma^{2}}(x-\mu)^{2}\right\}
$$

종종 $\sigma$ 값을 precision $\tau=1/\sigma^{2}$ 으로 대체하여 표현한다.

$$
\displaystyle\mathcal{N}\left(x\mid\mu,\tau\right)=\sqrt{\frac{\tau}{2\pi}}\exp\left(-\frac{1}{2}\tau(y-\mu)^{2}\right)
$$

## A.2) D-dimensional Vector

$D$ 차원 vector 의 데이터셋 $\mathbf{x}$ 에 대한 가우시안 분포는 [[multivariate Gaussian distribution]] 라고 부르며, pdf 는 다음과 같이 계산된다.

$$
\displaystyle\mathcal{N}(\mathbf{x}\mid\boldsymbol{\mu},\mathbf{\Sigma})=\frac{1}{(2\pi)^{D/2}}\frac{1}{|\mathbf{\Sigma}|^{1/2}}\exp\left\{-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^{\mathrm{T}}\mathbf{\Sigma}^{-1}(\mathbf{x}-\boldsymbol{\mu})\right\}
$$

위 수식에 대한 notation 은 다음과 같다.

* $\boldsymbol{\mu}$ 는 $D$- 차원 mean vector
* $\mathbf{\Sigma}$ 는 $D\times D$ 차원의 [[covariance]] matrix: $\operatorname{Cov}[\mathbf{x}]\triangleq\mathbb{E}\left[(\mathbf{x}-\mathbb{E}[\mathbf{x}])(\mathbf{x}-\mathbb{E}[\mathbf{x}])^{\top}\right]$
* covariance matrix 는 [positive-definite matrix]([[positive definite]]) 여야 한다.
	* [[normalizing constant]]: $Z=(2\pi)^{D/2}|\boldsymbol{\Sigma}|^{1/2}$

[[Mahalanobis distance]]: $\Delta$
covariance matrix

* 일반적으로 Gaussian distribution 이 잘 정의되기 (well defined) 위해선, covariance matrix 의 모든 [[eigenvalue]] $\lambda_i$ 가 strictly positive 한 조건이 필요하다: [[positive definite]]
* 물론 일부 eigenvalue 가 0 인 case 도 있는데 이는 covariance matrix 가 positive semidefinite 일 경우를 의미한다.

# B) Derivative of PDF

## B.1) Multivariate Gaussian Distribution

[[trace trick]] 을 활용하여 미분을 진행할 수 있음

# C) Sum of Normally Distributed Random Variables

가우시안 분포를 가지는 두 독립 변수 $X$, $Y$ 의 합 (sum) 도 가우시안 분포를 가진다.

즉, $X\sim N\left(\mu_{X},\sigma_{X}^{2}\right)$, $Y\sim N\left(\mu_{Y},\sigma_{Y}^{2}\right)$ 이고, $Z=X+Y$ 이면 $Z\sim N\left(\mu_{X}+\mu_{Y},\sigma_{X}^{2}+\sigma_{Y}^{2}\right)$ 를 만족한다.

subtraction 에도 적용할 수 있다: $Z=Y-X$ 이면 $Z\sim N\left(\mu_{Y}-\mu_{X},\sigma_{X}^{2}+\sigma_{Y}^{2}\right)$

# D) A Farewell to Epsilon

종종 Gaussian linear model 을 보면 이런식으로 표현하는 경우가 있다

$$
\begin{aligned}h_{i}&=\mu+\epsilon_{i}\\\epsilon_{i}&\sim\operatorname{Normal}(0,\sigma)\end{aligned}
$$

이는 $h_{i}\sim\operatorname{Normal}(\mu,\sigma)$ 와 동일하다.

하지만 $\epsilon$ 을 사용하는 방법은 별로 좋지않다. 왜냐하면 다른 분포에 대해서는 표현하지 못하기 때문에 general 한 면이 떨어진다.

# E) Related

* [[standard normal distribution]]
* [[Q-Q plot]]
* [[mixture gaussian problem]]

# F) References
