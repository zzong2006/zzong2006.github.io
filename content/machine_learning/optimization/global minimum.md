---
tags: ["optimization", "machine_learning"]
aliases: ["global optimum", "global minima"]
---

# A) Global Minimum ?

Global minimum 은 목적 함수 전체 영역에서 가장 작은 값을 가지는 지점이다.

$$
x^\* = \arg\min_x f(x)
$$

어떤 지점이 주변에서는 가장 작지만 전체에서는 더 작은 지점이 따로 있다면 local minimum 이다.

# B) 왜 중요한가

[[gradient descent]] 는 현재 위치의 gradient 를 따라 움직이므로 non-convex 함수에서는 local minimum, saddle point, plateau 에 머물 수 있다. 반대로 convex optimization 에서는 local minimum 이 곧 global minimum 이므로 최적화 해석이 훨씬 단순해진다.

# C) Related

* [[machine_learning/optimization/convex function|convex function]]
* [[optimization problem]]
* [[gradient descent]]

