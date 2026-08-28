---
title: "Combating Selection Biases in Recommender Systems with a Few Unbiased Ratings"
tags: ["WSDM", "bias", "fairness", "paper_review", "y2021"]
---

# Combating Selection Biases in Recommender Systems with a Few Unbiased Ratings ?

* Tags
	* [[selection bias]],
* Abstract
* Introduction
	* unbiased ratings 포함시키는 방법: 임의로 선택된 일부 아이템들에 대해 유저들에게 rating 을 요청함
* Related work
	* Recommendation Debiasing
		* 기존의 debiasing 은 주로 두 가지 측면에 초점을 둠: 1) rating prediction, 2) item ranking
		* rating prediction task 에서 일반적으로 잘 알려진 문제는 학습 데이터가 주로 biased 되어 있다는 것.
			* 초기 연구에서는 a joint likelihood of a propensity model and a rating model 를 최적화 하는 방향을 접근했지만 inference 복잡도가 매우 높았음
			* 이러한 복잡도를 피하기 위해, 최근 연구에서는 two-phase learning 을 도입함

첫째로 propensity model 을 학습하고, 둘째로 training model 에 propensity weighting 기법을 적용함

* [[Recommendations as treatments - debiasing learning and evaluation]]
* [[Doubly robust joint learning for recommendation on data missing not at random]]

# References
