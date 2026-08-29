---
title: "On the equivalence between Non-negative Matrix Factorization and Probabilistic Latent Semantic Indexing"
tags:
  - collaborative_filtering
  - paper_review
  - recommendation_system
aliases: []
---

# A) On the Equivalence between Non-negative Matrix Factorization and Probabilistic Latent Semantic Indexing ?

* [paper link](https://www.sciencedirect.com/science/article/pii/S0167947308000145)
* Abstract & Introduction (Summary)
	* [PLSI]([[Probabilistic latent Semantic Indexing]]) 와 [NMF]([[non-negative matrix factorization]]) 는 동일한 목적 함수를 최적화하는 것임을 보임
		* NMF 의 경우 I-divergence objective function ($L_1$-normalization NMF)
	* 다만, NMF 와 PLSI 는 서로 다른 알고리즘임
		* 동일한 초기화 조건으로 시작해도, 서로 다른 solution(local minima) 으로 converge 하게됨
		* NMF 와 PLSI converge 결과가 서로 다르지만, clustering 결과는 동일함
			* 많은 실험 결과에서 local minima 에 근접한 결과를 얻는다면 서로 거의 동일한 결과를 보였고, 그렇지 않으면 서로 매우 다른 결과를 얻었음
	* NMF 와 PLSI 를 서로 조합하면 local minima 를 벗어나는데 도움이 되는 하이브리드 method 를 만들어낼 수 있음
		* hybrid 라는 것이 NMF 한번 수행하고, PLSI 수행하고를 반복하는 알고리즘
* Data representations of NMF and PLSI
	* NMF: $F=CH^{\mathrm{T}}$
		* $F$ 는 stochastic normalized 된 word frequency: $\sum_{ij}F_{ij}=1$
			* 문서 $d_j$ 에 존재하는 word $w_i$ 의 normalized frequency
		* $C=\left(C_{ik}\right),H=\left(H_{jk}\right)$ 는 non-negative matrices
		* NMF 의 최소화 목적함수
			* $\displaystyleJ_{\mathrm{NMF}}=\sum_{i=1}^{m}\sum_{j=1}^{n}F_{ij}\log\frac{F_{ij}}{\left(CH^{\mathrm{T}}\right)_{ij}}-F_{ij}+\left(CH^{\mathrm{T}}\right)_{ij}$
			* related to [[KL-Divergence]]
	* PLSI
		* PLSI 의 최대화 likelihood
			* $\displaystyleJ_{\mathrm{PLSI}}=\sum_{i=1}^{m}\sum_{j=1}^{n}F_{ij}\logP\left(w_{i},d_{j}\right)$
				* $\begin{aligned}P\left(w_{i},d_{j}\right)&=\sum_{k}P\left(w_{i},d_{j}\midz_{k}\right)P\left(z_{k}\right)\\&=\sum_{k}P\left(w_{i}\midz_{k}\right)P\left(d_{j}\midz_{k}\right)P\left(z_{k}\right)\end{aligned}$
					* $z_k$ 가 주어졌을 때, $w_i$ 하고 $d_j$ 는 서로 [조건부 독립]([[independence (probability)]]) 임을 가정
		* probability factors
			* $\sum_{i=1}^{m}p\left(w_{i}\midz_{k}\right)=1$
			* $\sum_{j=1}^{n}p\left(d_{j}\midz_{k}\right)=1$
			* $\sum_{k=1}^{K}p\left(z_{k}\right)=1$
* Equivalence of NMF and PLSI
	* Theorem 1. PLSI 하고 NMF 는 동일하다.
		* Proposition 1. PLSI 의 목적함수는 NMF 의 목적함수와 동일하다.
			* $\maxJ_{\text{PLSI}}\Longleftrightarrow\minJ_{\text{NMF}}$
		* Proposition 2. NMF 의 열 정규화 값은 probability factorization 과 동일하다.
			* $\left(CH^{\mathrm{T}}\right)_{ij}=P\left(w_{i},d_{j}\right)$
		* 각 Proposition 에 대한 증명은 생략함

# B) References
