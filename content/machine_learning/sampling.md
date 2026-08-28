---
title: "sampling"
tags: ["machine_learning"]
---

# A) Sampling ?

데이터가 불균형한 분포를 가지는 경우, 모델의 학습이 제대로 이루어지지 않을 확률이 높습니다.

이 문제를 해결하기 위해 나온 개념이 언더 섬플링 (Undersampling) 과 오버 샘플링 (Oversampling) 입니다.

## A.1) Undersampling

언더 샘플링은 불균형한 데이터 셋에서 높은 비율을 차지하던 클래스의 데이터 수를 줄임으로써 데이터 불균형을 해소하는 아이디어 입니다.

하지만 이 방법은 **학습에 사용되는 전체 데이터 수를 급격하게 감소**시켜 오히려 성능이 떨어질 수 있습니다.

## A.2) Oversampling

오버 샘플링은 낮은 비율 클래스의 데이터 수를 늘림으로써 데이터 불균형을 해소하는 아이디어 입니다.

이 방법이 가능하다면 언더 샘플링보다 훨씬 좋은 해결책이 될 수 있을것 같은데, 문제는 **” 어떻게 “** 없던 데이터를 생성하느냐 입니다.

오버 샘플링 방식으로 [[Synthetic Minority Over-sampling Technique|SMOTE]] 가 있다.

### A.2.1) 주의점

오버 샘플링을 고려할때 주의해야 할 것이 있습니다. 바로 [[Recall]] 과 [[precision]] 이다.

positive 데이터가 negative 데이터보다 훨씬 부족한 데이터로 예를 들었을때, 오버 샘플링을 하게 되면 양성으로 예측하는 비율이 높아지기 때문에 precision 이 감소하게 됩니다 (반대로 recall 이 증가하게 됩니다).

## A.3) Figure (under Vs over sampling)

![](https://i.imgur.com/oQNa31s.png)

# B) References

* [Resampling strategies for imbalanced datasets | Kaggle](https://www.kaggle.com/rafjaa/resampling-strategies-for-imbalanced-datasets)
