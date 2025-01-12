---
layout: post
title: ML Recap - Linear Regression 
date: 2025-01-12 21:00:00
giscus_comments: true
categories: ml-fundamentals
toc:
  beginning: true
  sidebar: left
tags: machine-learning linear-regression
---


## Lasso Regression

Lasso 는 L1 정규화(Regularization) 라고 불리는 sparse 한 선형 회귀 모델이다.

이 모델의 특징으로는 variable selection 과 regularization 을 통해 모델의 예측 정확도와 interpretability 을 향상시키는 것이다.

아래는 regression 의 cost function $J(\mathbf{w})$ 이다. 이 함수를 최소화 하는 계수 $\mathbf{w}$ 를 찾는 것이 목적이다.

$$
J(\mathbf{w})=\frac{1}{N} \sum_{i=1}^N\left(y_i-\mathbf{w}^T \mathbf{x}_i\right)^2+\lambda \sum_{j=1}^m\left|w_j\right|
$$

regression parameter $\lambda$ 는 성능에 큰 영향을 미친다. 아래 그림과 같이 $\lambda$ 가 커질수록 모델의 bias 가 커지며, 반대로 모델의 variance 는 작아진다.

![20250112223049](https://i.imgur.com/wYVpKQH.png){: width="85%"}

### Limitation

Lasso 는 독립 변수들 간에 강한 상관관계가 존재하는 현상인 다중공선성(multicollinearity) 문제를 해결하기엔 한계가 있다. 왜냐하면 lasso 는 다중공선성에 관련된 변수들 중 임의로 하나만 살려두기 때문에, 모델 해석에 어려움을 줄 수 있기 때문이다 (동시에 성능 하락은 덤).

## Ridge Regression

Ridge regression 은 과적합을 방지하기 위해 회귀 계수(coefficient)의 제곱의 합을 작게 만들어 준다. 하지만, 이 방식은 변수 선택을 하지 않기 때문에 모델을 해석하는데 어려움이 있다.

반대로 Lasso 는 회귀 계수의 절대값의 합을 작게 만들어 준다. 이 방식은 특정 계수를 0으로 만들어서 예측에 영향을 가지 않도록 만들기 때문에 변수 선택 과정에서 이점이 있다.

아래는 Lasso 와 Ridge 모델이 두개의 parameter $\beta_1$ 과 $\beta_2$ 로 표현될때, 각 방식 별 가능한한 parameter 의 조합을 나타낸 그래프이다.

![20250112221358](https://i.imgur.com/vDcn664.png){: width="80%"}

### As classification

Ridge 방식은 regression 뿐만 아니라 분류 task 를 해결하는데도 자주 사용되는데, 종종 Logistic Regression 보다 선호되는 경우가 많다. 왜냐하면 계수를 찾기위해서는 아래와 같이 projection matrix 를 한번만 계산하면 되기 때문이다.

$$
\hat{\beta}_{\text {ridge }}=\left(X^T X+\lambda I\right)^{-1} X^T y
$$

그래서 계산 효율적인 특성이 있으며 대규모 데이터셋을 처리할때 자주 사용된다. 또한 accuracy 나 recall 에서도 SVM 이나 Logistic Regression 대비해서 유사한 결과를 얻는 사례가 많다.

## ElasticNet

ElasticNet 은 선형 회귀 모델에서 L1 regularization (Lasso) 과 L2 regularization (Ridge) 를 결합한 정규화 기법이다. 이 모델은 계수의 절대값의 합과 제곱의 합을 작게 만들어 준다.

$$
J(\mathbf{w})=\frac{1}{N} \sum_{i=1}^N\left(y_i-\mathbf{w}^T \mathbf{x}_i\right)^2+\alpha\left(r \sum_{i=1}^n\left|\mathbf{w}_i\right|+\left(1-r\right) \sum_{i=1}^n \mathbf{w}_i^2\right)
$$

- $\alpha$ 는 regularization 의 강도를 조절하는 매개변수이다.
- $r$ 은 L1 과 L2 의 비율을 조절하는 매개변수이다 (0 < $r$ < 1). $r$ 이 0 에 가까울수록 L2 정규화가 강해지고, 1 에 가까울수록 L1 정규화가 강해진다.

ElasticNet 은 상관관계가 높은 변수들이 함께 선택되거나 제외되는 그룹화 효과(grouping effect)를 보인다. 그래서 ElasticNet은 여러 특성(feature)들이 서로 상관관계가 있을 때 유용하다. Lasso는 이러한 특성들 중 하나를 무작위로 선택하는 경향이 있는 반면, ElasticNet은 이들 모두를 선택하는 경향이 있다.

### Limitation

L1 과 L2 비율을 조절하는 과정이 필요하므로, 기존의 lasso 나 ridige 보다 튜닝이 복잡해지거나 계산 비용이 증가할 수 있다. 또한 L1 방식과 달리 모델의 해석이 좀 더 복잡해지는 것도 단점으로 생각할 수 있다.

## skicit-learn 을 통한 구현

[LassoCV](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LassoCV.html) 는 cross-validation 을 통해 최적의 $\alpha$ 를 찾아서 회귀 모델을 튜닝해준다. 여기서는 regularization parameter $\alpha$ 로 표현한다.

이 외에도 LogisticRegressionCV, ElasticNetCV 도 있다.

```python
import numpy as np
from sklearn import linear_model
from sklearn.datasets import load_diabetes

X, y = load_diabetes(return_X_y=True)
reg = linear_model.LassoCV(alphas=np.logspace(-6, 6, 13), cv=5)
reg.fit(X, y)
reg.alpha_
```

위 코드는 아래 그래프처럼 여러 fold 에 대한 MSE 를 계산하고, 가능한 alpha 값들 중 최적의 alpha 값을 찾아준다.

![20250112225530](https://i.imgur.com/IPGrB1d.png){: width="60%"}

## References

- [Lasso Regression (wikipedia)](https://en.wikipedia.org/wiki/Lasso_(statistics))
- [Using cross-validation (sklearn)](https://scikit-learn.org/stable/modules/linear_model.html#using-cross-validation)
