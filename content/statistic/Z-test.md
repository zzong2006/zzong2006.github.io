---
title: "Z-test"
tags: ["hypothesis_test", "statistic"]
---

# Z-test ?

Z-test (Z- 검정) 는 [[test statistic]] 의 분포가 [[null hypothesis]] 의 가정 아래 [[Gaussian distribution]] 으로 근사화될 수 있는지 확인하는 [[hypothesis test]] 를 의미한다.

z-test 에서는 분포의 mean 을 테스트하는데, [[central limit theorem]] 에 의해 많은 test statistic 들이 충분한 샘플만 있다면 [[Gaussian distribution]] 분포로 근사화될 수 있다.

## 조건

* sample size 가 충분해야 하고 ($n>30$), 모집단의 분산 값을 알아야 한다. 만약 그렇지 않다면 z-test 보다는 [[Student's t-test]] 가 더 적절하다.
* 각 데이터 포인트가 서로 독립적이다.
* 데이터 분포가 [[Gaussian distribution]] 를 따라야 한다. 만약 그렇지 않더라도 데이터 사이즈가 충분하다면 central limit theorem 에 의해 이 조건은 필요없다.
* 데이터가 population 에서 임의로 선택되어야 한다.

## 과정

* [[null hypothesis]] 와 [[alternative hypothesis]] 를 정한다.
* significant level (유의 수준) $\alpha$ 을 결정한다.
* [[standardization]] 를 계산하고.
* 평균 값을

Two-tails test

* null hypothesis: 표본의 평균과 모집단의 평균이 서로 다르지 않다.
* alternative hypothesis: 표본의 평균과 모집단의 평균이 서로 다르다.

# Related

* [[statistical significance]]

# References
