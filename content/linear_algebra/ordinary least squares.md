---
title: "ordinary least squares"
tags:
  - linear_algebra
  - linear_regression
  - machine_learning
aliases: [OLS, Normal Equation]
---

# A) OLS ?

[[mean squared error|MSE]] 를 cost function 으로 가지는 [[linear regression|선형 회귀]] 모델에 대한 closed form solution

다음과 같은 선형 회귀 모델에 대한 [[residual sum of squares|RSS]] 가 있다고 해보자.

$$
\displaystyle\operatorname{RSS}(\boldsymbol{w})=\frac{1}{2}\sum_{n=1}^{N}\left(y_{n}-\boldsymbol{w}^{\top}\boldsymbol{x}_{n}\right)^{2}=\frac{1}{2}\|\mathbf{X}\boldsymbol{w}-\boldsymbol{y}\|_{2}^{2}=\frac{1}{2}(\mathbf{X}\boldsymbol{w}-\boldsymbol{y})^{\top}(\mathbf{X}\boldsymbol{w}-\boldsymbol{y})
$$

이를 미분해서 [[gradient]] 를 구하면 다음과 같다.

$$
\nabla_{\boldsymbol{w}}\operatorname{RSS}(\boldsymbol{w})=\mathbf{X}^{\top}\mathbf{X}\boldsymbol{w}-\mathbf{X}^{\top}\boldsymbol{y}
$$

이제 gradient 를 0 으로 설정하면 normal equations 이라고 알려진 다음과 같은 식을 얻는다:

$$
\mathbf{X}^{\top}\mathbf{X}\boldsymbol{w}=\mathbf{X}^{\top}\boldsymbol{y} 
$$

최적의 솔루션은 $y-\mathrm{X}w$ 이 $\mathbf{X}$ 의 범위에 대해 normal ([[orthogonal]]) 한 것이다.

즉, $\hat{\boldsymbol{w}}$ 에 대한 solution OLS 는 아래와 같다.

$$

\hat{\boldsymbol{w}}=\left(\mathbf{X}^{\top}\mathbf{X}\right)^{-1}\mathbf{X}^{\top}\boldsymbol{y}

$$

이는 [[system of linear equations]] $\boldsymbol{A} \boldsymbol{w}=\boldsymbol{b}$ 에서 $\boldsymbol{A}=\left(\boldsymbol{X}^{\top} \boldsymbol{X}\right)$ 와 $\boldsymbol{b}=\boldsymbol{X}^{\top} \boldsymbol{y}$ 일때, $\boldsymbol{w}$ 을 찾는 것과 같다.

# B) OLS 는 Unique Global Minimum 을 가지는가?

OLS 의 solution 이 unique 한지 확인하기 위해서는 parameter $\boldsymbol{w}$ 의 [[Hessian matrix]] 가 [[positive definite]] 한지 알아보면 된다

$$

\displaystyle\mathbf{H}(\boldsymbol{w})=\frac{\partial^{2}}{\partial\boldsymbol{x}^{2}}\operatorname{RSS}(\boldsymbol{w})=\mathbf{X}^{\top}\mathbf{X}

$$

만약 $\mathbf{X}$ 가 full [[the rank of a matrix|rank]] 인 경우, $\mathbf{H}$ 는 [[positive definite]] 하다.

여기서 full rank 인 경우는 $\mathbf{X}:=\left[\boldsymbol{x}_{1}, \ldots, \boldsymbol{x}_{N}\right]^{\top} \in \mathbb{R}^{N \times D}$ 의 rank 가 $D$ 를 만족한다는 의미이고, positive definite 는 $\boldsymbol{v}>0$ 에 대해 $\boldsymbol{v}^{\top}\left(\mathbf{X}^{\top}\mathbf{X}\right)\boldsymbol{v}=(\mathbf{X}\boldsymbol{v})^{\top}(\mathbf{X}\boldsymbol{v})=\|\mathbf{X}\boldsymbol{v}\|^{2}>0$ 를 만족한다는 의미이다.

# C) Computing Issue

$N \gg D$ 인 경우 $\left(\mathbf{X}^{\top}\mathbf{X}\right)^{-1}$ 를 [[QR decomposition]] 을 통해 좀 더 빠르게 계산하는 방법이 있다: $\mathbf{X}=\mathbf{Q}\mathbf{R},$ where $\mathbf{Q}^{\top}\mathbf{Q}=\mathbf{I}$

* OLS 는 the system of linear equations $\mathrm{X}w=y$ 을 푸는 것과 동일하다는 점을 고려했을 때 QR decomposition 을 이용하면 다음과 같이 계산할 수 있다

$$

\begin{aligned}(\mathbf{QR})\boldsymbol{w}&=\boldsymbol{y}\\\mathbf{Q}^{\top}\mathbf{QR}\boldsymbol{w}&=\mathbf{Q}^{\top}\boldsymbol{y}\\\boldsymbol{w}&=\mathbf{R}^{-1}\left(\mathbf{Q}^{\top}\boldsymbol{y}\right)\end{aligned}

$$

이때, $\mathbf{R}$ 은 upper triangular 이므로, [[backsubstitution]] 을 이용하면 matrix inversion 없이 equation 을 풀 수 있다.

other approaches: conjugate gradient, GMRES (generalized minimal residual method)

* Important issue
	* model 을 fitting 하기 전에, input feature 를 [[standardization|z-score]] 형태로 만드는 것이: zero mean and unit variance.

# D) Solving for Offset and Slope Separately

$p(y\mid\boldsymbol{x},\boldsymbol{\theta})=\mathcal{N}\left(y\mid w_{0}+\boldsymbol{w}^{\top}\boldsymbol{x},\sigma^{2}\right)$ 에서 $\left(w_{0},\boldsymbol{w}\right)$ 를 동시에 계산하는 방법 ($\mathbf{X}$ 에 $1$ column vector 추가) 도 있지만, 따로 계산할 수 있다.

$$

\hat{\boldsymbol{w}}=\left(\mathbf{X}_{c}^{T}\mathbf{X}_{c}\right)^{-1}\mathbf{X}_{c}^{T}\boldsymbol{y}_{c}=\left[\sum_{i=1}^{N}\left(\boldsymbol{x}_{n}-\overline{\boldsymbol{x}}\right)\left(\boldsymbol{x}_{n}-\overline{\boldsymbol{x}}\right)^{T}\right]^{-1}\left[\sum_{i=1}^{N}\left(y_{n}-\bar{y}\right)\left(\boldsymbol{x}_{n}-\overline{\boldsymbol{x}}\right)\right]

$$

* $\mathbf{X}_{c}$ 는 centered input matrix 로, 행이 $\boldsymbol{x}_{n}^{c}=\boldsymbol{x}_{n}-\overline{\boldsymbol{x}}$ 으로 구성됨 ($\boldsymbol{y}_{c}=\boldsymbol{y}-\overline{\boldsymbol{y}}$ 는 centered output)

$$

\displaystyle\hat{w}_{0}=\frac{1}{N}\sum_{n}y_{n}-\frac{1}{N}\sum_{n}\boldsymbol{x}_{n}^{T}\hat{\boldsymbol{w}}=\bar{y}-\overline{\boldsymbol{x}}^{T}\hat{\boldsymbol{w}}

$$

* $\hat{\boldsymbol{w}}$ 를 centered data 에 대해 계산하고, $\bar{y}-\overline{\boldsymbol{x}}^{T}\hat{\boldsymbol{w}}$ 를 통해 bias $w_0$ 를 계산

# E) 단점

$\mathbf{X}^{\top} \mathbf{X}$ 가 invertible 하지 않는 경우, 즉 [[singular]] 인 경우는 잘 동작하지 않는다.

이런 경우는 대부분 $m<n$ ($\mathbf{X}$ 는 $m \times n$ matrix) 이거나 일부 feature 가 불필요하는 경우다.

# F) References
