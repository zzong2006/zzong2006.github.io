---
title: "tractable"
tags:
  - word
aliases: ["계산 가능한"]
---

# A) Tractable ?

현실적인 시간과 자원 안에 계산해 낼 수 있다는 뜻이다. 반대는 intractable 로, 원리적으로는 정의돼 있지만 실제로 계산할 수 없는 경우를 가리킨다.

두 가지 층위에서 쓰인다.

**계산 복잡도** — 입력 크기에 대해 다항 시간에 풀리면 tractable, 지수 시간이 필요하면 intractable 로 본다. [[NP-complete]] 문제들이 후자로 분류된다.

**통계·머신러닝** — 적분이나 합이 닫힌 형태로 풀리거나 실용적인 비용에 계산되면 tractable 이라고 한다. 논문에서 "tractable solution 을 제안한다" 고 하면 대개 이쪽이다.

# B) 무엇이 intractable 해지나

확률 모델에서 가장 자주 막히는 자리는 정규화 상수와 주변화 적분이다.

$$
p(z \mid x) = \frac{p(x \mid z)\,p(z)}{\int p(x \mid z)\,p(z)\,dz}
$$

분모의 적분은 $z$ 가 가질 수 있는 모든 값에 대해 계산해야 한다. $z$ 가 연속이고 차원이 높으면 이 적분이 닫힌 형태로 풀리지 않고, 이산이더라도 조합의 수가 지수적으로 늘어난다. [[posterior]] 를 직접 구하지 못하는 이유가 여기 있다.

# C) 다루기 쉬운 형태로 바꾸는 방법

**근사 분포로 바꾼다** — [[variational inference]] 는 다루기 어려운 posterior 를 다루기 쉬운 분포족으로 근사하고, 원래 문제를 최적화 문제로 옮긴다. 정확한 값 대신 하한([[Evidence Lower Bound|ELBO]])을 최대화한다.

**표본으로 대체한다** — [[MCMC approximation]] 은 적분을 계산하는 대신 그 분포에서 표본을 뽑아 평균으로 근사한다.

**모델을 제약한다** — [[conjugate prior]] 를 쓰거나 독립 가정을 넣어, 애초에 닫힌 형태가 나오는 구조로 모델을 설계한다.

정보 병목(information bottleneck)처럼 목적 함수 자체에 상호정보량이 들어가는 경우도 그대로는 계산되지 않아서, 변분 하한으로 바꾼 뒤 최적화하는 형태로 제안된다.

# D) References
