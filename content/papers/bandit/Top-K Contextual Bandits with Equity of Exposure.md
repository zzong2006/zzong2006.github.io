---
title: "Top-K Contextual Bandits with Equity of Exposure"
tags: ["RecSyS", "bandit", "contextual_bandit", "paper_review", "y2021"]
---

# Top-K Contextual Bandits with Equity of Exposure ?

# Abstract

Probability Ranking Principle 에 의하면 top-K items 을 greedy 하게 rank 하는것이 optimal 함

대신

* Introduction
	* This work investigates how the “equity of exposure” principle can be applied to top-K contextual bandit problems for recommendation
	* We propose a novel algorithm for Exposure-Aware aRm Selection(EARS), which tackles the relevance-fairness trade-o” in a personalised manner.
		* To the best of our knowledge, EARS is the first algorithm that deals with equity of exposure in top-K contextual bandit recommenders.
* Related paper
	* [[Evaluating Stochastic Rankings with Expected Exposure]]: equity of exposure principle 제안, exploiting the stochasticity of rankings to lead to fairness in expectation.
	* Investigating Listeners’ Responses to Divergent Recommendations: how different users respond to diverging recommendations, and observed that the openness of a user to randomised recommendations can vary wildly

# References

* paper:
* source code: https://github.com/olivierjeunen/EARS-recsys-2021
* Algorithm
	* [sorting code link](https://github.com/olivierjeunen/EARS-recsys-2021/blob/2093d670d21b5b7b149efd4cd9efbad7728f048a/src/policies.py#L301)
