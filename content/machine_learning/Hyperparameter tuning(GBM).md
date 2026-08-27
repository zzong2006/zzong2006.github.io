---
tags: ["GBM"]
---

# A) LightGBM

[[LightGBM]] 에서는 어떤 파라매터를 주로 튜닝해야 하는가?

대회 코드를 살펴보면서 사람들이 튜닝하는 파라매터를 적어봤다. 괄호안 숫자는 대회 별 참조된 횟수를 의미한다. 즉, 많이 참조할수록 높은 값이다.

1. `lambda_l1` (3)
2. `lambda_l2` (3)
3. `num_leaves` (3)
4. `learning_rate` (3)
5. `num_leaves` (2)
6. `feature_fraction` (3)
7. `bagging_fraction` (3)
8. `bagging_freq` (2)
9. `n_estimators` (2)
10. `early_stopping_round`
11. `min_child_samples` (3)
12. `max_depth`
13. `subsample`
14. `is_unbalance` : class 분류 문제를 풀때 클래스가 불균형한 상태인 경우 사용.
	1. `scale_pos_weight` 와 같이 사용하면 안된다.
	2. 전체적인 모델의 퍼포먼스를 향상시킬 순 있지만, 개별적인 class 의 확률을 계산하는데는 퍼포먼스를 떨어트릴 수 있다는 이슈가 있다고 한다.
	3. 이 옵션을 `true` 로 설정하면서 dataset 에 weight 를 설정할 수 있다. 보다 섬세한 설정 (fine-grained control) 을 위해서라고 한다 (참고: [ICR: optimized LGB [LB 0.17] - [CV 0.18] | Kaggle](https://www.kaggle.com/code/tauilabdelilah/icr-optimized-lgb-lb-0-17-cv-0-18/comments#2276276)).
15. `scale_pos_weight`: positive class 의 가중치 weight
	1. 이것도 `is_unbalance` 와 비슷한 부작용이 있다고 한다.

# B) [[Extreme Gradient Boosting|XGBoost]]

* `learning_rate`
* `max_depth`
* `colsample_bytree`
* `subsample`
* `eta`
* `gamma`
* `scale_pos_weight` : 클래스 데이터 불균형 관찰시 사용하는 파라매터

# C) [[CatBoost]]

* `learning_rate`
* `iterations`
* `depth`
* `colsample_bylevel`
* `subsample`
* `l2_leaf_reg`
* `early_stopping_rounds`
* `auto_class_weights` : 클래스 데이터 불균형 관찰시 사용하는 파라매터

# D) Notes

Optuna 에서 수행한 벤치마크에 따르면, 가장 중요한 parameter 는 `feature_fraction`, `num_leaves`, 또는 `bagging_fraction` 이라고 한다.

중요한 정도는 parameter 의 값이 변하면 그에 따른 validation score 역시 심하게 변할수록 중요하다고 판단하는 것 같다.

# E) References

* [LightGBM Tuner: New Optuna Integration for Hyperparameter Optimization | by Kohei Ozaki | Optuna | Medium](https://medium.com/optuna/lightgbm-tuner-new-optuna-integration-for-hyperparameter-optimization-8b7095e99258)
