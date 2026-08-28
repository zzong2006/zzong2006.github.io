---
title: "permutation matrix"
tags: ["linear_algebra"]
---

# A) Permutation Matrix ?

주어진 행렬의 행을 바꾸기 위한 행렬 (Row operation)

$$
\left[\begin{array}{ll}0 & 1 \\ 1 & 0\end{array}\right]\left[\begin{array}{ll}a & b \\ c & d\end{array}\right]=\left[\begin{array}{ll}c & d \\ a & b\end{array}\right]
$$

열을 바꾸고 싶다면 permutation matrix 를 오른쪽에 놓으면 된다 (column operation).

$$
\left[\begin{array}{ll}a & b \\ c & d\end{array}\right]\left[\begin{array}{ll}0 & 1 \\ 1 & 0\end{array}\right]=\left[\begin{array}{ll}b & a \\ d & c\end{array}\right]
$$

# B) 특징

1. permutation matrix 의 [[Inverse matrix]] 는 [[transpose]] 와 같다.

$$
P^{-1}=P^{\top}
$$

1. $n \times n$ 크기의 matrix 의 경우 총 $n!$ 개의 permutation matrix 가 존재한다.

# C) Permutation Matrix

* row exchange matrix: identity matrix 에서 바꾸고 싶은 행을 바꾸면 그게 exchange matrix.
* 예시: $P_{23}=\left[\begin{array}{lll}1&0&0\\0&0&1\\0&1&0\end{array}\right]$
	* $\left[\begin{array}{lll}1&0&0\\0&0&1\\0&1&0\end{array}\right]\left[\begin{array}{l}1\\\mathbf{3}\\\mathbf{5}\end{array}\right]=\left[\begin{array}{l}1\\\mathbf{5}\\\mathbf{3}\end{array}\right]$
	* $\left[\begin{array}{lll}1&0&0\\0&0&1\\0&1&0\end{array}\right]\left[\begin{array}{lll}2&4&1\\\mathbf{0}&\mathbf{0}&\mathbf{3}\\0&6&5\end{array}\right]=\left[\begin{array}{lll}2&4&1\\0&6&5\\\mathbf{0}&\mathbf{0}&\mathbf{3}\end{array}\right]$
* For the augmented matrix $\left[\begin{array}{ll}A&b\end{array}\right]$, that elimination step gives $\left[E_{21}A\quad E_{21}b\right]$.
* $\left[\begin{array}{rll}1&0&0\\-2&1&0\\0&0&1\end{array}\right]\left[\begin{array}{rrrr}2&4&-2&2\\4&9&-3&8\\-2&-3&7&10\end{array}\right]=\left[\begin{array}{rrrr}2&4&-2&\mathbf{2}\\0&1&1&4\\-2&-3&7&\mathbf{10}\end{array}\right]$

# D) References
