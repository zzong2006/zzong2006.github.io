---
title: "Gradient-based One-Side Sampling"
tags: optimization
aliases: ["GOSS"]
---

# A) Gradient-based One-Side Sampling ?

[[LightGBM]] 이 트리의 분할 지점을 찾을 때 데이터 행을 일부만 쓰는 샘플링 방법이다. gradient 가 큰 행은 모두 남기고, gradient 가 작은 행만 무작위로 줄인다. 한쪽(작은 쪽)만 샘플링해서 one-side sampling 이라고 부른다.

# B) 왜 gradient 로 고르나

gradient boosting 에서 행마다의 gradient 는 "지금까지의 트리들이 이 행을 얼마나 틀리고 있는가" 다. gradient 가 작은 행은 이미 잘 맞고 있어서, 새 트리가 어디서 나누든 loss 가 크게 달라지지 않는다. 분할 이득을 계산할 때 기여가 작다.

그래서 gradient 가 작은 행을 덜 보면 계산은 줄고 분할 이득의 추정은 크게 흔들리지 않는다. 그냥 행을 무작위로 줄이는(subsample) 것과 다른 점은, 학습에 중요한 큰 gradient 행을 하나도 버리지 않는다는 것이다.

# C) 동작 방식

파라미터는 둘이다.

| 파라미터 | LightGBM 이름 | 기본값 | 뜻 |
| --- | --- | --- | --- |
| $a$ | `top_rate` | 0.2 | gradient 절댓값 상위 몇 비율을 모두 남길지 |
| $b$ | `other_rate` | 0.1 | 나머지에서 전체 행 수 대비 몇 비율을 무작위로 남길지 |

1. 행을 gradient 절댓값 순으로 정렬한다.
2. 상위 $a$ 비율은 모두 남긴다.
3. 나머지에서 전체의 $b$ 비율만큼 무작위로 고른다.
4. 무작위로 고른 행의 gradient 에 $(1 - a)/b$ 를 곱한다.
5. 남은 행만으로 히스토그램을 만들어 분할 지점을 찾는다.

4 단계의 가중치가 없으면 작은 gradient 쪽이 줄어든 만큼 분포가 큰 gradient 쪽으로 치우친다. 행 100 개에 기본값을 쓰면 상위 20 개를 남기고, 나머지 80 개 중 10 개를 고른다. 이 10 개가 원래 80 개를 대표해야 하므로 가중치는 $(1 - 0.2)/0.1 = 8$ 이다. 분할 계산에는 100 개 대신 30 개만 쓴다.

![[img-ebfc6376cb.png]]

위 그림의 ③ 이 이 과정이다. LightGBM 이 빠른 나머지 세 기법(histogram, leaf-wise, EFB)도 같은 그림에 있다.

# D) 쓸 때 주의할 점

- **LightGBM 4.0 부터 지정 방법이 바뀌었다**: 예전에는 `boosting="goss"` 였고, 지금은 `data_sample_strategy="goss"` 다.
- **작은 데이터에서는 이득이 적다**: 행이 적으면 줄여서 아낄 계산도 적고, 샘플링 때문에 생기는 분산이 더 크게 보인다. 과적합하기도 쉽다.
- **학습 초반에는 쓰지 않는다**: 첫 트리들에서는 모든 행의 gradient 가 비슷하게 크다. LightGBM 은 처음 몇 반복(학습률의 역수 정도)은 GOSS 없이 전체 행을 쓴다.

# E) References

- [LightGBM: A Highly Efficient Gradient Boosting Decision Tree (Ke et al., NeurIPS 2017)](https://papers.nips.cc/paper_files/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html)
- [LightGBM Parameters](https://lightgbm.readthedocs.io/en/latest/Parameters.html)
- [What makes LightGBM lightning fast?](https://towardsdatascience.com/what-makes-lightgbm-lightning-fast-a27cf0d9785e)
