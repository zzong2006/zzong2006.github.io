---
title: "permutation importance"
tags: ["feature_engineering"]
---

# A) Permutation Importance ?

Permutation Importance 는 feature importance 를 측정하기 위한 방법으로,모델을 학습시킨 뒤 특정 feature 의 데이터를 shuffle 했을 때, 검증 데이터 셋에 대한 예측성능을 확인하고 feature importance 를 계산한다.

즉, shuffle 했을 때 모델의 성능이 떨어지면, 중요한 feature 인거고 성능이 그대로거나, 좋아지면 중요하지 않은 feature 이다.

Permutation Feature Importance 의 중요한 특징이자 장점으로는 재학습시킬 필요가 없다는 것이다. 특정 Feature 를 제거하고 모델을 재학습하지 않고, feature 의 값들을 무작위로 섞어서 (permutation) 그 feature 를 노이즈로 만든다.

# B) Related

# C) References

* https://explained.ai/rf-importance/index.html
