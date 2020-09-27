---
layout: post
date:   2020-09-26
title: "Machine Learning: Computing Parameters Analytically"
categories: machinelearning
series: 5
---

## Normal Equation

* $X\cdot\theta=y$ 에 대한 parameter $\theta$를 찾아내는 방법은 Gradient descent 말고도, 그냥 식을 풀어버리는 방식이 있는데 그것이 normal equation임

  * $$
    \theta=(X^TX)^{-1}X^Ty
    $$



* Gradient Descent 와 Normal Equation 비교

  * | Gradient Descent                                          | Normal Equation                                |
    | :-------------------------------------------------------- | :--------------------------------------------- |
    | Need to choose alpha $\alpha$                             | No need to choose alpha $\alpha$               |
    | Needs many iterations (반복 학습)                         | No need to iterate                             |
    | O ($kn^2$) ($n$은 # of features)                          | $O (n^3)$, need to calculate inverse of $X^TX$ |
    | Works well when $n$ is large ($n \ge 10^6 $부터 효율적임) | Slow if $n$ is very large                      |



## Normal Equation Non-invertibility

* 만약 $(X^TX)^{-1}$ 가 존재하지 않는다면, 즉, $(X^TX)$가 noninvertible 하다면 두 가지의 원인 중 하나일 수 있다.
  1. 불필요한 features
     * 두 features가 서로 긴밀히 연관되어 있을때 (예를 들어, 선형 종속의 관계일 경우:  $x_2 = (0.5)^2 \cdot (x_1)$)
  2. 너무 많은 features($n$)를 가지고 적은 수의 training example($m$)을 표현하려 했을 때 (즉, $m \le n$ 의 경우)
     * 이 경우, feature들을 일부 지우거나, 정규화(regularization)을 적용한다.