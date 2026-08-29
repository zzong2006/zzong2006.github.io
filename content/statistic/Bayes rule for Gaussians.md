---
title: "Bayes rule for Gaussians"
aliases: ["Gaussian conjugacy"]
tags:
  - statistic
---

# A) Bayes Rule for Gaussians ?

[[prior]] 와 [[likelihood]] 가 모두 [[Gaussian distribution|가우시안]] 일 때, [[posterior]] 도 가우시안이 되고 그 평균과 분산이 닫힌 형태로 나온다. 가우시안이 자기 자신의 [[conjugate prior]] 라는 뜻이다.

적분을 수치적으로 풀지 않아도 posterior 를 바로 적을 수 있다는 점에서, 가우시안을 즐겨 쓰는 큰 이유 중 하나다.

# B) 평균을 추정하는 경우

분산 $\sigma^2$ 는 알고 있고 평균 $\mu$ 만 모른다고 하자.

$$
\begin{aligned}
p(\mu) &= \mathcal{N}(\mu \mid \mu_0,\ \sigma_0^2) \\
p(x \mid \mu) &= \mathcal{N}(x \mid \mu,\ \sigma^2)
\end{aligned}
$$

관측 $x_1, \dots, x_n$ 을 얻으면 posterior 는 다음과 같다.

$$
p(\mu \mid x_{1:n}) = \mathcal{N}(\mu \mid \mu_n,\ \sigma_n^2)
$$

$$
\frac{1}{\sigma_n^2} = \frac{1}{\sigma_0^2} + \frac{n}{\sigma^2},
\qquad
\mu_n = \sigma_n^2\left(\frac{\mu_0}{\sigma_0^2} + \frac{n\bar{x}}{\sigma^2}\right)
$$

| 기호 | 의미 |
| --- | --- |
| $\mu_0,\ \sigma_0^2$ | prior 의 평균과 분산 |
| $\sigma^2$ | 관측 잡음의 분산 (알고 있다고 가정) |
| $\bar{x}$ | 관측값의 표본 평균 |
| $\mu_n,\ \sigma_n^2$ | posterior 의 평균과 분산 |

# C) 식이 말해주는 것

분산의 역수를 precision 이라고 부른다. 첫 식은 **precision 이 그냥 더해진다** 고 말한다. prior 가 가진 확신의 양에 관측이 가져온 확신의 양이 더해지는 셈이다. 관측이 늘수록 $n/\sigma^2$ 가 커져 posterior 분산이 줄어든다.

두 번째 식의 $\mu_n$ 은 prior 평균과 표본 평균을 precision 으로 가중평균한 값이다.

- prior 가 확신에 차 있으면($\sigma_0^2$ 이 작으면) posterior 평균이 $\mu_0$ 쪽에 가깝다
- 관측이 많거나 잡음이 작으면 $\bar{x}$ 쪽으로 끌려간다
- $n \to \infty$ 면 prior 의 영향이 사라지고 $\mu_n \to \bar{x}$ 가 된다

데이터가 쌓일수록 사전 믿음이 씻겨나가는 현상이 식에 그대로 드러난다.

# D) 확장

평균과 분산을 둘 다 모르면 prior 로 normal-inverse-gamma 를 쓴다. 다변량에서는 [[multivariate Gaussian distribution]] 에 같은 논리가 적용되고, precision 행렬끼리 더해지는 형태가 된다.

선형 관측 모델 $y = A\boldsymbol{x} + \boldsymbol{\epsilon}$ 에 가우시안 prior 를 두면 같은 구조가 나오는데, 이것이 [[Bayesian linear regression for practitioners|베이지안 선형회귀]] 와 칼만 필터의 갱신식이다.

# E) References
