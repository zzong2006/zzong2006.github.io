---
title: "cross-entropy"
tags:
  - information_theory
  - machine_learning
  - metrics
aliases: ["logloss"]
---

# A) Cross-entropy?

우리가 예측 모형을 build 하는 이유는 불확실성을 제어하고자 하는 것이다.

이때, 예측 모형은 실제 분포인 $q$ 를 모르고, 모델링을 하여 $q$ 분포를 예측하고자 하는 것이다.  
예측 모델링을 통해 구한 분포를 $p$ 라고 해보자. 실제 분포인 $q$ 를 예측하는 $p$ 분포를 만들었을 때, 이 때 cross-entropy 는 아래와 같이 정의된다.  

$$
\displaystyle H_{p}(q)=-\sum_{c=1}^{C}q\left(y_{c}\right)\log\left(p\left(y_{c}\right)\right)
$$

이는 logloss 로 불리기도 하는데, 로그 손실은 분류 문제에서 모델의 성능을 평가하는 데 사용되는 손실 함수입니다. 로그 손실은 모델이 예측한 확률 분포와 실제 레이블의 확률 분포 간의 차이를 측정합니다.

$$
L(y, p)=-\frac{1}{N} \sum_{i=1}^N\left[y_i \log p_i+\left(1-y_i\right) \log \left(1-p_i\right)\right]
$$

이 값이 작을수록 모델의 성능이 좋다고 판단합니다.

# B) Application

[[machine learning]] 에서 cross-entropy 는 실제 확률 분포와 모델의 예측 분포의 차이 (dissimilarity) 를 계산하는데 활용할 수 있다.  

cross-entropy 는 상당히 자주 쓰이는데, 주된 이유는 cross-entropy 가 ==비교하는 확률 분포에 대한 종류를 특정하지 않기 때문==이다.

# C) Entropy 와 비교

cross-entropy 의 값은 [[entropy]] 값보다 항상 크다.

예를 들어, 가방에 0.8/0.1/0.1 의 비율로, 빨간/녹색/노랑 공이 들어가 있고, 모델을 통한 예측 $p$ 로는 0.2/0.2/0.6 의 비율로 가정했다고 해보자.  

이 때, entropy $H(q)$ 와 cross-entropy $H_{p}(q)$ 는 아래와 같이 계산된다.  

$$
H(q)=-[0.8\log(0.8)+0.1\log(0.1)+0.1\log(0.1)]=0.63
$$

$$
H_{p}(q)=-[0.8\log(0.2)+0.1\log(0.2)+0.1\log(0.6)]=1.50
$$

# D) KL-Divergence 과의 비교

주어진 데이터에 대한 [[Maximum Likelihood Estimation]] 와 같은 estimation 을 수행하는 경우, 추정한 분포와 실제 분포가 비슷하길 원한다.  
이를 위해, [[KL-Divergence]] 와 같은 metric 을 사용하는데, 두 분포 간 KL divergence 를 최소화하는 것은 cross-entropy 를 최소화하는 것과 동일하다.

# E) 계산 팁

$0\log0$ 계산 시, 정보 이론에 기반하여 $\lim_{x\rightarrow0}x\log x=0$ 이다.

# F) Binary Cross Entory

binary cross-entropy 는 [[CTR prediction]] 문제에서 광범위하게 사용된다.

$$
\mathcal{L}=-\frac{1}{N} \sum_{\mathbb{D}}(y \log \hat{y}+(1-y) \log (1-\hat{y}))
$$

# G) [[perplexity]] 와 연관성

Perplexity and cross-entropy are closely related in language models. Perplexity is defined as 2 raised to the power of the cross-entropy. Mathematically, this relationship is expressed as:

$$
\text { Perplexity }=2^{\text {Cross-Entropy }}
$$
