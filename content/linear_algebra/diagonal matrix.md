---
title: "diagonal matrix"
tags: ["linear_algebra"]
aliases: ["대각 행렬"]
---

# Diagonal Matrix ?

Formally, a matrix $D$ is diagonal if and only if $D_{i,j}=0$ for all $i\neq j$.

$\operatorname{diag}(\boldsymbol{v})$ 는 대각 원소가 vector $\boldsymbol{v}$ 로 구성되어 있는 matrix 라는 의미

# 특징

vector 곱을 수행할 때 효율적이다:

$$
\operatorname{diag}(\boldsymbol{v})\boldsymbol{x}=\boldsymbol{v}\odot\boldsymbol{x}
$$

# Inverse of Diagonal Matrix

대각 행렬의 [[Inverse matrix|역행렬]] 은 모든 대각 원소가 0 이 아닌 경우에만 존재한다:

$$
\operatorname{diag}(\boldsymbol{v})^{-1}=\operatorname{diag}\left(\left[1/v_{1},\ldots,1/v_{n}\right]^{\top}\right)
$$

그리고 대각 행렬은 square 일 필요는 없지만, ㅇ

# References

* [[symmetric matrix]]
