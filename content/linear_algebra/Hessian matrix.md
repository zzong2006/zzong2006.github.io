---
title: "Hessian matrix"
tags: ["linear_algebra", "calculus", "differentitation", "optimization"]
aliases: ["헤시안 행렬", "Hessian"]
---

# A) Hessian Matrix?

Suppose $f:\mathbb{R}^{n}\rightarrow\mathbb{R}$ is a function taking as input a vector $\mathbf{x}\in\mathbb{R}^{n}$ and outputting a scalar $f(\mathbf{x})\in\mathbb{R}$.

만약 $f$ 의 모든 이차 미분이 존재하고 해당 함수의 도메인에서 모두 연속이라면, $f$ 헤시안 행렬 $\mathbf{H}$ 는 정방 행렬 $n \times n$ 크기를 가지며, 다음과 같이 정의된다.

$$
\displaystyle \mathbf{H}_{f}=\left[\begin{array}{cccc}\frac{\partial^{2}f}{\partial x_{1}^{2}}&\frac{\partial^{2}f}{\partial x_{1}\partial x_{2}}&\cdots&\frac{\partial^{2}f}{\partial x_{1}\partial x_{n}}\\\\\frac{\partial^{2}f}{\partial x_{2}\partial x_{1}}&\frac{\partial^{2}f}{\partial x_{2}^{2}}&\cdots&\frac{\partial^{2}f}{\partial x_{2}\partial x_{n}}\\\\\vdots&\vdots&\ddots&\vdots\\\\\frac{\partial^{2}f}{\partial x_{n}\partial x_{1}}&\frac{\partial^{2}f}{\partial x_{n}\partial x_{2}}&\cdots&\frac{\partial^{2}f}{\partial x_{n}^{2}}\end{array}\right]
$$

이차 미분을 표현하기 위해 $\displaystyle\left(\mathbf{H}_{f}\right)_{i,j}=\frac{\partial^{2}f}{\partial x_{i}\partial x_{j}}$ 로 표기하기도 한다.

# B) 특징

Hessian matrix 는 symmetric matrix 다. 왜냐하면 함수 $f$ 가 2 차 미분이 가능하다는 의미에서, 미분의 순서는 상관없다는 것을 암시하기 때문이다.

# C) Optimization 에서 활용

만약 함수 $f$ 가 convex 하다면, $f$ 의 Hessian matrix $\mathbf{H}_{f}$ 는 [[positive definite]] 하다.

# D) Related

[[Jacobian matrix]]

# E) References
