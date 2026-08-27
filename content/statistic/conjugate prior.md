---
tags: ["bayesian_inference", "statistic"]
---

# Conjugate prior ?

만약 [[posterior]] 가 [[prior]] 와 동일한 parameterized family 라면 (i.e., $p(\boldsymbol{\theta}\mid\mathcal{D})\in\mathcal{F}$), 우리는 이 prior $p(\boldsymbol{\theta})\in\mathcal{F}$ 가 [[likelihood]] 함수에 대한 **conjugate prior** $p(\mathcal{D}\mid\boldsymbol{\theta})$ 라고 한다.

# 왜 Conjugate prior 가 중요한가?

prior, posterior 쌍이 존재한다면, posterior 에 대한 closed form 을 계산할 수 있다.

만약 $\mathcal{F}$ 가 [[exponential family]] 에 속한다면, 계산을 closed form 으로 수행할 수 있다.

# Gaussian

* the conjugate prior for the mean of a [[Gaussian distribution]] is another Gaussian.
* the conjugate prior for the parameters of the [[multinomial distribution]] is called the [[Dirichlet distribution]].

# Related

* [[Laplace prior]]

# References

* [Beta Prior for Bernoulli](https://rpubs.com/sitaramgautam/145048)
