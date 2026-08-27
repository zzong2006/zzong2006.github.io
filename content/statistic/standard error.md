---
tags: ["metrics", "machine_learning", "statistic"]
aliases: ["SE", "표준 오차"]
---

# A) Standard Error ?

표준 오차란, 표본 집단에서 계산할 수 있는 통계 (e.g. 평균) 를 여러번 계산했을 때, 모집단에서 계산할 수 있는 통계와의 편차의 정도를 의미한다.

정의에서 보아도 알 수 있듯이 당연하게도 모평균의 표준오차라는 말은 존재하지 않는다.

[[expectation|expected value]] 와 차이가 나는 정도라고 표현하기도 한다.

## A.1) Vs. Standard Deviation

개별 데이터 포인트의 변동성을 측정하는 [[standard deviation]](표준 편차) 와 표본 측정 지표의 변동성을 측정하는 standard error(표준 오차) 를 혼동하지 말자.

예를 들어, 내가 어떤 모집단의 모평균을 추정하기 위해 표본을 추출하여 표본의 평균값을 계산한다고 가정해보자. 이때, 표본 평균값은 모평균값과 동일하지 않으므로 편차 (변동성) 을 가지는데, 이 편차가 바로 표준 오차가 된다.

즉, 표본 평균들의 표준 편차가 표준 오차를 뜻한다.

## A.2) 계산 방법

표본 평균의 표준 오차에 대한 추정값은 곧 표본 평균의 표준 편차다.

$$
\begin{align}\operatorname{S.E}(\bar{X})&=\sqrt{\operatorname{Var}(\bar{X})}\\ &=\sqrt{\operatorname{Var}\left(\frac{1}{n} \sum X_{i}\right)}=\sqrt{\frac{1}{n^{2}} \operatorname{Var}\left(\sum X_{i}\right)}\\&=\sqrt{\frac{1}{n^{2}} n s^{2}}=\frac{s}{\sqrt{n}}\end{align}
$$

* $s$ 는 [[standard deviation]] 그리고 $n$ 은 표본 개수
* $n$ 은 제곱근의 법칙 ([[square root law]]) 을 따른다.

## A.3) 가정

이 식은 $n$ 개의 observation 들이 uncorrelated 할 때 성립한다.

# B) 예시

## B.1) 도박 게임 확률

카지노 게임에서 1,000 원을 딸 확률은 1/4 이고, 1,000 원을 잃을 확률은 3/4 이다. 게임을 10,000 번 시도한다고 했을 때, 단일 게임 결과의 표준 편차와 시도한 게임 결과의 표준 오차를 계산해보자.

기댓값은 $1000*1/4-1000*3/4=-500$ 원 이다. 이 기댓값을 활용하여, 표준 편차는 다음과 같이 계산된다.

$$
\sqrt{(1000+500)^2*1/4+(-1000+500)^2*3/4}\approx866
$$

10,000 번 시도한다면 카지노에서의 순이득은 $-500*10,000=-500,000$ 이 된다. 이 순이득의 표준 오차는 다음과 같이 계산된다

$$
866*\sqrt{10000}=86,600
$$

즉, 10,000 번 도박을 시도했을 경우 -50 만원의 적자가 발생하며, 여기에 약 8 만 6 천원의 오차가 있다.

## B.2) Regression

standard error 는 regression 의 coefficient 들에 대해서 [[hypothesis test]] 를 수행하는데 사용할 수 있다. 즉, 선형 모델의 추정된 계수에 대해 얼마나 정확한지 판단하는 것이다.

선형 관계 $Y=\beta_{0}+\beta_{1}X+\epsilon$ 에 대해 아래와 같은 통계 검정을 수행한다고 가정해보자.

* [[null hypothesis]]) $H_0$: $X$ 와 $Y$ 의 관계는 존재하지 않는다: $\beta_1=0$
* [[alternative hypothesis]]) $H_a$: $X$ 와 $Y$ 에 어떠한 관계가 존재한다: $\beta_1\neq0$

만일 standard error $\operatorname{SE}\left(\hat{\beta}_{1}\right)$ 가 상대적으로 작다면, 추정값 $\hat{\beta}_{1}$ 가 작아도, $\beta_1\neq0$ 일 가능성이 크다. 반대로 error 가 높다면, $\hat{\beta}_{1}$ 는 null hypothesis 을 기각할만한 충분히 큰 값이 되어야 한다.

여기서 각 계수에 대한 표준 오차는 아래와 같이 계산할 수 있다.

$\displaystyle\mathrm{SE}\left(\hat{\beta}_{0}\right)^{2}=\sigma^{2}\left[\frac{1}{n}+\frac{\bar{x}^{2}}{\sum_{i=1}^{n}\left(x_{i}-\bar{x}\right)^{2}}\right]$, $\displaystyle\mathrm{SE}\left(\hat{\beta}_{1}\right)^{2}=\frac{\sigma^{2}}{\sum_{i=1}^{n}\left(x_{i}-\bar{x}\right)^{2}}$

위에서 $\sigma$ 는 노이즈의 분산 $\sigma^{2}=\operatorname{Var}(\epsilon)$ 을 의미하며, 실질적으로 계산할수는 없다. 그래서 [[residual standard error|RSE]] 를 통해 $\sigma$ 를 추정한다: $\sigma\approx\operatorname{RSE}=\sqrt{\operatorname{RSS}/(n-2)}$

# C) References
