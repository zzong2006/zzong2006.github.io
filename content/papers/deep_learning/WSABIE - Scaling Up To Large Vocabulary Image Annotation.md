---
title: "WSABIE - Scaling Up To Large Vocabulary Image Annotation"
tags:
  - deep_learning
  - paper_review
  - recommendation_system
aliases: [WARP, WSABIE]
---

# A) WSABIE - 대용량 이미지 주석 작업을 위한 확장 가능한 방법

## A.1) 개요

WSABIE 는 대규모 이미지 주석 데이터에 대해 높은 성능을 보이는 방법으로, 주어진 이미지에 대해 상위 순위의 주석 리스트를 반환하는 데 최적화된 모델입니다. 이 방식은 기존의 baseline 방법들보다 빠르고 메모리 사용량이 적습니다.

## A.2) 도입

대규모 데이터에서 학습하고 이를 기반으로 이미지를 주석 처리할 수 있는 머신러닝 알고리즘이 필요합니다. 이러한 알고리즘은 다음과 같은 요구 사항을 충족해야 합니다:

1. **확장 가능한 학습 및 테스트 시간**
2. **효율적인 메모리 사용**

### A.2.1) 저차원 임베딩 공간에서 이미지와 주석을 함께 학습하는 모델

* 저차원 공간에서 이미지를 표현하면 계산 속도가 빨라지고 메모리 사용량이 줄어듭니다.

### A.2.2) WARP(Weighted Approximate-Rank Pairwise) Loss

* WARP 는 [[stochastic gradient descent]] 와 샘플링 기법을 활용하여 순위를 근사적으로 계산합니다.
* 모든 데이터를 메모리에 적재하지 않고도 학습할 수 있습니다.

### A.2.3) Joint Word-Image Model (이미지와 단어를 함께 학습하는 모델)

이미지와 주석을 동일한 특징 공간 (feature space) 에 매핑하여 표현하는 방식입니다.

#### A.2.3.1) 이미지 표현

$\Phi_{I}(x):\mathbb{R}^{d}\rightarrow\mathbb{R}^{D}$
$\Phi_{I}(x)=Vx$ (선형 변환)

#### A.2.3.2) 주석 표현

$\Phi_{W}(i):\{1,\ldots,Y\}\rightarrow\mathbb{R}^{D}$
$\Phi_{W}(i)=W_{i}$ ($D\times Y$ 행렬의 $i$ 번째 열)

#### A.2.3.3) 목표

주어진 이미지를 가장 잘 설명하는 여러 주석에 대한 순위를 매기는 것입니다. 각 주석 $i$ 는 다음과 같은 score function 으로 계산됩니다:
$f_{i}(x)=\Phi_{W}(i)^{\top}\Phi_{I}(x)=W_{i}^{\top}Vx$

### A.2.4) WARP Loss (Weighted Approximate-Rank Pairwise 손실 함수)

주어진 예시 $x$ 에 대해, label 집합 $\mathcal{Y}$ 내에서 올바른 label $y$ 를 찾기 위해 ranking 작업을 수행합니다.

* 학습 시 $(x,y)$ 쌍이 제공되며, 오직 하나의 올바른 annotation $y_i \in \mathcal{Y}$ 만 존재합니다.

기존 ranking error function 은 다음과 같이 정의됩니다:
$\operatorname{err}(f(x),y)=L(\operatorname{rank}_{y}(f(x)))$

여기서 $\operatorname{rank}_{y}(f(x))$ 는 true label $y$ 가 해당 예시에서 몇 번째로 높은 순위인지 나타냅니다:
$\operatorname{rank}_{y}(f(x))=\sum_{i \neq y} I(f_i(x) \geq f_y(x))$

$I$: indicator function 이며, 특정 조건이 참일 때 값을 반환합니다.

손실 함수 $L(k)$ 는 다음과 같이 정의됩니다:
$L(k)=\sum_{j=1}^{k}\alpha_j$, 여기서 $\alpha_1 \geq \alpha_2 \geq … \geq 0$

### A.2.5) Online Learning to Rank

순위를 학습하기 위한 온라인 방식에서는 [[hinge loss]] 가 사용됩니다.

WSABIE 는 이러한 구조를 통해 대규모 데이터에서도 효율적으로 작동하며, 특히 빠른 연산 속도와 적은 메모리 소모가 중요한 상황에서 유용한 솔루션입니다.

# B) WSAB

# C) Online WARP Loss Optimization

![|500](https://i.imgur.com/yWyXjUB.png)

여기서 constraints (2), (3) 은 regularization 을 의미

: $\begin{array}{ll}\left\|V_{i}\right\|_{2}\leq C,&i=1,\ldots,d\\\left\|W_{i}\right\|_{2}\leq C,&i=1,\ldots,Y\end{array}$

* Apply WARP loss to [[BPR - Bayesian Personalized Ranking from Implicit Feedback|BPR]]
	* Related paepr
		* [[Learning to Rank Recommendations with the k-Order Statistic Loss]]
	* Related Links
		* [LightFM](https://making.lyst.com/lightfm/docs/examples/warp_loss.html)
	* Rough algorithm
		* (user, positive item) pair 가 주어졌을 때, negative item 을 남은 아이템들 중에서 샘플링하고, 두 아이템 (positive, negative) 에 대해서 모두 prediction(score) 를 계산
		* 만약, negative item 의 prediction 값이 positive item 의 prediction 값에 margin 값을 더한것보다 크면 (i.e. rank violation), gradient update 를 수행하여 positive item 을 더 높이 그리고 negative item 을 낮게 rank 하도록 학습
		* 만약 rank violation 이 존재하지 않는다면, violation 이 찾아질 때까지 계속 sampling
		* 혹시나 첫번째 시도 (sampling) 에서 이러한 violation 을 찾는다면, large gradient update 를 수행한다.
			* 왜냐하면 이 의미는 많은 negative item 들이 poisitive item 들보다는 더 높게 rank 되어있다는 것을 의미하기 때문이다.
		* 반대로 많은 sampling 끝에 violating example 을 찾았다면, small update 를 진행한다.
			* 이 뜻은 학습하는 모델이 optimum 에 가까워졌기 때문에 low rate 로 update 되야 함을 의미하기 때문이다.

# D) References

* Paper link: http://www.thespermwhale.com/jaseweston/papers/wsabie-ijcai.pdf
