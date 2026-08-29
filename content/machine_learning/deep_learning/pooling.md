---
title: "pooling"
tags:
  - deep_learning
  - computer_vision
  - NLP
aliases: [pooling layer, max pooling, average pooling]
---

# A) Pooling ?

Pooling 은 여러 값의 local region 을 하나의 값으로 요약하는 연산이다. [[Convolution Neural Network]] 에서는 feature map 의 spatial resolution 을 줄이고, 작은 위치 변화에 덜 민감한 representation 을 만들기 위해 자주 사용한다.

# B) 대표 방식

| 방식 | 설명 | 특징 |
| --- | --- | --- |
| Max Pooling | region 안의 최댓값 선택 | 강한 activation 을 보존 |
| Average Pooling | region 평균 사용 | 전체적인 signal 을 부드럽게 요약 |
| Global Average Pooling | feature map 전체 평균 | classifier head 앞에서 parameter 수를 줄임 |

# C) NLP에서의 Pooling

Text embedding 에서는 token embedding 들을 하나의 vector 로 요약할 때 pooling 이 쓰인다. 예를 들어 mean pooling 은 모든 token embedding 의 평균을 사용하고, `[CLS]` pooling 은 특정 대표 token 의 hidden state 를 사용한다.

# D) Related

* [[retrieval/concepts/token pooling|token pooling]]
* [[Convolution Neural Network]]
* [[attention function]]

