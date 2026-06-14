---
title: "Cumulative Distribution Function"
tags: ["statistic"]
aliases: ["CDF"]
---

# A) CDF?

A cumulative distribution function (cdf) of a multivariate real-valued random variable $X$ with states $\boldsymbol{x}\in\mathbb{R}^{D}$ is given by  

$$
F_{X}(\boldsymbol{x})=P\left(X_{1}\leqslant x_{1},\ldots,X_{D}\leqslant x_{D} \right)
$$

, where $X=\left[X_{1},\ldots,X_{D}\right]^{\top},\boldsymbol{x}=\left[x_{1},\ldots,x_{D}\right]^{\top}$

CDF 는 [[Probability Density Function|pdf]] $f(\boldsymbol{x})$ 의 적분으로 표현할 수 있다:  

$$
\displaystyle F_{X}(\boldsymbol{x})=\int_{-\infty}^{x_{1}}\cdots\int_{-\infty}^{x_{D}}f\left(z_{1},\ldots,z_{D}\right)\mathrm{d}z_{1}\cdots\mathrm{d}z_{D}
$$

# B) CDF 특징

표준 [[Gaussian distribution|정규 분포]] 의 경우 CDF 는 다음가 같이 표현이 가능하다.  

$$
C D F=\Phi(X)=\int_{-\infty}^{X} \frac{1}{\sqrt{2 \pi}}  e^{-z^{2} / 2} d z
$$

이때 CDF 가 symmetric 하므로, $\Phi(-X)=1-\Phi(X)$ 를 만족한다.

증명: https://math.stackexchange.com/a/3959027
