---
title: "Probability"
aliases: []
tags:
  - statistic
---

# A) Probability

어떤 시행(실험)에서 특정 결과(샘플)가 나올 가능성을 확률 $P(A), A \in \mathcal{A}$로 표현한다. 다시 말해, 관측값 또는 관측 구간이 주어진 [[Probability Distribution]]에서 나타날 가능성의 정도를 의미한다.

확률은 $P(\text{data} \mid \text{distribution})$로 나타내며, 이 표현을 뒤집으면 [[likelihood]]가 된다. 즉, 랜덤 변수 $X$가 파라미터 $\theta$를 가진 분포를 따를 때, 특정 값 $x$가 관측될 확률을 $P(x \mid \theta)$로 표현할 수 있다.

확률 간 비교는 확률 변수의 특성에 따라 다르게 이루어진다.
* 이산형 확률 변수의 경우, 특정 관측치에 대한 확률 값을 직접 구할 수 있어 비교가 쉽다.
* 연속형 확률 변수의 경우, 특정한 한 점에서의 확률은 0이기 때문에 일정 구간을 정하여 해당 구간 내의 넓이([[statistic/Probability Density Function|pdf]])를 통해 확률 값을 계산한다.

사건 $A^c$는 사건 $A$가 일어나지 않는 경우를 의미하며, 전체 확률의 합은 1이므로 다음이 성립한다:

$$P(A^{c}) = 1 - P(A)$$

만약 사건들 $A_i: i=1,\cdots,m$이 서로 배반(mutually exclusive)이라면 다음 관계가 성립한다:

$$
	P\left(\bigcup_{i=1}^{m} A_i\right) = \sum_{i=1}^{m} P(A_i)
$$

# B) Related

* [[random variable]]

# C) References
