---
tags: ["KDD", "deep_learning", "paper_review", "recommendation_system", "reinforcement_learning", "y2018"]
---

# Recommendations with Negative Feedback via Pairwise Deep Reinforcement Learning ?

* Discussion
	* [[Q-learning]] based offline 학습 방식이고, 모델도 무겁고..
	* negative feedback 을 사용했다고 하는데, 관련 연구 내용이 없음
	* 강화학습 주제이지만, MAB 와 비교가 없음
		- [ ] MAB 는 MDP 랑 무슨 관계지?
* Abstract
	* we propose a novel recommender system with the capability of **continuously** improving its strategies during the interactions with users.
	* We model the sequential interactions between users and a recommender system as a Markov Decision Process (MDP) and leverage Reinforcement Learning (RL) to automatically learn the optimal strategies via recommending trial-and-error items and receiving reinforcements of these items from users’ feedback.
* Conclusion
	* the items skipped by users may not be caused by users disliking them, but just not preferring as more as the items clicked/ordered or not viewing them in details at all.
	* The week/wrong negative feedback may not improve or even reduce the performance when we consider the negative feedback.
	* To capture stronger negative feedback, more information like dwell time can be recorded in users’ behavior log and used in our framework.

# References

* https://arxiv.org/pdf/1802.06501.pdf
