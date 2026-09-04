---
title: "multimodal"
tags:
  - machine_learning
  - multimodal
aliases: [Multimodal Learning]
---

# A) Multimodal Learning

Multimodal learning은 text, image, audio, video, tabular feature처럼 서로 다른 modality의 정보를 함께 사용하는 학습 설정이다. [[CLIP]]은 image와 text를 같은 embedding space에 맞추는 대표적인 multimodal model이다.

# B) 어려운 점

Modality마다 noise, scale, sampling rate, 정보 밀도가 다르다. 그래서 단순히 feature를 붙이는 것보다 alignment, fusion, missing modality 처리, retrieval 방식까지 함께 설계해야 한다.

# C) 실무에서 볼 점

검색과 추천에서는 text query와 image, item metadata를 함께 쓰는 일이 많다. 이때 multimodal representation은 recall을 넓히는 데 도움을 주지만, ranking 단계에서는 modality별 오류와 bias를 따로 점검해야 한다.

# References
