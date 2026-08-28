---
title: "likelihood"
tags: ["statistic"]
---

# A) Likelihood ?

likelihood 는 [[Probability]] 와 반대되는 개념으로, 랜덤 변수 $X$ 에 따른 샘플 $x$ 이 주어졌을 때, 랜덤 변수가 따르는 parameter 가 $\theta$ 될 확률을 의미한다. 이는 주로 $\mathcal{L}(\theta\mid x)$ 로 표현한다.

# B) Likelihood Vs Probability

확률 변수의 특성에 따라 서로 같을 수 도 있고, 다를 수 도 있다.

이산형 확률 변수에 관해서는 특정 관측치에 관한 확률을 구할 수 있기 때문에, [[Probability]] 와 [[likelihood]] 의 개념적 차이는 없다. 일반적으로 $\mathcal{L}(\theta\mid O)=P(O\mid\theta)$ 를 만족하기 위한 $\theta$ 를 추정하는 것으로 생각할 수 있다.

연속형 확률 변수에서 [[Probability]] 는 특정 관측치에 대한 값은 항상 $P(O\mid\theta)=0$ 이다.

[[likelihood]] 는 [[Probability Density Function|pdf]] 의 그래프에서 $y=f(O\mid\theta)$ 값을 나타낸다. 즉, $\mathcal{L}(\theta\mid O)=f(O\mid\theta)$ 를 만족하는 $\theta$ 를 추정하는 것으로 생각할 수 있다.

# C) References
