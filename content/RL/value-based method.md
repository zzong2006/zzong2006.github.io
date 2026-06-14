---
title: "value-based method"
tags: ["reinforcement_learning"]
---

# A) Value-based Method ?

RL 커뮤니티에서는 [[Q-learning]] 으로 정의되며, bandit literature 에서는 Direct Method(DM) 라고 불린다.

context 와 학습된 모델이 주어진 상태에서 positive reward 가 주어질 확률이 가장 높은 action 을 취하는 방법이다.

## A.1) 단점

* model misspecification in supervised learning
* 수집된 학습 데이터가 모델에 의해 크게 영향을 받을때

## A.2) 특징

[[importance sampling]] 보다 일반적으로 variance 가 낮지만, 일반적으로 biased 하다.

Comparison with [[inverse propensity score]] and [[value-based method]]

* $\displaystyle\widehat{V}_{\mathrm{IPS}}(\pi,\mathcal{D})=\sum_{(c,a,r)\in\mathcal{D}}r\cdot\frac{\pi(a\midc)}{\widehat{\pi_{0}}(a\mid c)}$
* $\displaystyle\widehat{V}_{\mathrm{DM}}(\pi,\mathcal{D})=\sum_{(c,a,r)\in\mathcal{D}}\sum_{a^{\prime}\in\mathcal{A}}\pi\left(a^{\prime}\midc\right)\cdot\widehat{r}\left(a^{\prime},c\right)$
	* $\widehat{r}(a,c)\approx\mathbb{E}[R\mid C=c,A=a]$

[[value-based method]] 의 경우 logging policy 모델에 의존하지 않고, context 가 주어진 action 의 reward 에 의존함

# B) Related

# C) References

http://math.uchicago.edu/~may/REU2019/REUPapers/Kim,SangHoon.pdf
