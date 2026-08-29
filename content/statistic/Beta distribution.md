---
title: "Beta distribution"
tags:
  - probability_distribution
  - statistic
aliases: []
---

# 1. Beta Distribution ?

# 2. 정의

베타 분포는 두 매개변수 $α$ 와 $β$ 에 대해 0 과 1 사이에서 정의되는 연속확률분포들의 가족 (a general family of continuous probability distributions) 을 의미한다.

The beta distribution is frequently used as a [[conjugate prior]] distribution in Bayesian statistics. prior 와 posterior 가 동일한 beta 분포라고 할때, 전체 trial 중 $\alpha - 1$ 는 성공한 횟수 그리고 $\beta - 1$ 는 실패한 횟수로 parameter 의 의미를 부여할 수 있다.

# 3. 베타 분포의 [[Probability Density Function|PDF]]

$$
\displaystyle f(x,\alpha,\beta)\\=\frac{1}{\mathrm{~B}(\alpha,\beta)}x^{\alpha-1}(1-x)^{\beta-1}=\frac{\Gamma(\alpha+\beta)}{\Gamma(\alpha)\Gamma(\beta)}x^{\alpha-1}(1-x)^{\beta-1}
$$

* 감마 함수 $\Gamma(n)=(n-1)!$
* The parameters $\alpha$ and $\beta$ must be $>0$.
* $x^{\alpha-1}(1-x)^{\beta-1}$ 의 부분이 [[Bernoulli distribution]] 과 비슷하다: $x^p(1-x)^{1-p}$

# 4. 평균과 분산

* Mean: $\displaystyle\frac{\alpha}{\alpha+\beta}$
* [mode]([[mode]]): $\displaystyle\frac{\alpha-1}{\alpha+\beta-2}$
* Variance: $\displaystyle\frac{\alpha\beta}{(\alpha+\beta)^{2}(\alpha+\beta+1)}$

# 5. 특징

* $\alpha,\beta>0$ 를 만족해야만, 해당 분포가 integrable 하다 (즉, $B(\alpha,\beta)$ 가 존재한다).

# 6. Reference

* [github blog(ratsgo)](https://ratsgo.github.io/statistics/2017/05/28/binomial/)

# 7. Related

* [[Binomial Distribution]]
* [[multinomial distribution]]
* [[Dirichlet distribution]]

# 8. References
