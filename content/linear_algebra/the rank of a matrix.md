---
title: "the rank of a matrix"
tags:
  - linear_algebra
aliases: ["rank"]
---

# A) The Rank of a Matrix

matrix $A$ 의 rank $r$ 는 [[pivot]] 의 개수 또는 [[Linear Independence|linearly independent]] 한 column 개수를 나타낸다. 또한, rank 는 [[column space]] 또는 row space 의 차원 개수로 생각할 수 있다.

## A.1) 예시

$$
A=\left[\begin{array}{llll}1&1&2&4\\1&2&2&5\\1&3&2&6\end{array}\right]\quad R=\left[\begin{array}{llll}1&0&2&3\\0&1&0&1\\0&0&0&0\end{array}\right]
$$

* $A$ 는 two pivots 을 가짐 (첫번째 두번째 열)
* 세번째 열의 경우, 첫번째를 두배한 것이고, 네번째 열의 경우 첫번째와 두번째 열을 더한 결과다.

## A.2) 특징

* $m\times n$ matrix $A$ 의 [[nullspace]] 차원 수는 $n-r$ 이다.
* zero matrix 는 rank 가 $1$ 이 아닌, $0$ 이다.

# B) Rank-k Matrices

rank $k$ 인 matrix $A$ 는 rank 가 $1$ 인 $k$ 개의 행렬들의 합으로 나타낼 수 있다. 그리고 $k-1$ rank 인 행렬이나 $k$ 개 보다 작은 수의 rank $1$ 행렬의 합으로는 나타낼 수 없다.

위와 같은 행렬 분해 특징을 이용해 [[machine_learning/Singular Value Decomposition|SVD]] 에 대한 직관을 얻을 수 있다.

# C) Full Rank

## C.1) Full Column Rank

$r=n$ ($n$ 은 column 개수) 인 경우, nullspace 의 차원 수는 0 이다. 즉, zero vector 밖에 없으며, [[free variable]] 또는 [[special solution]] 가 존재하지 않는다는 의미다.  
그래서 만약 $A \mathbf{x}=\mathbf{b}$ 가 solution 이 존재한다면, 이는 unique 하다는 것을 의미한다. 결과적으로 solution 의 개수는 0 또는 1 이다. solution 이 없는 경우는 $\mathbb{R}^{m}$ 에 존재하는 $\mathbf{b}$ 가 $A$ 의 column space 에 존재하지 않을 때 이다.

$r \leq m$ 인 경우, matrix 를 reduced [[row-echelon form]] 으로 나타내면 $R=\left[\begin{array}{l}I \\ 0\end{array}\right]$ 가 된다.

## C.2) Full Row Rank

$r=m$ 이라면, reduced matrix 는 $R=\left[\begin{array}{ll}I & F\end{array}\right]$ 로 표현된다. 여기에는 영 행렬이 존재하지 않아서 $\mathbf{b}$ 의 원소들에 대해서 요구되는 조건도 없다 ([[Solving Ax=b#예시]] 참고). 결과적으로 $A \mathbf{x}=\mathbf{b}$ 는 모든 $\mathbf{b}$ 에 대해서 풀린다. 그리고 $n-r=n-m$ 의 free variable 이 존재하며, $A \mathbf{x}=\mathbf{0}$ 에 대한 $n-m$ 개의 special solution 이 존재한다.

## C.3) Full Row and Column Rank

$r = m = n$ 인 상태이므로, $A$ 는 [[Inverse matrix|invertible]] square matrix 라고 표현하며, $R$ 은 단순히 identity matrix 로 표현된다. nullspace 의 차원수는 0 이며 (full column rank 와 동일), $A \mathbf{x}=\mathbf{b}$ 은 $\mathbb{R}^{m}$ 에 존재하는 모든 $\mathbf{b}$ 에 대하여 unique 한 solution 을 가진다.

## C.4) Summary

만약 $R$ 이 row reduced form 이고, pivot column 을 첫번째로 가지고 있따면, 아래와 같이 rank 수에 따라 표현되는 방식과 solution 의 개수가 다르다.

solution 개수에 대하여 간단히 생각하면 이렇다.

* 만약 $R$ 에 영행렬이 있다면, 솔루션이 없을 수 있다.
* free variable 이 존재한다면, 솔루션이 무한할 수 있다.
* 솔루션이 unique 한 조건을 만족하려면, full column rank 를 만족해야 한다.

![](https://i.imgur.com/TSOa3HU.png)

# D) References
