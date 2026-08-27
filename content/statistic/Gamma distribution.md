---
tags: ["probability_distribution"]
---

# A) Gamma Distribution ?

* The gamma distribution can be parameterized in terms of a shape parameter $α = k$ and an inverse scale parameter $β =1/θ$, called a rate parameter.
	* [[exponential distribution]] 에서는 rate parameter 는 event 의 발생 빈도 (rate) 로 해석되고, $\lambda=1/\theta$ 로 표현된다.
	* 또한 $k$ 는 당신이 기다리는 $k$ 번째 event 를 의미한다.
* A random variable $X$ that is gamma-distributed with shape __α__ and rate __β__ is denoted
	* $X\sim\Gamma(\alpha,\beta)\equiv\Gamma(\alpha,\beta)$

# B) 특징

The exponential distribution, Erlang distribution, and chi-square distribution are special cases of the gamma distribution.

# C) 왜 Gamma Distribution 가 필요한가?

* 감마 분포는 어떤 미래의 이벤트가 발생할때 까지 기다리는 시간을 예측할 때 사용한다.
	* 즉, 감마 분포는 $k$ 번째 event 가 발생하기 전까지 기다리는 시간을 예측한다.
		* $k$ 는 gamma 분포에서 shape parameter 로 사용된다.
* 또한, [[Gaussian distribution]] 와 유사하게 확률 분포를 모델링할 수 있는데, 가우시안 분포와 달리 감마 분포는 항상 양수를 가진다는 차이점이 있어서 실생활 현상을 모델링 하는데 적합하다.
	* 예시) 자동자의 속도를 모델링 (평균 60km, 표준편차 $\pm$10km)

# D) Mean, Variance, Mode

* Mean: $k\theta$
* Variance: $k\theta^2$
* Mode: $(k-1)\theta$ for $k \geq 1$

[pdf]([[Probability Density Function]]) of Gamma distribution

* $\displaystyle f(x;\alpha,\beta)=\frac{x^{\alpha-1}e^{-\beta x}\beta^{\alpha}}{\Gamma(\alpha)}\text{for}x>0\quad\alpha,\beta>0$
	* $\alpha=k$: shape parameter, $\beta=1/\theta$:rate parameter
	* $\Gamma(\alpha)=(\alpha-1)!$ 는 [[gamma function]]

plots
![[img-8d9229b8e2.png]]

# E) Related

[[Poisson distribution]], [[Erlang distribution]]

# F) References

[naver_blog](https://blog.naver.com/mykepzzang/220842759639)
