---
title: "transfer learning"
tags: ["deep_learning", "machine_learning", "recommendation_system"]
---

# A) Transfer Learning ?

# B) In NLP

[[Natural Language Process|자연어처리]] 분야에서는 언어의 일반적인 이해를 신경망에 학습시키기 위해 다음과 같은 방식을 수행한다.

1. Generalized pretraining 에서 사용했던 입/출력 레이어를 제거한다.
2. 특정 작업에 특화된 입/출력 레이어로 교체한다.
3. 약간의 에폭시로 특정 작업을 위한 새로운 신경망을 학습한다.

![](https://i.imgur.com/tMzTvgn.png)

Figure: Initial Pretraining Architecture (Untrained), Trained Language Network, Fine-Tuning Architecture

# C) In RS

[[Recommendation System|RS]] 에서 transfer learning 의 활용

* A multi-view deep learning approach for cross domain user modeling in recommendation systems
