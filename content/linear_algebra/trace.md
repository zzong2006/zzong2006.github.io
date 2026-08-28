---
title: "trace"
aliases: []
tags:
  - linear_algebra
---

# A) Trace ?

square matrix $\boldsymbol{A}\in\mathbb{R}^{n\times n}$ 의 trace 는 주어진 정사각 행렬의 대각 원소들의 합을 의미한다.

$$
\displaystyle\operatorname{tr}(\boldsymbol{A}):=\sum_{i=1}^{n}a_{ii}
$$

# B) Properties

trace 는 다음 성질을 가진다.

* $\operatorname{tr}(\boldsymbol{A}+\boldsymbol{B})=\operatorname{tr}(\boldsymbol{A})+\operatorname{tr}(\boldsymbol{B})$, for $\boldsymbol{A},\boldsymbol{B}\in\mathbb{R}^{n\times n}$
* $\operatorname{tr}(\alpha\boldsymbol{A})=\alpha\operatorname{tr}(\boldsymbol{A})$, for $\alpha\in\mathbb{R},\ \boldsymbol{A}\in\mathbb{R}^{n\times n}$
* $\operatorname{tr}\left(\boldsymbol{I}_{n}\right)=n$
* $\operatorname{tr}(\boldsymbol{A}\boldsymbol{B})=\operatorname{tr}(\boldsymbol{B}\boldsymbol{A})$, for $\boldsymbol{A}\in\mathbb{R}^{n\times k},\ \boldsymbol{B}\in\mathbb{R}^{k\times n}$

마지막 성질(cyclic property) 을 두 벡터의 곱에 적용하면, outer product 의 trace 가 inner product 와 같아진다.

$$
\operatorname{tr}\left(\boldsymbol{x}\boldsymbol{y}^{\top}\right)=\operatorname{tr}\left(\boldsymbol{y}^{\top}\boldsymbol{x}\right)=\boldsymbol{y}^{\top}\boldsymbol{x}\in\mathbb{R}
$$

여기서 $\boldsymbol{x},\boldsymbol{y}\in\mathbb{R}^{n}$ 이다.

# References
