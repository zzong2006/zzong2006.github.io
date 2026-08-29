---
title: "Collaborative filtering via high-dimensional regression"
aliases: []
tags:
  - Netflix
  - bias
  - collaborative_filtering
  - paper_review
  - popularity_bias
  - recommendation_system
---

[paper link](https://arxiv.org/abs/1904.13033)

# Abstract

[[SLIM - Sparse Linear Methods for Top-N Recommender Systems|SLIM]] 이 높은 ranking 정확도를 여러 논문 실험에서 보여줬지만, 데이터를 통한 파라매터 학습 비용이 너무 높았다. 그래서 이 논문에서는 이를 고차원 회귀 문제의 variants 로 생각하고 closed-form solution 을 제안한다.

추가적으로, 데이터의 item-popularity 에 대해 대응하기 위해 re-weighting 보다는 re-scaling 에서 영감을 받았다.

…

# Introduction

SLIM 학습 비용이 높은 것을 줄이기 위해 다음과 같은 시도를 진행함

1. L1-norm [[regularization]] term 과 학습 가중치에 대한 non-negativity constraints 를 지웠더니 ranking 정확도의 상승이 있었다.

# Approach: Preliminaries

…

# Biased Training-data

실제 추천 시스템에서는 데이터에 여러 종류의 bias 가 들어가있다. 이 bias 의 원인은 데이터가 [[missing not at random|MNAR]] 이기 때문이다.

debiasing 을 위한 간단하고 효과적인 방법중 하나는 positive user-item interactions 으로만 구성된 학습 데이터를 이용할 때, negative user-item interactions 을 샘플링 하는 것이다.

그리고 또 다른 debiasing 방법 중 하나가 데이터에서 popularity bias 를 지우는 것이다. [[Natural Language Process]] 도메인에서는 이를 word2vec 으로 해결하고 있다: [[#^62a6cb]]

## Weighted Errors

$$
\begin{gathered}
\hat{B}^{(\text {weighted })}= \arg \min _{B}\|\sqrt{W} \odot(Y-X \cdot B)\|_{F}^{2}+\lambda \cdot\|B\|_{F}^{2} \\
\text { s.t. } \operatorname{diag}(B)=0
\end{gathered}
$$

## Re-scaled Target-Values

target values $Y\in \mathbb{R}^{|\mathcal{U}| \times|\mathcal{I}|}$ 를 아이템 가중치 $w^{(\mathrm{I})} \in \mathbb{R}^{|\mathcal{I}|}$ 를 이용하여 rescaling 하는 방법을 제시한다. $Y$ 는 일반적으로 binary matrix 로 생각할 수 있다 (1 은 클릭, 0 은 missing data).

$$
\begin{aligned}
\hat{B}^{(\text {scaled) }} &=\arg \min _{B}\left\|Y \cdot \operatorname{diagMat}\left(w^{(\mathrm{I})}\right)-X \cdot B\right\|_{F}^{2}+\lambda \cdot\|B\|_{F}^{2} \\
& \text { s.t. } \operatorname{diag}(B)=0
\end{aligned}
$$

## Example: Popularity Adjustments

### Removal of Popularity-Bias

학습 데이터에서 popularity bias 를 지우는 목적은 모델이 아이템의 similarities 에 집중했으면 하는 바람에 있다.

## Scaling Method

[[popularity bias]] 를 완화하기 위해 후처리 방법으로 추천 결과의 score 를 rescaling 하는 방법을 제시

$$
\widehat{r}_{u, i}^{(\text {scaled })}=\widehat{r}_{u, i}^{(\text {model })} /\left(C_{i}\right)^{\alpha}
$$

* $\widehat{r}_{u, i}^{(\text {model })}$ 은 predicted score
* $C_{i}$ 는 학습 데이터에 포함된 아이템 $i$ 에 대한 총 클릭 횟수
* $\alpha$ 는 debiasing strength 를 조절하는 hyper-parameter
	* 실험 상으로는 0.5 정도에서 가장 성능이 좋았다고 한다.

### Application Ideas

1. [[Contextual Bandit]] 에서 score 생산 시 적용해보면 어떨까?
2. 아니면 item pool 을 구성할 때 score 로 고려해도 괜찮을 것 같다.

# References

* [[Distributed representations of words and phrases and their compositionality]] ^62a6cb
