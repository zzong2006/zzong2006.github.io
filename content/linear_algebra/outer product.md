---
title: "outer product"
tags:
  - linear_algebra
aliases: ["외적"]
---

# Outer Product ?

사이즈가 각각 $m \times 1$ 그리고 $n \times 1$ 인 두 벡터가 있다고 가정하자.

$$
\mathbf{u}=\left[\begin{array}{c}u_{1} \\ u_{2} \\ \vdots \\ u_{m}\end{array}\right], \quad \mathbf{v}=\left[\begin{array}{c}v_{1} \\ v_{2} \\ \vdots \\ v_{n}\end{array}\right]
$$

이때 두 벡터 간 외적 $\mathbf{u} \otimes \mathbf{v}$ 은 $m \times n$ 크기의 행렬 $\mathbf{A}$ 로 표현된다.

$$
\mathbf{u} \otimes \mathbf{v}=\mathbf{A}=\left[\begin{array}{cccc}u_{1} v_{1} & u_{1} v_{2} & \ldots & u_{1} v_{n} \\ u_{2} v_{1} & u_{2} v_{2} & \ldots & u_{2} v_{n} \\ \vdots & \vdots & \ddots & \vdots \\ u_{m} v_{1} & u_{m} v_{2} & \ldots & u_{m} v_{n}\end{array}\right]
$$

$\mathbf{u} \otimes \mathbf{v}$ 은 행렬 곱 $\mathbf{u} \mathbf{v}^{\mathrm{T}}$ 과 동일하다. 여기서 $\mathbf{v}^{\top}$ 는 row vector 를 의미한다.

예시로 $m=4$ 이고 $n=3$ 인 케이스를 살펴보자.

$$
\mathbf{u} \otimes \mathbf{v}=\mathbf{u v}^{\top}=\left[\begin{array}{c}u_{1} \\ u_{2} \\ u_{3} \\ u_{4}\end{array}\right]\left[\begin{array}{lll}v_{1} & v_{2} & v_{3}\end{array}\right]=\left[\begin{array}{lll}u_{1} v_{1} & u_{1} v_{2} & u_{1} v_{3} \\ u_{2} v_{1} & u_{2} v_{2} & u_{2} v_{3} \\ u_{3} v_{1} & u_{3} v_{2} & u_{3} v_{3} \\ u_{4} v_{1} & u_{4} v_{2} & u_{4} v_{3}\end{array}\right]
$$

# 다른 벡터 연산과 비교

외적은 두 벡터 간 연산의 결과가 행렬이다. 이는 두 벡터 간 [[dot product|내적]] 이 scalar 인 것과 다른 개념을 보인다. 그리고 [[vector product]] 는 두 벡터에 수직이 되는 벡터를 결과로 얻는다.

# References

* https://en.wikipedia.org/wiki/Outer_product
