---
title: "statistical significance"
tags:
  - statistic
  - hypothesis_test
aliases: ["statistically significant"]
---

# Statistical Significance

[[hypothesis test]] 에서 결과가 통계적으로 유의 (statistical significance) 하다 라는 의미는 [[null hypothesis]] 를 가정했을 때, 이러한 결과가 일어나기 힘들 것으로 보인다는 의미이다.

보다 정확하게는 결과에 대한 값들이 $p\leq\alpha$ 를 보이면, 통계적으로 유의하다고 한다.여기서 $\alpha$ 는 [[significance level]] 이고, $p$ 는 [[p-value]] 를 의미한다.

# AB Test in Statistical Significance

Refer links: [(1)](https://analyticsmayhem.com/digital-analytics/statistical-significance-ab-testing/), [(2)](https://towardsdatascience.com/the-math-behind-a-b-testing-with-example-code-part-1-of-2-7be752e1d06f)

[[AB Test]] 의 결과가 통계적으로 유의한지 판단하는 방법은 무엇인가?

일반적으로 유의성 검정은 [[Z-test]] 의 Two-tails test 를 활용한다.

[[Recommendation System]] 에서 수행한 실험 결과 데이터는 [[statistic/Bernoulli distribution]] 를 따른다. 왜냐하면 추천한 아이템이 선택되느냐 (1) 마느냐 (0) 에 따른 값만이 존재하기 때문이다. 즉, $p$ 가 conversion rate 라 할 때, 수집한 데이터의 분포에 해당하는 랜덤 변수는 $p*(1-p)$ 의 분산을 가진다.

Bernoulli distribution 을 따르는 데이터가 충분히 크면, [[central limit theorem]] 을 이용해서 [[Gaussian distribution]] 를 따르는 sampling distribution 을 만들 수 있고 ($\bar{X}\sim N(\mu,\sigma^2/n)$), 이를 Z-test 에 적용할 수 있다.

문제는 Z-test 그리고 중심 극한 정리는 모두 단일 랜덤 변수를 다루기 때문에, (A, B 에 대한) 서로 다른 두 랜덤 변수를 Sum of normally distributed random variables 개념을 활용하여 하나로 합쳐줄 필요가 있다.

즉, A/B 테스트를 통해 얻어진 각 데이터의 결과에 대응하는 두개의 랜덤 변수가 central limit theorem 에 의해 Gaussian distribution 로 변환될 때, 이 둘의 차이를 나타내는 랜덤 변수 $S_{c-v}$ 는 다음과 같다.

$$
S_{c-v}\sim N\left(\mu_{c}-\mu_{v},\ \sigma_{c}^{2}/N_{c}+\sigma_{v}^{2}/N_{v}\right)
$$

$c$ 는 대조군, $v$ 는 실험군을 의미한다.

차이에 대한 분포를 구했는데 분산의 경우 덧셈을 한다. 이는 [[variance]] 의 특징을 활용한 것이다: $\operatorname{Var}(X-Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)$

이렇게 subtraction 에 대한 랜덤 변수를 구한 이유는 Z-test 의 null hypothesis “실험군과 대조군의 표본 분포 평균이 동일하다”를 기각하는지 판단하기 위함에 있다 (서로 같으면 차이가 $0$ 이므로).

합쳐진 랜덤 변수에 대하여 [[standardization]] 는 다음과 같이 계산된다

$$
Z_{\text{score}}=\left(\mu_{c}-\mu_{v}\right)/\sqrt{\left(\sigma_{c}^{2}/N_{c}+\sigma_{v}^{2}/N_{v}\right)}
$$

이후 계산된 z-score 가 특정 신뢰 수준에 해당하는 구간으로 부터 벗어나는지 확인하여, 벗어난다면 null hypothesis 를 기각함으로써 A/B 테스트 결과의 유의성을 검증할 수 있다.

# 예시

## 개요

추천 모델 A, B 가 있다. A 에서는 195 명 중 41 명이 추천된 아이템을 클릭했고, B 에서는 605 명중 351 명이 클릭했다. B 는 A 보다 통계적으로 유의미하게 좋은가? 유의 수준 $α=0.05$ 에서 판단하라. - Refer link: (1)

## Solution

두 모델의 전환율을 먼저 계산한.

$$
A = 41/195=0.21, B=351/605=0.58
$$

각 전환율에 해당하는 분포의 분산은 다음과 같다.

$$
A = 0.21*(1-0.21)/195, B= 0.58*(1-0.58)/605
$$

z-score 를 계산하면 다음과 같다.

$$
\displaystyle Z=\frac{\left(\hat{p}_{1}-\hat{p}_{2}\right)-0}{\sqrt{\left(\frac{\hat{p}_1(1-\hat{p}_1)}{n_{1}}+\frac{\hat{p}_2(1-\hat{p}_2)}{n_{2}}\right)}}=\frac{(.58-.21)-0}{\sqrt{\left(\frac{.21(1-.21)}{195}+\frac{.58(1-.58)}{605}\right)}}=10.45
$$

계산된 z-score 가 [[rejection region]] 에 포함되는지 확인해야 한다.

$10.45 > 1.96$ 이므로, rejection region 에 포함된다. 즉, null hypothesis (A 와 B 는 통계적으로 차이가 없다) 라는 가설을 기각하고, 신뢰 수준 95% 로 B 가 유의미하게 좋다고 말할 수 있다.

real-world A/B test 에서의 statistical significance (통계적 유의성) 은 어떻게 판단하는가? when using large data it becomes “too easy” to reject the null hypothesis of no statistical significance, since confidence intervals are $O(N^{-1})$

## Related

[Netflix techblog](https://netflixtechblog.com/interpreting-a-b-test-results-false-positives-and-statistical-significance-c1522d0db27a)

# References

 https://cosmiccoding.com.au/tutorials/ab_tests
