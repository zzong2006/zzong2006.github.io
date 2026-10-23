---
title: "trace"
aliases: [trace trick]
tags:
  - linear_algebra
---

# A) Trace ?

square matrix $\boldsymbol{A}\in\mathbb{R}^{n\times n}$ 의 trace 는 주어진 정사각 행렬의 대각 원소들의 합을 의미한다.

$$
\displaystyle\operatorname{tr}(\boldsymbol{A}):=\sum_{i=1}^{n}a_{ii}
$$

# B) Properties

trace 는 다음 성질을 가진다.

* $\operatorname{tr}(\boldsymbol{A}+\boldsymbol{B})=\operatorname{tr}(\boldsymbol{A})+\operatorname{tr}(\boldsymbol{B})$, for $\boldsymbol{A},\boldsymbol{B}\in\mathbb{R}^{n\times n}$
* $\operatorname{tr}(\alpha\boldsymbol{A})=\alpha\operatorname{tr}(\boldsymbol{A})$, for $\alpha\in\mathbb{R},\ \boldsymbol{A}\in\mathbb{R}^{n\times n}$
* $\operatorname{tr}\left(\boldsymbol{I}_{n}\right)=n$
* $\operatorname{tr}(\boldsymbol{A}\boldsymbol{B})=\operatorname{tr}(\boldsymbol{B}\boldsymbol{A})$, for $\boldsymbol{A}\in\mathbb{R}^{n\times k},\ \boldsymbol{B}\in\mathbb{R}^{k\times n}$

마지막 성질(cyclic property) 을 두 벡터의 곱에 적용하면, outer product 의 trace 가 inner product 와 같아진다.

$$
\operatorname{tr}\left(\boldsymbol{x}\boldsymbol{y}^{\top}\right)=\operatorname{tr}\left(\boldsymbol{y}^{\top}\boldsymbol{x}\right)=\boldsymbol{y}^{\top}\boldsymbol{x}\in\mathbb{R}
$$

여기서 $\boldsymbol{x},\boldsymbol{y}\in\mathbb{R}^{n}$ 이다.

# C) Trace Trick

Trace trick 은 scalar 를 trace 로 감싼 뒤 cyclic property 로 행렬 곱의 순서를 바꾸는 기법이다. Scalar $c$ 는 $1\times 1$ 행렬로 볼 수 있으므로 $c=\operatorname{tr}(c)$ 이고, 이 등식 덕분에 이차형식 (quadratic form) 을 다음처럼 바꿔 쓸 수 있다.

$$
\boldsymbol{x}^{\top}\boldsymbol{A}\boldsymbol{x}=\operatorname{tr}\left(\boldsymbol{x}^{\top}\boldsymbol{A}\boldsymbol{x}\right)=\operatorname{tr}\left(\boldsymbol{A}\boldsymbol{x}\boldsymbol{x}^{\top}\right)
$$

여기서 $\boldsymbol{x}\in\mathbb{R}^{n}$ 은 벡터, $\boldsymbol{A}\in\mathbb{R}^{n\times n}$ 은 행렬이다. 오른쪽 식에서는 $\boldsymbol{A}$ 가 맨 앞으로 나와 있어서, $\boldsymbol{A}$ 에 대해 미분할 때 아래 공식을 바로 쓸 수 있다.

$$
\frac{\partial}{\partial\boldsymbol{A}}\operatorname{tr}(\boldsymbol{A}\boldsymbol{B})=\frac{\partial}{\partial\boldsymbol{A}}\operatorname{tr}(\boldsymbol{B}\boldsymbol{A})=\boldsymbol{B}^{\top}
$$

$$
\frac{\partial}{\partial\boldsymbol{A}}\log|\boldsymbol{A}|=\boldsymbol{A}^{-\top}
$$

$|\boldsymbol{A}|$ 는 $\boldsymbol{A}$ 의 determinant 다. [[Gaussian distribution|multivariate Gaussian]] 의 log-likelihood 는 $\log|\boldsymbol{\Sigma}|$ 항과 $(\boldsymbol{x}-\boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\boldsymbol{x}-\boldsymbol{\mu})$ 항으로 이루어져 있어서, covariance matrix $\boldsymbol{\Sigma}$ 의 maximum likelihood 추정값을 유도할 때 이 두 공식을 함께 쓴다.
