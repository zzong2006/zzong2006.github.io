---
title: "multinomial distribution"
aliases: []
tags:
  - probability_distribution
  - statistic
---

# A) Multinomial Distribution ?

다항분포 (multinomial distribution) 란, 여러 개의 값을 가질 수 있는 독립 확률변수들에 대한 확률분포를 의미한다. 예를 들어, $k$ 면을 가진 주사위를 $n$ 번 굴렸을 때, 각 면이 나타날 수 있는 횟수에 대한 확률을 모델링 할 수 있다.

## A.1) 가정

* $n$ 번의 독립적 실행 (trial) 이다.
* 각 trial 에는 $k$ 사건 중 하나가 상호 독립적 (mutually exclusive) 으로 발생한다.
* 하나의 실행에서, $k$ 의 outcome 들이 나올 각 확률들: $p_{1}, \ldots, p_{k}$ 은 $\sum_{i=1}^{k} p_{i}=1$ 을 만족한다.

# B) PMF of Multinomial Distribution

랜덤 변수 $X_i$ 는 outcome $i$ 에 대한 발생 횟수라고 가정하자. 이때, multinomial 분포에 대한 [[Probability Mass Function|PMF]] 는 다음과 같다.

$$
P\left(X_{1}=x_{1}, \ldots, X_{k}=x_{k}\right)=\frac{n !}{x_{1} ! \cdots x_{k} !} p_{1}^{x_{1}} \cdots p_{k}^{x_{k}}
$$

여기서 $n$ 은 총 발생 횟수의 합 $\sum_{i=1}^{k} x_i=n$ 을 의미한다.

Multinomial distribution 은 a generalization of the [[Binomial Distribution]] 이다. 만약 $k$ 가 2 이고, $n$ 이 1 이라면, the multinomial distribution 은 [[statistic/Bernoulli distribution]] 이다. 그리고 $k$ is 2 and $n$ is bigger than 1, it is the Binomial Distribution.

# C) 예시

어떤 나라의 선거에 세 번의 후보가 참가했다고 가정하자. 후보 A, B, C 는 각각 20%, 30%, 50% 를 투표로 받았다.

만약 6 명의 지지자들이 세 후보자 중 임의로 선택한다면, 후보 A, B, C 에 대한 각 지지자가 1, 2, 3 명일 확률은 얼마나 되는가?

$$
\displaystyle\operatorname{Pr}(A=1,B=2,C=3)\\=\frac{6!}{1!2!3!}\left(0.2^{1}\right)\left(0.3^{2}\right)\left(0.5^{3}\right)=0.135
$$

# D) Expected Value and variance

[[statistic/expectation|expected value]] of times the outcome $i$ was observed over $n$ trials is $\mathrm{E}\left(X_{i}\right)=np_{i}$.

[[variance]]: $\operatorname{Var}\left(X_{i}\right)=np_{i}\left(1-p_{i}\right)$

# E) MLE Parameter of Multinomial Distribution

$K$ 개의 선택지가 있는 $N$ 개의 데이터 $x_1,…x_n$ 이 주어졌을 때, 해당 데이터들의 likelihood 를 최대화 ([[Maximum Likelihood Estimation|MLE]]) 하는 vector $\boldsymbol{p}$ 를 찾으면?

Maximize $P(X\mid\boldsymbol{p})=\prod_{n=1}^{N}\prod_{k=1}^{K}p_{k}^{x_{nk}}=\prod_{k=1}^{K}p_{k}^{\sum_{n=1}^{N}x_{nk}}=\prod_{k=1}^{K}p_{k}{}^{m_{k}}$

* $m_{k}=\sum_{n=1}^{N}x_{nk}$
* Subject to $p_{k}\geq0,\sum_{k}p_{k}=1$ (constraint)

[[Lagrange multiplier method]] 를 이용해서 풀어보자.

$$
L(\mu,m,\lambda)=\sum_{k=1}^{K}m_{k}\ln p_{k}+\lambda\left(\sum_{k=1}^{K}p_{k}-1\right)
$$

이후 $p_k$ 에 대해 미분하여 0 이 되는 값을 찾는다.

$$
\displaystyle\frac{d}{dp_{k}}L(\mu,m,\lambda)=\frac{m_{k}}{p_{k}}+\lambda=0\rightarrow p_{k}=-\frac{m_{k}}{\lambda}
$$

$\displaystyle\sum_{k}p_{k}=1$ 라는 constraint 를 활용하면 아래와 같이 유도할 수 있다.

$$
\sum_{k}-\frac{m_{k}}{\lambda}=1\\\rightarrow\sum_{k}m_{k}=-\lambda\rightarrow\sum_{k}\sum_{n=1}^{N}x_{nk}=-\lambda\rightarrow N=-\lambda
$$

여기서 $\sum_{k}\sum_{n=1}^{N}x_{nk}=N$ 인 이유는 다음과 같은 예시로 생각해볼 수 있다: 4($k$) 지선다 답을 10($N$) 문제 풀었을 경우 각 문제의 선택 확률 ($x_{nk}$) 들은 선택한 값만 1 그리고 나머지는 0 값으로 나오고, 이것을 모두 합치면 결국 $N$ 이 된다.

결과적으로 $\displaystyle p_{k}=-\frac{m_{k}}{\lambda}=\frac{m_{k}}{N}$ 가 된다.

# F) References

* [wiki](https://en.wikipedia.org/wiki/Multinomial_distribution)
