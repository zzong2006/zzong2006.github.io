---
tags: ["machine_learning", "feature_scaling"]
aliases: ["normalization", "scaling"]
---

# A) Normalization ?

Normalization 은 데이터의 scale 을 맞추는 전처리를 넓게 부르는 말이다. 문맥에 따라 의미가 조금 달라서, 실제로 어떤 변환을 말하는지 확인해야 한다.

Feature scaling 문맥에서 normalization 이라고 하면 보통 값을 특정 범위로 맞추는 [[machine_learning/min-max scaling|min-max scaling]] 을 가리키는 경우가 많다.

# B) Standardization 과 구분

[[standardization]] 은 평균을 빼고 표준편차로 나누어 z-score 로 바꾸는 방법이다.

$$
z = \frac{x-\mu}{\sigma}
$$

반면 min-max normalization 은 최솟값과 최댓값을 기준으로 값을 0~1 범위에 맞춘다.

$$
x' = \frac{x-\min(x)}{\max(x)-\min(x)}
$$

| 구분 | 중심 아이디어 | 결과 |
| --- | --- | --- |
| [[standardization]] | 평균과 표준편차 기준으로 재표현 | 평균 0, 표준편차 1 |
| [[machine_learning/min-max scaling|min-max scaling]] | 최솟값과 최댓값 기준으로 재표현 | 보통 0~1 |
| unit norm normalization | vector 길이를 1로 맞춤 | cosine 비교에 유리 |

# C) 언제 중요한가

[[gradient descent]], [[support vector machine]], [[k-Nearest Neighbors]], [[Principal Component Analysis|PCA]] 처럼 feature scale 에 민감한 방법에서는 normalization 또는 standardization 이 모델 품질과 학습 안정성에 직접 영향을 준다.

반대로 [[Decision Tree]] 계열은 feature 내부의 순서와 threshold split 에 더 의존하므로 scaling 영향이 상대적으로 작다.

