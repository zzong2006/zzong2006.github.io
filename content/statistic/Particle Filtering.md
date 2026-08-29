---
title: "Particle Filtering"
aliases: []
tags: []
---
* References
	* http://www.lirmm.fr/ModuleImage/sidibe_module_image_2011.pdf
* Particle Filters 또는 Particle Filtering 은 Sequential Monte Carlo (SMC) 방식으로도 불리며, 베이지안 통계 추론 (Bayesian statistical inference) 을 수행하기 위한 몬테카를로 알고리즘의 일종이다.
* Particle Filtering 의 목적은 Markov process 에서 states 의 posterior 분포를 계산하기 위함에 있다.
* Particle filtering 은 posterior 분포를 표현하는 particle 집합을 이용한다.
* The objective of a particle filter is to estimate the posterior density of the state variables given the observation variables.
	* Filter : 시스템의 parameters (또는 states) 들을 추정하는 과정
	* Particles : 임의로 선택된 weighted 샘플들
		* PDF 를 근사화하는데 사용됨
	* Problem Statement
		* $k$ 개의 measurements $\mathbf{Z}_{1:k}=\left\{\mathbf{z}_{1},\ldots,\mathbf{z}_{k}\right\}$ 가 주어질 때, parameter $\mathbf{x}$ 를 위한 최적의 추정 $\hat{\mathbf{x}}$ 을 찾기
	* Using Bayes rules
		* 문제 해결을 위한 posterior pdf 는 다음과 같이 계산된다.

		$\begin{aligned}p\left(\mathbf{x}\mid\mathbf{Z}_{1:k}\right)&=\frac{p\left(\mathbf{Z}_{1:k}\mid\mathbf{x}\right)p(\mathbf{x})}{p\left(\mathbf{Z}_{1:k}\right)}\\&\propto\eta\times p\left(\mathbf{Z}_{1:k}\mid\mathbf{x}\right)p(\mathbf{x})\end{aligned}$

	* $p\left(\mathbf{x}\mid\mathbf{Z}_{1:k}\right)$: the posterior pdf
	* $p\left(\mathbf{Z}_{1:k}\mid\mathbf{x}\right)$: the likelihood function
	* $p(\mathbf{x})$: the prior distribution
