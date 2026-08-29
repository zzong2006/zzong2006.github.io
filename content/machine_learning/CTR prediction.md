---
title: "CTR prediction"
aliases: []
tags:
  - deep_learning
  - machine_learning
---

# A) CTR Prediction ?

굉작히 작은 prediction [[accuracy]] 상승이라도 이는 전체 매출에 큰 상승으로 이어진다. 수치로 따지면, 대략 1% 정도의 [[cross-entropy|logloss]] (또는 [[Area Under Curve|AUC]]) 상승을 의미한다.

여러 딥러닝 모델들이 제안되어 왔고 산업적 CTR 예측 문제에서도 눈에 띄는 성과를 보였다.

# B) Data

CTR 예측 문제에 사용되는 데이터는 대부분 tabular format 이다. 그리고 샘플 사이즈는 큰 편이고, feature space 는 매우 spare 하다.예를 들어 구글 플레이에서는 billions 샘플 개수에 millions 수준의 features 을 가지고 있다.

이렇게 대부분의 feature 가 spare 하기 때문에, [[machine_learning/NLP/One Hot Encoding|One Hot Encoding]] 이나 multi-hot encoding 을 적용한 이후에 발생하는 고차원 feature 에 대해서는 feature embedding 을 적용하여 저차원 dense vector 들도 변환한다.

ID 종류가 억 단위로 늘어나고 새 ID 가 계속 생기는 도메인에서는 값과 행 번호를 짝지어 둔 사전을 유지하기 어려워서, 해시로 행을 정하는 [[hash-based embedding]] 을 쓴다.

# C) Feature Interaction

feature 간 상호작용 (feature conjunctions 이라고도 불림) 은 분류 성능을 향상시키기 위한 핵심 재료다. [[Factorization Machines]] 은 pairwise feature interaction 을 잡아내기 위해 [[dot product|내적]] 을 활용했다.

# D) Related

* [[BarsCTR - Open Benchmarking for Click-Through Rate Prediction]]: 일반적인 CTR Prediction 에 대한 overview 확인할 수 있다.

# E) References

* [BarsCTR Overview — BARS Benchmark](https://openbenchmark.github.io/BARS/ctr_prediction/)
