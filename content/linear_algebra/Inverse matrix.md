---
title: "Inverse matrix"
tags:
  - linear_algebra
aliases: ["regular matrix", "invertible matrix", "nonsingular matrix", "regular", "invertible", "nonsingular", "역행렬"]
---

# A) Inverse Matrix ?

$\boldsymbol{A} \in \mathbb{R}^{n \times n}$ 행렬에 대하여 $\boldsymbol{A B}=\boldsymbol{I}_{n}=\boldsymbol{B} A$ 를 만족하는 $\boldsymbol{B} \in \mathbb{R}^{n \times n}$ 를 inverse matrix $\boldsymbol{A}^{-1}$ 라고 한다.

이렇게 inverse 가 존재하는 matrix 를 regular/invertible/nonsingular matrix 라고 부른다. 그 반대는 [[singular]]/noninvertible matrix 이다.

[[system of linear equations]] $\boldsymbol{A} \boldsymbol{x}=\boldsymbol{b}$ 에서 $\boldsymbol{A}^{-1}$ 가 존재한다면 $\boldsymbol{b}$ 값에 상관없이 오직 하나의 solution 만 존재한다.

# B) Inverse Matrix 가 존재하지 않는 조건들

항상 모든 matrix 가 inverse 를 가지는 것은 아니다.

1. zero determinant
2. linear dependent 한 matrix row 가 존재 ([[singular]])

# C) Some Properties

* $(c \boldsymbol{A})^{-1}=c^{-1} \boldsymbol{A}^{-1}$

$$
\begin{aligned}  \\ \boldsymbol{A} \boldsymbol{A}^{-1} &=\boldsymbol{I}=\boldsymbol{A}^{-1} \boldsymbol{A} \\(\boldsymbol{A} \boldsymbol{B})^{-1} &=\boldsymbol{B}^{-1} \boldsymbol{A}^{-1} \\(\boldsymbol{A}+\boldsymbol{B})^{-1} & \neq \boldsymbol{A}^{-1}+\boldsymbol{B}^{-1} \end{aligned}
$$

# D) Related

[[symmetric matrix]]

[[Moore-Penrose Pseudoinverse]]

# E) References
