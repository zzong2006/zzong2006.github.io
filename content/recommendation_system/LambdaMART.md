---
tags: ["learning_to_rank"]
---

# A) LambdaMART란?

MART 모델은 [[Normalized Discounted Cumulative Gain|NDCG]]와 같은 평가 지표를 최적화하는 데 사용되는 머신러닝 기법입니다.

LambdaMART는 [[LambdaRank]]와 [[Multiple Additive Regression Trees|MART]]를 결합한 순위 학습(Learning-to-Rank, LTR) 알고리즘으로, 정보 검색, 추천 시스템, 전자상거래 플랫폼 등에서 검색 결과나 상품 목록을 사용자에게 더 관련성 높은 순서로 보여주기 위해 널리 활용되고 있습니다.

## A.1) LambdaMART: 순위 학습을 위한 강력한 알고리즘

LambdaMART는 두 가지 핵심 기술인 [[LambdaRank]]와 [[Multiple Additive Regression Trees|MART]]의 장점을 결합하여 높은 성능을 발휘합니다.

### A.1.1) LambdaMART의 주요 구성 요소

1. **MART (Multiple Additive Regression Trees)**
   MART는 그래디언트 부스팅(Gradient Boosting) 방식을 사용하는 앙상블 모델입니다. 여러 개의 약한 학습기(의사결정나무)를 순차적으로 학습시켜, 이전 단계의 오차(residual)를 점진적으로 보완함으로써 강력한 예측 모델을 만듭니다.

2. **Lambda(λ) 그래디언트**
   LambdaMART의 핵심 아이디어는 ‘Lambda’라고 불리는 특별한 그래디언트(경사도)에 있습니다. 일반적인 머신러닝 모델이 예측값과 실제값 사이의 오차를 최소화하는 데 집중한다면, LambdaMART는 순위 평가 지표 자체를 직접적으로 개선하는 데 목적이 있습니다.

   **Lambda는 순서가 잘못된 문서 쌍(예: 더 관련성 높은 문서가 낮은 위치에 있는 경우)을 올바른 순서로 바꾸기 위해 필요한 “힘” 또는 “이동량”을 의미합니다.** 이 Lambda 값은 [[Normalized Discounted Cumulative Gain|NDCG]]와 같은 순위 평가 지표의 변화량과 밀접하게 연관되어 있으며, 이 Lambda 값을 그래디언트로 사용함으로써 평가 지표를 직접적으로 개선할 수 있습니다.

### A.1.2) LambdaMART의 작동 원리

LambdaMART의 학습 과정은 아래와 같이 이루어집니다.

1. **초기 트리 생성**
   간단한 예측 모델(트리)로 시작합니다.

2. **Lambda 값 계산**
   현재 모델이 예측한 순위와 실제 정답 순위를 비교하여, 잘못된 문서 쌍들을 찾아냅니다. 이 쌍들의 순서를 바꿨을 때 [[Normalized Discounted Cumulative Gain|NDCG]] 등 평가 지표가 얼마나 개선되는지를 기반으로 각 문서에 대한 Lambda 값을 계산합니다.

3. **새로운 트리 학습**
   계산된 Lambda 값을 예측 목표값(잔차와 유사하게 사용)으로 하여 새로운 회귀 트리를 학습합니다. 이 트리는 현재 모델이 어떻게 순위를 수정해야 하는지 배우게 됩니다.
4. **모델 업데이트**
   새로 학습된 트리를 기존 모델에 더해 모델을 업데이트합니다.
5. **반복 학습**
   위 과정을 반복하면서 점진적으로 평가 지표를 개선하는 강력한 앙상블 모델을 완성합니다. 최종 점수는 모든 트리의 예측값을 합산하여 결정됩니다.

### A.1.3) LambdaMART의 장점

* **높은 정확도**
  [[Normalized Discounted Cumulative Gain|NDCG]]와 같은 순위 평가 지표를 직접 최적화하도록 설계되어 있어, 다른 LTR 알고리즘에 비해 순위 결정 문제에서 뛰어난 정확도를 보입니다.

* **유연성**
  특정 평가 지표에 한정되지 않고, 다양한 순위 평가 지표에 맞춰 Lambda 그래디언트를 설계하여 최적화할 수 있는 유연성을 가지고 있습니다.

* **강력한 성능**
  그래디언트 부스팅 기법을 바탕으로 다수의 약한 학습기를 결합함으로써 견고하고 신뢰할 수 있는 성능을 제공합니다.

이러한 특징들 덕분에 LambdaMART는 오늘날에도 XGBoost, LightGBM 등 최신 그래디언트 부스팅 라이브러리에서 순위 학습 옵션으로 제공되고 있으며, 검색 및 추천 시스템 분야에서 여전히 표준적인 핵심 알고리즘으로 널리 사용되고 있습니다.

# B) References

* From RankNet to LambdaRank to LambdaMART: An Overview
