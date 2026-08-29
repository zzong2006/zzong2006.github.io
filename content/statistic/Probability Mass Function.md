---
title: "Probability Mass Function"
aliases: ["PMF", "확률질량함수"]
tags:
  - statistic
---

# A) Probability Mass Function ?

이산 [[random variable]] 이 각 값을 가질 확률을 알려주는 함수다. 취할 수 있는 값이 셀 수 있는 경우에만 정의된다.

$$
p(x) = P(X = x)
$$

두 조건을 만족해야 한다.

1. 모든 $x$ 에 대해 $p(x) \ge 0$
2. $\sum_{x} p(x) = 1$

주사위라면 $p(1) = \dots = p(6) = 1/6$ 이고, 다 더하면 1 이다.

# B) [[Probability Density Function|PDF]] 와의 차이

연속 변수에서는 특정 한 점의 확률이 0 이라 같은 방식이 통하지 않는다. 그래서 확률 대신 밀도를 정의하고, 구간에 대해 적분해야 확률이 나온다.

| | PMF | PDF |
| --- | --- | --- |
| 변수 | 이산 | 연속 |
| $f(x)$ 의 뜻 | 그 값이 나올 확률 | 그 점에서의 밀도 |
| 값의 범위 | $0 \le p(x) \le 1$ | $f(x) \ge 0$, 1 을 넘을 수 있다 |
| 전체 합 | $\sum_x p(x) = 1$ | $\int f(x)dx = 1$ |

밀도가 1 을 넘을 수 있는 것은 밀도가 확률이 아니라 "구간 길이당 확률" 이기 때문이다. 폭이 0.5 인 구간에 균등분포를 두면 밀도는 2 이고, 여기에 폭 0.5 를 곱해야 확률 1 이 된다.

# C) 어디에 쓰이나

**[[entropy]]** — 이산 분포의 엔트로피는 PMF 로 정의된다. 범주가 $C$ 개일 때 $H = -\sum_{i=1}^{C} q_i \log q_i$ 이고, 여기서 $q$ 가 PMF 다.

**[[multinomial distribution]]** — $n$ 번의 시행에서 각 결과가 몇 번씩 나왔는지에 대한 PMF 를 다음과 같이 쓴다.

$$
p(x_1, \dots, x_k) = \frac{n!}{x_1!\cdots x_k!}\, \theta_1^{x_1}\cdots \theta_k^{x_k}
$$

$X_i$ 가 결과 $i$ 의 발생 횟수, $\theta_i$ 가 한 번의 시행에서 결과 $i$ 가 나올 확률이다.

# D) References
