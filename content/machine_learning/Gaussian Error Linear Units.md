---
title: "Gaussian Error Linear Units"
tags: ["activation_function"]
aliases: ["GELU"]
---

# A) Gaussian Error Linear Units ?

[GELU — PyTorch 2.4 documentation](https://pytorch.org/docs/stable/generated/torch.nn.GELU.html)

# B) GELU 함수 적용

Gaussian Error Linear Units (GELU) 함수는 다음과 같이 정의됩니다:

$$
\operatorname{GELU}(x)=x * \Phi(x)
$$

여기서 $\Phi(x)$ 는 Gaussian 분포의 누적 분포 함수 ([[Cumulative Distribution Function|CDF]]) 를 의미합니다.

또한, `tanh` 를 사용하여 근사할 경우, GELU 는 다음과 같이 추정됩니다:

$$
\operatorname{GELU}(x)=0.5 * x *\left(1+\operatorname{Tanh}\left(\sqrt{2 / \pi} *\left(x+0.044715 * x^3\right)\right)\right)
$$

# C) Approximate Argument 가 필요한 이유

GELU 는 아래처럼 생겼는데 x 축이 음에 가까울수록 출력이 flat 한 형태다. 이 식을 [[TensorFlow]] 에서 구현시 계산 속도가 느려진다는 이슈가 있어서 [[tanh function]] 를 활용한 approximate 수식을 적용했다고 한다.

2024 년 기준으로는 요즘엔 exact 버전과 별 차이가 없다고 한다.

![](https://i.imgur.com/6m3Oe3J.png)

# D) Questions

* 왜 GELU 가 [[machine_learning/ReLU function|ReLU function]] 보다 dead relu 이슈가 적을까?
