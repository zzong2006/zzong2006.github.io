---
title: "permutation"
tags: ["math"]
---

# A) Permutation ?

$n$ distinct 객체에서 $r$ 개를 뽑는 방법의 수

$$
{ }_{n} P_{r}=\frac{n !}{(n-r) !}
$$

만약 $n$ 개의 객체 중 $n_k$ 는 $k$ 번째 객체로 동일하다면, 다음과 같이 뽑을 수 있다.

$$
\frac{n !}{n_{1} ! n_{2} ! \cdots n_{k} !}
$$

## A.1) 예시 (1)

졸업생 25 명에게 상 (award) 종류 3 개를 나눠 주는 방법을 서술하라. 학생 당 오직 한개의 상만 받을 수 있다.

$$
{ }_{25} P_{3}=\frac{25 !}{(25-3) !}=\frac{25 !}{22 !}=(25)(24)(23)=13,800
$$

## A.2) 예시 (2)

$x$ 2 개, $y$ 2 개를 정렬하는 방법: $4 ! /(2 ! 2 !)=6$

# B) Partitioning

$n$ 개 ($n_{1}+n_{2}+\cdots+n_{r}=n$) 의 객체를 $r$ 개의 cell 로 나누는 경우, $n_1$ 개는 첫번째 셀 그리고 $n_2$ 는 두번째 셀 … 이라면

$$
\left(\begin{array}{c}
n \\
n_{1}, n_{2}, \ldots, n_{r}
\end{array}\right)=\frac{n !}{n_{1} ! n_{2} ! \cdots n_{r} !}
$$

만약 나누려는 cell 이 두개인 경우, 이를 [[combination]] 이라 부른다.

# C) Related

# D) References
