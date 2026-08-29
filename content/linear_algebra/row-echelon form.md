---
title: "row-echelon form"
tags:
  - linear_algebra
aliases: ["REF"]
---

# A) Row-echelon Form Matrix

어떤 행렬이 row-echelon form 이라고 하는것은 다음을 만족하는 행렬을 의미한다.

1. All rows that contain only zeros are at the bottom of the matrix. 따라서, all rows that contain at least one nonzero element are on top of rows that contain only zeros.
2. Looking at nonzero rows only, the ﬁrst nonzero number from the left (also called the [[pivot]] or the leading coefﬁcient) is always strictly to the right of the pivot of the row above it.

# B) Obtaining a Particular Solution

REF form 을 활용하면 [[special solution|particular solution]] 을 보다 쉽게 결정할 수 있다.

우선, $\boldsymbol{A} \boldsymbol{x}=\boldsymbol{b}$ 에서 $\boldsymbol{b}$ 를 $\displaystyle \boldsymbol{b}=\sum_{i=1}^{P} \lambda_{i} \boldsymbol{p}_{i}$ 을 통해 표현한다.

* $\boldsymbol{p}_{i}, i=1, \ldots, P$ 는 pivot columns

# C) Reduced Row-echelon Form

row-reduced echelon form 또는 row canonical form 라고 부리는 형태는 다음을 만족하는 행렬을 의미한다.

1. row-echelon form 을 만족한다.
2. 모든 pivot 값이 1 이다.
3. pivot 이 존재한 column (pivot column) 은 pivot 을 제외하고 모두 0 의 값을 가져야 한다.

$R$ 의 일부 column 을 서로 바꾸면, $R$ 은 upper left corner 에는 identity matrix $I$ 와 일부 free columns 로 구성된 matrix $F$ 로 표현할 수 있다. 여기서 만약 초기 matrix $A$ (i.e. $A \rightarrow R$) 의 row 들이 서로 [[Linear Independence|linearly dependent]] 하다면, $R$ 의 lower rows 는 0 으로 채워질 수 있다.

$$
R=\left[\begin{array}{ll}I & F \\ 0 & 0\end{array}\right]
$$

이때, $R N=0$ 로 표현함으로써 [[nullspace]] matrix $N=\left[\begin{array}{r}-F \\ I\end{array}\right]$ 를 얻을 수 있다.

## C.1) 예시

reduced row-echelon form (pivot 이 bold 체로 표기되어 있음)

$$
\boldsymbol{A}=\left[\begin{array}{ccccc}
\mathbf{1} & 3 & 0 & 0 & 3 \\
0 & 0 & \mathbf{1} & 0 & 9 \\
0 & 0 & 0 & \mathbf{1} & -4
\end{array}\right]
$$

# D) Related

* [[free variable]], [[basic variable]],
