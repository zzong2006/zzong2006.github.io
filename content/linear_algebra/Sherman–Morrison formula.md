---
title: "Sherman–Morrison formula"
tags: ["linear_algebra"]
---

# 1. Sherman–Morrison Formula ?

행렬 $A$ 의 역행렬을 알고 있을 때, $A+\mathbf{uv}^{\top}$ 의 역행렬을 비교적 빠르게 구할 수 있는 방법

$A\in\mathbb{R}^{n\times n}$ 가 invertible matrix 고, $\mathbf{u},\mathbf{v}\in\mathbb{R}^{n}$ 가 column vector 일 경우, $A+\mathbf{uv}^{\top}$ 의 역행렬이 존재할 필요충분조건은 $1+\mathbf{v}^{\top}A^{-1}\mathbf{u}\neq0$ 이다.

나아가 $A+\mathbf{uv}^{\top}$ 의 역행렬이 존재한다면 다음 공식이 성립한다.

$$
\displaystyle\left(A+\mathbf{uv}^{\top}\right)^{-1}=A^{-1}-\frac{A^{-1}\mathbf{uv}^{\top}A^{-1}}{1+\mathbf{v}^{\top}A^{-1}\mathbf{u}}
$$

이 식의 general 한 버전이 [[Woodbury formula]] 이다.

# 2. Related

# 3. References

https://jjycjnmath.tistory.com/398
