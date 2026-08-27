---
tags: ["statistic"]
aliases: ["evidence"]
---

# Marginal Likelihood ?

a marginal [[likelihood]] function, or integrated likelihood, is a likelihood function in which some parameter variables have been [[marginal distribution|marginal]]ized.

[[i.i.d.]] 데이터 셋 $\mathbf{X}=\left(x_{1},\ldots,x_{n}\right)$ 이 주어졌을 때, marginal likelihood 는 일반적으로 $\theta$ 가 marginalized out 되었을 경우의 $p(\mathbf{X}\mid\alpha)$ 에 대한 확률을 묻는다

$$
\displaystyle p(\mathbf{X}\mid\alpha)=\int_{\theta}p(\mathbf{X}\mid\theta)p(\theta\mid\alpha)\mathrm{d}\theta
$$

* $x_{i}\sim p\left(x_{i}\mid\theta\right)$ 는 $\theta$ 를 parameter 로 가지는 어떤 확률 분포를 따르는 데이터 포인트
* 그리고 $\theta$ 는 데이터와 마찬가지로 어떤 분포에 의해 설명되는 랜덤 변수: $\theta\sim p(\theta\mid\alpha)$

# References
