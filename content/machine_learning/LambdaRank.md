---
title: "LambdaRank"
tags: learning_to_rank
aliases: []
---

# A) LambdaRank ?

[[Learning-to-Rank]] 알고리즘으로, [[RankNet]] 의 gradient 에 순위 지표의 변화량을 곱해서 "지표를 많이 움직이는 쌍" 에 학습을 집중시키는 방법이다. 손실 함수를 정의하지 않고 gradient 만 직접 정의한 것이 특징이라, 이 gradient 를 $\lambda$ 라고 부르는 데서 이름이 왔다.

# B) 왜 손실 함수 대신 gradient 인가

순위 품질은 [[Normalized Discounted Cumulative Gain|NDCG]] 같은 지표로 잰다. 그런데 이런 지표는 문서의 순위 위치에만 의존하므로, 모델 점수를 아주 조금 바꿔도 순위가 안 바뀌면 지표는 그대로다. 순위가 바뀌는 순간에만 값이 계단처럼 튄다. 미분값이 거의 모든 곳에서 0 이라 경사하강으로 직접 최적화할 수 없다.

RankNet 은 이 문제를 우회해서, 문서 쌍 $(i, j)$ 중 $i$ 가 더 위에 와야 할 때 그렇게 될 확률을 높이는 방향으로 학습한다. 미분 가능한 대리 손실이라 학습은 되지만, 모든 쌍을 똑같이 취급한다는 한계가 있다. 순위 1 위와 2 위를 뒤집는 것과 100 위와 101 위를 뒤집는 것이 같은 무게로 다뤄진다.

LambdaRank 의 관찰은, 손실 함수를 새로 만들지 않아도 **gradient 를 원하는 대로 정의하면 학습 방향을 바꿀 수 있다** 는 것이다. RankNet gradient 에 "이 두 문서를 맞바꿨을 때 NDCG 가 얼마나 변하는가" 를 곱한다.

$$
\lambda_{ij} = \frac{-\sigma}{1 + e^{\sigma(s_i - s_j)}} \cdot \lvert \Delta \text{NDCG}_{ij} \rvert
$$

| 기호 | 의미 |
| --- | --- |
| $s_i$ | 모델이 문서 $i$ 에 준 점수 |
| $\sigma$ | 점수 차이를 확률로 바꿀 때의 기울기 상수 |
| 앞부분 | RankNet 의 gradient. 두 문서 순서가 틀릴수록 커진다 |
| $\lvert \Delta \text{NDCG}_{ij} \rvert$ | $i$ 와 $j$ 의 위치를 바꿨을 때 NDCG 변화량 |

상위권 문서 쌍은 NDCG 의 위치 할인 때문에 $\lvert \Delta \text{NDCG} \rvert$ 가 크고, 하위권 쌍은 작다. 그래서 같은 정도로 순서가 틀렸어도 상위권 쌍의 gradient 가 훨씬 크게 실린다. 검색 결과에서 첫 화면이 중요한 실제 요구와 학습 신호가 맞아떨어진다.

이 곱셈이 실제로 NDCG 를 개선한다는 것은 경험적으로 확인됐고, 이후 어떤 손실 함수의 gradient 에 해당하는지도 밝혀졌다.

# C) LambdaMART 로의 확장

$\lambda$ 는 모델 구조와 무관하게 "각 문서 점수를 어느 방향으로 얼마나 움직여야 하는지" 만 말해준다. 그래서 신경망 자리에 다른 모델을 넣을 수 있다. 이 $\lambda$ 를 gradient boosting 의 잔차 자리에 넣고 회귀 트리로 학습하는 것이 [[LambdaMART]] 이며, 오랫동안 순위 학습의 강력한 기준선으로 쓰였다.

# D) References

* [\[MSR-TR-2010-82\] From RankNet to LambdaRank to LambdaMART: An Overview](https://www.microsoft.com/en-us/research/publication/from-ranknet-to-lambdarank-to-lambdamart-an-overview/)
