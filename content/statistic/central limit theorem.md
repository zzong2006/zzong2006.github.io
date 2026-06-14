---
tags: ["statistic", "hypothesis_test"]
aliases: ["중심 극한 정리"]
---

# A) Central Limit Theorem ?

중심 극한 정리 (central limit theorem) 는 다음과 같이 설명할 수 있다.

모집단이 “ 평균이 $\mu$ 이고, 표준 편차가 $\sigma$ 인 임의의 분포 ” 를 이룬다고 할 때, 이 모집단으로부터 추출된 표본의 크기 $n$ 이 충분히 크다면, ==표본 평균의 분포==는 평균이 $\mu$ 이고, 표준 편차가 $\displaystyle\frac{\sigma}{\sqrt{n}}$ 인 [[Gaussian distribution|normal distribution]] 에 근접한다.

표본 크기 $n$ 이 커질수록 표준 편차의 크기가 줄어들기 때문에, 표준 분포가 더 narrow 해지며, 표준 분포에 더 가까워진다고 생각할 수 있다.

## A.1) Simple Definition

Let us have a random sample $X_{1},\ldots,X_{n}$, then we have

$$
\bar{X}\underset{n\rightarrow+\infty}{\sim}\mathcal{N}\left(\mu,\frac{\sigma}{\sqrt{n}}\right)
$$

# B) 표본 평균의 분포

> [[Sampling distribution]] of sample [[mean]]

모집단에서 표본크기가 $n$ 인 표본을 여러번 반복해서 추출했을 때, 각각의 표본 평균들이 이루는 분포.

표본 자체의 평균이 $\mu$ 에 가까워 지는 것이 아니라, “ 표본 평균 ” 의 분포에 대한 평균이 $\mu$ 에 가까워 지는 것을 의미한다. 다른 의미로 해석하자면, ==독립적인 랜덤 변수들의 합은 근사적으로 정규 분포를 따른다==고 해석할 수 있다.

## B.1) 조건

만약 모집단이 정규 분포를 따르지 않는다면, 평균에 대한 표본 분포는 표본 크기에 따라 달라진다. 표본 개수가 적은 경우 ($n < 30$), 분포는 모집단의 모양과 동일하다. 반대로 표본 개수가 많은 경우 ($n \geq 30$), 중심 극한 정리에 의해 모집단의 분포와 상관없이 평균에 대한 표본 분포가 근사적으로 정규 분포를 따른다.

# C) Central Limit Theorem 가 중요한 이유?

표본 평균들이 이루는 표본 분포와 모집단 간의 관계를 증명함으로써, 수집한 표본의 통계량을 이용해 모집단의 parameters 를 추정할 수 있는 수학적 근거를 마련해주기 때문이다.

![|700](https://i.imgur.com/Q7QtOHq.png)

# D) Related

* [[Z-test]]

# E) References
