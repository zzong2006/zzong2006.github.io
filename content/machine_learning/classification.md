---
title: "classification"
tags: ["classification"]
aliases: ["분류"]
---

# A) Classification ?

* 일반적인 classification 문제: $y\in{0,1}$ ($0$ 은 Negative Class, $1$ 은 Positive Class)
	* E-mail: 스팸 yes or no?
	* 온라인 거래: 사기 yes or no?
	* Tumor: 양성 or 음성?

# B) Multi-class Classification

분류하려는 class 가 3 개 이상인 경우의 분류 문제를 의미하며, **정답은 한 개의 class 밖에 없다**. 2 개 이하인 경우는 binary-class classification 으로 부른다.

Categorical [[cross-entropy]] 를 loss function 으로 사용한다.

## B.1) Multi-class Loss

**loss function**

$$
\log \operatorname{loss}=-\frac{1}{N} \sum_{i=1}^{N} \sum_{j=1}^{M} y_{i j} \log \left(p_{i j}\right)
$$

* $N$: test set 의 총 개수
* $M$: 클래스 label 개수
* $y_{ij} \in (1, 0)$: $i$ 번째 observation 에 $j$ class 가 속해있는지 여부
* $p_{ij} \in [0, 1]$: $i$ 번째 observation 이 $j$ class 에 속할 확률
	* log 를 씌우므로 $0$ 또는 $1$ 이 되는 것을 막기 위해 작은 값으로 대체한다: $\max \left(\min \left(p, 1-10^{-15}\right), 10^{-15}\right)$

# C) Multi-label Classification

한 데이터에 대해서 맞춰야 하는 label 의 개수가 2 개 이상인 분류 문제를 의미한다.

![|600](https://i.imgur.com/ehTDNls.png)

각 class 에 대한 binary cross-entropy 들의 합을 loss function 으로 사용한다.

예시로, 위 그림에서 target 1 과 prediction 0.6 에 대한 binary cross-entory 를 계산하고, 그 다음으로 target 0 과 prediction 0.7 에 대한 binary cross-entory 를 계산.. etc.

# D) ML Methods for Classification

1. Linear Classifier ([[logistic regression]], linear [[support vector machine|SVM]])
2. Kernel Machines ([[kernel trick]] 을 사용한 SVMs)
3. deep learning 계열의 [[neural network]]
4. [[Decision Tree]] 와 ensemble 기반의 tree ([[random forest]], [[Gradient Boosting Machine|GBM]])
5. [[k-Nearest Neighbors|KNN]] 또는 [[Naïve Bayes]] 와 같은 Naive 한 기술들

# E) References

* https://towardsdatascience.com/cross-entropy-for-classification-d98e7f974451
