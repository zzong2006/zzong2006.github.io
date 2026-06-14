---
title: "Binomial Distribution"
tags: ["probability_distribution"]
aliases: ["이항 분포"]
---

# 1. Binomial Distribution ?

성공확률이 $p$ 인 [[statistic/Bernoulli distribution]] 의 시행을 $n$ 번 반복시행할 때, 성공횟수를 나타내는 확률변수 $X$ 의 분포 ($X\sim Bin(n,p)$) 를 이항분포 (binomial distribution) 이라고 합니다.

# 2. 이항 분포의 확률 질량 함수 (pmf)

$$
P(X=x|p)=f(x|p)=\left(\begin{array}{l}n\\x\end{array}\right)p^{x}(1-p)^{n-x}
$$

$n$ 개에서 $x$ 개를 선택하는 경우의 수: $\left(\begin{array}{l}n\\x\end{array}\right)=\displaystyle\frac{n!}{x!(n-x)!}$ for $x\in{0,1,\cdots,n}$

# 3. Expected Value and Variance

Expected Value

$$
E[X]=np
$$

Variance

$$
Var(X)=np(1-p)
$$

# 4. Related

* [[statistic/Beta distribution]]
* [[Dirichlet distribution]]

# 5. References
