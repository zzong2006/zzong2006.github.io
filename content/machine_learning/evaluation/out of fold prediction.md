---
title: "out of fold prediction"
aliases: ["OOF", "stacking"]
tags:
  - machine_learning
---

# A) Out of Fold Prediction ?

학습에 사용되지 않은 데이터를 이용해서 예측을 수행하는 방식을 의미한다.
fold 는 k-fold [[cross-validation]] 의 fold 로, 데이터를 셔플링한 뒤에 균일하게 나눠진 데이터 구간을 fold 로 정해서 사용한다.

OOF 예측은 크게 1) 평가, 2) [[ensemble|앙상블]] 에 활용된다.

## A.1) 평가 (Evaluation)

각 OOF 에 대하여 metric (e.g. [[accuracy]]) 을 구한다음 평균내거나, 아니면 예측 결과들을 리스트 같은곳에 모은뒤에 한번에 계산하는 방법이 있다.

## A.2) 앙상블

stacking 이라고 부르며, 다음과 같은 단계로 진행된다.

1. k-fold cross-validation 을 적용하고, OOF 예측값을 모은다.
2. OOF 예측값은 OOF 데이터와 함께 섞이게 되는데, **예측값을 하나의 feature column 으로 사용하는 방식**으로 섞게된다.
   즉, 예측에 사용한 모델이 $n$ 개고, feature column 수가 $k$ 라면, 총 $n + k$ 차원의 feature 를 가진 학습 데이터를 구성할 수 있을 것이다 (label 값은 동일).
3. 이렇게 구성된 학습 데이터를 새로운 모델에 학습시키면 $n$ 개 모델의 앙상블 효과를 가지는 단일 모델을 구성할 수 있게 되는 것이다.
4. 학습된 모델을 평가하는 경우, 평가하려는 데이터를 우선 $n$ 개 모델에 대해 학습시켜서 예측 값을 생성해야지 최종 단일 모델을 평가할 수 있다.

# B) Related

* [How to Use Out-of-Fold Predictions in Machine Learning - MachineLearningMastery.com](https://machinelearningmastery.com/out-of-fold-predictions-in-machine-learning/#:%7E:text=An%20out%2Dof%2Dfold%20prediction,example%20in%20the%20training%20dataset.)

# C) References
