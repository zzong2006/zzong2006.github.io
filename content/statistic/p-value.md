---
title: "p-value"
aliases: []
tags:
  - statistic
  - hypothesis_test
---

# A) P-value 는 무엇인가?

p-value 는 귀무가설 ([[null hypothesis]]) $H_0$ 이 참이라고 가정했을 때, 표본으로부터 얻어지는 통계치 (예: 표본 평균) 가 나타날 (관측될) 확률값이다. 이 확률이 희박하면 희박할수록, 귀무가설이 틀렸다고 말할 만한 강한 근거가 된다.

## A.1) P-value 의 해석

p-value 를 통해 전달하고자 하는 의미는 “랜덤 모델이 주어졌을 때, 그 결과가 관찰된 결과보다 더 극단적일 확률” 이다.

p-value 가 낮다는 것은 귀무가설이 참이라는 가정 하에 표본을 추출했을 때, 이런 표본 평균이 관측될 확률이 낮다는 것을 뜻한다. 즉, p-value 가 매우 낮으면, 이러한 표본 통계량은 우연히 나타나기 어려운 경우이므로, 귀무가설 (null hypothesis) 을 채택하지 않고 (기각하고), 대립가설 ([[alternative hypothesis]]) 을 채택하게 된다.

# B) 왜 P-value 를 사용하는가?

우리는 표본을 추출하고 그 표본으로부터 얻은 정보를 기초로 하여 귀무가설 (null hypothesis) 이 참인지 거짓인지를 판정한다. 따라서 항상 오류의 가능성이 존재하는데, 이는 표본을 추출할 때마다 매번 통계치가 달라지기 때문이다.

이러한 오류의 가능성을 수치화하려는 시도가 바로 p-value 이다.

p-value 가 높고 낮음을 기준하는 값을 유의 수준 (significance level) $\alpha$ 라고 하는데, 주로 5% 를 기준으로 설정하므로, 일반적으로 $\alpha=0.05$ 를 사용한다.

# C) P-value 예시

[youtube link](https://youtu.be/-FtlH4svqx4)

1. 표본을 통해 [[standard deviation]] 계산하기

$$
\displaystyle\sigma_{\bar{X}}=\frac{\sigma}{\sqrt{N}}\approx\frac{s}{\sqrt{N}}
$$

* $N$ 은 샘플 총 개수
* $\sigma$ 는 이상적인 standard deviation
* $s$ 는 표본을 통해 얻어낸 standard deviation

1. [[standardization]] 계산하기

$$
\displaystyle z=\frac{x-\bar{x}}{S}
$$

* $\bar{x}$ 는 샘플의 [[mean]]
* $S$ 는 샘플의 standard deviation

# D) P-value 의 한계

Since the statistical test is a function of the sampleand effect sizes, if an early effect size is large through natural variation it is likely for the p-value to be below 0.05 early.

# E) Z-score 에서 P-value 구하기

[[survival function]] 을 이용하면 [[standardization|z-score]] 에서 p-value 를 구할 수 있다.

참고: [How to Find a P-Value from a Z-Score in Python - Statology](https://www.statology.org/p-value-from-z-score-python/)

# F) References

[[statistical significance]]
