---
tags: ["learning_to_rank", "machine_learning"]
aliases: ["LTR"]
---

# A) Learning-to-Rank ?

Learning-to-rank(LTR) 은 기계학습 알고리즘을 통해 주어진 아이템들에 대한 optimal ordering 을 찾는 방식

## A.1) LTR Methods

LTR 에는 두가지 방법이 있다.

1. Supervised methods: 이미 정해진 순서를 학습하는 방법으로, 관련 알고리즘으로는 RankNet, LambdaRank, LambdaMART 가 있다.
2. unsupervised methods: 정해지지 않은 순서를 학습하는 방법으로, 관련 알고리즘은 [[Reciprocal Rank Fusion]] (RRF), Condorcet, CombMNZ 가 있다.

# B) Evaluation

총 세가지 metrics 을 활용해서 Learning-to-Rank 방식의 성능을 측정한다

* [[recommendation_system/mean reciprocal rank|MRR]]: Mean Reciprocal Rank
* [[mean average precision|MAP]]: Mean Average Precision
* [[Normalized Discounted Cumulative Gain|NDCG]]: Normalized Discounted Cumulative Gain

# C) MAB 와 비교

LTR 은 combinatorial 학습 문제로 볼 수 있는데, 이는 a set of actions 이 주어졌을 때 reward 를 최대화할 수 있는 ordered subset 을 선택한다.

일반적인 bandit feedback(불완전한 피드백) 이 포함된 combinatorial 문제는 선택된 actions 의 subset 당 하나의 feedback(e.g., click/no-click) 만 존재한다.

# D) Machine Learning Models for LTR

## D.1) Input

query $q$ 와 relevance 측정을 위한 $n$ 개의 documents $D=\left\{d_{1}, \ldots, d_{n}\right\}$ 가 주어지는데, 이때 $x_{i}=\left(q, d_{i}\right)$ 가 모델의 입력값이 된다.

## D.2) Output

query-document input $x_{i}=\left(q, d_{i}\right)$ 에 대하여 true relevance score $y_i$ 를 가 존재하고, 이를 추정하려는 predicted score $s_{i}=f\left(x_{i}\right)$ 가 출력값으로 있다.

이 score 를 계산하기 위해 일반적으로 [[Decision Tree]] 또는 [[neural network]] 등 을 활용한다.

## D.3) Loss Function

### D.3.1) Pointwise Methods

각 document $d_i$ 에 정의된 loss term 의 합을 계산하는 방식으로, loss 계산을 위해 $y_i$ 와 $s_i$ 의 차이 (거리) 정도를 계산한다. 이는 [[regression]] 문제와 비슷하다.

* [[Subset Ranking]]

### D.3.2) Pairwise Methods

각 document pair $d_i$ 와 $d_j$ 간 정의된 loss term 의 합을 계산한다. 이 모델의 학습 목적은 $y_i > y_j$ 인 경우 $s_i > s_j$ 임을 예측할 수 있는지를 학습하는 것에 있다 (두 문서 중 어느것이 더 관련있는지). 이는 binary [[classification]] 문제와 비슷하다.

이 방식은 정확한 true score $y$ 를 모르지만, 상대적인 정보를 알고 있을 때 유용하다 (e.g., 어떤 document 가 다른 document 보다는 relevant 함).

* [[LambdaRank]]
* [[RankNet]]

### D.3.3) Listwise Methods

documents 의 전체 리스트에 대해서 loss 를 바로 계산한다.

* [[ListNet]]
* [[LambdaMART]] (2019 년 기준 SOTA 성능)

### D.3.4) 정리

![|800](https://i.imgur.com/QqrBPOp.png)

# E) References

* https://towardsdatascience.com/learning-to-rank-a-complete-guide-to-ranking-using-machine-learning-4c9688d370d4
