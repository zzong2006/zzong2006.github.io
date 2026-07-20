---
title: "Data Augmentation"
aliases: []
tags:
  - machine_learning
  - deep_learning
---

# A) Data Augmentation ?

[[overfitting]] 에 대응하기 위해서는 많은 training data 를 이용해서 학습하는 것이 좋다. 특히, 이미지 데이터의 경우, 기존 이미지를 변형해서 새로운 이미지 학습 데이터를 만들 수 있다. 이러한 이미지 변형 과정을 통해 얻어진 이미지는 완전히 새로운 학습 데이터를 얻는 것보다는 학습 효과가 덜 하겠지만, 저렴한 비용으로 학습 데이터를 늘릴 수 있다는 것이 장점이다.

# B) Example

![[img-c03bed78dc.png|image-20201128173127818]]

# C) For Sequential Data

1. shuffling
2. last word(item) prediction

# D) References
