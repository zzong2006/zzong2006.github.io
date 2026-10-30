---
title: "Latent Dirichlet Allocation"
aliases:
  - LDA
tags:
  - -
  - nlp
  - paper_review
  - topic_modeling
  - topic_modeling
---

paper link: https://www.jmlr.org/papers/volume3/blei03a/blei03a.pdf

# A) Abstract

LDA 는 이산 데이터 콜렉션을 위한 generative probabilistic model 이다.

3 단계 계층적 베이지안 모델이며, 콜렉션의 각 아이템들이 토픽 집합들의 유한한 mixture 로 모델링 된다.
the topic probabilities provide an explicit representation of a document.

# B) LDA 모델 Architecture

![[img-d3d31c088a.png]]

- $d$ 번째 문서에 등장한 $n$ 번째 단어 $w_{d,n}$
- $\alpha$ 는 topic $k$ 에 대한 [[Dirichlet distribution]] 의 prior
- $\theta_d$ 는 $d$ 번째 문서가 가진 topic 비중 (weight) 을 나타내는 벡터

**equation**

$$
p\left(\phi_{1:K},\theta_{1:D},z_{1:D},w_{1:D}\right)=\prod_{i=1}^{K}p\left(\phi_{i}\mid\beta\right)\prod_{d=1}^{D}p\left(\theta_{d}\mid\alpha\right)\left\{\prod_{n=1}^{N}p\left(z_{d,n}\mid\theta_{d}\right)p\left(w_{d,n}\mid\phi_{1:K},z_{d,n}\right)\right\}
$$

- [[Dirichlet distribution]] 의 모수 ($\alpha_{1},\alpha_{2},\ldots,\alpha_{k}$) 를 학습한다.
	- [[Bayesian inference]] 로 잠재 모수의 분포를 구해야 하는데, posterior distribution 을 계산하기가 불가능에 가깝다.
	- 그래서 [[variational inference]] 나 [[Sampling method]] 로 이 문제를 해결한다.

# C) [[overfitting]] 방지

LDA 는 Dirichlet prior 를 모델에 추가해서 overfitting 을 막는다.

- 이 prior 를 조절하는 hyperparameter 가 알파($\alpha$)와 베타($\beta$)다.
- 두 hyperparameter 가 일종의 regularization 역할을 한다.

## C.1) pLSI 의 overfitting 원인

pLSI 는 훈련 데이터셋(training corpus)에만 최적화되는 경향이 있다.

1. **사전 지식의 부재**: pLSI 는 주어진 문서-단어 행렬(DTM)의 확률 분포만 학습한다.
	- 토픽 분포나 단어 분포가 어떤 형태일지에 대한 사전 가정이 없다.
2. **문서별 파라미터**: pLSI 는 훈련 데이터의 문서마다 토픽 분포 파라미터를 따로 학습한다.
	- 훈련 문서가 늘어날수록 파라미터 수도 계속 늘어나서 overfitting 에 매우 취약하다.
	- 훈련 데이터에 나온 특정 문서의 토픽 조합만 기억할 가능성이 높다.

## C.2) Dirichlet prior 를 통한 overfitting 방지

LDA 는 pLSI 의 확률 모델에 베이즈 통계학 개념을 더한 모델이다.

- 관찰된 데이터(문서)를 설명하기 전에, 파라미터(토픽 분포, 단어 분포) 자체가 특정 확률 분포를 따른다고 사전 가정한다.
- 이 사전 가정에 쓰는 분포가 Dirichlet distribution 이고, 그 형태를 조절하는 hyperparameter 가 $\alpha$ 와 $\beta$ 다.

### C.2.1) 알파($\alpha$): 문서-토픽 분포 조절

- **역할**: 문서의 토픽 분포(예: 토픽1 70%, 토픽2 20%, 토픽3 10%)가 Dirichlet distribution 을 따른다고 가정하고, $\alpha$ 가 그 분포의 형태를 정한다.
- **$\alpha$ 가 높을 때**: 문서의 토픽 분포가 여러 토픽에 고르게 퍼진다 (dense).
	- 문서가 다양한 주제를 조금씩 포함하는 경향이 생긴다.
	- 정규화 효과가 커져, 모델이 특정 소수 토픽에만 의존하지 않게 된다.
- **$\alpha$ 가 낮을 때**: 문서의 토픽 분포가 소수의 특정 토픽에 집중된다 (sparse).
	- 문서가 몇 개의 핵심 주제로만 이뤄지는 경향이 생긴다.
- **overfitting 방지 원리**: "한 문서가 극단적으로 토픽 하나로만 이뤄지지는 않았을 것" 이라는 부드러운 제약(smoothing)을 건다.
	- pLSI 처럼 특정 문서의 토픽 분포를 극단적으로 학습하는 일을 막아 일반화 성능을 높인다.

### C.2.2) 베타($\beta$): 토픽-단어 분포 조절

- **역할**: 토픽의 단어 분포(예: 토픽1 은 '축구' 50%, '선수' 30%, ...)도 Dirichlet distribution 을 따른다고 가정하고, $\beta$ 가 그 분포의 형태를 정한다.
- **$\beta$ 가 높을 때**: 토픽의 단어 분포가 여러 단어에 고르게 퍼진다.
	- 토픽끼리 비슷한 단어를 공유하게 되어 토픽 간 경계가 모호해질 수 있다.
- **$\beta$ 가 낮을 때**: 토픽의 단어 분포가 소수의 핵심 단어에 집중된다.
	- 토픽별로 쓰는 단어가 명확히 구분되어 해석하기 쉬운 토픽이 만들어진다.
- **overfitting 방지 원리**: "한 토픽이 극단적으로 단어 몇 개로만 이뤄지지는 않았을 것" 이라는 제약을 건다.
	- 훈련 데이터에서 어떤 단어가 특정 토픽에만 나왔더라도, 다른 토픽에 나올 확률을 완전히 0 으로 만들지 않는다.
	- 그 덕분에 새로운 문서나 단어 조합에도 대응할 수 있다.

## C.3) [[Probabilistic latent Semantic Indexing]] 과 차이점

- pLSI: 모든 문서 주제의 분포 ($\theta$) 가 정해져 있고, 이를 찾아야 한다.
- LDA: 문서의 주제 분포 ($\theta$) 를 결정하는 parameter $\alpha,\beta$ 가 있고, sampling 으로 주제 분포를 얻는다.
	- pLSI 에 비해 모수 개수가 줄어들기 때문에 overfitting 발생 확률이 감소한다.
	- 파라미터 자체에 확률적인 제약을 걸어, 훈련 데이터에만 있는 분포가 아닌 더 일반적인 분포를 학습하게 만든다.
- 그래서 LDA 가 pLSI 보다 새로운 documents 에 쉽게 generalize 할 수 있다.

# D) Related

[[LDA]], [[topic modeling]], [[JMLR]] 03, #[[TF-IDF]]

- [[Probabilistic latent Semantic Indexing]]

# E) Reference

- [주니어 스터디 from Dante](https://www.youtube.com/watch?v=3ZeFBcJJri4&ab_channel=Recotechkakao)
