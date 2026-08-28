---
title: "boosting"
tags: ["ensemble"]
---

# A) Boosting ?

여러개의 weak learner 가 만들어낸 결과를 조합해서 최종 결과를 만드는 방식으로, 오분류된 샘플에 더 많은 가중치를 주어 학습하는 순차적 과정이다.

## A.1) 과정

1. [[bagging]] 과 마찬가지로, 첫 모델을 만들 때 모든 sample 들에 대해 동일한 확률로 [[bootstrapping|bootstrap]] sampling 을 수행한다.
2. 그리고, 전체 학습 데이터 (training data) 를 이용해 model 을 평가하여 낮은 성능을 기록하는 sample 들을 찾아내어 기록한다.
3. 이후, 다음 (두번째) 모델을 만들 때도 bootstrap sampling 을 수행하는데, 이때는 기록된 sample 들이 뽑힐 확률이 더 높게 설정한다.
4. 그리고, (2) 와 마찬가지로 전체 학습 데이터를 이용해 model 을 평가하는데, 이때는 (bagging 과 똑같이) 전체 모델의 결과를 aggregate 하여 평가를 진행하고, 낮은 성능을 기록하는 sample 들을 찾아내어 기록한다.
5. 이후, 다음 (세번째) 모델부터는 (3), (4) 의 과정을 반복한다.

# B) Boosting Algorithms

대표적으로 [[Gradient Boosting Machine|GBM]] 알고리즘이 존재한다.

* [[AdaBoost]]
* Extreme Gradient Boosting Machine (XGBM, XGBoost)
* [[LightGBM]]
* CatBoost

# C) 특징

* boosting 방식이 [[bagging]] 모델에 비해 [[overfitting]] 에 취약하다.

# D) Related

[[bootstrapping|bootstrap]]

# E) References
