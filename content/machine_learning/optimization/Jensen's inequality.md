---
title: "Jensen's inequality"
tags:
  - optimization
aliases: []
---

# A) Jensen’s Inequality ?

For a random variable $x$, if $f(x)$ is convec (refer. [[convex function]]), then $E[f(x)]>=f(E[x])$.

![[img-776fe70b8c.png||500]]

For a random variable $x$, if $f(x)$ is concave, then $f(E[x])>=E[f(x)]$

(위와 반대).

![[img-618ec35325.png||500]]

## A.1) Note

* Jensen 의 부등식에서 등호가 성립하는 경우는 다음과 같습니다: $f(E[x])=E[f(x)]$ 이 성립하려면, $x$ 가 상수일 때만 가능합니다.

# B) Related

* [[convex function]], [[machine_learning/EM algorithm]], [[KL-Divergence]]

# C) References
