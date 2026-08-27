---
tags: ["statistic"]
aliases: ["marginalization property"]
---

# 1. Sum Rule ?

$$
\displaystyle p(\boldsymbol{x})=\begin{cases}\displaystyle\sum_{\boldsymbol{y}\in\mathcal{Y}}p(\boldsymbol{x}, \boldsymbol{ y })&\text{if} \ \boldsymbol{y} \ \text{is discrete}\\\displaystyle\int_{\mathcal{Y}}p(\boldsymbol{x},\boldsymbol{y})\mathrm{d}\boldsymbol{y}&\text{if} \ \boldsymbol{y} \ \text{is continuous}\end{cases}
$$

$\mathcal{Y}$ 는 random variable $Y$ 의 target space 를 의미

we sum out (or integrate out) the set of states $\boldsymbol{y}$ of the random variable $Y$

# 2. 특징

Performing high-dimensional sums or integrals is generally computationally hard, in the sense that there is no known polynomial-time algorithm to calculate them exactly.

# 3. Related

[[product rule]], [[marginal distribution]]

# 4. References
