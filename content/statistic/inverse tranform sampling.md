---
tags: ["statistic"]
---

# A) Inverse Transform Sampling ?

Inverse transform sampling 는 어떤 확률 분포에서 해당 분포의 inverse [cumulative distribution]([[Cumulative Distribution Function]]) (또는 [[quantile function]]) $F^{-1}(x)$ 를 활용해서 임의의 값을 생성하는 방법을 의미한다.

* 랜덤 변수 $X$ 의 누적 분포: $F_{X}(x)=P(X\leq x)$

# B) 알고리즘

## B.1) 연속 분포

### B.1.1) Steps

* $U\sim\operatorname{Unif}(0,1)$ 에서 값을 뽑는다.
* $X=F_{X}^{-1}(U)$ 를 찾는다.
* $X$ 는 CDF $F_{X}$ 에 의한 분포를 따르기 때문에, 결과적으로 원하는 임의의 값이 된다.

이 방법은 분포에 따라 실용성이 나뉘는데, [[exponential distribution]] 의 경우 쉽지만, [[Gaussian distribution]] 의 경우 inverse 함수를 구하기 어렵다.

## B.2) 이산 분포

# C) References

* https://stephens999.github.io/fiveMinuteStats/inverse_transform_sampling.html
