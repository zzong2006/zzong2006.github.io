---
tags: ["RecSyS", "bias", "evaluation", "implicit_feedback", "offline_evaluation", "paper_review", "y2018"]
---

[Paper link](https://vision.cornell.edu/se3/wp-content/uploads/2018/08/recsys18_unbiased_eval.pdf)

# A) Abstract

* (a) investigate evaluation bias of AOA(Average-Over-All) evaluator
* (b) an unbiased and practical offline evaluator for implicit [MNAR]([[MNAR]]) datasets 를 제안
	* the Inverse-Propensity-Scoring ([IPS]([[inverse propensity score]])) technique 을 사용

# B) Introduction

* task: unbiased evaluation of recommendation performance offline
	* 해당 task 를 해결하기 위해 많은 방법이 제안되었지만, 대부분 explicit feedback 을 위한 것이고, [[implicit feedback]] 에는 적합하지 않음

# C) Related Work

* Debiasing the evaluation of ExplicitRec
* ImplicitRec and evaluation
	* implicit feedback 을 사용하는 추천 시스템들
		* click
		* watch: [[The YouTube Video Recommendation System]]
		* view: [[Personalizing Software and Web Services by Integrating Unstructured Application Usage Traces]]
* Counterfactual evaluation

# D) Experiment

biased feedback 으로 실험하고 unbiased evaluator 를 사용함

## D.1) Investigating Popularity Bias

실제 추천시스템에서 [[popularity bias]] 가 어느정도 확인되는지 조사하는 실험으로, 두 가지 종류의 bias 를 조사함

1. interaction bias: 사용자가 인기있는 아이템에 대해서 더 상호작용 하려함
2. presentation bias: 추천 방식이 인기 아이템에 대해서 불공평하게 더 추천해줌

그런데 어차피 사용자는 보이는 것만 상호작용 하기 때문에, interaction bais 와 presentation bias 를 나누기가 어렵다. 그래서 둘의 joint effect 를 확인할 수 있는 $n_{i}^{*}$ 의 분포를 확인하려 함

* $n_{i}^{*}$ : 사용자들이 각 아이템에 대해 상호작용한 횟수

직관적으로 봤을때, 편향없는 플랫폼이라면 사용자를 좀 더 다양하게 상호작용 시켜야 할 것 이다 ([[Gini index]].
