---
title: "perceptron"
aliases: ["퍼셉트론"]
tags:
  - deep_learning
---

# A) Perceptron ?

input $x_1, x_2, \cdots$ 을 weights $w_1, w_2, \cdots$ 과 곱해서 threshold 값에 따라 1 또는 0 을 출력하는 인공 뉴런 모델

$$
\text { output }= \begin{cases}0 & \text { if } \sum_{j} w_{j} x_{j} \leq \text { threshold } \\ 1 & \text { if } \sum_{j} w_{j} x_{j}>\text { threshold }\end{cases}
$$

[[dot product]] 개념을 이용하면 더 단순하게 표현된다.

$$
\text { output }= \begin{cases}0 & \text { if } w \cdot x+b \leq 0 \\ 1 & \text { if } w \cdot x+b>0\end{cases}
$$

* $b \equiv-\text { threshold }$ 는 bias 로, 얼만큼 output 이 $1$ 이 될 확률이 높은지 표현하는 정도이다. 예를 들어 $b$ 가 매우 높다면 output 은 거의 항상 1 이 될것이다.

## A.1) Sigmoid Neuron

perceptron 과 비슷하지만, output 에 [[sigmoid function|sigmoid]] 를 씌운 모델이다.

perceptron 은 output 에 [[step function]] 을 씌운 모델로 생각할 수 있다.
