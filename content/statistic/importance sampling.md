---
title: "importance sampling"
tags: ["sampling"]
aliases: ["inverse propensity score"]
---

# Importance Sampling ?

Importance sampling 은 효율적으로 기댓값을 추정하기 위해 고안된 방법이다.

# Why We Need IS?

[[Rejection sampling]] 는 rejection 이 많을 경우 계산 비용이 많이드는 단점이 있다.
또한, 우리는 전체 분포에 대해서 알 필요가 없이, 어떤 확률 분포의 기댓값에 대해서만 관심이 있는 경우가 많다.

a.k.a. [[inverse propensity score]]
	- Importance sampling 은 [기댓값]([[expectation]]) 을 계산하고자 하는 확률 분포 $f(x)$ 의 [확률 밀도 함수]([[Probability Density Function]]) $p$ 를 알고있지만 샘플들을 생성하기 어려울 때, 비교적 쉬운 pdf 인 $q(x)$ 에서 샘플을 생성하여 $f$ 의 기댓값을 계산하는 방법이다.

아래의 식을 보면, $q$ 에서 생성된 샘플을 통해 $p$ 의 기댓값을 계산할 수 있다는 것을 알 수 있다.

$$
\displaystyle E_{x\sim p}[f(x)]\\=\int p(x)f(x)dx \\ =\int\frac{p(x)}{q(x)}q(x)f(x)dx\\=E_{x\sim q}\left[\frac{p(x)}{q(x)}f(x)\right]\approx\frac{1}{N}\sum_{n=1}^{N}\frac{p\left(x_{n}\right)}{q\left(x_{n}\right)}f\left(x_{n}\right),\quad x_{n}\sim q
$$

$\displaystyle E_{x\sim q}\left[\frac{p(x)}{q(x)}f(x)\right]$ 에서 $p(x)/q(x)$ 를 likelihood ratio 라고 하며,  
$p$ 를 nominal distribution, $q$ 를 importance distribution 이라고 한다.

# Importance Sampling 과정

![|600](https://i.imgur.com/qa65j3i.png)

# References

* [edwith](https://www.edwith.org/machinelearning2__17/lecture/10876?isDesc=false)
