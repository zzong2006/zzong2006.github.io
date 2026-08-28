---
title: "Fast matrix factorization for online recommendation with implicit feedback"
tags: ["SIGIR", "bias", "collaborative_filtering", "paper_review", "popularity_bias", "recommendation_system", "y2016"]
aliases: ["eALS"]
---

# A) Fast Matrix Factorization for Online Recommendation with Implicit Feedback ?

efficiently optimizing a MF model with variably-weighted missing data

Also 온라인 학습 방식 제공

# B) Introduction

Also 학습 방식은 adversely degrades the learning efficiency due to the full consideration of both observed and missing data.

관찰되지 않은 데이터에 대해서 동일한 weight 의 negative 로 가정하는 것은 성능 감소로 이어짐

제안된 방식은 인기도를 기반하여 weight 를 부여

## B.1) Popularity-aware Weighting Strategy

인기가 많은 아이템일 수록 사람들에게 많이 노출될 것이고, 만약 사용자들이 해당 인기 컨텐츠에 반응을 잘 안한다면 그만큼 별로인 컨텐츠일 가능성이 높다는 것.

이 사용자가 얼마나 해당 아이템에 대해 부정적인지에 대한 confidence $c_i$ 계산

$$
\displaystyle c_{i}=c_{0}\frac{f_{i}^{\alpha}}{\sum_{j=1}^{N}f_{j}^{\alpha}}
$$

* $f_{i}$ 은 아이템 $i$ 의 인기도 $\left|\mathcal{R}_{i}\right|/\sum_{j=1}^{N}\left|\mathcal{R}_{j}\right|$
* $c_0$ 는 missing data 에 대한 overall weight 결정
* $\alpha$ 는 인기 아이템에 대한 significance level. $\alpha=0.5$ 정도에서 좋은 결과를 얻었다고 함

# C) Negative Sampling 과의 관계

* 인기에 기반한 가중치 전략은 [BPR]([[BPR - Bayesian Personalized Ranking from Implicit Feedback]]) 에서 인기 기반의 oversampling 기법과 동일한 직관을 가지고 있다.
	* 인기가 많은 아이템에 대한 negative feedback 을 sampling 하는 경우, 더 높은 확률로 뽑히도록 유도
* 하지만 경험적으로 이러한 oversampling 방식은 basic uniform sampling 방식보다 성능이 떨어진다.
	* 그 이유를 이 논문에서는 SGD 학습 방식이 덜 인기있는 아이템에 대해서는 under-trained 되었기 떄문이라고 밝히고 있다.

# D) Related

* [Paper link](https://arxiv.org/pdf/1708.05024.pdf)

# E) References
