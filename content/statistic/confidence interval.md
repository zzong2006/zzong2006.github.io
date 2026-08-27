---
tags: ["statistic"]
aliases: ["CI", "신뢰 구간"]
---

# 1. Confidence Interval ?

신뢰 구간 (confidence interval) 은 알려지지 않은 모수 (parameter) 에 대한 가능한 값 (plausible values) 들의 범위를 의미한다. 어떤 표본집단에서 추정한 parameter 가 모집단의 parameter 와 정확하게 일치하지 않을 수 있으니 이러한 범위를 정하는 것이다.

## 1.1. 신뢰 구간 계산하기

그렇다면 신뢰 구간은 어떻게 구하는 것일까? 우선, 모집단과 표본집단의 parameter 관계에 대해 생각해볼 필요가 있다.

모집단의 parameter 가 $p$ 이고, 표본집단의 parameter 가 $\hat{p}$ 라면, “$\hat{p}$ 이 $p$ 의 $2 \sigma_\hat{p}$ 에 존재할 확률은 $p$ 가 $\hat{p}$ 의 $2 \sigma_{\hat{p}}$ 에 존재할 확률과 같다 “.  
일반적으로 집단의 분포가 [[Gaussian distribution|normal distribution]] 을 따른다면, 이 확률은 대략 95% 이다. 그리고 $\sigma_{\hat{p}}$ 에 대한 추정값으로 [[standard error]] $S E_{\hat{p}}$ 를 사용할 수 있다. 즉, $S E_{\hat{p}}=\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$ 값으로 $\sigma_{\hat{p}}=\sqrt{\frac{p(1-p)}{n}}$ 를 추정할 수 있는 것이다.  
위 추정을 통해 95% 의 신뢰 수준 (confidence level) 에서 신뢰 구간을 계산한다면, $\left[\hat{p}-2\cdot S E_{\hat{p}},\hat{p}+2\cdot S E_{\hat{p}}\right]$ 가 된다.

## 1.2. 신뢰 구간 해석하기

95% 에 대한 confidence level 에서 구한 신뢰 구간을 어떻게 이해해야 하는가?  
이는 우리가 표본 집단에서 신뢰 구간을 구할때 마다 $p$ 가 그 신뢰 구간에 속할 확률이 95% 가 된다는 것을 의미한다.

결과적으로 confidence level 을 높일수록 $p$ 가 구간에 확률을 높이기 위해 구간이 늘어나고, 표본 집단의 크기가 커질수록 신뢰 구간의 간격이 줄어든다 (더 확실해지므로).

# 2. Application

[[linear regression]]: $\hat{y}=\hat{\beta}_{0}+\hat{\beta}_{1}x$ 의 경우  
$\beta_1$ 에 대한 95% confidence interval 은 다음과 같이 계산된다

$\hat{\beta}_{1}\pm2\cdot\operatorname{SE}\left(\hat{\beta}_{1}\right)$ (그리고 $\hat{\beta}_{0}\pm2\cdot\operatorname{SE}\left(\hat{\beta}_{0}\right)$)  
즉, 95% 의 확률로 $\left[\hat{\beta}_{1}-2\cdot\operatorname{SE}\left(\hat{\beta}_{1}\right),\hat{\beta}_{1}+2\cdot\operatorname{SE}\left(\hat{\beta}_{1}\right)\right]$ 는 $\beta_1$ 의 true value 를 포함한다는 의미다.

* 만약 어떤 계수의 confidence interval 이 상대적으로 넓다면, 그것은 해당 변수로 response ($y$) 를 잘 설명하지 못한다는 증거가 된다.
* In machine learning experiments
* it is common to say that algorithm A is better than algorithm B if the upper bound of the 95 percent conﬁdence interval for the error of algorithm A is less than the lower bound of the 95 percent conﬁdence interval for the error of algorithm B.

# 3. Example

## 3.1. 95% 신뢰 구간

95% 신뢰 구간이란, 다양한 관측값에서 같은 방법으로 구간 추정 ([[interval estimation]]) 을 하면, 그 중의 95% 는 바른 parameter 를 포함하고 있는 구간을 말한다.

동전을 100 번 던져서 앞면이 44 번 나왔을 때, 앞면이 나올 확률 $p$ 이 50% 라는 것이 적합한지 95% 신뢰 구간을 통해 판단하라.  
$p$ 의 신뢰 구간은 (0.343, 0.537) 이며, 다음을 통해 계산할 수 있다.  

$$
(100p-1.96\sqrt{100p(1-p)},100p+1.96\sqrt{100p(1-p)})
$$

* $100p$ 는 평균, $\sqrt{100p(1-p)}$ 는 표준편차

Coin flip 은 [[statistic/Bernoulli distribution]] 을 따른다. 이로 부터, concluded that it is plausible that the coin may be fair because $p=.5$ is in the interval.

# 4. Vs. [[prediction interval]]

* prediction interval 이 [[irreducible error]] $\epsilon$ 을 고려하기 때문에 confidence interval 보다 훨씬 범위가 넓지만, 중앙값은 동일하다 (Example 의 $100p$ 가 중앙값).
* confidence interval 은 데이터가 sampling 되는 true function 에 대해 초점을 맞췄지만, prediction interval 은 학습을 하는 데이터 자체에 대해 초점을 맞춘다.
* confidence
	* 95% of intervals of this form will contain the true value of $f(X)$.
* prediction
	* 95% of intervals of this form will contain the true value of $Y$ for this city.

# 5. Related

* residual standard error
* [[credible interval]]

# 6. References
