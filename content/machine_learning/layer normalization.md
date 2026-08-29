---
title: "layer normalization"
tags:
  - deep_learning
  - machine_learning
aliases: []
---

# Layer Normalization ?

[[Batch Normalization]] 이라고도 불리며, 배치에 있는 각 입력을 평균이 0 이고 분산이 1 을 가지도록 정규화하는 작업을 의미한다.

# Two Methods for Layer Norm

layer norm 방식은 크게 두가지가 있는데, post layer norm 또는 pre layer norm 방식이 존재한다.

![|500](https://i.imgur.com/nR1mFvc.png)

## (1) Post Layer Normalization

[[transformer]] 논문에서 사용한 방식으로, [[skip connection]] 를 적용한 이후에 정규화를 적용하는 방식이다.

[[machine_learning/gradient]] 가 발산하는 경우가 있으므로 훈련하기 까다롭다. 이에 대비하여 [[Learning rate]] 를 작은 값에서 시작해서 최대 값으로 Incremental 하게 증가시키는 learning rate-warm up 방식을 적용한다.

## (2) Pre Layer Normalization

정규화를 적용한 결과에 skip connection 을 적용하는 방식이다. 보다 안정적으로 적용되며 일반적으로 learning rate warm-up 이 필요하지 않다고 한다.

구체적인 내용은 [이 논문: On Layer Normalization in the Transformer Architecture](https://arxiv.org/pdf/2002.04745v1.pdf) 을 참고

# References

Paper Link: https://arxiv.org/pdf/1607.06450.pdf
