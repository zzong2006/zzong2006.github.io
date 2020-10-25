---
layout: default
title:  "Computing Parameters Analytically"
category: Machine Learning
order: 5
---

## Normal Equation

* $X\cdot\theta=y$ 에 대한 parameter $\theta$를 찾아내는 방법은 Gradient descent 말고도, 그냥 식을 풀어버리는 방식이 있는데 그것이 normal equation임

  * $$
    \theta=(X^TX)^{-1}X^Ty
    $$
    
  * :grey_question: Quiz: ​ $m=14$개의 training examples에 대한 $n=3$개의 features가 존재하고, 이를 normal equation으로 풀려고 했을 때, $\theta$ 는 $4\times 1$ 그리고, $y$ 는 $14 \times 1$ 그리고 $X$ 는 $14 \times 4$이다. 
  
    * $n=3$임에도 불구하고, $\theta, X$의 rows 개수가 $4$인 이유는 bias의 때문이다.    
      즉, $x_1 \sim x_3$에 대한, $\theta_0 \sim \theta_3$ 가 존재한다.

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