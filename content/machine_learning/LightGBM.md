---
title: "LightGBM"
tags: ["GBM"]
---

# A) LightGBM ?

LightGBM uses a histogram-based method for selecting the best split.

# B) Why LightGBM?

[link](https://lightgbm.readthedocs.io/en/latest/Features.html)

1. Faster training speed (higher efficiency)
   대용량 데이터와 호환성: 대용량 데이터에 대해서도 다른 GBM 알고리즘에 비해 학습 시간을 크게 줄일 수 있다.
2. 적은 메모리 사용량
   continuous value 를 discrete bins 으로 대체하여 사용하기 때문에 다른 GBM 방식보다 메모리를 적게 사용한다.
   위 특징이 Kaggle 에서 자주 사용되는 이유 중 하나이다.
3. 병렬 학습 가능

# C) 특징

다른 GBM 방식보다 높은 accuracy 를 보이지만, 그만큼 [[overfitting]] 에 취약한 편이다.

자식 노드 중 더 loss 가 높은 노드가 split 대상으로 선택된다.

* The trees in LightGBM have a  [leaf-wise](https://lightgbm.readthedocs.io/en/latest/Features.html#leaf-wise-best-first-tree-growth) growth, rather than a level-wise growth. Leaf-wise method allows the trees to converge faster but the chance of over-fitting increases.
* 작은 데이터에서는 잘 동작하지 않으며, 대용량 데이터에서 적합하다. You should be aware that for small datasets (<10000 records) lightGBM may not be the best choice. Tuning lightgbm parameters may not help you there. 

# D) Vs. XGBoost

1. Runtime: LightGBM 은 histogram 기반 최적화를 사용하기 때문에 XGBoost 보다 빠르다. 왜냐하면 이를 통해 각 트리를 세우는데 필요한 데이터가 적게 필요하기 때문이다. 이러한 특징 때문에 어떤 경우는 학습 시간이 몇배 차이나기도 한다.
2. Scalability: LightGBM 은 매우 큰 데이터셋에서 확장성이 좋다 (millions of examples 수준). 또한 communication overhead 없이 클러스터에서 분산 학습이 가능하다.
3. Performance: LightGBM 은 노드를 나눌때 greedy 방식을 사용하기 때문에 성능이 좋다.

# E) Boosting Methods

크게 GBDT, DART, 그리고 GOSS 가 있다.

# F) Lesson Learned

1. `lgb.LGBMClassifier` 클래스로 분류 모델 학습 가능. 이 경우 `lgb.Dataset` 인스턴스를 사용하지 않는다. DataFrame 을 입력으로 주는게 맞는듯

# G) Hyperparameter Tuning

* `class_weight`: `balanced` 를 사용하면 유리한듯
* `max_depth`:
* `n_estimators`:

# H) Related

[[Gradient Boosting Machine]], [[machine_learning/Extreme Gradient Boosting|XGBoost]]

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

* [Understanding LightGBM Parameters (and How to Tune Them) - neptune.ai](https://neptune.ai/blog/lightgbm-parameters-guide)
