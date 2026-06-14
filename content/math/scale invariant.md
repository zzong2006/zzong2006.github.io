---
tags: ["machine_learning", "linear_regression"]
---

# Scale Invariant ?

기계 학습 방식에서 scale invariant 란, feature 들을 rescaling 하는 경우에도 prediction 에 영향을 주지 않는 특성을 의미한다.

여기서 rescaling 이란 각 column 에 서로 다른 non-zero 값을 곱하는 것을 의미한다. 예를 들어 센치미터를 미터로 변환한다고 해서 예측값이 달라지지 않는다는 것이다.

# Related Methods

## OLS

[[ordinary least squares|OLS]] 는 scale invariant 하다.

예를 들어 $\hat{y}=w_{0}+w_{1} x_{1}+w_{2} x_{2}$ 이런 모델에서 $x_{1}$ 를 $x_{1}^{\prime}=x_{1} / 2$ 와 같이 바꾼다고 하더라도 이 $\hat{y}=w_{0}+2 w_{1} x_{1}^{\prime}+w_{2} x_{2}$ 모델은 동일한 예측 값을 내놓는다. $x_{1}^{\prime}$ 가 절반으로 줄어든 형태이므로, 그만큼 coefficient 가 두배로 커지면 된다.

## Linear Regression with Regularization

[[ridge regression]] & [[lasso regression]] (당연히 [[elastic net]] 도 포함하여), 이들은 scale invariant 하지 않다.

L0-regularization regression 의 경우는 scale invariant 하다.

## PCA

[[machine_learning/Principal Component Analysis|PCA]] 는 scale invariant 하지 않다.

# Related

# References

* https://stats.stackexchange.com/questions/519450/why-the-ridge-regression-is-not-scale-invariant
* 
