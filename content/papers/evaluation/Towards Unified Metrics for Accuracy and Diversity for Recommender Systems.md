---
title: "Towards Unified Metrics for Accuracy and Diversity for Recommender Systems"
aliases: []
tags:
  - RecSyS
  - evaluation
  - paper_review
  - y2021
---

# Abstract

[[offline evaluation]] 평가에서 중요한건 [[accuracy]] 인데, [[diversity]] 도 중요하다. 그래서 이 논문에서는 둘을 통합한 metric 을 만들었다. 그리고 제안한 metric 이 일부 속성들을 만족함을 보였다. 여기서 만족하는 속성들은 good metric 이라면 만족해야만 하는 constraints 를 의미한다.

제안한 metric 이름은 $\alpha \beta$-nDCG 이다.

# Notations

* aspect $a_{\phi}$ : 아이템의 카테고리 정보. 예를 들어 영화 장르가 있다 (액션: $a_{\text {action }}$)
* $a_{\phi} \in i$ : 아이템 $i$ 에 aspect $a_{\phi}$ 가 존재한다.
* assessors : 추천 시스템이 아닌 검색 시스템 (document ranking) 에서의 유저를 의미한다.
* nuggets : 서로 다른 aspects

# alpha-nDCG

user $u$ 와 aspect $a_{\phi}$ 가 주어졌을 때, item 과의 연관성은 binary 형식으로 주어짐. 이런 가정에서, 사용자가 주어졌을 때 아이템과 연관이 있을 확률은 다음과 같다.

$$
P(R=1, u, i)=P\left(\exists a_{\phi}: a_{\phi} \in u \cap i\right)
$$

여기서 $a_{\phi}$ 는 사용자가 가진 흥미에 대한 aspect 를 의미한다.

위 수식에 대한 해석: 유저 $u$ 가 가지고 있는 aspect $a_\phi$ 이 아이템 $i$ 이 ==하나라도== ($\exists a_{\phi}$) 존재할 확률 = $u$ 와 $i$ 가 연관이 있을 확률

위 확률 수식을 다시 써보자.

$$
P(R=1, u, i)=1-\prod_{\phi=1}^{c} 1-P\left(a_{\phi} \in u\right) \times P\left(a_{\phi} \in i\right)
$$

여기서 $c$ 는 가능한 aspects 의 전체 개수를 의미한다. ^c01523

다시 써진 식을 해석해보자. $P\left(a_{\phi} \in u\right) \times P\left(a_{\phi} \in i\right)$ 는 기존 해석과 동일하다: “유저 $u$ 가 가지고 있는 aspect $a_\phi$ 이 아이템 $i$ 에도 존재할 확률”.

그럼 $1-P\left(a_{\phi} \in u\right) \times P\left(a_{\phi} \in i\right)$ 은 역으로 존재하지 않을 확률을 의미하며, 이를 모두 곱해주면 ($\prod_{\phi=1}^{c}$) $u$ 와 $i$ 가 서로 어떤 aspect 도 공유하지 않을 확률을 의미하게 된다.

여기서 다시 $1$ 을 빼주면 ($1-\prod_{\phi=1}^{c} 1-P\left(a_{\phi} \in u\right) \times P\left(a_{\phi} \in i\right)$), 결과적으로 “$u$ 와 $i$ 가 최소 한 개 이상 aspect 을 공유할 확률”을 의미한다.

만약 가능한 aspects 을 모두 알고 이것이 고정되어 있다고 한다면, $P\left(a_{\phi} \in i\right)$ 는 다음과 같이 추정할 수 있다.

$$
P\left(a_{\phi} \in i\right)= \begin{cases}0 & a_{\phi} \notin i \\ 1 & \text { otherwise }\end{cases}
$$

$P\left(a_{\phi} \in i\right)$ 값에 uncertainty 를 부여할 수 있는 방법으로는 $\alpha$ 를 사용할 수 있다.

# Alpha beta-nDCG

기존 $\alpha$-nDCG 방식이 추천 환경에서 고려하지 못한 두 가지를 생각해보자.

1. 유저가 상호작용한 아이템에 대해서, 유저가 그 아이템에 대해 긍정적으로 생각한다고 판단할 수 있다. 하지만 상호작용하지 않은 아이템 (missing ratings) 에 대해서는 유저가 그 아이템에 대해 부정적으로 생각한다고 판단하기 어렵다.
   그래서 어떤 아이템 $i$ 이 사용자가 선호하는 aspect $a_\phi$ 를 가지고 있다고 하더라도, $i$ 에 대한 rating $r_{u, i}$ 여부에 따라서 사용자의 $a_\phi$ 를 만족시키는데 기여할 확률이 다르다.
2. 어떤 item 이 사용자의 선호도를 만족시켜 줄 수 있는 특정 aspect 을 가졌다고 하더라도, 그것이 항상 100% 만족스러운 것은 아니다. 예를 들어, 호러 영화를 좋아하는 사람은 모든 호러 영화를 똑같은 수준으로 좋아하지 않을 수 있다. 그러니까, $P\left(a_{\phi} \in i\right)$ 가 아니라, $P\left(a_{\phi} \mid u, i\right)$ 가 되어야 한다.

[[#^c01523]] 의 수식을 다시 작성해보면 아래와 같다.

$$
P(R=1, u, i)=1-\prod_{\phi=1}^{c} 1-P\left(a_{\phi} \mid u, i\right) \times P\left(a_{\phi} \mid u\right)
$$

 ^fa5f48

위 식에서 $P\left(a_{\phi} \mid u, i\right)$ 는 아이템 $i$ 가 유저 $u$ 의 선호도 $a_{\phi}$ 를 만족시키는데 기여하는 확률을 의미한다.

$$

P\left(a_{\phi} \mid u, i\right)= \begin{cases}0 & a_{\phi} \notin i \\ \alpha(u, i) & \nexists r_{u, i} \text { and } a_{\phi} \in i \\ \beta\left(u, r_{u, i}\right) & \exists r_{u, i} \text { and } a_{\phi} \in i\end{cases}

$$

$\alpha(u, i)$ 는 $u$ 에 대해 $i$ 가 가지는 가중치를 의미하는데, 이 논문에서는 작은 상수 값 $\alpha$ 를 사용하고 있다.

그리고 $\beta\left(u, r_{u, i}\right)$ 는 confidence 값인데, 이 논문에서는 여러 가능한 방법들 중, factor $\beta$ 를 활용해서 normalized 된 rating value 를 confidence 값으로 활용하고 있다.

$$

\beta\left(u, r_{u, i}\right)=\frac{r_{u, i}}{r_{\max }} * \beta

$$

그 다음으로, redundancy 와 novelty 에 대한 지표가 있다. 어떤 유저가 순위가 매겨진 순서대로 0 부터 $k-1$ 순위의 아이템 (i.e. $S=\vec{i}[0, \ldots, k-1]$) 까지 소비한 상태에서, 주어진 aspect 을 만족하기 위해 $k$ 순위 (position) 에 있는 아이템에 대해 여전히 관심이 있는지 여부는 다음과 같다.

$$

P\left(a_{\phi} \mid u, S\right)=P\left(a_{\phi} \mid u\right) \prod_{i \in S} 1-P\left(a_{\phi} \mid u, i\right)

$$

 ^adad35

위 수식도 해석해보자. $\prod_{i \in S} 1-P\left(a_{\phi} \mid u, i\right)$ 부분은 $S$ 에 추천된 ranked 아이템 $i$ 들이 $u$ 의 선호도 $a_\phi$ 를 만족하는데 전혀 도움을 주지 않을 확률을 계산한다. 결과적으로 $P\left(a_{\phi} \mid u, S\right)$ 는 “유저가 $k$ 개의 추천 결과를 소비하면서 한번도 $a_\phi$ 를 만족하지 못한 상태에서 $a_\phi$ 에 선호도를 가질 확률”을 의미한다.

이제 [[#^fa5f48]] 의 $P\left(a_{\phi} \mid u\right)$ 를 redundancy aware variant $P\left(a_{\phi} \mid u, S\right)$ 로 교체하면 다음과 같다.

$$

P\left(R_{k}=1, u, i, S\right)=1-\prod_{\phi=1}^{c} 1-P\left(a_{\phi} \mid u, i\right) \times P\left(a_{\phi} \mid u, S\right)

$$

위 수식을 해석하면 다음과 같다: $S$ 를 소비한 유저 $u$ 가 $a_\phi$ 에 관심을 가지고 있는 상태에서 $i$ 를 만났을 때, $i$ 의 여러 aspects 중 최소 하나의 $a_\phi$ 가 $u$ 의 관심사를 만족하는데 기여할 확률을 의미한다.

이제 $P\left(a_{\phi} \mid u, i\right)$ 계산에 사용되는 parameter $\beta$ 는 단순히 confidence 측정에 사용되는 것을 넘어서 -$P\left(a_{\phi} \mid u, S\right)$ 계산에서도 사용되므로 - 다른 역할을 가지게 된다. 즉, 후순위 ($k$ ~ ) 에 있는 아이템에 대해서 얼마나 관심이 있는지 여부를 측정하는데도 활용되는 것이다.

다시 말하면 $\beta$ 가 높을수록, 관련이 있는 아이템은 유저 관심사의 만족도를 빠르게 높인다. 동시에 관심사를 충족시키는데 더 적은 아이템이 필요하게 된다.

## 계산 (Estimation)

전통적인 document retrieval 에서는 $P\left(a_{\phi} \mid u\right)$ 를 계산할 수 없다. 왜냐하면 유저의 선호도를 나타내는 데이터가 존재하지 않기 때문이다. 그러나 추천에서는 다음과 같이 [[Maximum Likelihood Estimation|MLE]] 를 통해 추정할 수 있다.

$$

P\left(a_{\phi} \mid u\right) \ \hat{=} \ \frac{\sum_{i \in \mathcal{I}_{u} \mid a_{\phi} \in i} r_{u, i}}{\sum_{\varphi} \sum_{i \in \mathcal{I}_{u} \mid a_{\varphi} \in i} r_{u, i}} \equiv \gamma_{\phi}^{u}

$$

여기서 $\mathcal{I}_{u}$ 는 유저 $u$ 가 기존에 상호작용한 아이템의 집합을 의미한다.

즉, $P\left(a_{\phi} \mid u\right)$ 는 $u$ 가 상호작용한 아이템의 가능한 모든 aspect 들 중 $a_{\phi}$ 에 대한 rating 비율을 의미한다.

식 [[#^adad35]] 의 $P\left(a_{\phi} \mid u, S\right)$ 를 $\alpha$ 와 $\beta$ 로 표현해보자.

$\rho_{u, r, \phi, k-1}$ 를 $k-1$ 번째 순위의 추천 결과에서 aspect $\phi$ 를 보이는 아이템 중에 유저에게 rating $r$ 을 받은 아이템의 총 개수라고하자. 그리고 $\tau_{u, \phi, k-1}$ 는 반대로 $k-1$ 번째 순위의 추천 결과에서 aspect $\phi$ 를 보이는 아이템 중에 유저에게 rating 을 받지 못한 아이템의 총 개수라고하자.

위 가정하에, $P\left(a_{\phi} \mid u, S\right)$ 의 inner term 은 다음과 같이 바뀐다.

$$

\prod_{j=1}^{k-1} 1-P\left(a_{\phi} \mid u, i_{j}\right)=(1-\alpha)^{\tau_{u, \phi, k-1}} \prod_{r=r_{m i n}}^{r_{\max }}(1-\beta(u, r))^{\rho_{u, r, \phi, k-1}}

$$

그러면 최종적으로 식 $P\left(R_{k}=1, u, i, S\right)$ 는 다음과 같이 rewrite 할 수 있다.

$$

\begin{aligned}

P\left(R=1, u, i_{1}, \ldots, i_{k}\right)=1 &-\prod_{\phi=1}^{c} (1-P\left(a_{\phi} \mid u, i_{k}\right) \times \gamma_{\phi}^{u} \times(1-\alpha)^{\tau_{\phi, k-1}}\\

&\times \prod_{r=r_{\min}}^{r_{\max}}(1-\beta(u, r))^{\rho_{u, r, \phi, k-1}})

\end{aligned}

$$

위 확률은 position $k$ 에 대한 gain value $G[k]$ 로 생각할 수 있다. 이 값에 따른 position $k$ 의 cumulative gain 은 다음과 같다.

$$
C G[k]=\sum_{j=1}^{k} G[j]
$$

결과적으로 $\alpha-\mathrm{nDCG} @ k$ 보다 $\alpha \beta-\mathrm{nDCG} @ k$ 가 좋은점은 다음과 같다.

1. $\alpha$ 값으로 missing rating 이 유저의 선호도를 만족시키는데 얼마나 기여하는지 설명할 수 있다.
2. $P\left(a_{\phi} \mid u\right)$ 값이 aspect 와 관계없이 일정하지 않고, 상호작용 데이터를 기반으로 사용자 $u$ 에 대한 aspect 의 relevance 정도를 추정이 가능하다.
3. 추가된 $\beta$ 는 사용자의 rating 이 얼마나 confidence 한지 설명할 수 있을 뿐만 아니라 추천 결과를 순위대로 확인하는 과정에서 유저와 관련된 아이템이 얼마나 유저를 빠르게 만족시켜줄 수 있을지의 정도를 설명할 수 있다.

# Axiomatic 분석

axiom 분석은 제안한 metric 또는 다른 rank 성능 metric 이 axiom 을 만족하는지 확인하는 작업이다. axiom 은 일반적으로 “XX 일수록 추천결과가 좋다 (또는 나쁘다)” 라는 내용인데, 이를 주어진 metric 으로 확인할 수 있다면, 해당 metric 은 axiom 을 만족한다고 말할 수 있다.

## Axioms for Relevant and Diverse Item Rankings

### 1) Priority inside Aspect, Pri

추천 결과에서 aspect 이 동일한 두 아이템의 순위 ($p$ 와 $p + k$) 를 swap 할 때, $p+k$ 쪽이 높은 rating 점수를 가지고 있다면, swap 된 결과가 더 좋은 추천 결과이다. 즉, aspect 이 동일하다면 높은 평가 점수를 가진 아이템을 상위 추천에 올릴수록 추천 결과의 품질이 올라간다는 의미다.

### 2) Deepness inside Aspect, Deep

추천 결과에서 aspect 이 동일한 한 쌍의 아이템 중 한쪽의 rating 이 더 좋은 상황에서 swap 을 한다면, 좀 더 상위 추천 결과 간 아이템을 swap 하는게 추천 결과 변화에 더 큰 영향을 준다 (i.e. top-heaviness).

### 3) Non Priority on Saturated Aspects, NonPriSatAsp

만약 추천 결과가 특정 aspect $a_{n}$ 위주로 구성되어 있다면, relevance(rating) 가 조금 낮아도 또 다른 aspect $a_{n^{\prime}}$ 를 지닌 아이템을 상위 추천결과로 올리는 (swap) 것이 더 나은 추천 품질을 보인다.

### 4) Top Heaviness Threshold, TopHeav

유저들은 본인들이 관련있는 아이템이 상위 추천 결과에 놓이길 원하지, 하위 추천 결과에 놓이길 원치 않는다. 이는 axiom 1 Pri 를 기반으로한 axiom 이다.

구체적으로 말하면, 추천 결과의 순서에서 $n$ 개의 관련없는 아이템 이후 $n$ 개의 관련있는 아이템, 총 $2n$ 개의 아이템을 추천 결과로 내보내는 것보다는 단순히 관련있는 아이템 하나를 추천의 최상단에 두고 나머지 $2n-1$ 개는 관련없는 것을 내보내는게 추천 결과가 좋음을 만족할 수 있는 최대 $n$ 값이 존재한다.

$$
\exists n \in \mathbb{N}^{+} \mid Q\left(i_{1}^{r}, i_{2}^{0} \ldots i_{2 n}^{0}\right)>Q\left(i_{1}^{0}, \ldots, i_{n}^{0}, i_{n+1}^{r}, \ldots, i_{2 n}^{r}\right), r>0
$$

### 5) Top Heaviness Threshold Complementary, TopHeavComp

axiom 4 TopHeav 와 보완적으로 해석하는 axiom 이다. (4) 에서 관련있는 아이템을 최상단에 내보내는게 추천결과가 더 좋을 수 있는 최대 $n$ 값을 찾을 수 있다면, axiom 5 에서는 최상단 전략의 성능이 더 안좋을 수 있는 최소 $m$ 값을 찾을 수 있다.

$$
\exists m \in \mathbb{N}^{+} \mid Q\left(i_{1}^{r}, i_{2}^{0} \ldots i_{2 m}^{0}\right)<Q\left(i_{1}^{0}, \ldots, i_{m}^{0}, i_{m+1}^{r}, \ldots, i_{2 m}^{r}\right), r>0
$$

이는 유저가 ranking exploration 을 하려는 노력의 lower bound 가 존재한다는 것을 의미한다.

### 6) Aspect Relevance, AspRel

어떤 두 아이템이 유저에 동일한 연관성 (rating) 을 가지고, 서로 다른 aspect $a_n$ , $a_{n'}$ 을 각각 가진다면, 유저가 선호하는 aspect 를 가진 아이템을 상위에 놓을수록 추천 결과의 품질이 좋아진다.

### 7) Prefer More Aspect Contribution, MoreAsp

어떤 두 아이템이 유저에게 동일한 연관성을 지니고, 서로 다른 aspect $a_n$ , $a_{n'}$ 을 각각 가진다면, 좀 더 적은 apsect-level 의 redundancy 를 보이는 아이템이 상위 추천에 올수록 더 높은 추천 결과의 품질을 보인다.

아이템이 유저의 관심사 $a_\phi$ 에 대한 aspect 를 가지고 있으면서, 전체 추천 결과에서 확인할 수 있는 해당 aspect 이 희귀할수록 아이템의 redundancy 가 적다는 뜻이 된다.

### 8) Missing over Non-Relevant, MissOverNon

직관적으로 유저들은 맘에 들지 않는다고 표현한 아이템보다는 선호하는 aspect 이지만 아직 확인하지 않은 (non-rated) 아이템을 상위 추천 결과에 올리는게 더 나은 추천 품질을 보인다.

$$
r_{u, j}=0, \nexists r_{u, j^{\prime}}, \exists a_{\phi} \in j^{\prime} \mid s\left(u, a_{\phi}\right)<1 \Longrightarrow Q\left(\vec{i}_{j \leftrightarrow j^{\prime}}\right)>Q(\vec{i})
$$

# Evaluation Metric

실험적으로 확인하는 metric 의 세 요소

1. rank correlaton
2. discriminative power
3. robustness to incompleteness

## 1) Rank Correlation with Ideal Ordering

### 1-1) Swapping Items Bottom to top

이상적인 ranking 상태에서 top 과 bottom 아이템을 swap 하는 경우 성능이 떨어진다. 점진적으로 swap 을 진행하는 경우, 성능이 더 떨어질 것이다. 제안한 metric 이 이렇게 swap 된 결과에서 성능 감소를 잘 감지할 수 있는지 여부를 확인한다.

### 1-2) Swapping Items from Redundant Aspect

## 2) Discriminative Power

좋은 metric 은 성능이 유의미하게 다른 정도를 검증을 통해 쉽게 찾아낼 수 있어야 한다.

추천 결과에 distortion 을 주면, 통계적 검증을 통해 추천 결과의 하락 정도를 얼마나 유의미하게 검증할 수 있는지 metric 마다 확인.

## 3) Robustness to Incompleteness

# 대조군 Metrics

## Diversity and Novelty Metrics

### S-recall

앞에서 부터 $K$ 개의 document 들이 얼마나 많은 subtopics 을 가지고 있는지 비율을 계산한다.

$$
\text { S-recall@}K= \frac{\mid \bigcup_{i=1}^{K} \text { subtopics }\left(d_{i}\right) \mid}{n}
$$

위 식에서 $d_i$ 는 document 를 의미하며, $n$ 은 가능한 전체 subtopics 을 의미한다.

### S-RR

### NRBP

### RBU

### EU

# References
