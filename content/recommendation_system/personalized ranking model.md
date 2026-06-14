---
title: "personalized ranking model"
---


# A) Personalized Ranking Model ?

* 최적화 방식이 세 가지로 나뉘어짐
	* pointwise
		* Pointwise approaches considers a single interaction at a time and train a classifier or a regressor to predict individual preferences.
		* 예시) [[matrix factorization]], [[AutoRec]]
	* pairwise
		* Pairwise approaches consider a pair of items for each user and aim to approximate the optimal ordering for that pair.
		* 일반적으로 pairwise 방식이 ranking 업무에 더욱 적절하다.
		* 예시) [[BPR - Bayesian Personalized Ranking from Implicit Feedback]]
	* listwise
		* Listwise approaches approximate the ordering of the entire list of items, for example, direct optimizing the ranking measures such as Normalized Discounted Cumulative Gain ([[Normalized Discounted Cumulative Gain]]).
		* pointwise 나 pairwise 방식보다 복잡하며 계산 비용이 높다.

# B) Related

# C) References
