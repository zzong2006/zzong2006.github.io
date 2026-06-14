---
tags: ["RecSyS", "bias", "fairness", "paper_review", "recommendation_system", "y2020"]
---

# A) Abstract

“ 만약 사용자에게 강제로 영화를 보게 만든다면 어떻게 평가할 것인가?”: causal inference question

# B) Introduction

* prediction: “ 사용자가 영화를 보았을 때, 평점은?”
* causal inference: “ 우리가 사용자에게 그 영화를 노출시켰을 때, 평점은?”
* 일반적인 접근 방식에서 사용하는 user & item rating matrix 는 사용자가 임의로 영화를 확인하는 경우를 가정한다. 그러나 사용자는 랜덤으로 영화를 보지 않기 때문에 관찰된 평점 데이터에서 causal question 에 대답하는 것은 어려움
	* 이런 이슈를 [[confounder]] 라 부른다.
* The Deconfounded Recommender
* Empirical Studies
	* Evaluation 에서 strong generalization 을 썼다고 하는데, training set 에 존재하지 않는 new user 에 대한 prefernece prediction 이라고 함. 어떻게 한거지?
		* paper [[Modeling user rating profiles for collaborative filtering]] 를 참고했다고 한다.

# C) Related

# D) References
