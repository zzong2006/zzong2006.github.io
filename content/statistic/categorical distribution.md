---
title: "categorical distribution"
aliases: ["범주형 분포", "generalized Bernoulli"]
tags:
  - statistic
  - probability_distribution
---

# A) Categorical Distribution ?

$K$ 개의 서로 배타적인 결과 중 하나가 나오는 한 번의 시행을 나타내는 분포다. 주사위를 한 번 굴리는 것, 문서에서 토픽 하나를 고르는 것이 여기 해당한다.

$$
p(x = k \mid \boldsymbol{\theta}) = \theta_k, \qquad \sum_{k=1}^{K}\theta_k = 1,\ \ \theta_k \ge 0
$$

$\boldsymbol{\theta} = (\theta_1, \dots, \theta_K)$ 가 각 결과의 확률이다. 결과에 순서나 크기 관계가 없다는 점이 중요하다. 값이 1, 2, 3 이어도 그것은 이름표일 뿐 3 이 1 보다 크다는 뜻이 아니다.

# B) 이웃한 분포들과의 관계

| 분포 | 결과 개수 | 시행 횟수 |
| --- | --- | --- |
| [[Bernoulli distribution]] | 2 | 1 |
| categorical | $K$ | 1 |
| [[Binomial Distribution]] | 2 | $n$ |
| [[multinomial distribution]] | $K$ | $n$ |

베르누이를 결과가 여럿인 경우로 넓힌 것이 categorical 이고, 시행을 여러 번으로 넓힌 것이 multinomial 이다. 그래서 categorical 은 $n=1$ 인 multinomial 이며, 두 이름이 혼용되기도 한다.

# C) 켤레 사전분포

categorical 의 [[conjugate prior]] 는 [[Dirichlet distribution]] 이다. Dirichlet 을 [[prior]] 로 두고 categorical 관측을 넣으면 [[posterior]] 가 다시 Dirichlet 이 되고, 파라미터는 각 범주의 관측 횟수를 더한 값이 된다.

이 성질 덕분에 토픽 모델에서 자주 짝지어 나타난다. Latent Dirichlet Allocation 은 문서마다 Dirichlet 에서 토픽 비율을 뽑고, 각 단어마다 그 비율을 파라미터로 하는 categorical 에서 토픽을 하나 고른다.

# D) References
