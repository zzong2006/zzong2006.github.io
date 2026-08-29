---
title: "t-statistic"
tags: statistic 
aliases: []
---

# A) T-statistic ?

* [[F-statistic]]
* 만약 모델이 포함하고 있는 parameter 가 많다면, t-statistic 대신 F-statistic 을 사용한다.

t-statistic 값을 이용하면 [[p-value]] 를 계산할 수 있다.

* 작은 p-value 일수록 null 가설을 기각할 수 있다.
* 일반적으로 5%(0.05) 또는 1%(0.01) 보다 낮으면 [[null hypothesis]] 을 기각한다.

# B) Regression

실질적으로는 [[t-statistic]] 을 이용하여 이를 계산한다.  

$$
\displaystyle t=\frac{\hat{\beta}_{1}-0}{\operatorname{SE}\left(\hat{\beta}_{1}\right)}
$$

위 식은 $\beta_1=0$ 에서 얼마나 떨어졌는지를 나타낸다.

# C) Related

이건 무슨 테스트?

## C.1) 테스트 입니다

# D) References
