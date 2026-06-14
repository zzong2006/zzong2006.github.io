---
title: "covariance"
tags: ["statistic", "metrics", "linear_regression"]
aliases: ["covariance matrix", "공분산"]
---

# 1. Covariance ?

covariance 는 두 변수가 얼마나 선형적으로 관계가 있는지 수치적으로 나타내는 값이다.

covariance 의 절대값이 높다면, 두 값이 많은 변동이 있고 동시에 평균으로부터 멀리 떨어져 있다는 것을 의미한다.

양의 covaraince 는 두 값이 서로 양의 상관관계를 의미하고, 음의 covariance 는 음의 상관관계를 의미한다.

# 2. Correlation 과 관계

[[correlation]] 은 covariance 의 normalized 된 형태이다.

# 3. Covariance 계산 방법

## 3.1. For Univariate

The covariance between two univariate random variables $X,Y\in\mathbb{R}$ is given by the expected product of their deviations from their respective means

$$
\displaystyle\operatorname{Cov}_{X,Y}[x,y]:=\mathbb{E}_{X,Y}\left[\left(x-\mathbb{E}_{X}[x]\right)\left(y-\mathbb{E}_{Y}[y]\right)\right]
$$

Linearity of expectation([[expectation#Linearity of expectation]]) 에 의해서 위 식은 다음과 같이 다시 쓸 수 있다: the expected value of the product minus the product of the expected values)

$$
\operatorname{Cov}[x,y]=\mathbb{E}[xy]-\mathbb{E}[x]\mathbb{E}[y]
$$

## 3.2. For Multivariate

If we consider two multivariate random variables $X$ and $Y$ with states $\boldsymbol{x}\in\mathbb{R}^{D}$ and $\boldsymbol{y}\in\mathbb{R}^{E}$ covariance respectively, the covariance between $X$ and $Y$ is defined as

$$
\operatorname{Cov}[\boldsymbol{x},\boldsymbol{y}]=\\\mathbb{E}\left[\boldsymbol{x}\boldsymbol{y}^{\top}\right]-\mathbb{E}[\boldsymbol{x}]\mathbb{E}[\boldsymbol{y}]^{\top}=\operatorname{Cov}[\boldsymbol{y},\boldsymbol{x}]^{\top}\in\mathbb{R}^{D\times E}
$$

# 4. Variance 와 관계

어떤 변수의 자기 자신에 대한 covariance 를 [[variance]] 라고 한다.

## 4.1. For Univariate

$\boldsymbol{x}\in\mathbb{R}^{D}$ 이고, $\boldsymbol{\mu}\in\mathbb{R}^{D}$ 일때, $\operatorname{Cov}[x,x]$ 는 variance 라고 하며, $\mathrm{V}_{X}[x]$ 로 표현된다.

$$
\mathbb{V}_{X}[x]:=\mathbb{E}_{X}\left[(x-\mu)^{2}\right]
$$

## 4.2. For Multivariate

multivariate 의 variance 경우는 다음과 같이 covariance 의 matrix 로 표현한다.

$$
\begin{aligned}\mathbb{V}_{X}[\boldsymbol{x}]&=\operatorname{Cov}_{X}[\boldsymbol{x},\boldsymbol{x}]\\&=\mathbb{E}_{X}\left[(\boldsymbol{x}-\boldsymbol{\mu})(\boldsymbol{x}-\boldsymbol{\mu})^{\top}\right]=\mathbb{E}_{X}\left[\boldsymbol{x}\boldsymbol{x}^{\top}\right]-\mathbb{E}_{X}[\boldsymbol{x}]\mathbb{E}_{X}[\boldsymbol{x}]^{\top}\\&=\left[\begin{array}{cccc}\operatorname{Cov}\left[x_{1},x_{1}\right]&\operatorname{Cov}\left[x_{1},x_{2}\right]&\ldots&\operatorname{Cov}\left[x_{1},x_{D}\right]\\\operatorname{Cov}\left[x_{2},x_{1}\right]&\operatorname{Cov}\left[x_{2},x_{2}\right]&\ldots&\operatorname{Cov}\left[x_{2},x_{D}\right]\\\vdots&\vdots&\ddots&\vdots\\\operatorname{Cov}\left[x_{D},x_{1}\right]&\ldots&\ldots&\operatorname{Cov}\left[x_{D},x_{D}\right]\end{array}\right]\end{aligned}
$$

* covariance 의 대각 원소들은 variance 를 의미한다: $\operatorname{Cov}\left(\mathrm{x}_{i},\mathrm{x}_{i}\right)=\operatorname{Var}\left(\mathrm{x}_{i}\right)$

# 5. Regression 과 관계

[[linear regression]] 의 기울기 $m$ 은 $X$ 에 대한 분산을 $X$ 와 $Y$ 의 공분산으로 나눈 것이다.

$$
m=\frac{\operatorname{Cov}(X, Y)}{\operatorname{Var}(X)}
$$

# 6. Covariance Matrix

covariance matrix 는 우리에게 데이터가 얼마나 퍼져 (spread) 있는지 알려주는 역할을 한다.

## 6.1. 특징

symmetric 이며, [[positive definite|positive semi-definite]] 하다.
covariance matrix 의 대각 원소는 marginals 의 variance 를 나타낸다.

$$
\displaystyle p\left(x_{i}\right)=\int p\left(x_{1},\ldots,x_{D}\right)\mathrm{d}x_{\backslash i}
$$

* $\backslash i$ 는 $i$ 만 제외하고 모두라는 뜻
* 대각 원소가 아닌 다른 원소들은 cross-covariance
: $\operatorname{Cov}\left[x_{i},x_{j}\right]$ for $i,j=1,\ldots,D,i\neq j$

Empirical covariance matrix

* 모집단이 아니라 샘플에 의해 계산되는 크기가 $D\times D$ 인 공분산 행렬을 의미 ($\boldsymbol{x}$ 크기가 $D\times1$)

$$
\displaystyle\boldsymbol{\Sigma}:=\frac{1}{N}\sum_{n=1}^{N}\left(\boldsymbol{x}_{n}-\overline{\boldsymbol{x}}\right)\left(\boldsymbol{x}_{n}-\overline{\boldsymbol{x}}\right)^{\top}
$$

covariance matrix 의 종류

* full : $D(D+1)/2$ 개의 원소를 가진 공분산 행렬 (대각선 절반이 가득 찬 행렬)
* diagonal : $D$ 개의 원소를 가진 공분산 행렬 ([[diagonal matrix]])
* spherical 또는 isotropic: $\boldsymbol{\Sigma}=\sigma^{2}\mathbf{I}_{D}$, one free parameter $\sigma^{2}$ 에 의해 좌우되는 공분산 행렬

# 7. Related

# 8. References
