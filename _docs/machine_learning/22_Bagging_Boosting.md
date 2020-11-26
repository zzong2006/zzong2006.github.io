---
layout: default
title:  "Ensemble: Bagging & Boosting"
category: Machine Learning
order: 22
---

## Ensemble, Hybrid Method

앙상블 기법은 동일한 학습 알고리즘을 사용해서 여러 모델을 학습하는 개념

(vs.) **Stacking**: 서로 다른 모델을 결합하여 새로운 모델을 만들어내는 방법

앙상블 기법은 다음과 같은 문제를 완화시켜 준다.

1. **Bagging**: 높은 Variance로 인한 Overfitting을 완화
2. **Boosting**: 높은 bias로 인한 Underfitting을 완화 (by 여러개의 weak model에 의해)



앙상블 기법에는 일반적으로 두 가지 방법이 존재한다: 1) bagging, 2) boosting

<img src="https://i.loli.net/2020/11/26/XpRkIrLjdN21K74.png" alt="img" style="zoom: 50%;" />



## Bagging

샘플을 여러 번 뽑아(bootstrap sampling) 각 모델을 학습시켜 결과를 집계(Aggregate) 하는 방법 (parallel process)

* bootstrap sampling: $N$개의 데이터셋 sample을 복원 추출로 $N'$ 번 추출하여 하나의 데이터셋을 만드는 방법 (일반적으로 $N' < N$ 를 만족하고, $N'$은 $N$의 60% 정도라고 한다.)
  * 복원 추출: 데이터셋에서 sample을 추출할 때, 이전에 뽑았던 샘플을 다시 추출할수 있는 방식 
* Aggregate에는 voting(투표) 또는 mean(평균) 을 주로 사용한다.

<img src="https://i.loli.net/2020/11/26/zD46NFfWqexbuQ5.png" alt="image-20201127003408673" style="zoom: 67%;" /> 

### 평가

생성된 bagging 모델을 테스트할 경우, bootstrap에서 뽑히지 않은 sample (이를 out-of-bag samples 이라 부른다)들을 이용해서 얼만큼 맞추는지 (classification의 경우), 얼만큼 실제값과 다른지 (regression의 경우) 확인한다.

대표적인 Bagging 알고리즘: Random Forest 모델

## Boosting

오분류된 샘플에 더 많은 가중치를 주어 학습하는 방식 (sequential process)

### 과정

1. Bagging과 마찬가지로, 첫 모델을 만들 때 모든 sample들에 대해 동일한 확률로 bootstrap sampling을 수행한다. 
2. 그리고, 전체 학습 데이터(training data)를 이용해 model을 평가하여 낮은 성능을 기록하는 sample들을 찾아내어 기록한다.
3. 이후, 다음 (두번째) 모델을 만들 때도 bootstrap sampling을 수행하는데, 이때는 기록된 sample들이 뽑힐 확률이 더 높게 설정한다.
4. 그리고, (2)와 마찬가지로 전체 학습 데이터를 이용해 model을 평가하는데, 이때는 (bagging과 똑같이) 전체 모델의 결과를 aggregate 하여 평가를 진행하고, 낮은 성능을 기록하는 sample들을 찾아내어 기록한다.
5. 이후, 다음 (세번째) 모델부터는 (3), (4)의 과정을 반복한다. 

### 평가

모든 모델의 결과에 aggregate를 사용하는 것은 bagging과 비슷하지만, 더 좋은 성능을 내는 모델이 내는 결과는 높은 가중치를 준다. 그렇기 때문에, bagging과 달리, boosting은 매번 모델을 생성할 때마다 성능을 기록하여, 어느정도의 가중치를 줄지 결정한다.

또한, 몇몇 boosting 알고리즘은 일정 임계치 이상 성능을 내는 모델만 keep 한다.

대표적인 Boosting 알고리즘: AdaBoost, XGBoost, GradientBoost

![image-20201127011713312](https://i.loli.net/2020/11/27/OCkfQ5w16RWDArc.png)

