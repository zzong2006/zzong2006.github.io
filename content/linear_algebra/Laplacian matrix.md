---
title: "Laplacian matrix"
tags:
  - graph
  - matrix
aliases: ["라플라시안 행렬"]
---

# Laplacian Matrix ?

graph 표현을 위한 행렬

$n$ 개의 vertices 를 가지는 graph $G$ 에 대해서, 이 그래프의 라플라시안 행렬 $L_{n\times n}$ 은 다음과 같이 정의된다.

$$
L=D-A
$$

여기서 $D$ 는 degree matrix 그리고 $A$ 는 [[adjacency matrix]] 를 의미한다.

# Example

![[img-a8e5e87e42.png]]

# Symmetrically Normalized Laplacian

$$
\displaystyle L^{\text{sym}}:=D^{-\frac{1}{2}}LD^{-\frac{1}{2}}=I-D^{-\frac{1}{2}}AD^{-\frac{1}{2}}
$$

# Laplacian Matrix 의 특징

1. Symmetric: 대각 성분을 중심으로 양 값이 대칭적
2. Non-positive off-diagonals: 대각요소 성분을 제외하고 음의 값을 가지고 있음
3. Diagonally dominant: 주 대각성분의 값이 행의 다른 값보다 크거나 같다. 즉, diagonally dominant 하다.

# References

* https://pongdangstory.tistory.com/513
* https://en.wikipedia.org/wiki/Laplacian_matrix
