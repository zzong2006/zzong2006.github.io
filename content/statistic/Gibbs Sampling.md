---
title: "Gibbs Sampling"
tags:
  - bayesian_inference
  - statistic
aliases: ["깁스 샘플링"]
---

# A) Gibbs Sampling?

Gibbs sampling 은 특정 multivariate 확률 분포에서 approximated 된 일련의 관찰값 (observations) 들을 획득하기 위한 [[statistic/MCMC approximation|MCMC]] 알고리즘으로, 직접적인 샘플링이 어려울 때 사용한다.

구체적으로는 joint distribution 을 explicit 하게 알기 어렵거나 직접적으로 샘플링하기 어려운 케이스이지만, 각 변수에 대한 conditional distribution 은 상대적으로 확인하기 또는 샘플링하기 쉬울 때 사용한다.

이러한 시퀀스는 [[joint distribution]] 을 approximate 하는데 사용하거나 (e.g. 분포의 히스토그램 생성), 어떤 한 변수에 대한 marginal 분포를 approximate 하는데 사용된다.

Gibbs sampling 의 basic version 은 [[Metropolis-Hasting]] 알고리즘의 특수한 케이스로 생각할 수 있다.

It produces a sequence of sampled parameters ($\hat{\theta}^{n}:n=0,1,2,\ldots$) forming a Markov chain with [stationary distribution]([[stationary distribution]]) $f_{t-1}$.

# B) 특징

깁스 샘플링은 주로 [[Bayesian inference]] 을 위해 사용되고, randomized 알고리즘이라, [[machine_learning/EM algorithm]] 과 같은 통계적 추론을 위한 deterministic 알고리즘의 대체제로 사용한다.

* Gibbs sampling 은 다음번 생성될 표본은 현재 샘플에 영향을 받는다는 점에서는 MCMC 와 같지만, 나머지 변수는 그대로 두고 한 변수에만 변화를 준다는 점이 다르다.

# C) Implementation

* Gibbs sampling 의 중요한 점은 multivariate 분포가 주어졌을 때, [[joint distribution]] 에 대한 통합을 통해 merginalize 하기 보다 조건부 분포에서 샘플링하기가 더 쉽다는 점을 이용한다는 것이다.
* joint 분포 $p\left(x_{1},\ldots,x_{n}\right)$ 로 부터, $\mathbf{X}=\left(x_{1},\ldots,x_{n}\right)$ 의 $k$ 개 샘플들을 얻기 원한다고 가정한다면, 다음과 같은 방식대로 한다.
	* 어떤 초기 값 $\mathbf{X}^{(i)}$ 으로 부터 시작한다.
		* $i$ 번째 sample: $\mathbf{X}^{(i)}=\left(x_{1}^{(i)},\ldots,x_{n}^{(i)}\right)$
	* 이제, 다음 샘플 $\mathbf{X}^{(i+1)}=\left(x_{1}^{(i+1)},x_{2}^{(i+1)},\ldots,x_{n}^{(i+1)}\right)$ 을 얻는다고 해보자. 이때, $\mathbf{X}^{(i+1)}$ 는 vector 이고, 각 벡터의 원소에 대해서 샘플을 원한다.
	* $x_{j}^{(i+1)}$ 에 대해 샘플링을 진행할 때, 최대 $x_{j-1}^{(i+1)}$ 원소 까지는 $\mathbf{X}^{(i+1)}$ 의 원소로 설정하고, 나머지 원소들 ($\text{from}x_{j+1}^{(i)}\text{to}x_{n}^{(i)}$) 은 $\mathbf{X}^{(i)}$ 의 원소들로 condition 을 걸어버린다

: $p\left(x_{j}^{(i+1)}\mid x_{1}^{(i+1)},\ldots,x_{j-1}^{(i+1)},x_{j+1}^{(i)},\ldots,x_{n}^{(i)}\right)$

* 이렇게 전체 원소에 대해서 sampling 을 진행하고 나면 $\mathbf{X}^{(i+1)}$ 를 얻게되는데, 이 과정을 $k$ 번 반복한다.
* notes
* 변수들의 초기값은 임의로 설정하거나 [[machine_learning/EM algorithm]] 에 의해 결정할 수 있다.
* 초기에 생성된 일부 샘플들은 무시하는게 일반적이다 (이 구간을 burn-in period 라고 부른다). 그리고 [[expectation]] 을 계산할 때는 $n$ 번째 샘플만 가져다가 평균을 계산한다.
* 예를 들어, 처음 1,000 개의 샘플은 무시하고, 이후 매 100 번째 샘플만 평균을 계산한다. 나머지는 버린다.
* 이렇게 하는 이유
	* [[Markov Chain]] 의 [[stationary distribution]] 에 도달하기까지 어느정도 시간이 걸리기 때문이다.
	* 연속적인 샘플은 각기 독립적이지 않고 어느정도의 [[correlation]] 을 지니기 때문에, $n$ 번째의 간격을 둔다.
* Inference
	* Gibbs sampling 은 일반적으로 statistical inference 를 위해 사용되는데, 메인 아이디어는 관측된 데이터를 sampling 과정에 포함시키는 것이다.
		* 관측된 데이터 각각에 대해서 분리된 변수를 생성하고, 관측된 값에 대해 sampling 할 때 해당 변수들을 고정시키는 것
	* algorithm detail: a generic Gibbs sampler
		* ![[img-22487957ea.png]]
* 변형 또는 확장
	* 기존의 Gibbs sampler 에 대한 여러가지 변형이 존재한다. 이러한 변형의 이유는 샘플 간 autocorrelation 을 충분히 줄여서, 추가적인 계산 비용을 극복하기 위함에 있다.
	* 종류
		* [[collapsed Gibbs sampler]]

# D) Reference

* [[Thompson sampling]] tutorial: https://web.stanford.edu/~bvr/pubs/TS_Tutorial.pdf
* [wiki](https://en.wikipedia.org/wiki/Gibbs_sampling)

# E) References
