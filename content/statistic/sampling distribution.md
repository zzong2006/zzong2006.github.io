---
title: "sampling distribution"
tags: ["statistic"]
aliases: ["표본 분포"]
---

# A) Sampling Distribution ?

표본 분포란, 임의의 샘플링 결과들에 의해 구해진 확률 분포를 의미한다.

# B) The Normal Condition for Sample Proportions

주어진 샘플 분포가 normal 분포를 근사하게 따르는지 확인할 수 있는 방법

여기서 샘플링된 결과는 베르누이 실행을 통한 것으로, 성공할 기댓값 $np$ 가 10 을 넘고 실패할 기댓값 $n(1-p)$ 도 10 을 넘는다면, 표본 비율의 분포는 normal 분포를 근사하게 따르게 된다.

# C) 표본 비율의 평균과 표준편차

표본 비율에 대한 표본 분포의 평균은 모 비율의 평균과 동일하다.  

$$
\mu_{\hat{p}}=p
$$

표본 비율에 대한 표본 분포의 표준편차는 다음과 같다.  

$$
\sigma_{\hat{p}}=\sqrt{\frac{p(1-p)}{n}}
$$

# D) Sample Proportions 에 따라 계산하기

표본 분포에 대한 확률 $P(n_0 < \hat{p}< n_1)$ 계산하기

만약 모 비율에 대한 평균 $p$ 을 알고있다고 가정하자. 이때 모집단에서 표본을 뽑았을 때, 그 표본의 얼만큼의 비율이 특정 조건을 따르는지에 대한 확률을 알고싶을 때가 있다. 예를 들어, $j$ 개가 존재하는 모집단에서 $k$ 개를 표본으로 뽑았을 때, 어떤 조건을 만족하는 표본의 비율이 $n_0\%$ 보다 많고 $n_1\%$ 보다 적을 확률은 무엇인가?

1. 표본 비율에 대한 평균 $\mu_{\hat{p}}$ 과 표준 편차 $\sigma_{\hat{p}}$ 를 계산한다.
2. [[Gaussian distribution|normal distribution]] 의 [[Cumulative Distribution Function|CDF]] 계산기를 통해 lower bound $n_0$ 과 upper bound $n_1$ 을 설정하고 확률을 계산한다.

## D.1) normalCDF 계산기가 없다면?

boundary 를 [[standardization|z-score]] 로 변환하고, z-score table 을 참조하여 계산할 수 있다.

예를 들어, $P(x<\hat{p}<y)$ 를 계산하고 싶다고 해보자. 이 경우 다음과 같이 바꿀 수 있다.  

$$
P(x<\hat{p}<y)=P\left(z<\frac{y-p}{\sqrt{\frac{p(1-p)}{n}}}\right)-P\left(z<\frac{x-p}{\sqrt{\frac{p(1-p)}{n}}}\right)
$$

# E) 모 비율의 Parameter 찾기

일반적으로 모집단에 대한 평균 $p$ 과 표준 편차 $\sigma$ 를 찾는 것은 어렵다. 하지만 [[central limit theorem|중심 극한 정리]] 를 활용하여 표본 평균에 대한 분포의 평균 $\mu_{\bar{x}}$ 과 분산 $\sigma_{\bar{x}}^{2}$ 을 구함으로써, $p$ 와 $\sigma$ 를 쉽게 찾을 수 있다. 다만, 충분한 표본 개수 $n$ 이 보장되어야 한다 (최소 $n > 10$ 정도).

어느정도 표본 개수가 보장되는 경우, 표본 평균으로 구성된 분포의 평균과 모집단의 평균과 동일하며, 모집단의 [[standard deviation|표준 편차]] 에서 $\sqrt{n}$ 값을 나누면 표본 평균 분포에 대한 표준 편차를 얻을 수 있다 ($n$ 은 샘플 개수).

# F) References
