---
title: "Monte Carlo Method"
aliases: ["Monte Carlo", "MC"]
tags:
  - sampling
---

# A) Monte Carlo Method ?

몬테카를로 방법이란 랜덤 표본을 뽑아 함수의 값을 확률적으로 계산하는 알고리즘

계산하려는 값이 닫힌 형식 (closed form) 으로 표현되지 않거나 복잡한 경우에 그 값을 근사적으로 계산하려고 할 때 쓰임

## A.1) 예시

특정 확률 분포를 따르는 $f(x)$ 함수의 [[expectation]] 은 monte carlo method(단순 [[mean]] 계산) 를 통해 다음과 같이 $k$ 개 샘플로 근사할 수 있다.

$$
\displaystyle \int p(x)f(x)dx=E_{x\sim p(x)}[f(x)]\approx\frac{1}{K}\sum_{i=0}^{K}\left[f\left(x_{i}\right)\right]_{x_{i}\sim p(x)}
$$

# B) Related

* [[variational inference]]
* [[RL/Monte Carlo Method(RL)]]

# C) References
