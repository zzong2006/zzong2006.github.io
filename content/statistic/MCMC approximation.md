---
title: "MCMC approximation"
aliases: ["MCMC"]
tags:
  - bayesian_inference
  - sampling
---

# 1. MCMC Approximation ?

MCMC(Markov Chains Monte Carlo) algorithms 은 주어진 분포에 대한 sampling 또는 분포의 parameter estimation 에 사용되는 알고리즘이다.

# 2. Metropolis 알고리즘

MCMC sampling 알고리즘은 여러가지가 있는데, 그중 하나가 Metropolis 알고리즘이다.

## 2.1. Sampling 과정

[[Rejection sampling]] 과 마찬가지로 sample 을 추출하고자 하는 target distribution $f(x)$ 을 준비한다. 또한, proposal distribution $g(x)$ 를 준비하는데, [[Gaussian distribution]] 과 같이 symmetric 한 확률 분포여야 한다.

처음엔 초기 sample $x_0$ 를 임의로 선택하고, 다음과 같은 과정을 $N$ 번 반복하여 sampling 을 진행한다.

1. $g(x_i\mid x_{i-1})$ 의 확률로 $x_i$ 를 sampling 한다.
2. 만약 $u\lt A(x_i,x_{i-1})$ 이라면, $x_i$ 를 accept 하고, 그렇지 않다면 reject 한다.

### 2.1.1. 샘플링 방법

예를 들어 $x_{i-1}$ 를 중심으로 하는 정규 분포에서 $x_i$ 를 sampling 하는걸 생각해볼 수 있다.

1. uniform distribution 에서 $u\sim U_{[0,1]}$ 를 sampling 한다.
2. $A\left(x_{i},x_{i-1}\right)=\min\left\{1,f\left(x_{i}\right)/f\left(x_{i-1}\right)\right\}$ 를 계산한다.

### 2.1.2. Accept 과 Rejection 기준

이는 새로 제안된 샘플에서 target 분포의 높이가 proposal 분포의 높이보다 높은 경우만 수용하고, 그렇지 않으면 거절하는 식이다 (물론 거절의 경우 $u$ 의 확률로 진행).

![[img-e29ccfc1da.png]]

# 3. Related Algorithm: [[Metropolis-Hasting]] Algorithm

proposal distribution 이 symmetric 하지 않은 경우를 고려한 알고리즘

$\displaystyle A\left(x_{i},x_{i-1}\right)=\min\left\{1,\frac{f\left(x_{i}\right)/g\left(x_{i}\mid x_{i-1}\right)}{f\left(x_{i-1}\right)/g\left(x_{i-1}\mid x_{i}\right)}\right\}$ 로 $A\left(x_{i},x_{i-1}\right)$ 값을 치환한다.

위 식은 분자 분모 각각의 값 ($f(x_i),f(x_{i-1})$) 에 일종의 정규화를 진행했다고 생각할 수 있다.

* The whole MCMC approach is based on the ability to build a Markov Chain whose [[stationary distribution]] is the one we want to sample from.
	* In order to do so, [[Metropolis-Hasting]] and [[Gibbs Sampling]] algorithms both use a particular property of Markov Chains: **reversibility**.
	* “가장 마지막에 뽑힌 샘플이 다음번 샘플을 추천해준다.” 라는 의미로 Markov Chain 을 사용한다고 생각하면 좋다.
* MCMC draws samples from a probability distribution defined up to a factor.
	* The “Monte Carlo” part of the method’s name is due to the sampling purpose whereas the “Markov Chain” part comes from the way we obtain these samples
	* 즉, 첫 샘플을 랜덤하게 선정한 뒤, 첫 샘플에 의해 그 다음번 샘플이 추천되는 방식 (Markov Chain) 의 시도를 무수하게 해본다 (Monte Carlo).
* MCMC approaches assume no model for the studied probability distribution.
	* As a consequence, these methods have a low bias but a high variance.
	* MCMC 는 비용은 많이 들지만 [[variational inference]] 을 통해 얻어낸 결과보다는 정확하다.

# 4. Related

* [[Gibbs Sampling]], [[Bayesian inference]], [[Hamiltonian Monte Carlo]], [[approximate posterior inference]]

# 5. References

* https://twiecki.io/blog/2015/11/10/mcmc-sampling/
	* an attempt at trying to explain the **intuition** behind MCMC sampling
* https://angeloyeo.github.io/2020/09/17/MCMC.html
