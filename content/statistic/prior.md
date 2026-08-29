---
title: "prior"
aliases: ["prior distribution", "사전분포"]
tags:
  - statistic
---

# A) Prior ?

데이터를 보기 전에 파라미터가 어떤 값일지에 대해 갖고 있는 믿음을 확률분포로 적어둔 것이다. [[Bayesian inference]] 에서 [[Bayes theorem]] 을 통해 데이터의 [[likelihood]] 와 결합되어 [[posterior]] 를 만든다.

$$
p(\theta \mid \mathcal{D}) = \frac{p(\mathcal{D} \mid \theta)\, p(\theta)}{p(\mathcal{D})}
$$

| 기호 | 의미 |
| --- | --- |
| $\theta$ | 추정하려는 파라미터 |
| $\mathcal{D}$ | 관측한 데이터 |
| $p(\theta)$ | prior. 데이터를 보기 전의 분포 |
| $p(\mathcal{D} \mid \theta)$ | likelihood. 그 파라미터에서 이 데이터가 나올 가능성 |
| $p(\theta \mid \mathcal{D})$ | posterior. 데이터를 반영한 뒤의 분포 |

파라미터를 고정된 미지의 상수로 보는 [[Frequentist]] 관점과 갈리는 지점이 여기다. 베이즈 쪽은 파라미터 자체를 확률변수로 두므로, 데이터를 보기 전 상태에도 분포를 붙일 수 있다.

# B) prior 를 0 으로 두면 안 되는 자리

일어날 수 있는 값에 prior 가 0 을 주면, likelihood 가 아무리 크게 나와도 posterior 는 0 이다. 곱셈이라 한쪽이 0 이면 결과가 0 이기 때문이다. 데이터가 아무리 그 값을 가리켜도 결론이 바뀌지 않는다는 뜻이라, 조금이라도 가능성이 있는 값에는 0 이 아닌 확률(밀도)을 줘야 한다. 이를 Cromwell's rule 이라고 부른다.

관측되지 않은 사건의 확률을 0 으로 두지 않기 위해 계수에 작은 값을 더하는 Laplace smoothing 도 같은 문제에 대한 처방이다.

# C) prior 를 고르는 방식

**[[conjugate prior]]** — posterior 가 prior 와 같은 분포족에 남도록 짝을 맞춘 prior 다. 베르누이 관측에 베타 prior, 포아송에 감마 prior 처럼 짝이 정해져 있고, 이 경우 posterior 의 파라미터가 닫힌 형태로 나와 적분을 수치적으로 풀 필요가 없다.

**무정보 prior** — 특정 값을 편들지 않으려는 목적으로 넓게 퍼진 분포를 쓴다. 다만 완전히 중립적인 prior 라는 것은 없고, 파라미터를 어떻게 변수변환하느냐에 따라 "평평함" 의 의미가 달라진다.

**약한 정보 prior** — 현실적으로 말이 안 되는 범위를 배제할 정도로만 정보를 넣는다. 사람의 키를 추정하는데 3미터에 큰 확률을 주지 않는 정도다. 데이터가 적을 때 추정이 터무니없는 값으로 튀는 것을 막아준다.

데이터가 많아질수록 likelihood 가 posterior 를 지배해서 prior 의 영향은 줄어든다. 반대로 데이터가 적으면 결론이 prior 선택에 크게 좌우되므로, 어떤 prior 를 왜 골랐는지가 결과의 일부가 된다.

# D) References
