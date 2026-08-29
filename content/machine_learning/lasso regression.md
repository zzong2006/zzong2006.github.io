---
title: "lasso regression"
tags:
  - linear_regression
  - machine_learning
aliases: []
---

# A) Lasso Regression ?

[[ridge regression]] 과 달리 L1-[[norm]] 을 regularization term 으로 사용하는 linear 모델이다.  

$$
\sum_{i=1}^{n}\left(y_{i}-\beta_{0}-\sum_{j=1}^{p} \beta_{j} x_{i j}\right)^{2}+\lambda \sum_{j=1}^{p}\left|\beta_{j}\right|=\mathrm{RSS}+\lambda \sum_{j=1}^{p}\left|\beta_{j}\right|
$$

주로 모델의 가중치 $\hat{\boldsymbol{w}}$ 가 sparse 하기 원할 때 사용한다 (weight 의 일부가 완벽히 $0$ 이 되길 원하는 경우).

# B) Application

## B.1) Feature Selection

$f(\boldsymbol{x} ; \boldsymbol{w})=\sum_{d=1}^{D} w_{d} x_{d}$ 를 계산할 때, $w_{d}=0$ 에 해당하는 feature $x_{d}$ 를 버리는 방향으로 진행하면 좋다.

# C) Related

[[elastic net]]

# D) References
