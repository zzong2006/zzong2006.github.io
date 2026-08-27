---
tags: ["machine_learning"]
aliases: ["선형 회귀"]
---

# A) Linear Regression ?

Linear Regression 는 다음과 같은 형태의 모델을 의미한다

$$
p(y\mid\boldsymbol{x},\boldsymbol{\theta})=\mathcal{N}\left(y\mid w_{0}+\boldsymbol{w}^{\top}\boldsymbol{x},\sigma^{2}\right)
$$

* 여기서 $\boldsymbol{\theta}=\left(w_{0},\boldsymbol{w},\sigma^{2}\right)$ 는 모델의 모든 parameters 로 불리고, $\boldsymbol{w}_{1:D}$ 는 weights 또는 회귀 계수라고 불린다.
* $w_{0}$ 는 offset 또는 [[bias]] 를 의미한다. 이는 입력 값이 $0$ 일 경우의 값을 의미한다.

# B) Linear Regression 의 종류

## B.1) Simple Linear Regression

입력 차원 $\boldsymbol{x}\in\mathbb{R}^{D},D=1$ 일 경우

## B.2) Multiple Linear Regression

$D>1$ 인 경우

## B.3) Multivariate Linear Regression

$\boldsymbol{y}\in\mathbb{R}^{J},J>1$ 인 경우. 즉, $p(\boldsymbol{y}\mid\boldsymbol{x},\mathbf{W})=\prod_{j=1}^{J}\mathcal{N}\left(y_{j}\mid\boldsymbol{w}_{j}^{\top}\boldsymbol{x},\sigma_{j}^{2}\right)$

## B.4) Polynomial Regression

[[polynomial regression]] 은 input 에 nonlinear transformation 이 적용된 경우의 linear regression 을 의미한다.

$$
p(y\mid\boldsymbol{x},\boldsymbol{\theta})=\mathcal{N}\left(y\mid\boldsymbol{w}^{\top}\boldsymbol{\phi}(\boldsymbol{x}),\sigma^{2}\right)
$$

* 여기서 $\phi$ 는 feature extractor

# C) Linear Regression 을 푸는 방법

선형 회귀 모델을 주어진 데이터에 맞추기: [[least squares estimation]]

# D) The Quality of a Linear Regression

선형 회귀 모델의 퀄리티는 일반적으로 두 가지를 통해 측정된다: the [[residual standard error]] and the [[R-squared]] $R^2$-statistic.

## D.1) Goodness of FIt

goodness of ﬁt 이란, regression model 가 데이터를 얼마나 잘 학습했는지의 정도를 의미한다. 다음과 같은 여러 간단한 방법들이 존재한다.

1. [[residual plot]]: 데이터의 non-linearity 를 확인하기 위해 사용
2. [[residual sum of squares|RSS]]: 실제 정답과 얼마나 다른지 확인하기 위해 사용

## D.2) Using Standard Error

[[standard error#Regression]] 참고

# E) 선형 회귀 모델을 다룰 때 발생할 수 있는 문제들

[[challenges of linear regression]]

# F) Related

[[logistic regression]], [[ridge regression]], [[least squares estimation]], [[ordinary least squares]]
