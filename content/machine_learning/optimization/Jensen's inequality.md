---
title: "Jensen's inequality"
tags: ["optimization"]
---

# A) Jensen’s Inequality ?

For a random variable $x$, if $f(x)$ is convec (refer. [[convex function]]), then $E[f(x)]>=f(E[x])$.

![|500](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FdYb3KkwyiK.png?alt=media&token=59811c71-679b-4381-aa7e-ac05081d4103)

For a random variable $x$, if $f(x)$ is concave, then $f(E[x])>=E[f(x)]$

(위와 반대).

![|500](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FkjYv4uknH-.png?alt=media&token=1dac67f5-424a-4a41-aac9-0cb4adcffbff)

## A.1) Note

* Jensen 의 부등식에서 등호가 성립하는 경우는 다음과 같습니다: $f(E[x])=E[f(x)]$ 이 성립하려면, $x$ 가 상수일 때만 가능합니다.

# B) Related

* [[convex function]], [[machine_learning/optimization/EM algorithm]], [[KL-Divergence]]

# C) References
