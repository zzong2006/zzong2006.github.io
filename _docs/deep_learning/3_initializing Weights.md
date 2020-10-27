---
layout: default
title:  "Initializing Weights"
category: Deep Learning
order: 3
---

## 신경망의 모든 weights와 bias를 0으로 설정하면 무슨일이 일어날까?

Symmetric하다. 즉, 매 iteration마다 hidden units들은 모두 같은 값을 출력한다.

그리고, hidden units 출력한 값들은 그 다음 units에게 같은 영향을 준다. 

결과적으로 back-propagation에서 같은 update를 진행하고, 얼마나 많은 학습을 진행하든 항상 같은 값을 출력한다.

그래서 이런 경우, hidden unit 한 개 이상은 의미가 없다.

## Random initialization

가장 쉬운 방법은 모든 weights를 랜덤한 값으로 설정하는 것이다.
* 이 방법이 먹히는 이유는 symmetry를 break 하기 때문이다.
* 그래서 bias를 랜덤 값으로 설정하고, weights를 모두 0으로 설정해도 신경망은 학습한다.

하지만 너무 크면 안된다. 

* Why? Activation function(tanh or sigmoid)의 gradient 계산 시, 기울기 값이 0에 가깝기 때문에 gradient descent에서 학습이 매우 느릴 가능성이 높기 때문이다.

## Logistic Regression의 경우

Logistic Regression은 weight들을 모두 0으로 설정해도 상관없다. 

* 왜냐하면 logistic regression은 hidden layer가 없으므로, 미분값이 순전히 weight가 아니라 입력 $x$에 의존하기 때문이다. 

그래서 first iteration은 값이 동일할지 몰라도, second iteration부터는 weights가 $x$의 분포를 따를것이다.

