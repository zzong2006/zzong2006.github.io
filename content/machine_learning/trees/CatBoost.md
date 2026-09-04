---
title: "CatBoost"
aliases: []
tags:
  - GBM
  - ensemble
---

# 1. What is the CatBoost?

CatBoost is a boosting algorithm that can handle categorical variables in the data.

# 2. Hyperparameter Tuning

```python
params={
    'iterations':10000,
    'learning_rate':0.005,
    'early_stopping_rounds':1000,
    'auto_class_weights':'Balanced',
    'loss_function':'MultiClass',
    'eval_metric':'MultiClass:use_weights=True',
    'random_seed':42,
    'use_best_model':True,
    'l2_leaf_reg':1,
    'max_ctr_complexity':15,
    'max_depth':10,
    "grow_policy":'Lossguide',
    'max_leaves':64,
    "min_data_in_leaf":40,
}
```

1. colsample_bylevel
2. boosting_type
3. `bootstrap_type`
트리를 split 할 때 영향을 미치는 parameter 이다.

4. depth
