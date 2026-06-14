---
title: "multivariate Gaussian distribution"
tags: ["probability_distribution", "statistic"]
aliases: ["multivariate normal distribution", "MVN"]
---

# A) Multivariate Gaussian Distribution ?

다변량 정규 분포는 1 차원 [[Gaussian distribution|normal distribution]] 을 다차원으로 일반화한 분포를 의미한다.

# B) PDF

$$
\displaystyle\mathcal{N}(\boldsymbol{y}\mid\boldsymbol{\mu},\boldsymbol{\Sigma})\triangleq\frac{1}{(2\pi)^{D/2}|\boldsymbol{\Sigma}|^{1/2}}\exp\left[-\frac{1}{2}(\boldsymbol{y}-\boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\boldsymbol{y}-\boldsymbol{\mu})\right]
$$

* $\boldsymbol{\mu}=\mathbb{E}[\boldsymbol{y}]\in\mathbb{R}^{D}$ 는 mean vector
* $\boldsymbol{\Sigma}=\operatorname{Cov}[\boldsymbol{y}]$ 는 $D\times D$ 는 [[covariance]] matrix

# C) 차원 MVN

2 차원에서는 MVN 는 [[bivariate Gaussian]] 분포로 알려져있다.

$\boldsymbol{y}\sim\mathcal{N}(\boldsymbol{\mu},\boldsymbol{\Sigma})$, where $\boldsymbol{y}\in\mathbb{R}^{2},\boldsymbol{\mu}\in\mathbb{R}^{2}$ 그리고 $\boldsymbol{\Sigma}=\left(\begin{array}{cc}\sigma_{1}^{2}&\sigma_{12}^{2}\\\sigma_{21}^{2}&\sigma_{2}^{2}\end{array}\right)=\left(\begin{array}{cc}\sigma_{1}^{2}&\rho\sigma_{1}\sigma_{2}\\\rho\sigma_{1}\sigma_{2}&\sigma_{2}^{2}\end{array}\right)$

* 여기서 $\rho$ 는 [[correlation]] 계수다: $\displaystyle\operatorname{corr}\left[Y_{1},Y_{2}\right]\triangleq\frac{\operatorname{Cov}\left[Y_{1},Y_{2}\right]}{\sqrt{\mathbb{V}\left[Y_{1}\right]\mathbb{V}\left[Y_{2}\right]}}=\frac{\sigma_{12}^{2}}{\sigma_{1}\sigma_{2}}$

위 내용을 정리해서 [[Probability Density Function|PDF]] 를 계산하면 다음과 같다.

$$
p\left(y_{1},y_{2}\right)=\frac{1}{2\pi\sigma_{1}\sigma_{2}\sqrt{1-\rho^{2}}}\exp\left(-\frac{1}{2\left(1-\rho^{2}\right)}\times\left[\frac{\left(y_{1}-\mu_{1}\right)^{2}}{\sigma_{1}^{2}}+\frac{\left(y_{2}-\mu_{2}\right)^{2}}{\sigma_{2}^{2}}-2\rho\frac{\left(y_{1}-\mu_{1}\right)}{\sigma_{1}}\frac{\left(y_{2}-\mu_{2}\right)}{\sigma_{2}}\right]\right)
$$

# D) Related

 * [[Mahalanobis distance]]

# E) References
