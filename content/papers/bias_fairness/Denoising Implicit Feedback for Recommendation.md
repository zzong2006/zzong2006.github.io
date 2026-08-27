---
tags: ["WSDM", "bias", "fairness", "implicit_feedback", "paper_review", "y2021"]
---

# Denoising Implicit Feedback for Recommendation ?

# Abstract

* [[implicit feedback]] 은 획득하기 쉬워서 data sparsity 를 완화하지만, 유저의 실제 만족도를 잘 반영하지 않는다: **noisy**

예시) E-commerce: 클릭의 대부분은 구매로 이어지지 않고, 구매한 물품 중에도 불만족하여 negative review 가 남음

implicit feedback 의 이러한 noisy 특성을 고려한 추천 연구가 적은 상태

* 추천 학습의 효율성을 향상시키기 위해 noisy 한 interaction 을 pruning 하고 identify 하는 것이 목적
* Adaptive Denoising Training (ADT) 제안: adaptive loss function
* adaptive loss function 를 위한 두가지 패러다임 고안
	* Truncated Loss: 매 iteration 마다 dynamic threshold 에 해당하는 large-loss sample 를 제외함
	* Reweighted Loss: large-loss sample 들의 가중치를 낮춤
* binary cross-entropy loss 에 ADT 를 적용하여 기존 학습 방식에 비해 어느정도 효과가 있는지 확인함

# Introduction

Study on false-positive feedback

* effect of noisy training samples 은 일반적으로 image [[classification]] 과 같은 ML task 에서 자주 연구됨
* Related work: denoising implicit feedback
	* Negative Experience Identification
		* additional feature 를 활용해서 false-positive 를 classification
			* e.g. 체류 시간, item feature
	* Incorporation of Various Feedback
		* extra feedback 의 활용
			* e.g. 좋아요, 구독 등
	* Related work 의 limitation
		* 추가 데이터가 필요하며, extra feedback 같은 경우 높은 sparsity 가 문제가 됨
	* Compared to related work
		* 본 논문은 추가 데이터가 필요없이 false-positive 의 영향력을 줄이는 접근을 시도

# Approach

Implicit feedback 중 false-positive 에 집중하고 이를 denoising 하고자 함

# References
