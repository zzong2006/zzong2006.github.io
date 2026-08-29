---
title: "RankNet"
tags: learning_to_rank
aliases: []
---

# A) RankNet ?

[[Learning-to-Rank]] 를 문서 쌍의 대소 비교 문제로 바꿔서 푸는 방법이다. 2005년 Microsoft Research 에서 제안했고, 이후 [[LambdaRank]] 와 [[LambdaMART]] 로 이어지는 계열의 출발점이다.

# B) 쌍으로 바꾸는 이유

문서마다 "적합도 점수" 를 회귀로 맞추는 방식(pointwise)은 절대 점수의 눈금에 민감하다. 사람이 매긴 등급은 질의마다 기준이 흔들리는데, 정작 필요한 것은 절대값이 아니라 순서다.

RankNet 은 문서 하나가 아니라 문서 쌍 $(i, j)$ 를 학습 단위로 삼는다. $i$ 가 $j$ 보다 위에 와야 한다는 사실만 있으면 되므로, 등급의 눈금이 달라도 상관없다.

# C) 학습

모델 $f$ 가 각 문서에 점수 $s_i = f(x_i)$ 를 준다. 두 점수의 차이를 로지스틱 함수에 넣어 "$i$ 가 $j$ 보다 위일 확률" 로 바꾼다.

$$
P_{ij} = \frac{1}{1 + e^{-\sigma(s_i - s_j)}}
$$

목표 확률 $\bar{P}_{ij}$ 는 실제로 $i$ 가 위면 1, $j$ 가 위면 0, 동급이면 0.5 다. 손실은 이 둘 사이의 [[cross-entropy]] 다.

$$
C_{ij} = -\bar{P}_{ij}\log P_{ij} - (1 - \bar{P}_{ij})\log (1 - P_{ij})
$$

| 기호 | 의미 |
| --- | --- |
| $x_i$ | 문서 $i$ 의 특징 벡터 (질의-문서 쌍에서 뽑는다) |
| $s_i$ | 모델이 문서 $i$ 에 준 점수 |
| $\sigma$ | 점수 차이를 확률로 바꿀 때의 기울기 |
| $\bar{P}_{ij}$ | 정답 순서로부터 정해지는 목표 확률 |

점수 차이만 쓰므로 모든 문서 점수에 같은 상수를 더해도 손실이 변하지 않는다. 모델이 절대 점수의 위치가 아니라 상대 순서만 학습한다는 뜻이다.

# D) 한계와 다음 단계

모든 문서 쌍을 동등하게 취급하는 것이 약점이다. 1위와 2위를 뒤집는 것과 100위와 101위를 뒤집는 것이 손실에 같은 크기로 들어가는데, 실제 검색 품질에서 두 실수의 무게는 전혀 다르다. cross-entropy 를 줄이는 것과 [[Normalized Discounted Cumulative Gain|NDCG]] 를 올리는 것이 어긋나는 지점이다.

LambdaRank 는 이 gradient 에 순위 지표의 변화량을 곱해 상위권 쌍에 더 큰 무게를 실어 이 간극을 메운다.

# E) References

* [\[ICML 2005\] Learning to Rank using Gradient Descent](https://www.microsoft.com/en-us/research/publication/learning-to-rank-using-gradient-descent/)
