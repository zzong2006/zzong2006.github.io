---
tags: ["probability_distribution"]
aliases: ["pdf", "PDF", "확률 밀도 함수"]
---

A function $f:\mathbb{R}^{D}\rightarrow\mathbb{R}$ is called a probability density function (pdf) $i$ if

* $\forall\boldsymbol{x}\in\mathbb{R}^{D}:f(\boldsymbol{x})\geqslant0$
* Its integral exists and $\int_{\mathbb{R}^{D}}f(\boldsymbol{x})\mathrm{d}\boldsymbol{x}=1$.

The law or distribution of the law random variable $X$

$$
P(a\leqslant X\leqslant b)=\int_{a}^{b}f(x)\mathrm{d}x
$$

$a,b\in\mathbb{R}$ and $x\in\mathbb{R}$.

# A) References

* [[Cumulative Distribution Function]]
