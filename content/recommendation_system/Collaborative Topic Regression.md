---
title: "Collaborative Topic Regression"
tags: ["recommendation_system", "topic_modeling"]
aliases: ["CTR"]
---

[[collaborative filtering]] 과 [[topic modeling]] 을 합친 모델을 의미

* Approaches
* naive
	* $r_{ij}\sim\mathcal{N}\left(u_{i}^{T}\theta_{j},c_{ij}^{-1}\right)$

# The Generative Process for CTR

1. 각 사용자 $i$ 에 대해서 Latent vector $u_{i}\sim\mathcal{N}\left(0,\lambda_{u}^{-1}I_{K}\right)$ 를 draw
2. 각 아이템 $j$ 에 대해서 다음을 실행
	1. [[Dirichlet distribution]] 를 활용하여 topic proportions 을 뽑음: $\theta_{j}\sim\operatorname{Dirichlet}(\alpha)$
	2. item latent offset $\epsilon_{j}\sim\mathcal{N}\left(0,\lambda_{v}^{-1}I_{K}\right)$ 를 뽑고, item latent vector $v_{j}=\epsilon_{j}+\theta_{j}$ 를 계산
	3. $j$ 번째 아이템 (문서) 의 $n$ 번째 단어 $w_{jn}$ 에 대해서, 다음을 실행
		1. [[multinomial distribution]] 을 통해 topic assignment 를 결정: $z_{jn}\sim\operatorname{Mult}\left(\theta_{i}\right)$
		2. 해당 topic 에서 단어를 draw : $w_{jn}\sim\operatorname{Mult}\left(\beta_{z_{jn}}\right)$
3. 각 user-item 쌍 $(i,j)$ 에 대해, rating 값을 draw: $\displaystyle r_{ij}\sim\mathcal{N}\left(u_{i}^{T}v_{j},c_{ij}^{-1}\right)$
	* $c_{ij}$ 는 reward $r_{ij}$ 를 관찰할 수 있는 정도의 confidence 를 의미한다

$$
c_{ij}=\begin{cases}a&\text{if}r_{ij}=1\\b&\text{if}r_{ij}=0\end{cases}
$$ where $a>b>0$
	- $u_i$는 사용자의 latent vector를 의미
# The Graphical Representation
![|500](https://i.imgur.com/4pAt0LB.png)

# Related
## Papers
- [[Collaborative Topic Modeling for Recommending GitHub Repositories]]
- [[Collaborative Topic Modeling for Recommending Scientific Articles]]
## Notes
* [[Latent Dirichlet Allocation]]
* [[Probabilistic latent Semantic Indexing]]
