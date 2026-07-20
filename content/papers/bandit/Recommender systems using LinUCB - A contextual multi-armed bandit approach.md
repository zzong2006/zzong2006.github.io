---
title: "Recommender systems using LinUCB - A contextual multi-armed bandit approach"
tags:
  - MAB
  - bandit
  - paper_review
  - recommendation_system
  - thompson_sampling
aliases: []
---
* Metadata
	* Tag: [[Contextual Bandit]], [[Thompson sampling]], [[LinUCB]], [[Multi-Armed Bandit]]
	* Link: https://towardsdatascience.com/recommender-systems-using-linucb-a-contextual-multi-armed-bandit-approach-35a6f0eb6c4
	* Related Reference: git_issue_Contextual Bandit 을 활용한 개인화추천 성능 고도화 실험, [[A Contextual-Bandit Approach to Personalized News Article Recommendation]]
![[img-17a97cdad4.png]]
		* Even though the recorded mean award achieved for Arm 3 is higher, the algorithm selects arm 2 because of the __uncertainty of its potential__ and updates its confidence bound for future trials.
