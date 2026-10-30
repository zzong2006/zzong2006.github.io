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
| 앞의 분수 | RankNet 의 gradient. 두 문서 순서가 틀릴수록 커진다 |
| $\lvert \Delta \text{NDCG}_{ij} \rvert$ | $i$ 와 $j$ 의 위치를 바꿨을 때 NDCG 변화량 |

쌍은 관련도가 다른 문서끼리만 만든다. 관련도가 같은 두 문서는 서로 순서가 바뀌어도 NDCG 가 그대로라서 $\lvert \Delta \text{NDCG} \rvert = 0$ 이다.

문서 하나가 받는 gradient 는 그 문서가 들어간 쌍의 $\lambda_{ij}$ 를 모두 모은 값이다. 문서 $i$ 가 상대보다 위에 와야 하는 쌍에서는 점수를 올리는 쪽으로, 아래에 와야 하는 쌍에서는 내리는 쪽으로 더해진다. 그래서 $\lambda_i$ 는 "문서 $i$ 의 점수를 어느 방향으로 얼마나 밀어야 하는가" 를 하나의 숫자로 말해 준다.

처음에는 이 곱셈이 NDCG 를 개선한다는 것을 실험으로만 확인했다. 나중에 LambdaLoss(Wang et al., CIKM 2018)가 LambdaRank 도 NDCG 에서 유도한 손실 함수를 최적화하고 있음을 보였다.

# C) ΔNDCG 계산 예

$\lvert \Delta \text{NDCG} \rvert$ 가 순위에 따라 얼마나 달라지는지 작은 목록으로 직접 계산해 본다. 모델이 지금 매긴 순위대로 문서 5 개가 있고, 관련도는 위에서부터 `[0, 1, 1, 0, 1]` 이다. 1 위와 4 위에 무관한 문서가 올라와 있다.

순위 $r$ 의 할인(discount)은 $1/\log_2(r+1)$ 이다.

| 순위 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| 할인 | 1.000 | 0.631 | 0.500 | 0.431 | 0.387 |
| 관련도 | 0 | 1 | 1 | 0 | 1 |

이상적인 순서 `[1, 1, 1, 0, 0]` 의 DCG 인 IDCG 는 $1 + 0.631 + 0.5 = 2.131$ 이다. 이 목록에서 순서가 틀린 쌍(무관한 문서가 관련 문서보다 위에 있는 쌍)은 넷이다.

![[img-1d71ba338f.png]]

1·2 위 쌍과 4·5 위 쌍은 둘 다 "무관 문서가 관련 문서 바로 위에 있다" 는 같은 실수다. 그런데 맞바꿨을 때의 NDCG 변화는 0.173 과 0.021 로 약 8 배 차이가 난다. 위쪽 순위끼리는 할인 차이가 크고($1 - 0.631$), 아래쪽 순위끼리는 작기($0.431 - 0.387$) 때문이다.

이 관계를 식으로 쓰면 다음과 같다. 두 문서의 위치를 바꾸면 각 문서의 이득이 서로의 할인을 받게 되므로, 변화량은 이득 차이와 할인 차이의 곱이다.

$$
\lvert \Delta \text{NDCG}_{ij} \rvert = \frac{\lvert G_i - G_j \rvert \cdot \lvert D_i - D_j \rvert}{\text{IDCG}}
$$

| 기호 | 의미 |
| --- | --- |
| $G_i$ | 문서 $i$ 의 이득(gain). 관련도 $l$ 을 그대로 쓰거나 $2^l - 1$ 로 키운다 |
| $D_i$ | 문서 $i$ 가 지금 있는 순위의 할인 $1/\log_2(r_i + 1)$ |
| IDCG | 이상적인 순서의 DCG. 쿼리마다 NDCG 를 0 과 1 사이로 맞춘다 |

할인은 **모델이 지금 매긴 점수로 정렬한 순위** 에서 계산한다. 학습이 진행되면 순위가 바뀌고, 그에 따라 같은 쌍의 $\lvert \Delta \text{NDCG} \rvert$ 도 매 반복마다 다시 계산된다.

# D) LightGBM 에서 쓰기

[[LightGBM]] 은 `objective="lambdarank"` 로 이 방식을 그대로 구현한다. 트리 모델 위에서 $\lambda$ 를 쓰는 것이므로 엄밀히는 [[LambdaMART]] 다.

```python
import lightgbm as lgb

# X: (문서 수, feature 수), y: 정수 관련도 0..4
# group: 쿼리별 문서 수. [3, 5] 면 앞 3 행이 쿼리 1, 다음 5 행이 쿼리 2
train = lgb.Dataset(X, label=y, group=[3, 5])

params = {
    "objective": "lambdarank",
    "metric": "ndcg",
    "eval_at": [5, 10],
    "label_gain": [0, 1, 3, 7, 15],          # 관련도별 이득. 기본값이 2^l - 1
    "lambdarank_truncation_level": 30,       # 기본값
}
model = lgb.train(params, train)
```

학습 데이터는 쿼리 단위로 묶여 있어야 한다. `group` 이 그 경계를 알려 주고, 쌍은 같은 쿼리 안에서만 만든다.

LambdaRank 에 직접 걸리는 파라미터는 셋이다 ([LightGBM Parameters](https://lightgbm.readthedocs.io/en/latest/Parameters.html)).

| 파라미터 | 기본값 | 정하는 것 |
| --- | --- | --- |
| `label_gain` | `0,1,3,7,15,…` ($2^l - 1$) | 관련도 $l$ 의 이득 $G$. 높은 등급을 얼마나 더 중요하게 볼지 정한다 |
| `lambdarank_truncation_level` | 30 | 현재 점수로 상위 몇 개까지를 끼고 있는 쌍만 $\lambda$ 를 계산할지 |
| `lambdarank_norm` | true | 쿼리마다 $\lambda$ 크기를 정규화해, 문서가 많은 쿼리가 학습을 독차지하지 않게 한다 |

`label_gain` 의 기본값은 등급이 하나 오를 때마다 이득이 두 배 가까이 커진다. "아주 관련" 과 "조금 관련" 의 차이를 크게 보고 싶으면 그대로 두고, 등급 간 차이가 크지 않은 라벨이면 `[0, 1, 2, 3, 4]` 처럼 줄인다. 라벨은 정수여야 하고, `label_gain` 은 가장 큰 라벨까지의 이득을 모두 담고 있어야 한다.

`lambdarank_truncation_level` 은 LightGBM 소스에서 바깥 반복문의 상한이다. 현재 점수로 정렬한 목록의 위에서부터 이 개수만큼 문서를 고르고, 각 문서와 그 아래 모든 문서로 쌍을 만든다. 그래서 둘 다 31 위 밖에 있는 쌍은 계산하지 않는다. 평가를 상위 10 개로만 한다면 이 값을 줄여 학습 시간을 아낄 수 있다.

# E) LambdaMART 로의 확장

$\lambda$ 는 모델 구조와 무관하게 "각 문서 점수를 어느 방향으로 얼마나 움직여야 하는지" 만 말해준다. 그래서 신경망 자리에 다른 모델을 넣을 수 있다. 이 $\lambda$ 를 gradient boosting 의 잔차 자리에 넣고 회귀 트리로 학습하는 것이 [[LambdaMART]] 이며, 오랫동안 순위 학습의 강력한 기준선으로 쓰였다.

# F) References

* [\[MSR-TR-2010-82\] From RankNet to LambdaRank to LambdaMART: An Overview](https://www.microsoft.com/en-us/research/publication/from-ranknet-to-lambdarank-to-lambdamart-an-overview/)
* [The LambdaLoss Framework for Ranking Metric Optimization (Wang et al., CIKM 2018)](https://research.google/pubs/the-lambdaloss-framework-for-ranking-metric-optimization/)
* [LambdaRank in LightGBM (Frank Fineis)](https://ffineis.github.io/blog/2021/05/01/lambdarank-lightgbm.html)
* [LightGBM Parameters](https://lightgbm.readthedocs.io/en/latest/Parameters.html)
* [LightGBM rank_objective.hpp](https://github.com/microsoft/LightGBM/blob/master/src/objective/rank_objective.hpp)
