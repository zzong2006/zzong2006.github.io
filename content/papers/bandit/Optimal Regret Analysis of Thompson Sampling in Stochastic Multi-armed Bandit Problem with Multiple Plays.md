---
title: "Optimal Regret Analysis of Thompson Sampling in Stochastic Multi-armed Bandit Problem with Multiple Plays"
tags: ["MAB", "bandit", "paper_review"]
---

# A) Optimal Regret Analysis of Thompson Sampling in Stochastic Multi-armed Bandit Problem with Multiple Plays ?

# B) Introduction

* Thompson sampling is an old heuristic that has a spirit of Bayesian inference and selects an arm based on posterior samples of the expectation of each arm.

# C) Algorithm: MP-TS for Binary Rewards

![](https://i.imgur.com/hlzmxgL.png)

* Improvement of MP-TS based on the empirical means
	* In the theoretical analysis of the MP-MAB problem, we observed that an extra loss arises when multiple suboptimal arms are drawn at the same round.
	* Based on this observation, the new algorithm selects $L-1$ arms on the basis of empirical averages and selects the last arm on the basis of TS to avoid simultaneous draws of suboptimal arms.
		* In other words, this algorithm is further aimed to minimize the regret by purely exploiting the knowledge in the top-$(L-1)$ arms; thus, limiting the exploration to only one arm.
		* One might fear that this increase in exploitation could devastate the balance between exploration and exploitation.

# D) References

* Link: https://arxiv.org/pdf/1003.0146.pdf
* Related Reference: https://arxiv.org/pdf/1506.00779.pdf
