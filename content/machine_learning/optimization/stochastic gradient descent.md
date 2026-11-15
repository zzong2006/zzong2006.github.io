---
title: "Stochastic Gradient Descent (SGD)"
tags:
  - machine_learning
  - optimization
aliases: ["SGD"]
---

# A) 전체 gradient 대신 미니배치로 추정한다

일반적인 batch [[gradient descent]] 는 매 step 학습 데이터 전체로 gradient 를 계산한다. 데이터가 크면 한 step 에 드는 계산이 너무 많아 학습이 느리다.

SGD(stochastic gradient descent)는 매 step 데이터 일부만 무작위로 뽑아 gradient 를 계산한다. 뽑은 묶음을 미니배치라고 한다. "stochastic(확률적)" 은 이 무작위 추출 때문에 붙은 이름이다.

$$
\nabla L(\theta) = \frac{1}{N}\sum_{i=1}^{N} \nabla \ell_i(\theta)
\qquad\approx\qquad
g_t = \frac{1}{b}\sum_{i \in B_t} \nabla \ell_i(\theta)
$$

| 기호 | 뜻 |
| --- | --- |
| $N$ | 학습 데이터 전체의 샘플 수 |
| $\ell_i(\theta)$ | 샘플 $i$ 의 loss |
| $\nabla L(\theta)$ | 전체 데이터로 계산한 gradient. batch gradient descent 가 쓰는 값 |
| $B_t$ | step $t$ 에 무작위로 뽑은 미니배치. 크기는 $b$ |
| $g_t$ | 미니배치로 계산한 gradient. SGD 가 쓰는 값 |

미니배치를 무작위로 뽑으면 $g_t$ 의 평균은 전체 gradient $\nabla L(\theta)$ 와 같다. 즉 $g_t$ 는 전체 gradient 를 치우침 없이 추정한 값이다. 대신 어떤 샘플이 뽑혔느냐에 따라 매번 조금씩 다른 값이 나오는 잡음이 섞여 있다. 샘플들이 독립이면 이 잡음의 분산은 미니배치 크기 $b$ 에 반비례한다.

원래 SGD 는 샘플 하나($b = 1$)로 업데이트하는 방법을 가리켰고, $1 < b < N$ 은 mini-batch gradient descent 라고 따로 불렀다. 지금은 미니배치로 업데이트하는 방식 전체를 SGD 라고 부르는 경우가 많다. 미니배치 크기를 고르는 기준은 gradient descent 노트에 있다.

# B) 절차

SGD 를 시작하기 전에 데이터를 무작위로 섞는다. 데이터가 시간 순서처럼 특정한 구조로 정렬돼 있으면, 앞에서부터 잘라 만든 미니배치가 전체를 대표하지 못해 gradient 추정이 한쪽으로 치우치기 때문이다.

그다음 데이터를 미니배치로 나눠 차례로 gradient 를 계산하고 파라미터를 업데이트한다. 데이터 전체를 한 바퀴 도는 것을 1 epoch 라고 한다.

![[img-cfa218e9d5.png|image-20201018172431535]]

위 그림은 샘플 하나씩($b = 1$) 업데이트하는 경우의 식이다.

# C) 잡음이 일반화에 주는 영향

미니배치 gradient 의 잡음은 계산을 아끼느라 생긴 부산물이지만, 일반화에는 도움이 된다는 설명이 널리 쓰인다.

loss 의 최솟값 주변 모양은 두 종류로 나눠 볼 수 있다. 좁고 뾰족한 골짜기(sharp minimum)는 파라미터가 조금만 달라져도 loss 가 크게 오르고, 넓고 평평한 골짜기(flat minimum)는 파라미터가 조금 달라져도 loss 가 거의 그대로다. 학습 데이터와 새 데이터의 loss 곡면은 조금씩 어긋나 있으므로, 평평한 골짜기에 놓인 파라미터가 새 데이터에서도 loss 가 낮을 가능성이 크다.

SGD 의 잡음은 파라미터를 계속 조금씩 흔든다. 좁은 골짜기에서는 이 흔들림만으로 골짜기 밖으로 튕겨 나가기 쉽고, 넓은 골짜기에서는 흔들려도 그 안에 머문다. 그래서 SGD 는 넓은 골짜기에 머무는 경향이 있다는 것이다.

Keskar et al. (2017) 은 이 설명과 맞는 실험 결과를 보고했다. 미니배치를 크게 키우면 잡음이 줄어 학습 loss 는 비슷하게 내려가지만, 도달한 최솟값이 더 뾰족하고 test 성능이 떨어졌다. 다만 평평함을 어떻게 재느냐에 따라 결론이 달라질 수 있다는 반론도 있어, 완전히 정리된 이론은 아니다.

큰 배치로 학습할 때는 learning rate 를 함께 키워 잡음의 크기를 비슷하게 유지하는 방법을 쓴다. 미니배치를 $k$ 배로 키우면 learning rate 도 $k$ 배로 키우고, 학습 초반 몇 epoch 동안은 learning rate 를 0 에서부터 서서히 올리는 warmup 을 둔다 (Goyal et al., 2017).

SGD 와 Adam 같은 적응형 optimizer 중 무엇을 쓸지는 [[optimization algorithms]] 노트의 "SGD 와 Adam 중 무엇을 쓰나" 절에서 다룬다.

# References

- Nitish Shirish Keskar, Dheevatsa Mudigere, Jorge Nocedal, Mikhail Smelyanskiy, Ping Tak Peter Tang, "[On Large-Batch Training for Deep Learning: Generalization Gap and Sharp Minima](https://arxiv.org/abs/1609.04836)", ICLR 2017.
- Priya Goyal et al., "[Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour](https://arxiv.org/abs/1706.02677)", 2017.
