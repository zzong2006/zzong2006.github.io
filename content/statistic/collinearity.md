---
tags: ["machine_learning", "statistic", "linear_regression"]
aliases: ["공선성", "다중공선성"]
---

# A) Collinearity ?

[[explanatory variable|predictor variable]] 들이 완벽하거나 거의 완벽에 가까운 상관성을 갖는다고 할 때, [[regression]] 은 다중공선성 문제를 가지고 있다고 말할 수 있다.

회귀 분석에서는 다중공선성 문제가 사라질 때까지 변수를 제거해야 한다. 공선성이 문제가 되는 이유는 1) 회귀 모델에서 계산하는 추정 값의 [[standard error|표준 오차]] 가 커지고, 2) 회귀 분석의 결과 해석을 어렵게 만들기 때문이다.

반대로, [[Decision Tree]] 나 [[k-Nearest Neighbors|KNN]] 과 같은 방식에서는 공선성이 그다지 문제가 되진 않는다. 그래서 공선성을 피하기 위해 [[random forest]] 또는 [[Gradient Boosting Machine|GBM]] 을 통해 최적의 상호작용 항들을 걸러내는 전략을 사용할 수 있다 (벌점을 부여하는 방식의 회귀 방식).

## A.1) 다중공선성 발생 원인

* 오류로 인해 한 변수가 여러번 포함된 경우
* [[machine_learning/NLP/One Hot Encoding]] 을 통해 $P-1$ 개가 아닌 $P$ 개의 가변수가 만들어진 경우
* 두 변수가 서로 거의 완벽하게 상관성이 있는 경우

# B) 완전 다중공선성

완전 다중공선성은 한 예측 변수가 다른 변수들의 선형결합으로 표현된다는 것을 의미한다.

# C) References
