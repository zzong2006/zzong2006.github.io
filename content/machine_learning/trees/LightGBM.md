---
title: "LightGBM"
aliases: []
tags:
  - GBM
---

# A) LightGBM ?

Microsoft 가 만든 [[Gradient Boosting Machine|gradient boosting decision tree]](GBDT) 라이브러리다 (Ke et al., NeurIPS 2017). 결정 트리를 하나씩 더해 가며 앞 트리들이 남긴 오차(gradient)를 줄이는 방식은 다른 GBDT 와 같다. 차이는 트리 하나를 세우는 비용을 줄이는 기법들에 있다. 논문에서는 기존 GBDT 보다 학습이 최대 20 배 이상 빨랐고, 정확도는 거의 같았다.

# B) XGBoost 보다 빠른 이유

GBDT 학습에서 가장 비싼 일은 **분할 지점 찾기** 다. 트리의 노드마다 "어느 feature 의 어느 값에서 나누면 loss 가 가장 많이 줄어드는가" 를 찾아야 한다. 비용은 대략 (데이터 행 수) × (feature 수) × (분할 후보 수) 에 비례한다. histogram · GOSS · EFB 는 이 곱의 한 항씩을 줄이고, leaf-wise 성장은 분할 횟수 자체를 아낀다.

![[img-ebfc6376cb.png]]

| 기법 | 줄이는 것 | 관련 파라미터 |
| --- | --- | --- |
| Histogram | 분할 후보 수 | `max_bin` (기본 255) |
| Leaf-wise 성장 | 같은 정확도에 필요한 분할 수 | `num_leaves` (기본 31), `max_depth` |
| GOSS | 분할 계산에 쓰는 행 수 | `data_sample_strategy="goss"`, `top_rate`, `other_rate` |
| EFB | feature 수 | `enable_bundle` (기본 true) |

## B.1) Histogram: bin 경계에서만 분할

XGBoost 의 exact 방식(초기 버전에서 작은 데이터에 기본으로 쓰였다)은 feature 값을 정렬해 두고, 서로 다른 값 사이를 모두 분할 후보로 본다. 값이 백만 종류면 후보도 백만 개다.

LightGBM 은 학습 전에 각 feature 를 최대 `max_bin` 개 구간(bin)으로 나누고, 값 대신 bin 번호를 저장한다. 노드마다 bin 별로 gradient 합을 모은 히스토그램을 만들고, 분할 후보는 bin 경계(기본 설정이면 최대 254 개)만 본다. 값을 1 바이트 bin 번호로 저장하므로 메모리도 줄어든다.

히스토그램에는 계산을 한 번 더 아끼는 성질이 있다. 부모 노드의 히스토그램에서 한쪽 자식의 히스토그램을 빼면 다른 쪽 자식의 히스토그램이 된다. 그래서 데이터가 적은 자식 쪽만 직접 세고, 큰 쪽은 뺄셈으로 얻는다.

## B.2) Leaf-wise: loss 감소가 가장 큰 잎만 분할

XGBoost 의 기본 성장 방식(level-wise)은 깊이를 한 층씩 늘리며 그 층의 모든 노드를 나눈다. 이미 충분히 잘 맞는 노드도 같이 나눈다.

LightGBM 은 지금 있는 잎 중 나눴을 때 loss 가 가장 많이 줄어드는 잎 하나만 나눈다. 같은 잎 수라면 loss 를 더 많이 줄이므로, 같은 정확도에 트리 수나 분할 수가 덜 든다. 대신 한쪽으로만 깊게 자라 데이터가 적으면 [[overfitting|과적합]] 하기 쉽다. 그래서 `num_leaves` 로 잎 수를 제한하고, 필요하면 `max_depth` 와 `min_data_in_leaf` 를 함께 건다.

## B.3) GOSS: gradient 가 작은 행 샘플링

[[Gradient-based One-Side Sampling|GOSS]] 는 분할 지점을 계산할 때 행 일부만 쓴다. gradient 가 작은 행은 이미 잘 맞고 있어 분할 이득 계산에 기여가 작다는 점을 이용한다. gradient 가 큰 상위 행은 모두 남기고, 나머지는 일부만 무작위로 남긴 뒤 가중치를 키워 원래 분포를 맞춘다.

## B.4) EFB: 겹치지 않는 sparse feature 묶기

one-hot 인코딩처럼 대부분 0 인 feature 가 많으면, 서로 동시에 0 이 아닌 행이 거의 없는 feature 쌍이 많다. EFB(Exclusive Feature Bundling)는 이런 feature 들을 하나로 합친다. 합칠 때 두 번째 feature 의 값에 오프셋을 더해 bin 범위가 겹치지 않게 하므로, 합친 뒤에도 원래 값이 어느 feature 의 것인지 구분된다.

어떤 feature 끼리 묶어야 묶음 수가 최소가 되는지 찾는 문제는 NP-hard 라서, 논문은 greedy 방식으로 근사한다. feature 가 수만 개인 sparse 데이터에서 효과가 크고, dense feature 만 있는 데이터에서는 묶을 것이 거의 없다.

## B.5) 지금의 XGBoost 와 비교

위 기법 중 일부는 XGBoost 에도 들어갔다. 같은 설정으로 맞추면 속도 차이는 예전보다 작고, 데이터와 파라미터에 따라 결과가 달라진다.

| 비교 항목 | LightGBM | XGBoost |
| --- | --- | --- |
| 분할 후보 | histogram (bin) | 2.0 부터 기본값 `tree_method="auto"` 가 histogram 방식. exact 도 선택 가능 |
| 트리 성장 | leaf-wise | 기본 level-wise. `grow_policy="lossguide"` 로 leaf-wise 가능 |
| 행 샘플링 | GOSS 선택 가능 | 무작위 subsample. GPU 에서는 gradient 기반 샘플링(`sampling_method="gradient_based"`, MVS 방식)도 가능 |
| sparse feature | EFB 로 묶음 | 묶지 않음. sparsity-aware split 으로 결측 · 0 을 따로 처리 |

# C) 쓸 때 주의할 점

## C.1) 과적합을 막는 파라미터

leaf-wise 성장 때문에 데이터가 적으면 과적합하기 쉽다. LightGBM 문서도 작은 데이터에서는 `num_leaves` 를 줄이고 `min_data_in_leaf` 를 키우라고 권한다.

| 파라미터 | 기본값 | 정하는 것 | 과적합 시 조정 |
| --- | --- | --- | --- |
| `num_leaves` | 31 | 트리 하나의 잎 수 상한 | 줄인다 |
| `min_data_in_leaf` (`min_child_samples`) | 20 | 잎 하나에 들어가야 하는 최소 행 수 | 키운다 |
| `max_depth` | -1 (제한 없음) | 트리 깊이 상한. leaf-wise 가 한쪽으로만 깊어지는 것을 막는다 | 건다 |
| `feature_fraction` (`colsample_bytree`) | 1.0 | 트리마다 쓰는 feature 비율 | 줄인다 |
| `learning_rate` · `num_iterations` (`n_estimators`) | 0.1 · 100 | 트리 하나의 반영 비율과 트리 개수 | 학습률을 낮추고 early stopping 으로 개수를 정한다 |

괄호 안은 scikit-learn 방식 API(`LGBMClassifier` 등)에서 쓰는 이름이다.

## C.2) scikit-learn 방식 API

`lgb.LGBMClassifier` · `lgb.LGBMRegressor` 는 scikit-learn 과 같은 `fit` / `predict` 인터페이스다. `lgb.Dataset` 을 만들 필요 없이 pandas DataFrame 이나 numpy 배열을 바로 넣는다. DataFrame 의 `category` 타입 열은 자동으로 categorical feature 로 처리한다.

클래스 불균형이 있으면 `class_weight="balanced"` 로 클래스 빈도의 역수만큼 가중치를 줄 수 있다. 소수 클래스를 더 잘 잡게 되지만, 학습 분포가 바뀌므로 소수 클래스의 예측 확률이 실제보다 부풀려진다. 확률값을 그대로 써야 하면 [[probability calibration|보정]] 을 거친다.

## C.3) Boosting 방식

`boosting` 파라미터로 GBDT(기본), DART, random forest 를 고른다. 예전에는 GOSS 도 `boosting="goss"` 로 골랐지만, 4.0 부터는 행 샘플링 방식으로 분리되어 `data_sample_strategy="goss"` 로 지정한다. 순위 학습용 목적 함수(`objective="lambdarank"`)도 기본으로 들어 있다 ([[LambdaRank]]).

# D) 한계: ID 사이의 관계 학습

사용자 ID · 상품 ID 처럼 값이 수백만 종류인 feature 를 넣어도, 트리 모델은 "어떤 ID 끼리 비슷한가" 를 배우지 못한다. 트리의 분할은 언제나 feature 하나의 값으로 데이터를 나누는 질문이기 때문이다. "user_A 와 user_B 가 얼마나 비슷한가" 는 분할로 표현할 수 없다.

ID 를 categorical feature 로 넣으면 LightGBM 은 분할할 때마다 다음을 한다 (범주가 `max_cat_to_onehot`, 기본 4 개보다 많을 때).

1. 범주(ID)별로 gradient 합 ÷ hessian 합을 구한다. 대략 "이 ID 의 현재 오차가 어느 쪽으로 쏠려 있는가" 다.
2. 이 값으로 범주를 정렬한다.
3. 정렬된 순서에서 한 지점을 골라 두 무리로 나눈다. 예를 들어 `{user_A, user_C, …}` 와 나머지로 나뉜다.

user_A 와 user_C 가 같은 무리에 들어간 이유는 둘의 통계값이 비슷했기 때문뿐이다. 둘이 같은 상품을 샀는지, 취향이 비슷한지는 모델이 알 수 없다. 그래서 데이터가 적은 ID 는 통계값이 불안정하고, 처음 보는 ID 에는 쓸 정보가 없다.

임베딩을 쓰는 신경망(MLP 등)은 다르다. ID 마다 벡터를 두고 학습하면서, 비슷한 행동을 한 ID 의 벡터를 서로 가깝게 만든다. 데이터가 적은 user_A 도 비슷한 user_B 에게서 배운 정보를 나눠 쓴다.

| 비교 항목 | LightGBM (결정 트리) | MLP (임베딩) |
| --- | --- | --- |
| ID 를 쓰는 방식 | ID 마다 오차 통계를 내서 무리를 나눈다 | ID 마다 벡터를 두고 학습한다 |
| 학습하는 관계 | feature 와 target 사이 | feature 와 target 사이 + ID 끼리의 유사도 |
| 데이터가 적은 ID | 통계가 불안정해 거의 쓸모없다 | 비슷한 ID 의 정보를 빌려 쓴다 |

그래서 ID 를 트리 모델에 넣을 때는 ID 자체보다 ID 의 통계(과거 클릭률, 구매 수 등)를 feature 로 만들어 넣는 일이 많다.

# E) Feature Importance

LightGBM 은 feature 중요도를 두 가지로 낸다.

| `importance_type` | 계산 |
| --- | --- |
| `split` (기본값) | 그 feature 로 분할한 횟수 |
| `gain` | 그 feature 로 분할했을 때 줄어든 loss 의 합 |

`split` 은 분할이 loss 를 얼마나 줄였는지 보지 않는다. 효과가 작은 분할을 여러 번 한 feature 가 중요하게 나온다. 보통 `gain` 이 더 믿을 만한 지표로 쓰인다.

[[random forest]] 의 기본 중요도(scikit-learn 의 `feature_importances_`)는 분할로 줄어든 불순도의 평균이다. 원리는 LightGBM 의 `gain` 과 같지만, 두 모델의 값을 그대로 비교하면 안 된다.

| 비교 항목 | Random Forest | LightGBM |
| --- | --- | --- |
| 트리 관계 | 서로 독립 ([[bagging]]) | 앞 트리의 오차를 이어 받음 ([[boosting]]) |
| 분할 기준 | 불순도(Gini, entropy) 감소 | gradient 로 계산한 loss 감소 |
| 중요도 분포 | 트리마다 feature 를 무작위로 골라 여러 feature 에 퍼지는 편 | 오차를 가장 잘 줄이는 소수 feature 에 몰리는 편 |

두 방식 모두 값 종류가 많은 feature(ID 등)를 과대평가하는 경향이 있다. 분할 후보가 많아 우연히 이득이 큰 분할을 찾기 쉽기 때문이다. feature 의 실제 기여를 보려면 permutation importance 나 SHAP 을 함께 본다.

# F) Related

[[Gradient Boosting Machine]], [[Extreme Gradient Boosting|XGBoost]]

# G) References

* [LightGBM: A Highly Efficient Gradient Boosting Decision Tree (Ke et al., NeurIPS 2017)](https://papers.nips.cc/paper_files/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html)
* [LightGBM Features](https://lightgbm.readthedocs.io/en/latest/Features.html)
* [LightGBM Parameters](https://lightgbm.readthedocs.io/en/latest/Parameters.html)
* [XGBoost - Tree Methods](https://xgboost.readthedocs.io/en/stable/treemethod.html)
* [scikit-learn - Permutation feature importance](https://scikit-learn.org/stable/modules/permutation_importance.html)
* [Understanding LightGBM Parameters (and How to Tune Them) - neptune.ai](https://neptune.ai/blog/lightgbm-parameters-guide)
