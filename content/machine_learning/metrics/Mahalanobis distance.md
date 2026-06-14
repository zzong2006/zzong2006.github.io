---
title: "Mahalanobis distance"
tags: ["metrics"]
---

# A) Mahalanobis Distance ?

$$
\Delta^{2}=(\mathbf{x}-\boldsymbol{\mu})^{\mathrm{T}}\mathbf{\Sigma}^{-1}(\mathbf{x}-\boldsymbol{\mu})
$$

* 만약 $\mathbf{\Sigma}$ 가 identity matrix 인 경우, $\boldsymbol{\mu}$ 부터 $\mathbf{x}$ 까지의 [[Euclidean distance]] 로 생각할 수 있다.
* 만약, 이 제곱 형태의 값이 상수라면, Gaussian distribution 은 $\mathbf{x}$- 공간의 평면에서 상수값이 될 것이다.
* [[multivariate Gaussian distribution]] 의 pdf 의 log 는 다음과 같이 표현된다.
	* [pdf]([[Probability Density Function]]): $\displaystyle\mathcal{N}(\boldsymbol{y}\mid\boldsymbol{\mu},\boldsymbol{\Sigma})\triangleq\frac{1}{(2\pi)^{D/2}|\boldsymbol{\Sigma}|^{1/2}}\exp\left[-\frac{1}{2}(\boldsymbol{y}-\boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\boldsymbol{y}-\boldsymbol{\mu})\right]$
	* $\log p(\boldsymbol{y}\mid\boldsymbol{\mu},\boldsymbol{\Sigma})=-\frac{1}{2}(\boldsymbol{y}-\boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\boldsymbol{y}-\boldsymbol{\mu})+\text{const}$

# B) Related

# C) References
