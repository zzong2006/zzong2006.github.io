---
tags: ["metrics", "statistic"]
aliases: ["정밀도"]
---

# A) Precision ?

## A.1) Laymen 정의

모델이 positive 하다고 예측한 것들 중에서, 얼마나 많은 true positive 가 존재하는가?

## A.2) Formulation

$$
\displaystyle\frac{\text{True Positive}}{\text{True Positive + False Positive}}
$$

## A.3) In Statistic

precision $\gamma$ 은 [[variance]] 의 역이다: $\displaystyle\gamma=\frac{1}{\sigma^{2}}$

# B) Related

[[precision]] 은 positive example 에 집중해서 평가를 진행하는 반면, [[machine_learning/metrics/accuracy|accuracy]] 는 positive 와 negative 한 example 모두를 고려한다는 점이다.

# C) References
