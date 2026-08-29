---
title: "conditional expectation"
tags:
  - statistics
  - probability
aliases: [Conditional Expectation]
---

# A) Conditional Expectation

Conditional expectation은 어떤 정보가 주어졌을 때 random variable의 평균을 다시 계산한 값이다. 단순 평균이 전체 population의 중심을 본다면, conditional expectation은 관측된 조건 안에서의 중심을 본다.

# B) 직관

$E[Y \mid X=x]$는 $X=x$라는 조건을 만족하는 상황에서 $Y$가 평균적으로 어디에 있는지를 뜻한다. 회귀 함수도 본질적으로는 입력 $X$가 주어졌을 때 target $Y$의 conditional expectation을 추정하는 문제로 볼 수 있다.

# C) 왜 중요한가

Bayesian inference, regression, causal inference에서 “현재 가진 정보로 가장 합리적인 평균 예측이 무엇인가”를 표현하는 기본 언어다. [[statistic/expectation|expectation]]을 조건부 정보로 확장한 개념이라고 보면 된다.

# References
