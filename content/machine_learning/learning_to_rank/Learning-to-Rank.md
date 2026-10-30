---
title: "Learning-to-Rank"
aliases: ["LTR"]
tags:
  - learning_to_rank
  - machine_learning
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

query-document input $x_{i}=\left(q, d_{i}\right)$ 에 대하여 true relevance score $y_i$ 가 존재하고, 이를 추정하려는 predicted score $s_{i}=f\left(x_{i}\right)$ 가 출력값으로 있다.

이 score 를 계산하기 위해 일반적으로 [[Decision Tree]] 또는 [[neural network]] 등 을 활용한다.

## D.3) Loss 단위에 따른 구분: Pointwise · Pairwise · Listwise

LTR 방법을 pointwise · pairwise · listwise 로 나누는 기준은 **모델이 받는 입력이 아니라 loss 가 묶어 보는 단위** 다. 세 방식 모두 모델은 문서마다 따로 점수 $s_i = f(q, d_i)$ 를 낸다. 서빙할 때도 똑같이 문서별 점수를 내고 그 점수로 정렬한다. 다른 것은 학습할 때 loss 한 항이 문서 하나를 보는지, 문서 둘을 비교하는지, 목록 전체를 보는지다.

![[img-7acafaf712.png]]

| 방식 | loss 한 항이 보는 것 | 필요한 라벨 | 대표 알고리즘 |
| --- | --- | --- | --- |
| Pointwise | 문서 하나의 $(s_i, y_i)$ | 문서별 절대 점수나 클릭 여부 | 회귀, 이진 분류 (CTR 모델) |
| Pairwise | 문서 쌍의 점수 차 $s_i - s_j$ | "어느 쪽이 더 관련 있는가" 라는 상대 정보 | [[RankNet]], [[LambdaRank]] |
| Listwise | 한 쿼리의 점수 목록 전체 | 쿼리별 관련도 목록 | ListNet, ListMLE, [[LambdaMART]] |

[[Re-ranking]] 에서도 point-wise · list-wise 라는 말을 쓰지만 그쪽은 **추론할 때 모델에 무엇을 넣는가** 를 가리킨다. cross-encoder 에 문서를 하나씩 넣으면 point-wise, LLM 프롬프트에 후보 목록을 통째로 넣으면 list-wise 다. 같은 단어가 학습 loss 와 추론 입력이라는 서로 다른 축에 쓰인다.

### D.3.1) Pointwise

문서마다 loss 를 계산해 더한다. 관련도 등급이 있으면 회귀로, 클릭 여부만 있으면 이진 분류로 푼다. 검색 랭킹에 클릭 예측 모델을 그대로 쓰는 경우가 여기에 해당한다.

$$
L = \sum_i \ell(s_i, y_i)
$$

구현이 가장 단순하고 기존 분류·회귀 도구를 그대로 쓸 수 있다. 대신 loss 가 같은 쿼리의 다른 문서를 보지 않는다. 순위 지표는 한 쿼리 안의 순서만 보므로, 쿼리 A 의 점수가 모두 0.9 근처이고 쿼리 B 의 점수가 모두 0.1 근처여도 각 쿼리 안의 순서만 맞으면 지표는 같다. pointwise loss 는 점수 하나하나를 라벨 값에 맞추느라, 이렇게 순위와 상관없는 절대값에도 학습 신호를 쓴다.

### D.3.2) Pairwise

관련도가 다른 두 문서 $(i, j)$ 에 대해 $y_i > y_j$ 이면 $s_i > s_j$ 가 되도록 학습한다. 두 문서 중 어느 쪽이 더 관련 있는지를 맞히는 이진 분류와 비슷하다. RankNet 은 이 확률을 점수 차의 sigmoid 로 둔다.

$$
L = \sum_{(i,j):\, y_i > y_j} \log\left(1 + e^{-\sigma (s_i - s_j)}\right)
$$

정확한 점수는 몰라도 "이 문서가 저 문서보다 낫다" 는 상대 정보만 있으면 학습할 수 있다. 클릭 로그에서 "건너뛰고 아래를 클릭했다" 같은 신호가 이런 형태다. 한계는 모든 쌍을 같은 무게로 본다는 점이다. 1·2 위 쌍과 50·51 위 쌍을 똑같이 고치는데, 사용자는 위쪽만 본다. [[LambdaRank]] 는 쌍마다 NDCG 변화량을 곱해 이 문제를 고친다.

### D.3.3) Listwise

한 쿼리의 점수 목록 전체를 보고 loss 하나를 만든다. ListNet(Cao et al., ICML 2007)은 점수와 라벨을 각각 [[softmax function|softmax]] 로 "이 문서가 1 위일 확률" 분포로 바꾼 뒤 두 분포의 cross-entropy 를 줄인다.

$$
P_s(i) = \frac{e^{s_i}}{\sum_k e^{s_k}}, \qquad L = -\sum_i P_y(i) \log P_s(i)
$$

$P_y$ 는 라벨 $y_i$ 에 같은 softmax 를 적용한 분포다. 분모에 같은 쿼리의 모든 문서가 들어가므로, 문서 하나의 점수가 오르면 나머지 문서의 확률이 함께 내려간다. 목록 안의 상대적인 자리를 직접 학습하는 셈이다.

[[LambdaRank]] 와 [[LambdaMART]] 를 어디에 넣을지는 문헌마다 다르다. 둘은 같은 $\lambda$ 를 쓰고, $\lambda$ 는 문서 쌍에서 계산하므로 형태는 pairwise 다. 그런데 쌍의 가중치 $\lvert \Delta \text{NDCG} \rvert$ 는 목록 전체의 현재 순위를 알아야 구할 수 있어서 listwise 로 분류하기도 한다.

# E) References

* https://towardsdatascience.com/learning-to-rank-a-complete-guide-to-ranking-using-machine-learning-4c9688d370d4
* [Learning to Rank: From Pairwise Approach to Listwise Approach (Cao et al., ICML 2007)](https://www.microsoft.com/en-us/research/publication/learning-to-rank-from-pairwise-approach-to-listwise-approach/)
* [From RankNet to LambdaRank to LambdaMART: An Overview (Burges, 2010)](https://www.microsoft.com/en-us/research/publication/from-ranknet-to-lambdarank-to-lambdamart-an-overview/)
