---
title: "Early Stopping"
tags: machine_learning 
aliases: []
---

# 1. Early Stopping ?

# 2. Early Stopping 전략이란 무엇인가?

Early Stopping 은 overfitting 현상을 완화하는 방법으로, 학습을 하다가 일정 기준에 의해 학습을 중간에 멈추는 방법을 의미한다.

![[img-c105d6d208.png|image-20201128173444275]]

모델 학습 시, weight 가 처음에는 0 과 비슷한 값으로 설정되고, 이후 학습을 거칠 수록 weight 가 커질 것이다.

	- [[overfitting]] 현상을 완화하기 위해 L2 Norm 과 비슷한 metrics 을 이용하여 weight 가 너무 커지기 전에 중간에 학습을 멈춘다.

	- 이는 L2 [[regularization]] 과 비슷한 효과를 준다.

* [[Early Stopping]] 의 단점
	* 비용 함수 최소화 과정과 [[overfitting]] 완화 과정을 분리해서 수행할 수 없다는 점이다.
	* 중간에 학습이 멈추게되면 [[overfitting]] 은 완화시킬 수 있지만, cost function 의 최소화 과정을 더 이상 진행할 수 없다.
		* 그래서 Andrew Ng 씨는 그냥 L2 [[regularization]] 을 적용한다고 한다.
		* 다만 L2 Norm 은 lambda 값을 일일이 찾아봐야 한다는 단점이 있다.

# 3. Related

# 4. References
