---
title: "Popularity-Opportunity Bias in Collaborative Filtering"
tags: ["WSDM", "bias", "fairness", "paper_review", "popularity_bias", "y2021"]
---

[paper link](https://dl.acm.org/doi/pdf/10.1145/3437963.3441820)

# Abstract

popularity-opportunity bias(POB) 를 조사하기 위해 세 파트로 나눠서 연구를 진행함

## Popularity-opportunity Bias 란?

사용자가 동일한 아이템을 둘 다 좋아하지만, 인기가 많은 아이템에 대해서 더 자주 추천되는 현상을 보이는 bias

## Three-part Study

1. 실험적으로 POB 가 [[matrix factorization|MF]] 모델에도 존재함을 확인함
2. (1) 의 내용을 바탕으로 하여 이론적으로 MF 모델이 해당 bias 를 생성하는것을 보임
3. 전처리와 후처리 알고리즘을 통해 이 bias 를 완화하는 것을 보임

# Introduction

기존 [[popularity bias]] 를 다룬 내용들은 인기 아이템이 높은 랭킹에 할당되고 덜 인기있는 아이템이 낮은 랭킹에 할당되는 것만 연구했다.

하지만 이러한 접근방법은 사용자의 선호도를 고려하지 않았다.

즉, 유저 선호도를 고려하지 않고 단순히 추천 결과 자체만으로는 bias 의 증거가 될 수 없다.

테스트 과정에서 POB 를 확인하기 위해서는 bias 를 측정하기 위해 어떻게 사용자 선호도를 알 수 있냐는 것이다. 이 논문에서는 선호도 확인을 위해 test data 를 활용했다고 한다 (from train-test data split).

## User-side Popularity-opportunity Bias

한 유저가 두 아이템 A, B 에 대해서 상호작용 (click) 했다 하더라도, A 가 B 보다 더 인기있다면 A 를 상위 추천 결과에 올리는 bias

## Item-side Popularity-opprtunity Bias

어떤 아이템 $i$ 을 소비한 모든 사용자에 대해서 $i$ 의 ranking 을 고려했을때, 인기 있는 아이템의 평균 ranking 이 상대적으로 매우 높은 편이였다.

또한, top-100 에 들어갈 확률도 매우 높았다.

# Data-Driven Study

## Measuring uPO and iPO Bias

### uPO Bias 측정

[[Spearman's rank correlation]](SRC) coefficient 을 활용한 metric 계산

$$
P R U=-\frac{1}{N} \sum_{u \in \mathcal{U}} S R C\left(\operatorname{pop}\left(\widetilde{O}_{u}^{+}\right), \operatorname{rank}_{u}\left(\widetilde{O}_{u}^{+}\right)\right)
$$

* $p o p(\cdot)$ 은 아이템 인기도를 의미: 각 아이템에 대해서 발생한 feedback 횟수
* $\operatorname{rank}_{u}\left(\widetilde{O}_{u}^{+}\right)$ 은 test dataset 에 존재하는 유저가 상호작용한 아이템 셋 $\widetilde{O}_{u}^{+}$ 을 기준으로, $u$ 를 대상으로한 모델의 추천 ranking positions (from 0 to $M$ - 1)

높은 값일수록 사용자가 좋아하는 아이템을 낮은 ranking 에 놓는다는 의미가 된다 (높은 popularity bias).

### iPO Bias 측정

iPO bias 는 matched user 에 대해서 낮은 인기를 가진 아이템의 기대 랭킹이 높은 인기를 가진 아이템의 기대 랭킹보다 낮은지의 여부를 확인하는 것.

$$
P R I=-S R C\left(p o p(I), a v g_{-} \operatorname{rank}(\mathcal{I})\right)
$$

* $\displaystyle \operatorname{avg}_{-} \operatorname{rank}(i)=\frac{1}{\left|\widetilde{\mathcal{U}}_{i}\right|} \sum_{u \in \widetilde{\mathcal{U}_{i}}} \operatorname{rank}_{u}(i)$

# Debiasing Approaches

pre-processing, in-processing 그리고 post-processing 이 세가지로 나뉘어짐

여기서 전처리 (pre-processing) 접근 방법은 학습 데이터를 변경하는 방법인데, 해당 종류의 알고리즘들은 디자인하기 어렵고 알고리즘의 bias 를 제거하지 못하는 문제가 존재하므로 비효율적이다.

결과적으로 이 논문에서는 post 와 in-processing 접근 방식으로 포커스를 맞춘다.

## Post-processing: Popularity Compensation (PC)

predicted user-item preference matrix $\hat{\mathbf{R}}$ 의 아이템쪽에 compenstation(약간의 인기도) 을 추가함으로써 더 높은 ranking position 을 가지도록 하는 방법

### 인기 보상 Debiasing 알고리즘

1. 사용자 $u$ 에 대한 predicted score 의 norm 을 계산

$$
\mathbf{n}_{u}=\left\|\left(\widehat{\mathbf{R}}_{u,:} \odot\left(1-\mathbf{R}_{u,:}\right)\right) /\left(M-\left|\mathcal{O}_{u}^{+}\right|\right)\right\|_{\mathrm{F}}
$$

* $\mathbf{R}_{u,:} \in\{0,1\}^{1 \times M}$ 는 training 데이터 (e.g. click 여부)
* $\widehat{\mathbf{R}}_{u,:} \in \mathbb{R}^{1 \times M}$ 는 predicted preference from MF or BPR
* $\mathcal{O}_{u}^{+}$ 는 학습 데이터에 포함된 $u$ 가 상호 작용한 아이템 집합
* $\widehat{\mathbf{R}}_{u,:} \odot\left(1-\mathbf{R}_{u,:}\right)$ 는 학습 데이터에 포함되지 않은 아이템의 score 만 고려하겠다는 의미

1. 사용자 $u$ 에 대한 아이템 $i$ 의 the popularity compensation score 를 계산

$$
\mathbf{C}_{u, i}=\frac{1}{\operatorname{pop}(i)} \cdot\left(\widehat{\mathbf{R}}_{u, i} \cdot \beta+1-\beta\right)
$$

* $\displaystyle \frac{1}{\operatorname{pop}(i)}$: 낮은 인기도를 가진 아이템에 대해 더 많은 compensation
* $\left(\widehat{\mathbf{R}}_{u, i} \cdot \beta+1-\beta\right)$: 유저가 좋아할만한 아이템은 더 많이 compensation
* $\beta \in[0,1]$ : trade-off weight 로, 유저의 선호도 정도를 얼만큼 반영할지의 비율을 의미
	* 높은 값을 줄수록 선호도에 더 높은 비중

1. 계산된 compensation score 를 scaling 하여 기존 선호도 예측 값 $\widehat{\mathbf{R}}_{u, i}$ 에 더해줌

$$
\widehat{\mathbf{R}}_{u, i}^{*}=\widehat{\mathbf{R}}_{u, i}+\alpha \cdot \mathbf{C}_{u, i} \cdot \mathbf{n}_{u} / \mathbf{m}_{u}
$$

* $\mathbf{m}_{u}=\|\left(\mathbf{C}_{u} \odot \right.\left.\left(1-\mathbf{R}_{u}\right)\right) /\left(M-\left|O_{u}^{+}\right|\right) \|_{F}$: compenstation score 의 norm 값
* $\mathbf{n}_{u} / \mathbf{m}_{u}$ : 사용자 $u$ 에 대한 predicted score $\widehat{\mathbf{R}}_{\boldsymbol{u}}$ 가 높다면, 그만큼 높은 compensation score 를 부여해야 함
* $\alpha$ : 전체 PC 알고리즘에 대한 trade-off weight

### My Opinion

제안된 방식은 이미 score prediction 이 존재한다고 가정하고 진행하지만, bandit 류 알고리즘은 계속해서 score 결과가 다르기 때문에 쉽게 적용하기 어려울 것

(2) 정도만 가져와서 score 계산에 진행하면 어떨까? 그러면 좀 좋을 것 같긴한데..

## In-processing: Regularization

MF 모델 학습 시 loss function 에 [[regularization]] 을 추가하는 방식

이전 work 에서 영감을 받음: equal opportunity based recommendation fairness for different item groups ([[#^665f88]])

$$
\min _{\Theta} \mathcal{L}_{R e c}+\gamma P C C\left(\widehat{\mathbf{R}}_{+}, p o p(\mathcal{I})\right)^{2}
$$

* $\mathcal{L}_{R e c}$ 는 MF 모델의 loss
* $P C C\left(\widehat{\mathbf{R}}_{+}, p o p(\mathcal{I})\right)$ 는 positive user-item pair 에 대한 predicted score matrix 와 해당하는 아이템 인기도 간 [[Pearson correlation]] 을 계산한 것.

# References

## Pre-processing Debiasing 관련

* [[Fighting Fire with Fire - Using Antidote Data to Improve Polarization and Fairness of Recommender Systems]]

## In-processing Debiasing

* [[Fairness in recommendation ranking through pairwise comparisons]] ^665f88
