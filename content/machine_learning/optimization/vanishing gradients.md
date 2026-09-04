---
title: "vanishing gradients"
tags:
  - deep_learning
aliases: []
---

# 1. Vanishing Gradients ?

gradient 가 backpropagation 을 통해 layer 들을 지날 때 마다 exponential 하게 감소하는 현상

 * 해결책: [[Gated Recurrent Unit]] / [[Long Short-Term Memory]] / Truncated BTT
 * [[machine_learning/optimization/exploding gradients]]
 * gradient 가 backpropagation 을 통해 layer 들을 지날 때 마다 exponential 하게 증가하는 현상
 * 해결책: gradient clipping
 * ![[img-99b35f73a1.png|image-20201101234742246]]
 * 다른 해결책: Truncated Backpropagation through time (Truncated BPTT)# 정의

# 2. Related

# 3. References
