---
title: "Vanishing and Exploding Gradients"
tags:
  - deep_learning
aliases: [vanishing gradients, exploding gradients, vanishing gradient, exploding gradient]
---

# A) Vanishing Gradients 와 Exploding Gradients

[[backpropagation]] 은 출력층에서 입력층 쪽으로 [[math/chain rule (calculus)|chain rule]] 을 따라 gradient 를 전달한다. 앞쪽 layer 의 gradient 는 뒤쪽 layer 들의 미분값을 차례로 곱한 값이 된다. 그래서 layer 가 깊어질수록, 또는 [[Recurrent Neural Network|RNN]] 에서 time step 이 길어질수록 같은 크기의 값이 여러 번 곱해진다.

* 곱해지는 값이 대체로 1 보다 작으면 gradient 가 layer 를 지날 때마다 exponential 하게 줄어든다. 이것이 **vanishing gradients** 다. 앞쪽 layer 의 parameter 가 거의 업데이트되지 않아서, 먼 과거 time step 이나 입력 가까운 layer 의 정보를 학습하지 못한다.
* 곱해지는 값이 대체로 1 보다 크면 gradient 가 exponential 하게 커진다. 이것이 **exploding gradients** 다. 한 번의 업데이트로 parameter 가 크게 튀어서 loss 가 발산하거나 NaN 이 된다.

# B) 해결책

두 현상은 원인이 같지만 대응 방법은 다르다.

| 현상 | 대표적인 해결책 |
| --- | --- |
| Vanishing gradients | gate 로 gradient 경로를 유지하는 [[Long Short-Term Memory]], [[Gated Recurrent Unit]] / 미분값이 1 인 구간이 있는 [[ReLU function]] / layer 를 건너뛰는 [[skip connection]] |
| Exploding gradients | gradient clipping |
| 둘 다 (RNN) | Truncated Backpropagation Through Time (Truncated BPTT) |

Gradient clipping 은 gradient 의 norm 이 정해 둔 threshold 를 넘으면 그 threshold 크기로 줄이는 방법이다. 방향은 그대로 두고 크기만 자르기 때문에, 아래 그림처럼 한 번에 멀리 튀는 업데이트가 사라지고 최솟값 쪽으로 안정적으로 이동한다.

![[img-99b35f73a1.png|image-20201101234742246]]

Truncated BPTT 는 RNN 의 긴 sequence 를 일정 길이 구간으로 잘라서, 각 구간 안에서만 backpropagation 을 한다. 곱해지는 time step 수에 상한이 생기므로 gradient 가 지나치게 커지거나 작아지는 것을 줄여주지만, 그 대가로 구간보다 먼 의존 관계는 학습하기 어렵다.
