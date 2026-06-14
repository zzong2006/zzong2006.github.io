---
title: "Factorization Meets the Item Embedding - Regularizing Matrix Factorization with Item Co-occurrence"
tags: ["RecSyS", "collaborative_filtering", "paper_review", "recommendation_system", "word2vec", "y2016"]
aliases: ["CFR", "CoFactor"]
---

# Abstract

co-factorization model (CoFactor) 제안

item latent factor 를 공유하는 user-item interaction(i.e. click) matrix 와 the item-item co-occurrence matrix 를 jointly 하게 decompose
각 items pair 에 대해서 co-occurence matrix 는 두 아이템에 대해서 동시에 소모한 사용자의 수를 encode

CoFactor 는 word co-occurrence matrix 를 factorizing 하는 [[Word Embedding]] 모델 (e.g. [[Word2Vec]]) 에서 영감을 받음

기존 MF 모델에서 약간의 오버헤드가 추가되고, 큰 퍼포먼스 향상이 존재했음

# 1. Introduction

CoFactor 는 [[Alternating Least Squares|ALS]] 에서 사용한 coordinate update 를 응용하여 closed-form update 를 가능하게 했으며, 실험 결과에서 Also 보다 성능이 좋았다고 함.

# 2. The CoFactor Model

## SPPMI

[[negative sampling]] 을 통해 학습한 [[skip-gram]] 은 $\log{k}$ 만큼 shift 된 [[pointwise mutual information|PMI]] matrix SPPMI 를 implicit factorization(e.g. [[linear_algebra/Singular Value Decomposition]]) 한것과 동일하다고 한다. 이 방식은 최적화 과정이 없기때문에 유용하다.

PMI matrix 의 원소는 다음과 같이 계산된다.

$$
\operatorname{PMI}(i, j)=\log \frac{P(i, j)}{P(i) P(j)}=\log \frac{\#(i, j) \cdot D}{\#(i) \cdot \#(j)}
$$

여기서 $\#(i, j)$ 는 item $i$ 의 context 에서 $j$ 가 나타난 횟수를 의미한다. 그리고 $\#(i)=\sum_{j} \#(i, j)$ , $\#(j)=\sum_{i} \#(i, j)$ 이다. 또한 $D$ 는 item-context 쌍의 총 개수를 의미한다.

그리고 shifted positive PMI 인 SPPMI 행렬 $M \in \mathbb{R}_{+}^{I \times J}$ 은 다음과 같이 계산된다.

$$
\operatorname{SPPMI}(i, j)=\max \{\operatorname{PMI}(i, j)-\log k, 0\}
$$

CoFactor 에서는 SPPMI 를 사용할 때 조금 단순하게 했다.

1. 사용자의 item 사용 순서를 고려하지 않았으며, context $j$ 는 그 유저의 click history 전체에서 샘플링했다.
2. PMI 원소 값을 정할때, empirical estimated 값 $\#(i, j)$ 을 사용했다: 아이템 $i$ 와 $j$ 를 동시에 소모한 유저 수

## CoFactor Model Objective

Both MF and item embedding models infer latent item representation

$$
\begin{aligned}\mathscr{L}_{\mathrm{co}}&=\overbrace{\sum_{u,i}c_{ui}\left(y_{ui}-\theta_{u}^{\top}\beta_{i}\right)^{2}}^{\mathrm{MF}}+\overbrace{\sum_{m_{ij}\neq0}\left(m_{ij}-\beta_{i}^{\top}\gamma_{j}-w_{i}-c_{j}\right)^{2}}^{\text{item embedding}}\\&+\lambda_{\theta}\sum_{u}\left\|\theta_{u}\right\|_{2}^{2}+\lambda_{\beta}\sum_{i}\left\|\beta_{i}\right\|_{2}^{2}+\lambda_{\gamma}\sum_{j}\left\|\gamma_{j}\right\|_{2}^{2}\end{aligned}
$$

$\beta_{i}$ 는 item embedding 이고 $\gamma_{j}$ 는 context embedding, 그리고 $w_{i}$ 와 $c_j$ 는 각각 item 그리고 context biases.

# Related Works

[[matrix factorization|MF]] 에서 item 의 side information 을 활용하려는 시도가 있었다 (e.g. [[recommendation_system/VBPR - Visual Bayesian Personalized Ranking from Implicit Feedback|VBPR]]). 일반적으로 이러한 side 정보는 factor 를 regularize 하는데 사용된다.

CoFactor 와 이런 접근 방식의 주요 차이점은 regularization 이 추가적인 정보를 활용한다기 보다는 원래의 user-item 선호 데이터의 deterministic 하며, non-linear 한 transformation 에서 온다는 것이다.

또한, CoFactor 는 collective matrix factorziation(CMF) 의 special case 로 생각할 수 있다. CMF 역시 item 의 side information 을 활용하는데, CoFactor 는 [[Word Embedding]] 모델에 기반한 item-item relation 을 활용했다는 것에 차별점을 둘 수 있겠다.

# Discussion

Q. item co-occurrence 정보를 사용하는게 항상 좋은가?
A. 그렇지 않다. 어떤 문제를 푸는가, 어떤 데이터를 사용하는가에 따라 다르다. 그러나 가중치 $c_{ui}$ 값이 무한으로 치솟는 경우는 CoFactor 가 이를 줄이는데 도움이 된다.

# Related

* [[Collaborative Filtering for Implicit Feedback Datasets]]

# References

* paper link: https://dawenl.github.io/publications/LiangACB16-cofactor.pdf
* aurochs code: https://github.daumkakao.com/toros/aurochs/tree/dev/aurochs/buffalo/cfr
