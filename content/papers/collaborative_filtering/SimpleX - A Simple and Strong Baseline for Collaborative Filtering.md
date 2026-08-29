---
title: "SimpleX - A Simple and Strong Baseline for Collaborative Filtering"
aliases: []
tags:
  - collaborative_filtering
  - paper_review
  - recommendation_system
---

# 1. Introduction

learning process of [[collaborative filtering]] 는 크게 3 개의 요소로 나뉘어진다: 1) interaction encoder, 2)loss functions, 3)negative sampling

적은 negative sampling 과 BPR loss 로 학습한 결과는 많은 CF 모델보다 낮은 성능을 보임을 empirically 하게 확인함

해당 논문에서는 interaction encoder 보다 적절한 negative sample 개수와 loss function 의 선택이 더 중요하다는 것을 보임

# SimpleX

* Cosine Contrastive Loss
	* 많은 loss function 이 존재

# 2. Related

[[BPR - Bayesian Personalized Ranking from Implicit Feedback|BPR]]

# 3. References

[[Reinforced Negative Sampling for Recommendation with Exposure Data]]
