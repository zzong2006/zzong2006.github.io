---
title: "Naïve Bayes"
tags:
  - machine_learning
  - classification
aliases: [나이브 베이즈, Naive Bayes]
---

# A) Naïve Bayes ?

Naïve Bayes 는 서로 조건부 독립 (conditional independence) 인 feature 를 가정하고, [[Bayes theorem]] 을 기반으로 하는 ML 알고리즘

class 변수 $y$ 에 의존 관계가 있는 feature vector 가 $x_1$ 부터 $x_n$ 까지 주어졌다면, Naïve Bayes 는 다음을 계산한다.

$$
\displaystyle P\left(y\mid x_{1},\ldots,x_{n}\right)=\frac{P(y)P\left(x_{1},\ldots,x_{n}\mid y\right)}{P\left(x_{1},\ldots,x_{n}\right)}
$$

모든 feature 들은 조건부 독립이기 때문에, 이 성질을 이용하면 위의 식을 더욱 단순화시킬 수 있다.

$$
\displaystyle P\left(y\mid x_{1},\ldots,x_{n}\right)=\frac{P(y)\prod_{i=1}^{n}P\left(x_{i}\mid y\right)}{P\left(x_{1},\ldots,x_{n}\right)}
$$

여기서 분모의 $P\left(x_{1},\ldots,x_{n}\right)$ 는 상수이므로, 분자만 생각하면 된다.

$$
\displaystyle P\left(y\mid  x_{1},\ldots,x_{n}\right)\propto P(y)\prod_{i=1}^{n}P\left(x_{i}\mid y\right)
$$

만약 feature vector 가 $x_1$ 부터 $x_n$ 까지 주어졌고, 이 feature vector 에 대한 class 를 찾기 위해 Naïve Bayes 를 사용한다면, 아래의 식을 만족하는 $\hat{y}$ 를 찾으면 된다.

$$
\displaystyle\hat{y}=\arg\max_{y}P(y)\prod_{i=1}^{n}P\left(x_{i}\mid y\right)
$$

# B) 장점 및 단점

## B.1) 장점

* Categorical data 에 효과적이다.
* [[logistic regression]] 에 비해 효과가 좋고, 학습 데이터가 적게 필요하다.
* Class 수가 많을수록 효과가 좋다.

## B.2) 단점

* feature 간 독립이라는 가정이 성립해야 하므로 결과를 신뢰하기가 힘들다.
* 학습 데이터를 기반으로 확률을 추정하므로, 학습 데이터에는 없지만 테스트 데이터에는 있는 class 의 경우 추정이 불가능하다 (확률이 0 이 되어버리기 때문).

# C) 예시: 스팸 메일 분류
