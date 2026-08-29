---
title: "An Improved Sampler for Bayesian Personalized Ranking by Leveraging View Data"
aliases: []
tags:
  - WWW
  - implicit_feedback
  - paper_review
  - recommendation_system
---

여기서는 DNS (dynamic negative sampling) 전략으로 불림

* Introduction
	* DNS 방식은 item 크기가 클 때 낮은 효율을 보임
	* Two RQ(Research Questions)
		* 전체 space 에서 negative sampling 을 하는것이 꼭 필요한가?
		* BPR 을 위해 더 나은 sampling 을 제안할 수 있는가?
* Unnecessary to sample from all items
	* 전체 item space 에 대해서 uniform 하게 sampling 을 진행하지 않아도 성능에 큰 영향이 없었음
	* 특히 item size 가 큰 경우 (약 10 만개 이상), item space 를 줄였더니 오히려 성능 향상이 있었음
		* space 줄이는 방법은 임의로 일부 아이템들을 선택
* A View-Enhanced Sampler
	* 하나의 유저에 대해 3 가지 sets 으로 item space 를 나눔: $\mathcal{P}_{u},\mathcal{V}_{u},\text{and}\mathcal{R}_{u}$
		* 순서대로, 해당 유저가 구입한 아이템들, 구입하진 않았지만 view 가 발생한 아이템들 그리고 나머지 아이템들
	* 그리고 $(i,j)$ 를 세 candidate sets 에서 샘플링을 진행
: $\left\{(i,j)\mid i\in\mathcal{P}_{u},j\in\mathcal{V}_{u}\right\}$, $\left\{(i,j)\mid i\in\mathcal{P}_{u},j\in\mathcal{R}_{u}\right\}$, $\left\{(i,j)\mid i\in\mathcal{V}_{u},j\in\mathcal{R}_{u}\right\}$

	* 여기서 $(u,i,j)\in\mathcal{D}$ 는 $u$ 가 $i$ 를 $j$ 보다 더 좋아한다는 의미
	* 샘플링 할때는 미리 정의된 확률 값 ($\left[\omega_{1},\omega_{2},\omega_{3}\right]$) 으로 휴리스틱하게 진행
* Discussion
	* click 이 없는 ($\mathcal{P}_{u}$ 가 없는) case 에서도 잘 동작하는 로직을 원하기 때문에 별로…
	* 확률 값을 미리 정하는 것도 별로임

# A) Related

* [[BPR - Bayesian Personalized Ranking from Implicit Feedback]]
* [[Improving Pairwise Learning for Item Recommendation from Implicit Feedback]]

# B) References

* paper link: https://dl.acm.org/doi/pdf/10.1145/3184558.3186905
