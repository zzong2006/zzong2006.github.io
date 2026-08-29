---
title: "bias"
aliases: []
tags:
  - machine_learning
  - statistic
---

# A) Bias ?

bias 는 데이터 내에 있는 모든 정보를 고려하지 않음으로 인해, 지속적으로 잘못된 것들을 학습하는 경향을 말한다.

어떤 모델을 학습시켰을 경우, 그 모델이 예측한 값과 실제 정답이 얼마나 멀리있는지를 나타내는가 생각해보면 된다. 너무 멀리있으면 (오답이 크면) high bias([[underfitting]]), 가까이 있으면 (예측이 정확하면) low bias 이다.

# B) Solution for High Bias

* Bigger Network (모델에 complexity 를 추가)
* Train Longer
* NN architecture search (또 다른 신경망 구조를 탐색 및 시도)
* High bias 상태에서 데이터를 추가하는 것은 아무 도움을 주지 않는다.

# C) Bias in point Estimation

$$
\operatorname{bias}\left(\hat{\boldsymbol{\theta}}_{m}\right)=\mathbb{E}\left(\hat{\boldsymbol{\theta}}_{m}\right)-\boldsymbol{\theta}
$$

* $\hat{\boldsymbol{\theta}}_{m}=g\left(\boldsymbol{x}^{(1)},\ldots,\boldsymbol{x}^{(m)}\right)$ 는 $m$ 개의 데이터로 추정한 parameter

## C.1) Example: Estimators of the Variance of a Gaussian Distribution

$\displaystyle \hat{\sigma}_{m}^{2}=\frac{1}{m}\sum_{i=1}^{m}\left(x^{(i)}-\hat{\mu}_{m}\right)^{2}$ 으로 sample variance 를 추정하는 경우의 bias 는 다음과 같이 계산된다.

* $\operatorname{bias}\left(\hat{\sigma}_{m}^{2}\right)=\mathbb{E}\left[\hat{\sigma}_{m}^{2}\right]-\sigma^{2}$
* $\begin{aligned}\mathbb{E}\left[\hat{\sigma}_{m}^{2}\right]&=\mathbb{E}\left[\frac{1}{m}\sum_{i=1}^{m}\left(x^{(i)}-\hat{\mu}_{m}\right)^{2}\right]=\frac{m-1}{m}\sigma^{2}\end{aligned}$
즉, bias 는 $-\sigma^{2}/m-\sigma^{2}/m$ 으로, 위의 추정은 biased estimator 이다.

위 variance 추정 식 대신, $\tilde{\sigma}_{m}^{2}=\frac{1}{m-1}\sum_{i=1}^{m}\left(x^{(i)}-\hat{\mu}_{m}\right)^{2}$ 를 사용하면 unbiased 하게 나온다 (i.e. $\operatorname{bias}\left(\hat{\sigma}_{m}^{2}\right)=0$). 하지만 unbased estimator 가 언제나 best 인것은 아니다.

# D) Bias in Linear Model

[[residual sum of squares|RSS]] 가 다음과 같을 때,

$$
\mathrm{RSS}=\sum_{i=1}^{n}\left(y_{i}-\beta_{0}-\sum_{j=1}^{p} \beta_{j} x_{i j}\right)^{2}
$$

bias(intercept) 는 $x_{i 1}=x_{i 2}=\ldots=x_{i p}=0$ 일 때 $y$ 의 [[expectation|expected value]] 를 의미한다.

# E) References
