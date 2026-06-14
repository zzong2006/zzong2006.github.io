---
title: "conditional entropy"
tags: ["information_theory statistic"]
---

# 1. Conditional Entropy ?

$X$ 가 주어졌을 때 $Y$ 의 conditional entropy 는 다음과 같이 계산된다  

$$
\displaystyle\mathrm{H}(Y\mid X)=-\sum_{x\in\mathcal{X},y\in\mathcal{Y}}p(x,y)\log\frac{p(x,y)}{p(x)}
$$

$\mathcal{X}\text{and}\mathcal{Y}$ 는 $X$ 와 $Y$ 의 [[support sets]]

* Relation with [[joint entropy]] and marginal entropy
	* $H(X,Y)=H(X)+H(Y\mid X)$
*

# 2. Related

[[Information theory]], [[mutual information]], [[cross-entropy]]

# 3. References

[Information Theory — Sungjoo Ha](https://shurain.net/personal-perspective/information-theory/)
