---
title: "matrix factorization"
aliases: []
tags: 
---
ㅔ
---
tags: collaborative_filtering
aliases: [MF]
---

* Tags
	* [[autoencoder]], #[[non-negative matrix factorization]]

# A) What is Matrix factorization(MF)?

* 행렬로 표현된 데이터를 더 작은 차원의 행렬로 분해하는 방법
* 가장 널리 쓰이는 [[collaborative filtering]] 기술
	* 일부 추천 플랫폼에서는 [[Alternating Least Squares]], [[BPR - Bayesian Personalized Ranking from Implicit Feedback|BPR]] MF (BPR-MF), 그리고 [[Logistic Matrix Factorization for Implicit Feedback Data|Logistic MF]] 등의 다양한 MF 기술을 사용하고 있다.
	* 또한 YouTube 에서는 딥러닝을 이용한 Deep MF 기법이 연구되고 있다고 한다.

# B) 멜론에서 Matrix Factorization 의 예시

* 유저가 어떤 곡을 소비했는지 여부를 유저 $x$ 곡 행렬로 표현할 수 있다.
* matrix factorization 에서는 이 행렬을 랭크가 작은 두 개의 행렬로 나누고, 이렇게 두 개로 나눈 행렬의 곱이 원래의 행렬과 비슷하게 나오도록 학습한다.
* explicit and implicit feedback
	* explicit models are more effective for the **rating** prediction task while implicit models are well suited to the **ranking** task.
* Low rank matrix factorization
	* collaborative 을 수행할 때, vectorization 을 이용해서 rating prediction 을 빠르게 수행할 수 있다.
	* ![[img-942391a495.png|image-20201102205057974]]
		* 위 rating table 을 $Y$ 라는 matrix 로 나타낼 수 있으며, $Y$ 는 user parameters matrix 와 item features matrix 의 곱으로 표현될 수 있다.
	* 아래 그림과 같은 방법을 low rank matrix factorization 이라고 한다.
		* ![[img-dedd35e74f.png|image-20201102205239056]]
	* Finding related movies
		* item 에 대한 feature 학습이 완료된 상태라면, 각 item 간 유사도를 측정할 수 있다.
			* 아래 그림에서는 유사도 metrics 중 L2-norm 을 활용하였다.
		* ![[img-62de4784e9.png|image-20201102205335601]]
	* Implementational Detail: [[Mean Normalization]]

# C) Matrix Factorization 의 장점

* 데이터의 압축
* 숨겨진 특성 (latent factor) 의 활용

# D) Matrix Factorization 의 단점

* MF 를 통해서 얻어낸 행렬들의 norm 은 종종 아이템의 인기도와 상관관계가 깊다.
* 즉, 인기가 많은 아이템은
* This can be explained by the fact that in matrix factorization models, the norm of the embedding is often correlated with popularity (popular movies have a larger norm), which makes it more likely to recommend more popular items.
* This can happen if the embedding of that movie happens to be initialized with a high norm. Then, because the movie has few ratings, it is infrequently updated, and can keep its high norm. This will be alleviated by using regularization.
* the expected norm of a $d$-dimensional vector with entries $\sim\mathcal N(0,\sigma^2)$ is approximately $\sigma\sqrt{d}$ .
* Folding
	* The model does not learn how to place the embeddings of irrelevant movies. This phenomenon is known as folding.
* Loss Function
* regularization
	* We can add regularization terms that will address the folding issue.
	* We use two types of regularization:
		* $\ell_2$ regularization term: Regularization of the model parameters.
This is given by $r(U, V) = \frac{1}{N} \sum_i \|U_i\|^2 + \frac{1}{M}\sum_j \|V_j\|^2$.
		* Gravity term : A global prior that pushes the prediction of any pair towards zero.
This is given by $g(U, V) = \frac{1}{MN} \sum_{i = 1}^N \sum_{j = 1}^M \langle U_i, V_j \rangle^2$.
	* The total loss is then given by
: $\displaystyle\frac{1}{|\Omega|}\sum_{(i, j) \in \Omega} (A_{ij} - \langle U_i, V_j\rangle)^2 + \lambda _r r(U, V) + \lambda_g g(U, V)$
		* where $\lambda_r$ and $\lambda_g$ are two [[regularization]] coefficients (hyper-parameters).
* [[matrix factorization implementation]]
