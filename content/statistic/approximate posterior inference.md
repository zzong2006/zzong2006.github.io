---
title: "approximate posterior inference"
tags: ["bayesian_inference"]
---

# A) Approximate Posterior Inference ?

[[posterior]] 를 approximate 하게 추정하는 방법이다. 정확한 값을 계산하지 않고 근사하는 이유는 posterior 를 정확하게 계산하려면 많은 비용이 들기 때문에 그렇다.

# B) Approximations

아래에서는 다양한 근사 방법에 대해서 소개한다.

## B.1) 그리드 근사 (Grid Approximation)

미지수의 가능한 값들의 공간을 유한한 개수의 후보, 즉 $\boldsymbol{\theta}_{1}, \ldots, \boldsymbol{\theta}_{K}$로 분할합니다. 이후, 이 후보들에 대해 모든 경우를 직접 계산(brute-force enumeration)하여 다음과 같이 사후확률을 근사할 수 있습니다.

$$
p\left(\boldsymbol{\theta} = \boldsymbol{\theta}_{k} \mid \mathcal{D}\right) \approx \frac{p\left(\mathcal{D} \mid \boldsymbol{\theta}_{k}\right) p\left(\boldsymbol{\theta}_{k}\right)}{p(\mathcal{D})}
= \frac{p\left(\mathcal{D} \mid \boldsymbol{\theta}_{k}\right) p\left(\boldsymbol{\theta}_{k}\right)}{\sum_{k' = 1}^{K} p\left(\mathcal{D},\, \boldsymbol{\theta}_{k'}\right)}
$$

이 방법의 단점은, 차원이 2~3개 이상으로 늘어날 경우 그리드 포인트(즉, 가능한 후보)의 개수가 지수적으로 증가한다는 점입니다. 따라서 현실적으로 고차원 문제에는 적용하기 어렵습니다.

## B.2) Laplace Approximation

[[Laplace approximation]] 를 참고한다.

## B.3) [[variational inference]] (변분 추론)

* [[statistic/MCMC approximation]]

# C) References

# D) References

* [[Computing Bayes - Bayesian Computation from 1763 to the 21st Century]]
* [link](https://arxiv.org/abs/2004.06425): a review of various approximate inference methods
