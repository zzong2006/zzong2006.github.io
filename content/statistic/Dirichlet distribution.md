---
title: "Dirichlet distribution"
tags:
  - statistic
aliases: []
---

# 1. Dirichlet Distribution ?

Dirichlet(디리클레) 분포는 [[statistic/Beta distribution]] 의 확장판

* Beta 분포의 경우 $X\sim\operatorname{Beta}(\alpha,\beta)$ 에서 sample 을 뽑을 시 0 과 1 사이의 값이 나옴
* Dirichlet 분포의 경우 vector 를 sampling 하고, vector 의 원소들은 모두 $[0,1]$ 값을 가지며, 다 합치면 $1$ 이 나옴
	* 즉, Dirichlet 의 sample space 에 존재하는 vector 는 확률 분포와 동일한 속성을 지닌다.
* 디리클레 분포는 $k$ 차원의 실수 벡터에서, 벡터의 원소가 양수이며 모든 요소를 더한 값이 1 인 경우에 확률값이 정의되는 연속확률분포이다.
* pdf of Dirichlet distribution
	* Parameter 가 $a_{1},\ldots,a_{K}>0,K\geq2$ 이면, 디리클레 분포의 pdf 는

$\displaystyle f\left(x_{1},\ldots,x_{K};\alpha_{1},\ldots,\alpha_{K}\right)=\frac{1}{\mathrm{~B}(\boldsymbol{\alpha})}\prod_{i=1}^{K}x_{i}^{\alpha_{i}-1}$ 이다.

Normalizing constant $\mathrm{B}(\boldsymbol{\alpha})$ 는 multivariate beta function 으로, [[gamma function]] 으로 표현될 수 있다.

$$
\mathrm{B}(\boldsymbol{\alpha})=\displaystyle\frac{\prod_{i=1}^{K}\Gamma\left(\alpha_{i}\right)}{\Gamma\left(\sum_{i=1}^{K}\alpha_{i}\right)},\quad\boldsymbol{\alpha}=\left(\alpha_{1},\ldots,\alpha_{K}\right)
$$

$K=2$ 인 경우 [[statistic/Beta distribution]] 이다.

* concentration parameter $\alpha$ 값의 의미
	* 높은 $\alpha_i$ 값은 그 $x_i$ 에 대해 더 많은 가중치가 존재함을 뜻한다.
	* 만약 $\alpha_i$ 가 모두 동일하다면, 그 분포는 symmetric 하다.
	* $\alpha_i<1$ 이라면, $x_i$ 에서 멀어지는 anti-weight 의 정도로 생각할 수 있다.
	* 예시

: (a) $α_1=α_2=α_3=1$, (b) $α_1=α_2=α_3=10$, (c) $α_1=1,α_2=10,α_3=5$, (d) $α_1=α_2=α_3=0.2$

![Four different samples from Dirichlet distributions. In %28a%29 the values are "uniformly" scattered all over the space, in %28b%29 they are clustered around the center, in %28c%29 they are clustered around one side %28alpha_2%29, and slightly shifted towards another %28alpha_3%29, in %28d%29 the values are drifting away from the center, towards the borders.](https://i.stack.imgur.com/7ZiDs.png)

* 특징
	* the Dirichlet distribution 는 [[multinomial distribution]] 그리고 categorical distributions 와 [[conjugate prior]] 관계이다. 그래서 Dirichlet 분포는 prior 분포로 사용할 수 있다.
	* 수식
		* multinomial 분포에 대한 likelihood 는 다음과 같이 계산

: $\displaystyle P(X\mid\theta)=\frac{n!}{x_{1}!\ldots x_{K}!}\theta_{1}^{x_{1}}\ldots\theta_{K}^{x_{K}}$

		* Dirichlet 분포의 prior는 다음과 같이 표현됨

: $\displaystyle p(\theta)=\operatorname{Dir}(\theta\mid\alpha)=\frac{1}{B(\alpha)}\prod_{k=1}^{K}\theta_{k}^{\alpha_{k}-1}$

		* conjugate prior 특성으로 인해, posterior는 Dirichlet 분포를 따르게 되는데, 이는 다음과 같음

: $\displaystyle p(\theta\mid X)\propto\prod_{k=1}^{K}\theta_{k}^{\alpha_{k}+x_{k}-1}$

두 분포에 대한 vector 표현을 서로 더한 것 (beta 분포와 [[statistic/Bernoulli distribution]] 의 관계와 동일)

$p(\theta\mid X)=\operatorname{Dir}\left(\theta\mid\left(\begin{array}{c}\ldots\\\alpha_{k}+x_{k}\\\ldots\end{array}\right)\right)$

* [Maximum log-Likelihood Estimation]([[Maximum Likelihood Estimation]]) of Dirichlet distribution parameters
	* $\begin{aligned}F(\alpha)&=\log p(D\mid\alpha)\\&=\log\prod_{i}p\left(\mathbf{p}_{i}\mid\alpha\right)\\&=\log\prod_{i}\frac{\Gamma\left(\sum_{k}\alpha_{k}\right)}{\prod_{k}\Gamma\left(\alpha_{k}\right)}\prod_{k}p_{ik}^{\alpha_{k}-1}\\&=N\left(\log\Gamma\left(\sum_{k}\alpha_{k}\right)-\sum_{k}\log\Gamma\left(\alpha_{k}\right)+\sum_{k}\left(\alpha_{k}-1\right)\log\hat{p}_{k}\right)\end{aligned}$
		* $\log\hat{p}_{k}=\frac{1}{N}\sum_{i}\log p_{ik}$ 는 관찰된 [[sufficient statistics]]
		* 해당 log-likelihood 함수는 $\alpha$ 에 대해 convex 하기 때문에 unique optimum 을 보장한다.
* In [[Recommendation System]]
	* latent topic 에 대한 standard deviation 을 구하면 user 의 topic 에 대한 선호도가 적절히 분산되어있는지, 아니면 한쪽으로 편향되어 나타나는지 확인할 수 있다 (일반적으로 표준 편차가 작을수록 사용자의 선호도를 잘 구별하지 못한다고 생각할 수 있음).
	* $\alpha$ 값이 클수록 각 사용자에 대해 더 많은 topic 이 할당되고, 작을수록 각 사용자에 대해 더 작은 topic (skew 된) 이 할당됨

# 2. Related

* [[multinomial distribution]]
* [[Latent Dirichlet Allocation]]

# 3. References

[bayesian - What exactly is the alpha in the Dirichlet distribution? - Cross Validated](https://stats.stackexchange.com/questions/244917/what-exactly-is-the-alpha-in-the-dirichlet-distribution)
