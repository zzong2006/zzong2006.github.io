---
layout: post
title:  "Probability Theory: Expected Value and Variance"
date:   2020-10-14 22:00
categories: probabilitytheory
series: 2
---

## Expected Value and Mean

통계에서 Average 를 표현하는 방법은 여러가지가 존재한다.

1. Expected value $E(X)$ 

   * Discrete Random Variable $X$ 에 대한 expectation $E(X)$는 다음과 같이 계산된다.

   * $$
     E(X)=\sum_{x}xP(X=x)
     $$

     * $P(X=x)$는 $X$에서 $x$가 발생할 확률을 의미한다.
     * 예를 들어, 주사위의 경우 $\frac{1}{6} (1 + 2 + 3 + 4 + 5 + 6) = \frac{21}{6}=3.5$이다.

   * Continuous Random Variable $Y$에 대한 expectation $E(Y)$는 다음과 같이 계산된다.

   * $$
     E(Y)=\int^{\infty}_{-\infty}y(f(y))dy
     $$

     * $y$는 continuous value 그리고 $f(y)$는 그 값의 PDF를 의미한다. 
     * continuous value는 제한이 없으므로 무한의 범위를 가진다.

   * Linearity of Expectation

     * 모든 랜덤 변수 $X$, $Y$는 다음을 만족한다.

     * $$
       E(X + Y) = E(X) + E(Y)
       $$

     * 변수가 서로 dependent 해도 만족하는 성질이다.

2. Mean $\bar{X}$

   * mean은 $X$에서 발생하는 sample에 대한 평균을 의미한다. 일반적으로 우리가 아는 평균 계산과 같다.

   * $$
     \bar{X}=\frac{1}{n}\sum^n_{j=1}X_j
     $$

   * 만약 sample의 개수 $n$이 무한대로 접근한다면($n \rightarrow \infty$) $\bar{X}$는 $\mu$로 표현된다 (with probability 1).

     * 즉 $\mu=E(X)$ 를 의미한다.

## Variance

* 분산 $Var(X)$는 다음과 같이 계산할 수 있다.

* $$
  Var(X)=E[(X-\mu)^{2}]=\sum_{all \ x}(x-\mu)^2p(X=x)
  $$

* 확률 변수 $X$가 복잡해질수록, $Var(X)$를 직접 구하는 것은 어렵다.

  * 이를 해결하기 위해, handy relationship을 제공한다.

  * $$
    E[(X-\mu)^2]=E(X^2)-[E(X)]^2 = \sigma^2
    $$

    * 끝의 $\sigma^2$은 분산이 표준 편차(standard deviation)의 제곱 값이라는 의미를 나타낸다 ($Var(X)=\sigma^2$)

## Reference

* [jbstatistics, Youtube](https://www.youtube.com/watch?v=OvTEhNL96v0&ab_channel=jbstatistics)