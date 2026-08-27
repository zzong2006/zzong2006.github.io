---
tags: ["machine_learning", "statistic", "feature_scaling"]
aliases: ["z-score", "z score", "z-score normalization"]
---

# A) Standardization ?

Standardization 은 feature 를 평균 0, 표준편차 1의 스케일로 바꾸는 전처리다. 서로 다른 단위의 feature 를 같은 좌표계에서 비교해야 하는 선형 모델, 거리 기반 모델, gradient 기반 최적화에서 특히 중요하다.

$$
z = \frac{x - \mu}{\sigma}
$$

여기서 $\mu$ 는 평균, $\sigma$ 는 표준편차다. 변환 후 값은 “평균에서 표준편차 몇 개만큼 떨어져 있는가”를 나타내므로 z-score 라고도 부른다.

# B) Normalization 과 구분

Normalization 은 문맥에 따라 넓게 쓰이는 말이라 혼동이 자주 생긴다. feature scaling 문맥에서는 보통 [[machine_learning/min-max scaling|min-max scaling]] 처럼 값을 특정 범위로 맞추는 방법을 가리키고, 통계 문맥에서는 standardization 을 z-score normalization 이라고 부르기도 한다.

| 구분 | 변환 | 결과 범위 | 언제 유용한가 |
| --- | --- | --- | --- |
| Standardization | $(x-\mu)/\sigma$ | 고정 범위 없음 | 선형 모델, SVM, PCA, z-test |
| Min-max scaling | $(x-\min(x))/(\max(x)-\min(x))$ | 보통 0~1 | bounded input 이 필요한 모델, 거리 기반 비교 |
| Unit norm scaling | $x/\Vert x \Vert$ | vector norm 이 1 | cosine 기반 embedding 비교 |

즉, “평균을 빼고 표준편차로 나눈다”면 standardization 이고, “값을 0~1 같은 범위로 눌러 넣는다”면 min-max normalization 에 가깝다.

# C) 왜 모델에 영향을 주나

[[gradient descent]] 는 feature scale 이 크게 다르면 parameter 마다 업데이트 속도가 달라진다. 어떤 feature 는 큰 단위 때문에 gradient 를 지배하고, 어떤 feature 는 거의 반영되지 않을 수 있다.

[[Decision Tree]] 계열은 split 기준이 feature 내부의 순서에 더 의존하므로 standardization 영향이 작다. 반대로 [[logistic regression]], [[support vector machine]], [[k-Nearest Neighbors]], [[Principal Component Analysis|PCA]] 처럼 선형 결합이나 거리/분산을 쓰는 방법은 scaling 에 민감하다.

# D) 해석할 때 주의할 점

Standardization 은 outlier 에 완전히 강한 방법은 아니다. 평균과 표준편차 자체가 outlier 의 영향을 받기 때문이다. 다만 [[machine_learning/min-max scaling|min-max scaling]] 처럼 최솟값과 최댓값에 직접 묶이는 방법보다는 outlier 하나가 전체 범위를 압축하는 문제가 덜하다.

Train/test split 이 있다면 평균과 표준편차는 train set 에서만 추정하고, 같은 값으로 validation/test set 을 변환해야 한다. 전체 데이터에서 미리 계산하면 data leakage 가 생긴다.

