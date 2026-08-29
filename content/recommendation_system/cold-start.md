---
title: "cold-start"
aliases: []
tags:
  - cold-start
  - recommendation_system
---

# A) Cold-start ?

* Cold start 문제란, 사용자와 아이템 간 interaction 이 없는 신규 유저나 신규 아이템을 추천 대상에서 제외되는 문제를 뜻한다.
	* ID 를 사전 없이 해시로 임베딩하는 [[hash-based embedding]] 은 신규 아이템에도 즉시 자리를 주지만, 그 자리의 벡터는 아직 학습되지 않은 값이라 cold start 자체를 풀어주지는 않는다. 내용에서 표현을 끌어오는 semantic ID 나 content feature 가 함께 필요하다.
* Cold start 문제를 해결하기 위해 UX(유저 경험, User Experience) 의 편향이 없는 인기글을 추천 결과로 제공해야 한다.
	* 만약, 단순 인기글을 추천 결과로 제공하게 된다면, 글의 품질을 떠나 많은 노출 기회를 얻게되는 글만 인기글이 될 가능성이 높아진다 (빈익빈 부익부 현상).
	* 브런치는 신규 글을 많이 소비하도록 노출 조건이 설정되어 있어서, 최근에 발행된 글이 인기글이 되는 경우가 빈번하다. 그리고, 이러한 노출 조건을 설정함으로써, 추천 성과 지표가 50% ~ 70% 가량 향상됨을 실험적으로 확인했다고 한다.

# B) Related Papers

* [[DropoutNet - Addressing Cold Start in Recommender Systems]]
* collaborative topic regression (CTR):
* [[Joint User-Entity Representation Learning for Event Recommendation in Social Network]] (from Facebook)
* [[Recommending Podcasts for Cold-Start Users Based on Music Listening and Taste]]
