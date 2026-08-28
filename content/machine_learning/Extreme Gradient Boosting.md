---
title: "Extreme Gradient Boosting"
tags: ["ensemble"]
aliases: ["XGBoost"]
---

# A) Extreme Gradient Boosting ?

XGBoost is another popular [[machine_learning/boosting]] algorithm, and XGBoost is simply an improvised version of the [[Gradient Boosting Machine|GBM]] algorithm.

# B) Vs. GBM

## B.1) 차이점

노드 레벨에서 병렬 전처리를 수행하기 때문에 GBM 보다는 훨씬 빠르게 학습한다.

[[overfitting]] 방지와 전반적인 performance 향상을 위해 다양한 regularization 방식들이 차별적으로 적용되어 있다.  
missing value 들을 스스로 처리함

공통점

* Sequential learning
* Trying to correct the errors of the previous trees

# C) Hyperparameter Tuning

* `scale_pos_weight` ?

```Python
xgb.XGBClassifier(max_depth = 2, n_estimators = 95, random_state = 73, scale_pos_weight = 4.71)
```

# D) References
