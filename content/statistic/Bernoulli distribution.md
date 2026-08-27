---
tags: ["probability_distribution", "statistic"]
aliases: ["베르누이 분포"]
---

# A) Bernoulli Distribution ?

$X\sim B(p)$ ($\sim$ 은 랜덤 변수 $X$ 가 베르누이 분포 $B(p)$ 를 따른다는 의미)

베르누이 분포는 어떤 trial 이 성공 또는 실패할 확률을 정의한다.

* $P(X=1)=p$
* $P(X=0)=1-p$

특정 확률 $p$ 가 주어졌을 때, $X$ 가 $x$ 일 확률은?

$$
f(X=x|p)=f(x|p)
$$

베르누이의 경우

$$
p^x(1-p)^{1-x}I_{x\in{0,1}}(x)
$$

여기서 $I_{x\in{0,1}}(x)$ 는 [[Indicator function]] 으로 가장 먼저 계산함

# B) Expected Value & Variance

Expected value

$$
E[X]=\sum_{x}xP(X=x)=(1)p+(0)(1-p)=p
$$

Variance

$$
Var(x)=p(1-p)
$$

# C) Notes

* 베르누이를 $N$ 번 실행하는 경우 - [[Binomial Distribution]]

# D) Likelihood Function

observations $\mathcal{D}=\left\{x_{1},\ldots,x_{N}\right\}$ 이 $p(x\mid\mu)$ 에서 독립적으로 생성된다고 했을 경우를 생각해보자 ($\mu=p$). 이때 likelihood 는 다음과 같이 계산된다.

$$
\displaystyle p(\mathcal{D}\mid\mu)=\prod_{n=1}^{N}p\left(x_{n}\mid\mu\right)=\prod_{n=1}^{N}\mu^{x_{n}}(1-\mu)^{1-x_{n}}
$$

그리고 log likelihood function 은 다음과 같다.

$$
\displaystyle\ln p(\mathcal{D}\mid\mu)=\sum_{n=1}^{N}\ln p\left(x_{n}\mid\mu\right)=\sum_{n=1}^{N}\left\{x_{n}\ln \mu+\left(1-x_{n}\right)\ln(1-\mu)\right\}

s
$$

만약 위 log 함수를 $\mu$ 에 대해 미분하고 $0$ 인 값을 찾는다면, 가장 최대가 되는 $\mu$ 는 다음과 같다.

$$
\displaystyle\mu_{\mathrm{ML}}=\frac{1}{N}\sum_{n=1}^{N}x_{n}
$$

# E) References
