---
title: "residual connection"
tags: ["resnet", "residual", "machine_learning", "CNN", "deep_learning"]
---

# A) Residual Connection 이란?

residual connection 은 [[skip connection]] 과 동일한 개념으로, gradient 를 non-linear 한 [[activation function]] 을 통과시키지 않고 network 로 직접 흘려보내는 방법을 의미한다.

 ![](https://i.stack.imgur.com/gSxcB.png)

# B) 사용하는 이유

[[vanishing gradients]] 의 문제를 완화하기 위함
