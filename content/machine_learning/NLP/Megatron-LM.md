---
title: "Megatron-LM"
tags:
  - LLM
  - distributed_training
aliases: []
---

# A) Megatron-LM ?

NVIDIA 가 만든 대형 [[transformer]] 학습 프레임워크다. 한 장의 GPU 에 올라가지 않는 모델을 여러 GPU 에 쪼개 학습시키기 위한 tensor-slicing model parallelism 을 제안한 것으로 알려져 있다.

# B) Tensor parallelism 이 무엇을 쪼개나

모델 병렬화에는 크게 두 방향이 있다. 층 단위로 잘라 GPU 마다 다른 층을 맡기는 pipeline parallelism 과, 하나의 층 안에서 가중치 행렬 자체를 쪼개는 tensor parallelism 이다. Megatron-LM 은 뒤쪽이다.

feed-forward 층의 $Y = \text{GeLU}(XA)$ 를 예로 들면, $A$ 를 열 방향으로 $[A_1, A_2]$ 로 나눠 각 GPU 가 $XA_1$, $XA_2$ 를 계산한다. GeLU 는 원소별 연산이라 쪼갠 상태에서 그대로 적용할 수 있다. 이어지는 두 번째 행렬은 행 방향으로 나누면, 각 GPU 의 부분 결과를 마지막에 한 번 더하는 것으로 끝난다.

attention 은 더 자연스럽다. head 가 서로 독립이므로 head 를 GPU 에 나눠주고 마지막에 결과를 이어붙이면 된다.

이렇게 짜면 층마다 통신이 두 번(순전파 한 번, 역전파 한 번)만 필요하다. 다만 통신량 자체가 크고 빈번해서, tensor parallelism 은 보통 NVLink 로 묶인 한 노드 안에서만 쓴다.

# C) 다른 병렬화와의 조합

| 방식 | 쪼개는 대상 |
| --- | --- |
| data parallelism | 배치. GPU 마다 모델 전체 사본을 갖는다 |
| tensor parallelism | 층 안의 가중치 행렬 |
| pipeline parallelism | 층 |

실제 대형 모델 학습은 세 가지를 함께 쓴다. [[deepspeed]] 의 ZeRO 는 data parallelism 을 쓰되 옵티마이저 상태·gradient·파라미터를 GPU 들에 나눠 갖게 해서 사본 중복을 없앤다. Megatron-LM 의 tensor parallelism 에 ZeRO 의 data parallelism 을 얹으면, 노드 안에서는 모델을 쪼개고 노드 사이에서는 배치를 쪼개는 조합이 된다. 이 조합을 정리한 것이 Megatron-DeepSpeed 다.

# D) References

* [\[1909.08053\] Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism](https://arxiv.org/abs/1909.08053)
