---
title: "polynomial regression"
tags:
  - linear_regression
aliases: []
---

# A) Polynomial Regression ?

polynomial functions of the predictors in the [[linear regression]] model

# B) Interaction Effect

그냥 단순히 변수들을 additive 하게 나열하는 것보다, 변수간 관계를 생각해서 섞는게 효과가 좋을 수 있다. 이런 효과를 synergy effect 또는 interaction effect 라고 한다.

## B.1) 예시

$Y=\beta_{0}+\beta_{1}X_{1}+\beta_{2}X_{2}+\epsilon$ 대신,

$Y=\beta_{0}+\beta_{1}X_{1}+\beta_{2}X_{2}+\beta_{3}X_{1}X_{2}+\epsilon$ 를 고려해보자.

# C) Applications

mpg(gas mileage in miles per gallon) 와 horsepower 의 non-linearity 를 표현하는 linear model

$$
\mathrm{mpg}=\beta_{0}+\beta_{1}\times\text{horsepower}+\beta_{2}\times\text{horsepower}^{2}+\epsilon
$$

* [[#interaction effect]] 와 달리 모델의 degree 가 $1$ 이 아니다.

# D) References
