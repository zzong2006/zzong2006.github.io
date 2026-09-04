---
title: "Naive Bayes"
tags:
  - machine_learning
  - classification
  - probabilistic_model
aliases: [Naive Bayes Classifier, Naïve Bayes, 나이브 베이즈]
---

# A) Naive Bayes

Naive Bayes 는 feature 들이 class 조건부로 서로 독립이라고 가정하고 [[Bayes theorem]] 으로 class 를 고르는 probabilistic classifier 다. 여기서 "조건부 독립 (conditional independence)" 은 class $y$ 를 이미 알고 있다고 치면 feature 하나를 알아도 다른 feature 에 대한 정보가 늘지 않는다는 뜻이다.

이 가정은 현실에서는 거의 성립하지 않는다. 그래도 text classification 처럼 feature 가 많고 sparse 한 문제에서는 단순한 baseline 으로 꽤 강하게 동작한다.

# B) 핵심 식

class 변수 $y$ 와, $y$ 에 의존 관계가 있는 feature vector $x_1, \ldots, x_n$ 이 주어졌다고 하자. Bayes theorem 을 그대로 쓰면 다음과 같다.

$$
P\left(y \mid x_{1},\ldots,x_{n}\right)=\frac{P(y)P\left(x_{1},\ldots,x_{n}\mid y\right)}{P\left(x_{1},\ldots,x_{n}\right)}
$$

여기서 각 기호는 다음을 가리킨다.

| 기호 | 의미 |
| --- | --- |
| $y$ | class label (예: 스팸/정상) |
| $x_i$ | $i$ 번째 feature 값 |
| $n$ | feature 개수 |
| $P(y)$ | class prior — 학습 데이터에서 그 class 가 나오는 비율 |
| $P(x_i \mid y)$ | class 가 $y$ 일 때 feature $x_i$ 가 관측될 확률 (likelihood) |

우변의 $P(x_1,\ldots,x_n \mid y)$ 는 feature 조합 전체에 대한 확률이라 그대로 추정할 수 없다. feature 가 $n$ 개면 조합 수가 지수적으로 늘어나기 때문이다. 조건부 독립 가정을 넣으면 이 항이 곱으로 쪼개진다.

$$
P\left(y\mid x_{1},\ldots,x_{n}\right)=\frac{P(y)\prod_{i=1}^{n}P\left(x_{i}\mid y\right)}{P\left(x_{1},\ldots,x_{n}\right)}
$$

분모 $P(x_1,\ldots,x_n)$ 은 어느 class 를 넣어도 같은 값이므로, class 끼리 비교할 때는 무시할 수 있다.

$$
P\left(y\mid  x_{1},\ldots,x_{n}\right)\propto P(y)\prod_{i=1}^{n}P\left(x_{i}\mid y\right)
$$

따라서 예측은 우변을 가장 크게 만드는 class 를 고르는 것이 된다.

$$
\hat{y}=\arg\max_{y}P(y)\prod_{i=1}^{n}P\left(x_{i}\mid y\right)
$$

"naive" 라는 이름이 붙은 자리는 두 번째 식, 즉 $P(x_1,\ldots,x_n \mid y)$ 를 $\prod_i P(x_i \mid y)$ 로 바꾼 부분이다.

# C) 예시: 스팸 메일 분류

가장 흔한 사용처다. feature 를 "메일 본문에 어떤 단어가 등장했는가" 로 두면 다음 순서로 계산한다.

1. 학습 데이터에서 스팸 비율과 정상 비율을 센다 → $P(\text{spam})$, $P(\text{ham})$
2. 스팸 메일 안에서 각 단어의 등장 비율을 센다 → $P(\text{"무료"} \mid \text{spam})$ 처럼 단어별 likelihood
3. 정상 메일에 대해서도 같은 방식으로 센다
4. 새 메일이 오면 등장한 단어들의 likelihood 를 class 별로 모두 곱하고 prior 를 곱한다
5. 두 값 중 큰 쪽의 class 로 판정한다

단어 하나하나를 독립으로 보기 때문에 "무료 대출" 같은 어구가 붙어 나오는 효과는 잡지 못한다. 그런데도 단어 개수가 많아지면 개별 단어의 신호가 누적돼서 실용적인 성능이 나온다.

이 절차에는 함정이 하나 있다. 학습 데이터의 스팸 메일에 한 번도 없던 단어가 테스트 메일에 나오면 $P(\text{word} \mid \text{spam})=0$ 이 되고, 곱셈이므로 전체 확률이 0 으로 무너진다. 다른 단어들이 아무리 스팸을 가리켜도 판정이 뒤집힌다. 그래서 실제 구현은 모든 카운트에 작은 상수를 더하는 Laplace smoothing (또는 add-$\alpha$ smoothing) 을 기본으로 쓴다.

# D) 장점 및 단점

## D.1) 장점

* 학습과 추론이 빠르다. 카운트만 세면 되므로 iterative optimization 이 필요 없다.
* 학습 데이터가 적어도 baseline 을 만들 수 있다. [[logistic regression]] 은 파라미터를 최적화해야 해서 상대적으로 데이터를 더 요구한다.
* categorical data 와 궁합이 좋다. 값별 빈도를 그대로 확률로 쓸 수 있다.
* class 수가 많아도 class 별로 카운트를 따로 세기만 하면 되므로 확장이 쉽다.

## D.2) 단점

* feature 간 독립 가정이 깨질수록 예측 확률값 자체는 못 믿게 된다. 순위(어느 class 가 더 큰가)는 그럭저럭 맞아도, 출력된 확률은 과도하게 0 이나 1 쪽으로 치우친다. 확률값을 그대로 쓰려면 [[probability calibration]] 이 필요하다.
* 학습 데이터에 없던 값은 확률 0 이 되어 곱셈 전체를 0 으로 만든다 (C 절의 smoothing 이 이 문제를 다룬다).
* feature 간 상관관계가 예측에 중요한 문제에서는 logistic regression 이나 tree-based model 보다 표현력이 부족하다. [[Gradient Boosting Machine]] 노트에서 다루는 collinear feature 문제가 여기에 해당한다.

# References

* [scikit-learn: Naive Bayes](https://scikit-learn.org/stable/modules/naive_bayes.html)
