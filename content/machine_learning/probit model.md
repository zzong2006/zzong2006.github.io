---
tags: ["linear_regression statistic"]
---

# A) Probit Model ?

probit model 은 [[regression]] 의 종류 중 하나로, 출력값 ([[response variable|dependent variable]]) 이 binary 형식을 띄는 모델을 의미한다.

[[logistic regression]] 과 동일한 문제를 푸는것이며, [[Generalized Linear Model|GLM]] 입장에서는 probit link function 을 사용하는 모델이 될 것이다.

# B) 개념

출력값 $Y$ 는 binary 이고, 입력값 ([[explanatory variable|predictor variable]]) 이 벡터 $X$ 인 경우, 다음과 같이 모델을 표현할 수 있다.

$$
\operatorname{Pr}(Y=1 \mid X)=\Phi\left(X^{T} \beta\right)
$$

* 여기서 $\Phi$ 는 표준 [[Gaussian distribution|정규 분포]] 의 [[Cumulative Distribution Function|CDF]] 를 의미한다.
	* 표준 정규 분포를 쓰는 이유는 임의의 평균과 표준 편차에 대해 generality 를 잃지 않기 위함이다.
* 여기서 parameter $\beta$ 는 일반적으로 [[Maximum Likelihood Estimation|MLE]] 를 통해 추정한다.

그런데 왜 CDF 인가?

probit model 을 다음과 같은 latent variable model $Y^*$ 를 통해 표현해보자.

$$
Y^{*}=X^{T} \beta+\varepsilon,\ \ \varepsilon \sim N(0,1)
$$

$$
Y=\left\{\begin{array}{ll}
1 & Y^{*}>0 \\
0 & \text { otherwise }
\end{array}\right\}=\left\{\begin{array}{ll}
1 & X^{T} \beta+\varepsilon>0 \\
0 & \text { otherwise }
\end{array}\right\}
$$

이제 위 모델을 통해 CDF 모델을 유도할 수 있다.

$$
\begin{aligned}
\operatorname{Pr}(Y=1 \mid X) &=\operatorname{Pr}\left(Y^{*}>0\right) \\
&=\operatorname{Pr}\left(X^{T} \beta+\varepsilon>0\right) \\
&=\operatorname{Pr}\left(\varepsilon>-X^{T} \beta\right) \\
&=\operatorname{Pr}\left(\varepsilon<X^{T} \beta\right) \\
&=\Phi\left(X^{T} \beta\right)
\end{aligned}
$$

\

$$
# Model Estimation

## Using MLE

다음과 같이 $n$ 개의 독립적인 data set $\left\{y_{i}, x_{i}\right\}_{i=1}^{n}$ 을 입력받은 경우, single observation 에 대해 확률값을 다음과 같이 계산할 수 있다.
$$

\begin{aligned}

&\operatorname{Pr}\left(y_{i}=1 \mid x_{i}\right)=\Phi\left(x_{i}^{\prime} \beta\right) \\

&\operatorname{Pr}\left(y_{i}=0 \mid x_{i}\right)=1-\Phi\left(x_{i}^{\prime} \beta\right)

\end{aligned}

$$
\
$$

* 여기서 $x_i$ 는 $K \times 1$ 크기를 가지는 vector 이다.

단일 observation 에 대한 [[likelihood]] 값은 $\mathcal{L}\left(\beta ; y_{i}, x_{i}\right)=\Phi\left(x_{i}^{\prime} \beta\right)^{y_{i}}\left[1-\Phi\left(x_{i}^{\prime} \beta\right)\right]^{\left(1-y_{i}\right)}$ 이므로, 전체 sample 에 대한 joint likelihood 값은 다음과 같다.

$$
\mathcal{L}(\beta ; Y, X)=\prod_{i=1}^{n}\left(\Phi\left(x_{i}^{\prime} \beta\right)^{y_{i}}\left[1-\Phi\left(x_{i}^{\prime} \beta\right)\right]^{\left(1-y_{i}\right)}\right)
$$

아래는 Log-likelihood 버전이다.

$$

\ln \mathcal{L}(\beta ; Y, X)=\sum_{i=1}^{n}\left(y_{i} \ln \Phi\left(x_{i}^{\prime} \beta\right)+\left(1-y_{i}\right) \ln \left(1-\Phi\left(x_{i}^{\prime} \beta\right)\right)\right)

$$

여기서 위 Likelihood 식을 더 짧게 만들 수 있다. 대칭인 표준 정규 분포의 경우 $\left[1-\Phi\left(x_{i} \beta\right)\right]=\left[\Phi\left(-x_{i} \beta\right)\right]$ 를 만족하고, $2 * y_i  - 1 = q_i$ 를 응용하면 다음과 같이 표현이 가능하다.

$$

\begin{aligned}

\mathcal{L}(\beta ; Y, X) &=\prod_{i=1}^{N}\left[\Phi\left(x_{i} \beta\right)\right]^{y_{i}}\left[1-\Phi\left(x_{i} \beta\right)\right]^{1-y_{i}} \\

&=\prod_{i=1}^{N}\left[\Phi\left(q_{i} x_{i} \beta\right)\right]^{y_{i}}\left[\Phi\left(q_{i} x_{i} \beta\right)\right]^{1-y_{i}} \\

&=\prod_{i=1}^{N}\left[\Phi\left(q_{i} x_{i} \beta\right)\right]^{y_{i}+1-y_{i}} \\

&=\prod_{N}^{N} \Phi\left(q_{i} x_{i} \beta\right)

\end{aligned}

$$

# C) Some Notes

여기서 probit 은 probability + unit 의 합성어이다.

# D) Related

# E) References

* https://en.wikipedia.org/wiki/Probit_model
* https://www.statlect.com/fundamentals-of-statistics/probit-model-maximum-likelihood (증명이 매우 잘 되어 있음)
