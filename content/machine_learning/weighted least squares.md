---
title: "weighted least squares"
tags: ["machine_learning", "linear_regression"]
---

# A) Weighted Least Squares ?

* variance 가 input 마다 다른 것
	* $p(\boldsymbol{y}\mid\boldsymbol{x};\boldsymbol{\theta})=\mathcal{N}\left(\boldsymbol{y}\mid\mathbf{X}\boldsymbol{w},\boldsymbol{\Lambda}^{-1}\right)$ where $\boldsymbol{\Lambda}=\operatorname{diag}\left(1/\sigma^{2}\left(\boldsymbol{x}_{n}\right)\right)$
* weighted least squares estimate
	* $\hat{\boldsymbol{w}}=\left(\mathbf{X}^{\top}\boldsymbol{\Lambda}\mathbf{X}\right)^{-1}\mathbf{X}^{\top}\boldsymbol{\Lambda}\boldsymbol{y}$ ([[statistic/Maximum Likelihood Estimation|MLE]] 를 사용)
* 예시) heteroskedastic regression
	* $\displaystyle p(y\mid\boldsymbol{x};\boldsymbol{\theta})=\mathcal{N}\left(y\mid\boldsymbol{w}^{\top}\boldsymbol{x},\sigma^{2}(\boldsymbol{x})\right)=\frac{1}{\sqrt{2\pi\sigma^{2}(\boldsymbol{x})}}\exp\left(-\frac{1}{2\sigma^{2}(\boldsymbol{x})}\left(y-\boldsymbol{w}^{\top}\boldsymbol{x}\right)^{2}\right)$

# B) Related

 * [[least squares estimation]]

# C) References
