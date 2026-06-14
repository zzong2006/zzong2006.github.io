---
tags: ["optimization"]
aliases: ["convex", "concave"]
---

# A) Convex ? Concave?

* $f(x)$ is convex, iff $f^{\prime\prime}(x)\geqslant0,\forall\mathrm{x}\in R$
* $f(x)$ is strictly convex, iff $f^{\prime\prime}(x)>0,\forall\mathrm{x}\in R$
* $f(x)$ is concave, iff $-f(x)$ is convex.

# B) Convex Quadratic Function

아래 그림과 같이 오직 하나의 minima ([[global minimum]]) 밖에 존재하지 않는 비용 함수 $J$ 를 convex quadratic function 이라 부른다.

convex 는 윤곽이 볼록하다는 뜻이다.

![|400](https://i.loli.net/2020/09/22/ayop5RBENvDdMbI.png)

# C) Strictly Convex Function

Convex function 은 optimal 값이 unique 하지만, 그 값을 가지는 점이 unique 하지는 않다.

예시는 다음과 같다.

![|400](http://sanghyukchun.github.io/images/post/63-2.png)

따라서 unique 한 optimal point 를 찾기 위해서는 하나의 조건이 더 필요한데, 바로 strictly convex 라는 조건이다.

Strictly convex function 은 minimum point 가 unique 하게 존재하기 때문에, 이런 convex function 에 대해서 우리는 어떤 optimization algorithm 을 design 할 수 있다

# D) Convex Function 의 Property

* Convex 함수의 local minimum 은 항상 global minimum 이다.
* 어떤 함수가 convex function 인지 알려면, 해당 함수의 [[Hessian matrix]] 가 [[positive definite|positive semi-definite]] 함을 알아야 한다.

# E) Related

* [[gradient descent]]
* [[Jensen's inequality]]

# F) References
