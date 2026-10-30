---
title: "Learning-to-Rank"
aliases: ["LTR"]
tags:
  - learning_to_rank
  - machine_learning
---

# A) Learning-to-Rank ?

Learning-to-rank(LTR) 은 검색어 하나에 딸린 문서들처럼, 주어진 아이템 목록의 가장 좋은 순서를 기계학습으로 찾는 방법이다.

## A.1) LTR Methods

순위를 만드는 방법은 라벨을 쓰는지에 따라 둘로 나뉜다.

1. **라벨로 학습한다**: 관련도 라벨이나 클릭 로그로 점수 함수를 학습한다. RankNet, LambdaRank, LambdaMART 가 여기에 속한다.
2. **라벨 없이 여러 순위를 합친다**: BM25 결과와 벡터 검색 결과처럼 이미 있는 순위 목록 여러 개를 정해진 규칙으로 합친다. [[Reciprocal Rank Fusion]] (RRF), Condorcet, CombMNZ 가 있다. 엄밀히는 학습이 아니라 rank fusion 이다.

# B) Evaluation

총 세가지 metrics 을 활용해서 Learning-to-Rank 방식의 성능을 측정한다

* [[recommendation_system/mean reciprocal rank|MRR]]: Mean Reciprocal Rank
* [[mean average precision|MAP]]: Mean Average Precision
* [[Normalized Discounted Cumulative Gain|NDCG]]: Normalized Discounted Cumulative Gain

# C) MAB 와 비교

LTR 을 [[Multi-Armed Bandit|MAB]] 처럼 보면 조합(combinatorial) 문제가 된다. 행동(문서) 집합에서 보상을 가장 크게 하는 순서 있는 부분집합(목록)을 고르는 문제다.

bandit 설정에서는 고른 목록 하나에 피드백(클릭 여부 등)이 하나만 돌아온다. 목록의 어느 문서 때문에 클릭이 났는지 따로 알 수 없으므로, 문서마다 라벨이 붙은 일반 LTR 보다 학습 신호가 적다.

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
| Pairwise | 문서 쌍의 점수 차 $s_i - s_j$ | "어느 쪽이 더 관련 있는가" 라는 상대 정보 | [[RankNet]], [[LambdaRank]], [[LambdaMART]] |
| Listwise | 한 쿼리의 점수 목록 전체 | 쿼리별 관련도 목록 | ListNet, ListMLE |

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
