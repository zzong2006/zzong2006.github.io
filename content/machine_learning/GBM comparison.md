---
tags: ["machine_learning", "tabular"]
---

# 1. CatBoost vs. LightGBM vs. XGBoost

여러 [[Gradient Boosting Machine|gradient boosting]] 알고리즘들이 있는데 이 중에서 뭘 선택해야 하는가?

아래는 [[CatBoost]], [[LightGBM]], [[Extreme Gradient Boosting|XGBoost]] 이 세개의 알고리즘을 비교한 테이블이다.

![](https://i.imgur.com/343lgVm.png)

# 2. Charateristics

boosting 알고리즘이 가지는 특징들에 대해 말해보자.

## 2.1. Tree Symmetry

[[CatBoost]] 는 symmetric tree 또는 balanced tree 를 가진다. 이는 모든 노드가 동일한 분할 조건 (splitting condition) 을 가져서 트리가 같은 depth 를 가질 수 있음을 의미한다.
반대로 [[LightGBM]] 과 XGBoost 는 asymmetric tree 다.

LightGBM 과 XGBoost 는 서로 다른 비대칭 트리를 가진다. LightGBM 은 leaf-wise 방향 (vertical) 으로 성장하고, XGBoost 는 level-wise 방향 (horizontal) 으로 성장한다.

![](https://i.imgur.com/fjizFzB.png)

## 2.2. Splitting Method

어떤식으로 트리의 분기가 진행되는지가 다르다.

CatBoost 는 greedy method 를 사용한다. feature-split 을 위해 가능한 모든 후보군들을 나열하여 leaf 에 할당하고 가장 작은 패널티를 보이는 split 을 선택한다.

LightGBM 은 gradient 기반 one-side sampling (GOSS) 를 사용한다.

# 3. Related

# 4. References
