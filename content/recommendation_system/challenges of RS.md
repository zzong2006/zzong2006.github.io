---
title: "challenges of RS"
tags: ["recommendation_system"]
---

# 1. Challenge of RS ?

추천 시스템에서 발생할 수 있는 문제점들

* nosiy data
	* 일반적으로 historical 데이터는 모두 사용자의 성향을 반영한다고 가정하지만, 사용자는 자신이 선택한 아이템을 좋아하지 않을 수 있다.
* dynamic user preference: capturing the drifted preference from past data
	* 사용자의 성향은 시간이 지나면 바뀔 수 있다.
* bias
	* exposure bias
		* 정의
			* exposure(e.g. vimp) 데이터를 사용하지 않고, click 데이터만 사용하여 발생하는 bias
			* 추천팀에서의 정의: [[soft-clustering]] 에서 특정 그룹에게 특정 아이템 그룹이 지속적으로 노출되는 편향
		* Related Papers
			* Causal embeddings for recommendation. In RecSys. 2018. ACM, 104–112.
			* Causal inference for recommendation.
			* [[Multi-Armed Bandit]]
	* popularity bias
	* Soltuons
		* [[inverse propensity scoring weighting, IPW]]

# 2. Related

# 3. References
