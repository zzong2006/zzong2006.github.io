---
title: "CTR prediction"
aliases: []
tags:
  - deep_learning
  - machine_learning
---

# A) CTR Prediction ?

광고 · 추천에서 노출마다 클릭 확률(pCTR)을 예측하는 문제다. 노출 수가 워낙 많아서 예측이 아주 조금만 좋아져도 매출이 크게 늘어난다. 그래서 CTR 예측 논문들은 [[cross-entropy|logloss]] 나 [[Area Under Curve|AUC]] 가 0.001 만 좋아져도 의미 있는 개선으로 본다 (AutoInt, Song et al., 2019).

여러 딥러닝 모델들이 제안되어 왔고 산업적 CTR 예측 문제에서도 눈에 띄는 성과를 보였다.

# B) Data

CTR 예측 데이터는 대부분 표(tabular) 형태다. 샘플 수가 많고, feature 공간은 매우 sparse 하다. 예를 들어 Google Play 앱 추천 모델은 5,000 억 개가 넘는 샘플로 학습했다 (Wide & Deep, Cheng et al., 2016).

feature 대부분이 sparse 하므로, [[machine_learning/NLP/One Hot Encoding|One Hot Encoding]] 이나 multi-hot encoding 으로 만든 고차원 feature 에 임베딩을 적용해 저차원 dense vector 로 바꾼다.

ID 종류가 억 단위로 늘어나고 새 ID 가 계속 생기는 도메인에서는 값과 행 번호를 짝지어 둔 사전을 유지하기 어려워서, 해시로 행을 정하는 [[hash-based embedding]] 을 쓴다.

# C) Feature Interaction

feature 간 상호작용 (feature conjunctions 이라고도 불림) 은 분류 성능을 향상시키기 위한 핵심 재료다. [[Factorization Machines]] 은 pairwise feature interaction 을 잡아내기 위해 [[dot product|내적]] 을 활용했다.

# D) Related

* [[BarsCTR - Open Benchmarking for Click-Through Rate Prediction]]: 일반적인 CTR Prediction 에 대한 overview 확인할 수 있다.
* [[Entire Space Multi-Task Model - An Effective Approach for Estimating Post-Click Conversion Rate|ESMM]]: 클릭 확률과 클릭 후 전환 확률을 곱하는 구조로 전환율을 노출 전체에서 학습한다.
* [[probability calibration]]: 입찰가와 곱하려면 pCTR 의 순서뿐 아니라 값이 맞아야 한다.

# E) References

* [BarsCTR Overview — BARS Benchmark](https://openbenchmark.github.io/BARS/ctr_prediction/)
* [Wide & Deep Learning for Recommender Systems (Cheng et al., DLRS 2016)](https://arxiv.org/abs/1606.07792)
* [AutoInt: Automatic Feature Interaction Learning via Self-Attentive Neural Networks (Song et al., CIKM 2019)](https://arxiv.org/abs/1810.11921)
