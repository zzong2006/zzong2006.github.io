---
title: "skip connection"
aliases: ["shortcut connection", "residual connection", "Residual Connection"]
tags:
  - deep_learning
  - machine_learning
  - resnet
  - CNN
---

# A) Skip Connection ?

층의 출력에 그 층의 입력을 그대로 더해서 다음 층으로 보내는 연결이다. 중간 변환을 건너뛰는 경로가 하나 더 생긴다는 뜻에서 skip 이라는 이름이 붙었다.

$$
y = F(x) + x
$$

$F$ 가 층이 수행하는 변환이고, $x$ 가 건너뛰어 더해지는 입력이다. residual connection 이라고도 부르는데, 층이 $y$ 전체가 아니라 $y - x$ 라는 잔차 (residual) 만 학습하면 된다는 관점에서 붙은 이름이다. 두 용어는 같은 것을 가리킨다.

![](https://i.stack.imgur.com/gSxcB.png)

# B) 왜 필요한가

깊은 신경망에서 gradient 는 역전파를 거치며 층마다 미분값이 곱해진다. [[activation function]] 의 미분이 1 보다 작으면 이 곱이 층 수만큼 반복되어 앞쪽 층에 도달할 즈음엔 0 에 가까워진다. [[vanishing gradients]] 다.

skip connection 은 덧셈이므로 미분이 그대로 1 이다. $\partial y / \partial x = \partial F/\partial x + 1$ 에서 뒤의 1 이 비선형 변환을 거치지 않는 통로가 되어, gradient 가 앞쪽 층까지 감쇠 없이 흘러간다. ResNet 이 152층까지 쌓을 수 있었던 이유가 이것이다.

학습 관점에서도 유리하다. $F$ 의 가중치가 0 에 가까우면 그 층은 입력을 그대로 통과시키는 항등 함수가 된다. 즉 "이 층이 도움이 안 되면 없는 셈 치기" 가 기본값이라, 층을 더 쌓는 것이 최소한 손해는 아닌 상태에서 학습이 시작된다.

# C) Transformer 에서의 배치

[[transformer]] 의 각 sub-layer (attention, feed-forward) 는 skip connection 과 정규화를 함께 쓴다. 둘의 순서에 따라 두 가지로 나뉜다.

| 방식 | 계산 | 특징 |
| --- | --- | --- |
| Post-LN | $\text{LN}(x + F(x))$ | 원 transformer 논문의 방식. 깊어지면 학습 초반이 불안정해 warmup 이 필요하다 |
| Pre-LN | $x + F(\text{LN}(x))$ | 정규화를 sub-layer 안으로 넣어 skip 경로에 정규화가 걸리지 않는다. 깊은 모델에서 더 안정적이라 최근 LLM 이 대부분 이쪽이다 |

Post-LN 은 skip 으로 더한 결과에 다시 [[layer normalization]] 을 걸기 때문에, gradient 가 통과하는 경로에 정규화가 끼어든다. Pre-LN 은 덧셈 경로를 손대지 않아 그 통로가 온전히 남는다.

# D) References

* [Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385)
