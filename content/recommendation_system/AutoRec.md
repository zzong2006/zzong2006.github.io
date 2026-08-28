---
title: "AutoRec"
tags: ["recommendation_system", "deep_learning"]
---

# A) AutoRec ?

AutoRec 이란 a nonlinear neural network collaborative filtering model 을 의미한다.

[[collaborative filtering]] (CF) with an [[autoencoder]] architecture

# B) 구조 (vs. autoencoder)

[[autoencoder]] 와 동일하게 an input layer, a hidden layer, and a reconstruction (output) layer 로 구성되어 있다.

* explicitly embedding users/items 을 저차원 공간으로 매핑하는 대신, interaction matrix 의 행 또는 열을 입력 및 출력으로 사용한다.
	* 행 또는 열을 사용하냐에 따라서 user-based 또는 item-based 버전이 갈린다.
* autoencoder 와 차이점은 the hidden representations 을 학습하는 대신, the output layer 를 학습하거나 재구성하는데 집중한다는 것이다.
* 재구성 과정에서 interaction matrix 의 missing entries 를 채우는 것을 추천에 응용한다.

# C) 수식

## C.1) Item-based Version

$$
f\left(\boldsymbol{y}_{:,i};\boldsymbol{\theta}\right)=\mathbf{W}^{\top}\varphi\left(\mathbf{V}\boldsymbol{y}_{:,i}+\boldsymbol{\mu}\right)+\boldsymbol{b}
$$

* $\boldsymbol{y}_{:,i}\in\mathbb{R}^{M}$ 는 rating matrix 의 $i$ 번째 열 벡터
* $\mathbf{V}\in\mathbb{R}^{K\times M}$ 는 ratings 을 embedding space 에 mapping
* $\mathbf{W}\in\mathbb{R}^{K\times M}$ 는 embedding space 에서 ratings 에 대한 분포로 mapping
* $\boldsymbol{\mu}\in\mathbb{R}^{K}$ 는 hidden unit 에 대한 bias 그리고 $\boldsymbol{b}\in\mathbb{R}^{M}$ 는 output unit 에 대한 bias
* 총 $2MK+M+K$ 개의 parameter 가 존재함

## C.2) User-based Version

l2-[[regularization]] 이 추가된 버전의 loss 함수

$$
\displaystyle\mathcal{L}(\boldsymbol{\theta})=\sum_{i=1}^{N}\sum_{u:y_{ui}\neq?}\left(y_{u,i}-f\left(\boldsymbol{y}_{:,i};\boldsymbol{\theta}\right)_{u}\right)^{2}+\frac{\lambda}{2}\left(\|\mathbf{W}\|_{F}^{2}+\|\mathbf{V}\|_{F}^{2}\right)
$$

* $N$ 은 전체 사용자 수

# D) Related

* [[BPR - Bayesian Personalized Ranking from Implicit Feedback]]

# E) References

 * https://d2l.ai/chapter_recommender-systems/autorec.html
