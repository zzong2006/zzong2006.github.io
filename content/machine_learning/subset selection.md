---
title: "subset selection"
---


# A) Subset Selection ?

$p$ 개의 변수들 (predictors) 중 일부를 고려한 예측 모델들의 집합을 만들어 놓고, 가장 좋은 모델을 선택하는 방법

## A.1) Best Subset Selection

## A.2) Stepwise Selection

### A.2.1) Forward Stepwise Selection

Forward stepwise selection is a computationally eﬃcient alternative to best subset selection.

### A.2.2) Backward Stepwise Selection

# B) Choosing the Optimal Model

모든 변수 (predictor) 들을 고려한 모델이 가장 [[residual sum of squares|RSS]] 값이 작고, [[R-squared]] 값은 가장 크다. 왜냐하면 모든 변수는 각각 학습 에러와 연관이 있기 때문이다. 그래서 이 둘은 서로 다른 변수로 구성된 모델 집합 중 가장 좋은 모델을 고를때 적합한 metrics 이 아니다.

가장 좋은 모델을 선택할 때는 가장 낮은 test error 를 가진 모델을 선택해야 한다 ([[cross-validation]] 이나 validation-set 을 만들어서 테스트).

# C) Related

# D) References

[[Introduction to Statistical Learning|ISL]] - 6.1.
