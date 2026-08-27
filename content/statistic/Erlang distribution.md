---
tags: ["probability_distribution"]
---

# 1. Erlang Distribution ?

Erlang distribution(얼랭 분포) 은 [[Gamma distribution]] 에서 shape parameter $k$ 가 이산값을 따르는 분포를 의미한다: discretised

# 2. PDF

얼랭 분포의 [[Probability Density Function|pdf]] 는 다음과 같다.

$$
\displaystyle f(x;k,\lambda)=\frac{\lambda^{k}x^{k-1}e^{-\lambda x}}{(k-1)!}\quad\text{for}x,\lambda\geq0
$$

* $k$ 는 shape, $\lambda$ 는 rate paramteter

# 3. Notes

rate 가 $\lambda$ 인 $n$ 개의 독립된 [[exponential distribution]] 를 합한 값은 Erlang$(n,\lambda)$ 를 따른다.

즉, Erlang$(1,\lambda)$ 는 rate 가 $\lambda$ 인 단일 [[exponential distribution]] 이다.

# 4. Related

# 5. References
