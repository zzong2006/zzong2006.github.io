---
title: "residual sum of squares"
aliases: ["RSS"]
tags:
  - statistic
  - machine_learning
  - metrics
---

# A) Residual Sum of Squares ?

estimation 과 실제 값의 차이의 제곱에 대한 합을 나타낸다.

$$
\operatorname{RSS}=e_{1}^{2}+e_{2}^{2}+\cdots+e_{n}^{2}
$$

## A.1) 예시

coefficient 가 2 개인 단순 선형 모델의 경우

$$
\operatorname{RSS}=\left(y_{1}-\hat{\beta}_{0}-\hat{\beta}_{1}x_{1}\right)^{2}+\left(y_{2}-\hat{\beta}_{0}-\hat{\beta}_{1}x_{2}\right)^{2}+\cdots+\left(y_{n}-\hat{\beta}_{0}-\hat{\beta}_{1}x_{n}\right)^{2}
$$

이 경우 [[mean squared error|MSE]] 와 비슷하다.

# B) Related

[[residual standard error]]

# C) References
