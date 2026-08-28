---
title: "Poisson distribution"
tags: ["probability_distribution", "statistic"]
aliases: ["푸아송 분포"]
---

# A) Poisson Distribution ?

푸아송 분포는 확률론에서 단위 시간 안에 어떤 사건이 몇 번 발생할 것인지를 표현하는 이산 확률 분포이다.

정해진 시간 안에 어떤 사건이 일어날 횟수에 대한 기댓값을 $\lambda$ 라고 했을 때, 그 사건이 $k$ 회 일어날 확률은 다음과 같다.

$$
f(k ; \lambda)=\frac{\lambda^{k} e^{-\lambda}}{k !}
$$

* Mean: $\lambda$
* Variance: $\lambda$

## A.1) 예시

어떤 병원에서는 시간당 평균적으로 2 명의 신생아가 태어난다고 해보자. 그럼 시간당 3 명의 신생아가 태어날 확률은 다음과 같다.

$$
P(X=3)=2^{3} \cdot e^{-2} /\ 3 !=0.1805
$$

# B) Applications

* 일정 주어진 시간 동안에 도착한 고객의 수
* 1 킬로미터 도로에 있는 흠집의 수
* 일정 주어진 생산시간 동안 발생하는 불량 수

# C) Notes

* [[Gamma distribution]] 는 event 의 횟수 대신 특정 이벤트가 발생하기 까지 기다리는 시간을 계산하는데 사용한다.
* possion 분포에 log 를 씌웠을때 정규 분포로 수렴이 된다고 하는데, 이건 사실 확인이 필요함.

# D) Related

[[Poisson regression]]

# E) References

* https://seeing-theory.brown.edu/probability-distributions/index.html#section1
