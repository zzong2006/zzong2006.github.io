---
title: "bagging"
tags:
  - machine_learning
  - ensemble
aliases: []
---

# A) Bagging ?

분류 및 회귀 문제를 위해서, 여러 [[bootstrapping]] 샘플을 가지고 독립적인 모델 (e.g. [[Decision Tree]]) 들을 여러개 만든 다음 각 모델에서 나온 예측값을 평균 (분류 문제에서는 과반수 투표) 내는 것을 방식을 의미한다.

## A.1) Figure

![[img-3b3ad96452.png]]

## A.2) 특징

부트스트랩 데이터를 활용하여 학습하다보니 서로 상관관계가 낮은 모델이 생성되고, 이것들을 이용하여 최종 예측을 계산하므로 [[variance]] 를 줄일 수 있다.

# B) Vs. Boosting

* bagging 은 [[boosting]] 에 비해 구조의 단순성 때문에 정확도가 상대적으로 낮은 편이다.
* variance 를 낮추는 전략으로 인해 [[overfitting]] 에 robust 한 편이다.

# C) Bagging Model

[[random forest]] 는 feature selection 주로 사용된다.

# D) References
