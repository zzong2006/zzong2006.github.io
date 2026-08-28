---
title: "Complex Embeddings for Simple Link Prediction"
tags: ["collaborative_filtering", "paper_review"]
---

# Abstract

statistical relational learning 에서 link prediction 문제를 latent factorization 을 통해 푸는 방식을 제안한다.

complex valued embedding 을 사용하여 binary relation 들의 다양한 변화를 다룰 수 있다.

Neural Tensor Network 또는 Holographic Embeddings 방식과 비교했을때 complex embedding 이 더 단순하다. 그 이유는 Hermitian dot product 을 사용했기 때문이다.

# Introduction

Relations as Real Part of Low-Rank Normal Matrices

## (1) Modelling Relations

* $\mathcal{E}$ 는 개체 (entity) 들의 집합 ($|\mathcal{E}|=n$)
* 두 개체 사이의 관계는 binary value 로 표현됨: $Y_{so}\in\{-1,1\}$
	* $s\in\mathcal{E}$ 는 relation 의 subject 이고, $o\in\mathcal{E}$ 는 object
* 개체 간 관계가 있을 확률은 logistic inverse link function 으로 표현됨: $P\left(Y_{so}=1\right)=\sigma\left(X_{so}\right)$
	* $X\in\mathbb{R}^{n\times n}$ 는 a latent matrix of scores 그리고 $Y$ 는 partially observed sign matrix
* 본 논문의 목적은 $X$ 에 대한 generic structure 를 찾는 것
* 일반적인 [[matrix factorization]] 에 의하면 다음과 같이 표현할 수 있음: $X=UV^{T}$
	* $U$ 와 $V$ 는 $n\times K$ 크기의 독립된 matrices ($K$ 는 [matrix rank]([[the rank of a matrix]]))
1. Low-Rank Decomposition

# Related

* [[PyTorch-BigGraph]], [[knowledge bases]]

# References

* paper: https://proceedings.mlr.press/v48/trouillon16.html
* github: https://github.com/ttrouill/complex
