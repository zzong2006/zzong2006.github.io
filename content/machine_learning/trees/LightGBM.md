---
title: "LightGBM"
aliases: []
tags:
  - GBM
---

# A) LightGBM ?

Microsoft 가 만든 [[Gradient Boosting Machine|gradient boosting decision tree]](GBDT) 라이브러리다 (Ke et al., NeurIPS 2017). 결정 트리를 하나씩 더해 가며 앞 트리들이 남긴 오차(gradient)를 줄이는 방식은 다른 GBDT 와 같다. 차이는 트리 하나를 세우는 비용을 줄이는 기법들에 있다. 논문은 기존 GBDT 대비 학습을 최대 20 배 넘게 빠르게 하면서 정확도는 거의 같다고 보고했다.

# B) XGBoost 보다 빠른 이유

GBDT 학습에서 가장 비싼 일은 **분할 지점 찾기** 다. 트리의 노드마다 "어느 feature 의 어느 값에서 나누면 loss 가 가장 많이 줄어드는가" 를 찾아야 한다. 비용은 대략 (데이터 행 수) × (feature 수) × (분할 후보 수) 에 비례한다. LightGBM 의 네 기법은 각각 이 곱의 한 항을 줄인다.

![[img-ebfc6376cb.png]]

| 기법 | 줄이는 것 | 관련 파라미터 |
| --- | --- | --- |
| Histogram | 분할 후보 수 | `max_bin` (기본 255) |
| Leaf-wise 성장 | 같은 정확도에 필요한 분할 수 | `num_leaves` (기본 31), `max_depth` |
| GOSS | 분할 계산에 쓰는 행 수 | `data_sample_strategy="goss"`, `top_rate`, `other_rate` |
| EFB | feature 수 | `enable_bundle` (기본 true) |

## B.1) Histogram: 값 대신 bin 경계에서만 자른다

XGBoost 의 exact 방식(초기 버전에서 작은 데이터에 기본으로 쓰였다)은 feature 값을 정렬해 두고, 서로 다른 값 사이를 모두 분할 후보로 본다. 값이 백만 종류면 후보도 백만 개다.

LightGBM 은 학습 전에 각 feature 를 최대 `max_bin` 개 구간(bin)으로 나누고, 값 대신 bin 번호를 저장한다. 노드마다 bin 별로 gradient 합을 모은 히스토그램을 만들고, 분할 후보는 bin 경계(기본 설정이면 최대 254 개)만 본다. 값을 1 바이트 bin 번호로 저장하므로 메모리도 줄어든다.

히스토그램에는 계산을 한 번 더 아끼는 성질이 있다. 부모 노드의 히스토그램에서 한쪽 자식의 히스토그램을 빼면 다른 쪽 자식의 히스토그램이 된다. 그래서 데이터가 적은 자식 쪽만 직접 세고, 큰 쪽은 뺄셈으로 얻는다.

## B.2) Leaf-wise: loss 가 가장 많이 줄어드는 잎만 나눈다

XGBoost 의 기본 성장 방식(level-wise)은 깊이를 한 층씩 늘리며 그 층의 모든 노드를 나눈다. 이미 충분히 잘 맞는 노드도 같이 나눈다.

LightGBM 은 지금 있는 잎 중 나눴을 때 loss 가 가장 많이 줄어드는 잎 하나만 나눈다. 같은 잎 수라면 loss 를 더 많이 줄이므로, 같은 정확도에 트리 수나 분할 수가 덜 든다. 대신 한쪽으로만 깊게 자라 데이터가 적으면 과적합하기 쉽다. 그래서 `num_leaves` 로 잎 수를 제한하고, 필요하면 `max_depth` 와 `min_data_in_leaf` 를 함께 건다.

## B.3) GOSS: gradient 가 작은 행을 덜 본다

[[Gradient-based One-Side Sampling|GOSS]] 는 분할 지점을 계산할 때 행 일부만 쓴다. gradient 가 작은 행은 이미 잘 맞고 있어 분할 이득 계산에 기여가 작다는 점을 이용한다. gradient 가 큰 상위 행은 모두 남기고, 나머지는 일부만 무작위로 남긴 뒤 가중치를 키워 원래 분포를 맞춘다.

## B.4) EFB: 서로 겹치지 않는 sparse feature 를 묶는다

one-hot 인코딩처럼 대부분 0 인 feature 가 많으면, 서로 동시에 0 이 아닌 행이 거의 없는 feature 쌍이 많다. EFB(Exclusive Feature Bundling)는 이런 feature 들을 하나로 합친다. 합칠 때 두 번째 feature 의 값에 오프셋을 더해 bin 범위가 겹치지 않게 하므로, 합친 뒤에도 원래 값이 어느 feature 의 것인지 구분된다.

어떤 feature 끼리 묶어야 묶음 수가 최소가 되는지 찾는 문제는 NP-hard 라서, 논문은 greedy 방식으로 근사한다. feature 가 수만 개인 sparse 데이터에서 효과가 크고, dense feature 만 있는 데이터에서는 묶을 것이 거의 없다.

## B.5) 지금은 차이가 줄었다

위 기법 중 일부는 XGBoost 에도 들어갔다. XGBoost 는 `tree_method="hist"` 로 히스토그램 방식을 지원하고, 2.0 부터는 기본값 `auto` 가 `hist` 와 같은 방식을 쓴다. `grow_policy="lossguide"` 를 주면 leaf-wise 로도 자란다. 그래서 같은 설정으로 맞추면 속도 차이는 예전보다 작고, 데이터와 파라미터에 따라 결과가 달라진다. EFB 는 LightGBM 에만 있다. XGBoost 에도 gradient 기반 행 샘플링(`sampling_method="gradient_based"`)이 있지만, GOSS 와 다른 MVS 방식이고 GPU 에서만 쓸 수 있다.

# C) 특징

leaf-wise 로 자라기 때문에 데이터가 적으면 [[overfitting]] 에 취약한 편이다. LightGBM 문서도 작은 데이터에서는 `num_leaves` 를 줄이고 `min_data_in_leaf` 를 키우라고 권한다.

학습이 빠르고 메모리를 적게 써서 행이 수백만 이상인 표 데이터에서 자주 쓴다. 순위 학습용 목적 함수(`lambdarank`)도 기본으로 들어 있다 ([[LambdaRank]]).

# D) Vs. XGBoost

| 비교 항목 | LightGBM | XGBoost |
| --- | --- | --- |
| 분할 후보 | histogram (bin) | 2.0 부터 기본 histogram. exact 도 선택 가능 |
| 트리 성장 | leaf-wise | 기본 level-wise. `lossguide` 로 leaf-wise 가능 |
| 행 샘플링 | GOSS 선택 가능 | 무작위 subsample. GPU 에서는 gradient 기반(MVS)도 가능 |
| sparse feature | EFB 로 묶음 | sparsity-aware split 으로 결측 · 0 을 따로 처리 |

# E) Boosting Methods

`boosting` 파라미터로 GBDT(기본), DART, random forest 를 고른다. 예전에는 GOSS 도 `boosting="goss"` 로 골랐지만, 4.0 부터는 행 샘플링 방식으로 분리되어 `data_sample_strategy="goss"` 로 지정한다.

# F) Lesson Learned

1. `lgb.LGBMClassifier` 클래스로 분류 모델 학습 가능. 이 경우 `lgb.Dataset` 인스턴스를 사용하지 않는다. DataFrame 을 입력으로 주는게 맞는듯

# G) Hyperparameter Tuning

* `class_weight`: `balanced` 를 사용하면 유리한듯
* `max_depth`:
* `n_estimators`:

# H) Related

[[Gradient Boosting Machine]], [[Extreme Gradient Boosting|XGBoost]]

# I) 단점: ID 간의 관계 학습 부재

"LightGBM이 ID 간의 관계를 학습하지 못한다"는 말의 핵심적인 이유는 LightGBM이 **결정 트리([[Decision Tree]])에 기반한 모델**이기 때문입니다. 결정 트리가 동작하는 방식을 이해하면 그 이유를 명확히 알 수 있습니다.

### I.1.1) 결정 트리의 작동 방식: "질문을 통한 그룹 나누기"

결정 트리는 데이터를 가장 잘 나눌 수 있는 질문을 연속적으로 던져서 데이터를 분류하거나 예측합니다. 이 질문은 항상 **"하나의 피처(Feature)"**에 대해서만 이루어집니다.

간단한 비유를 들어보겠습니다.

당신이 광고 클릭 여부를 예측하는 모델(결정 트리)이라고 상상해 보세요. 당신 앞에는 100만 명의 사용자 데이터가 있습니다. 당신이 할 수 있는 질문은 이런 식입니다.

* "사용자의 나이가 30세 미만인가?" (Yes / No)
* "사용자의 거주지가 서울인가?" (Yes / No)
* "사용자 ID가 'user_123'인가?" (Yes / No)

여기서 가장 중요한 점은, 당신이 **"사용자 A와 사용자 B가 얼마나 비슷한가?"** 와 같은 질문은 던질 수 없다는 것입니다. 트리는 오직 **데이터에 주어진 피처 값 그 자체**를 가지고 그룹을 나눌 뿐입니다.

### I.1.2) LightGBM이 고차원 ID 피처를 다루는 방법

이제 수백만 개의 ID가 있는 상황을 생각해 보겠습니다. LightGBM은 이 ID들을 어떻게 처리할까요?

1. **목표(Target) 변수와의 관계를 계산**: LightGBM은 각 ID별로 타겟 변수(예: 광고 클릭률)의 평균값을 계산합니다.
	
	* user_A의 평균 클릭률: 0.8
	* user_B의 평균 클릭률: 0.2
	* user_C의 평균 클릭률: 0.85
	* user_D의 평균 클릭률: 0.15
	* ... 등등
		
2. **최적의 분할 지점(Split Point) 찾기**: 그 다음, 이 '클릭률'을 기준으로 ID들을 정렬하고, 데이터를 가장 잘 나눌 수 있는 "경계선"을 찾습니다. 예를 들어, 트리는 다음과 같은 규칙을 학습할 수 있습니다.
	
	> **"만약 해당 사용자의 ID가 `{user_A, user_C, ...}` 그룹에 속하면, 클릭할 확률이 높다고 예측해라."**

	여기서 {user_A, user_C, ...} 그룹이 만들어진 이유는 단 하나입니다. 바로 **"이 ID들이 높은 클릭률을 보였기 때문"**입니다. 모델은 user_A와 user_C가 취미가 같거나, 나이가 비슷하거나, 같은 종류의 상품을 구매했다는 사실은 전혀 알지 못합니다. 그저 이 둘을 한 그룹으로 묶었을 때 예측이 더 정확해졌다는 **통계적 결과**만을 학습한 것입니다.

### I.1.3) 결정적인 차이: "관계"의 의미

* **LightGBM (트리 모델)에게 "관계"란?**
	
	* 각 ID가 **타겟 변수(클릭 여부)와 맺는 통계적 관계**입니다.
	* `P(클릭 | ID = user_A)` 와 P(클릭 | ID = user_B) 값을 비교할 뿐입니다.
	* ID와 ID 사이의 직접적인 유사성은 고려 대상이 아닙니다.
		
* **MLP (임베딩 모델)에게 "관계"란?**
	* 모델이 학습을 통해 만들어낸 **임베딩 공간(Embedding Space)에서의 거리**입니다.
	* 만약 user_A와 user_B가 비슷한 광고들을 클릭하고, 비슷한 상품들을 구매했다면, 모델은 이 둘의 임베딩 벡터 **v(A)** 와 **v(B)** 를 공간상에서 매우 가깝게 위치시킵니다.
	* 따라서 모델은 "user_A와 user_B는 비슷한 사용자다"라는 **ID 간의 잠재적 관계(Latent Relationship)**를 직접 학습하게 됩니다. 이 덕분에 user_A에 대한 데이터가 부족해도, 비슷한 user_B의 정보를 활용하여 더 정확한 예측이 가능해집니다 (일반화 성능 향상).

### I.1.4) 요약

|           |                          |                                     |
| --------- | ------------------------ | ----------------------------------- |
| 구분        | LightGBM (결정 트리)         | MLP (임베딩)                           |
| **학습 대상** | **피처와 타겟 간의 관계**         | **피처와 타겟 간의 관계 + 피처 값(ID)들 사이의 관계** |
| **질문 방식** | "이 ID는 클릭률 높은 그룹에 속하는가?" | "이 ID의 벡터는 다른 어떤 ID들의 벡터와 가까운가?"    |
| **결과**    | 각 ID를 독립적인 존재로 취급        | 비슷한 ID들을 비슷한 벡터로 표현하여 관계를 학습        |
|           |                          |                                     |

결론적으로, LightGBM은 각 ID를 하나의 분리된 점으로 보고 "이 점의 클릭률이 높은가, 낮은가?"만 판단하는 반면, 임베딩을 사용한 MLP는 모든 ID를 하나의 지도에 뿌려놓고 "어떤 점들이 서로 가까이 모여 있는가?"를 학습하여 그 관계 자체를 예측에 활용하는 것입니다.

# J) Feature Importance

compared to [[random forest]]

두 모델 모두 근본적으로는 **"불순도(Impurity) 감소"** 또는 **"정보 획득(Information Gain)"**이라는 동일한 원리를 사용하여 피처 중요도를 측정하는 것이 맞습니다.

하지만 **"많이 다른가?"** 라고 물으신다면, 대답은 **"네, 모델의 작동 방식 차이 때문에 결과적으로 꽤 다를 수 있습니다."** 입니다.

핵심은 불순도를 활용하는 **'방식'**과 **'환경'**이 두 모델에서 다르기 때문입니다.

### J.1.1) 공통점: 불순도 감소의 원리

말씀하신 대로 두 모델의 가장 기본적인 피처 중요도(feature_importance_type='gain')는 특정 피처가 트리의 분기점(split)에서 사용되었을 때, 얼마나 불순도를 많이 감소시켰는지를 측정하여 합산한 값입니다.

* **피처 A가 분기에 사용됨** -> **분기 전 불순도 - 분기 후 불순도 = 불순도 감소량 (Gain)**
	
* **피처 A의 총 중요도** = **모든 트리에서 피처 A가 기여한 모든 '불순도 감소량'의 합계**

여기까지는 두 모델의 원리가 같습니다.

### J.1.2) 결정적인 차이점들

#### J.1.2.1) 트리 생성 방식: 독립 vs. 직렬

* **Random Forest (랜덤 포레스트)**: **독립적인** 수백 개의 트리를 만듭니다 (배깅, [[bagging]]). 각 트리는 전체 데이터의 일부(부트스트랩 샘플)와 전체 피처의 일부만 보고 독립적으로 학습합니다.
	
	* **중요도에 미치는 영향**: "민주적인" 방식입니다. 특정 피처가 우연히 한 트리에서 높게 평가받아도, 다른 많은 트리에서는 다른 피처들이 선택될 기회를 얻습니다. 결과적으로 중요도가 여러 피처에 걸쳐 비교적 안정적이고 고르게 분산되는 경향이 있습니다.
		
* **LightGBM (그래디언트 부스팅)**: **직렬적인** 방식으로 트리를 만듭니다 (부스팅, [[boosting]]). 첫 번째 트리가 예측을 하고, 두 번째 트리는 첫 번째 트리가 만든 **오류(Residual)**를 학습합니다. 세 번째 트리는 앞선 두 트리의 오류를 학습하는 식으로, 점진적으로 오류를 보완해 나갑니다.
	
	* **중요도에 미치는 영향**: "전문가" 방식입니다. 모델은 예측 오류를 줄이는 데 가장 효과적인 피처를 집중적으로 사용하게 됩니다. 만약 소수의 강력한 피처가 있다면, 모델은 계속해서 그 피처들을 활용하여 오류를 줄이려 할 것이므로, 해당 피처들의 중요도가 매우 높게 나타날 수 있습니다.

#### J.1.2.2) LightGBM만의 추가적인 중요도 측정 방식: Split

LightGBM은 두 가지 주요 피처 중요도 유형을 제공하며, 기본값이 split 이라는 점이 큰 차이입니다.

* **importance_type='split' (기본값)**: 단순히 피처가 **분기점으로 사용된 횟수(count)**를 모두 합산합니다. 계산이 매우 빠르지만, Gain의 '크기'를 고려하지 않기 때문에 덜 정교할 수 있습니다.
	
* **importance_type='gain'**: 위에서 설명한 불순도 감소량의 총합입니다. 랜덤 포레스트의 방식과 원리가 같습니다.

일반적으로 'gain'이 더 신뢰할 수 있는 지표로 여겨집니다. 만약 랜덤 포레스트와 비교하고 싶다면, 반드시 LightGBM의 importance_type을 'gain'으로 설정해야 합니다.

#### J.1.2.3) 고차원(High-Cardinality) 피처에 대한 편향

결정 트리 기반 모델들은 고유값이 많은 피처(high-cardinality feature, 예: 사용자 ID)를 분기점으로 사용할 때 더 많은 조합이 가능하므로, 우연히라도 높은 Gain을 얻을 가능성이 커지는 편향이 있습니다.

* **랜덤 포레스트**: 각 트리에서 피처의 일부만 무작위로 선택(max_features)하므로, 이 편향이 어느 정도 완화됩니다.
	
* **LightGBM**: 매 분기마다 모든 피처를 고려하므로 이 편향이 더 강하게 나타날 수 있습니다. LightGBM이 고차원 범주형 피처를 잘 다루기는 하지만, 중요도를 측정할 때는 이러한 편향이 발생할 수 있다는 점을 인지해야 합니다.

### J.1.3) 요약 비교표

|   |   |   |
|---|---|---|
|항목|Random Forest|LightGBM|
|**모델 아키텍처**|배깅 (Bagging)|부스팅 (Boosting)|
|**트리 관계**|독립적, 병렬적|직렬적, 보완적|
|**주요 중요도 원리**|Gain (불순도 감소량)|Gain 또는 Split (사용 횟수)|
|**기본 중요도 타입**|Gain (구현에 따라 다름)|**Split (사용 횟수)**|
|**결과 경향**|중요도가 비교적 고르게 분포|소수의 강력한 피처에 집중될 수 있음|
|**편향성**|max_features로 인해 고차원 피처 편향이 일부 완화|고차원 피처에 대한 편향이 더 클 수 있음|

### J.1.4) 결론

> **"두 모델 모두 불순도 감소(Gain)를 활용하지만, 랜덤 포레스트는 여러 독립적인 트리의 결과를 '평균'내는 것에 가깝고, LightGBM은 오류를 줄이기 위해 가장 효율적인 피처를 '집중'하여 학습하는 것에 가깝습니다. 이로 인해 피처 중요도의 분포와 값이 달라질 수 있습니다."**

따라서 한 모델에서 중요하다고 나온 피처가 다른 모델에서는 덜 중요하게 나올 수 있으며, 이는 각 모델이 데이터를 해석하고 학습하는 방식의 근본적인 차이에서 비롯됩니다. 모델을 선택하고 피처 중요도를 해석할 때 이러한 특성을 이해하는 것이 매우 중요합니다.

# K) References

* [LightGBM: A Highly Efficient Gradient Boosting Decision Tree (Ke et al., NeurIPS 2017)](https://papers.nips.cc/paper_files/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html)
* [LightGBM Features](https://lightgbm.readthedocs.io/en/latest/Features.html)
* [LightGBM Parameters](https://lightgbm.readthedocs.io/en/latest/Parameters.html)
* [XGBoost - Tree Methods](https://xgboost.readthedocs.io/en/stable/treemethod.html)
* [Understanding LightGBM Parameters (and How to Tune Them) - neptune.ai](https://neptune.ai/blog/lightgbm-parameters-guide)
