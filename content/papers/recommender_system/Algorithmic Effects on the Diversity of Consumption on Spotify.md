---
title: "Algorithmic Effects on the Diversity of Consumption on Spotify"
tags: ["WWW", "diversity", "paper_review", "recommendation_system"]
---

# A) Generalist Specialist Score (GS-score)

* 주어진 유저의 다양성을 수치적으로 측정하는 metric: GS-score 는 어떤 한 노래의 vector 와 사용자들의 vector 들 간 [[cosine similarity]] 의 평균을 측정한다.
* specialist 들에게는 이 평균이 높게 나올것이고, generalist 들에게는 이 평균이 낮게 나올것이다.
	* 특정 사용자가 유사한 곡들을 듣는다면 이들을 specialist 로 레이블링하고, 다양한 곡들을 듣는다면 generalist 로 레이블링한다.

$$
\displaystyle GS\left(u_{i}\right)=\frac{1}{\sum w_{j}}\sum_{j}w_{j}\frac{\vec{s_{j}}\cdot\vec{\mu_{i}}}{\|\vec{s_{j}}\|\cdot\left\|\vec{\mu}_{i}\right\|}
$$

어떤 유저 $u_i$ 가 노래 $s_j$ 를 $w_j$ 번 들었다고 가정한다면, $\vec{s_{j}}$ 는 $s_j$ 의 노래 embedding 에 대한 vector 표현을 의미.

$$
\displaystyle\vec{\mu}_{i}=\frac{1}{\sum w_{j}}\cdot\sum_{j}w_{j}\vec{s_{j}}
$$

$\vec{\mu}_{i}$ 는 $u_i$ 의 중심 (해당 유저의 노래 벡터의 centroid)

특정 시간 구간대 $T$ 에서 사용자 $u_i$ 의 청취 기록 $D_{i}=\left\{\left(s_{j},w_{j}\right)\right\}$ 을 이용하여, $u_i$ 의 $T$ 에서 musical diversity ${GS}\left(u_{i}\right)$ 를 측정할 수 있음

# B) [[Gini index]] 나 [[entropy]] 와 비교

* 이 두 방식은 사용자들이 서로 다른 아이템들을 어느 정도 소비했는지는 확인할 수 있어도, 아이템들 간 유사도는 고려하지 않음
	* 예를 들어, 서로 다른 두 비틀즈 곡을 들은 어떤 한 사용자와, 조용필과 이문세 노래를 들은 어떤 한 사용자는 동일한 다양성을 가지도록 분류될 것임. 하지만, 후자가 좀 더 서로 다른곡을 다양하게 들었음.
* 또한, diversity metric 에서 아이템 간 유사도 뿐만 아니라, 어떤 아이템을 몇번이나 소비했는지도 고려한지 중요한데, GS-score 는 그것을 고려함

# C) References
