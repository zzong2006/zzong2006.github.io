---
title: "empirical risk minimization"
tags: 
aliases: ["ERM"]
---

# Empirical risk Minimization ?

[[Maximum Likelihood Estimation]] 에서 (conditional) log loss term $\ell\left(\boldsymbol{y}_{n},\boldsymbol{\theta};\boldsymbol{x}_{n}\right)=-\log p\left(\boldsymbol{y}_{n}\mid\boldsymbol{x}_{n},\boldsymbol{\theta}\right)$ 에 평균을 계산한 값

$$
\displaystyle\mathcal{L}(\boldsymbol{\theta})=\frac{1}{N}\sum_{n=1}^{N}\ell\left(\boldsymbol{y}_{n},\boldsymbol{\theta};\boldsymbol{x}_{n}\right)
$$

empirical 분포를 이용해 expected loss 를 계산했으므로 empirical risk minimization 이라고 부른다.

# References
