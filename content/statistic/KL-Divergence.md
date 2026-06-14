---
title: "KL-Divergence"
tags: ["statistic", "probability_distribution", "metrics", "machine_learning"]
---

# A) KL-Divergence ?

KL-Divergence(Kullback-Leibler Divergence) 는 서로 다른 두 분포의 차이 (dissimilarity) 를 측정하는데 쓰이는 metric 이다.

두 분포, $q$(실제) 와 $p$(예측) 가 있을 때, KL-Divergence 는 다음과 같다.

$$
\displaystyle D_{KL}(q\|p)=-\sum_{c=1}^{C}q\left(y_{c}\right)\left[\log\left(p\left(y_{c}\right)\right)-\log\left(q\left(y_{c}\right)\right)\right]=H_{p}(q)-H(q)
$$

보다시피, [[cross-entropy]] 값에 [[entropy]] 값을 뺀 것이 KL-Divergence 다. 
Cross-entropy 의 값은 entropy 값보다 항상 크므로, KL-Divergence 값은 $0$ 보다 항상 크다.

## A.1) KL-Divergence 의 의미

예측 분포인 $p$ 를 실제분포 $q$ 에 가깝게 하는 것이, 예측 모형이 이루고자 하는 것이며, $p$ 가 $q$ 에 가까이갈 수록 KL-Divergence 값은 $0$ 에 가까워질 것이다.

$H(q)$ 는 고정이기 때문에, $H_p(q)$ 를 최소화 시키는 것이 예측 모형을 최적화 시키는 것이라고 할 수 있다. 따라서 cross-entropy 를 최소화 시키는 것이 KL-Divergence 를 최소화 시키는 것이며, 이것이 불확실성을 제어하고자 하는 예측 모형의 실질적인 목적이라고 볼 수 있다.

## A.2) KL-divergence Properties

$\displaystyle\mathcal{K}\mathcal{L}(q\|p)=\int q(x)\log\frac{q(x)}{p(x)}dx$ 이라고 가정할때 아래를 만족한다.

* $\mathcal{KL}(q\|p)\neq\mathcal{KL}(p\|q)$ 그리고 $\mathcal{K}\mathcal{L}(q\|q)=0$
* $\mathcal{K}\mathcal{L}(q\|p)\geq0$

### A.2.1) Proof

$$
-\mathcal{K}\mathcal{L}(q\|p)=\mathbb{E}_{q}\left(-\log\frac{q}{p}\right)=\mathbb{E}_{q}\left(\log\frac{p}{q}\right)\leq\log\left(\mathbb{E}_{q}\frac{p}{q}\right)=\log\int q(x)\frac{p(x)}{q(x)}dx=0
$$

여기서 log 함수는 [[concave function]] 이므로, [[Jensen's inequality]] 에 의해 Expectation sign 이 안으로 들어갈 수 있다. 또한, $\log\int p(x)dx=1$ 이다.

- [ ] Forward KL vs. Reverse KL ([link](https://blog.evjang.com/2016/08/variational-bayes.html))

# B) As Objective Function

![|600](https://i.imgur.com/YdAEMhR.png)

# C) Related

[[Kolmogorov-Smirnov|KS]] 방식은 두 [[Cumulative Distribution Function|CDF]] 의 차이를 계산한다.

# D) References

* https://timvieira.github.io/blog/post/2014/10/06/kl-divergence-as-an-objective-function/
