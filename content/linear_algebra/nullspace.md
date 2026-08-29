---
title: "nullspace"
aliases: ["영공간"]
tags:
  - linear_algebra
---

# A) Nullspace ?

nullspace $N(A)$ 는 $m\times n$ matrix $A$ 에 대해서, $A\mathbf{x}=\mathbf{0}$ 에 대한 모든 solution 들 $x\in\mathbf{R}^{n}$ 의 collection 을 뜻한다. 즉, $N(A)$ 는 [[linear combination|선형 결합]] 을 통해 zero vector 를 얻을 수 있는 column vector 들을 포함하고 있다.

## A.1) 다른 정의 (using Linear mapping)

만약 [[linear mapping|linear map]] $T: V \rightarrow W$ 이 존재한다면, $T$ 의 nullspace 는 다음을 만족한다.

$$
\operatorname{null}(T)=\{\mathbf{v} \in V \mid T \mathbf{v}=\mathbf{0}\}
$$

그리고 $T$ 에 대한 range 는 다음과 같다.

$$
\operatorname{range}(T)=\{\mathbf{w} \in W \mid \exists \mathbf{v} \in V \ \text{such that} \ T \mathbf{v}=\mathbf{w}\}
$$

# B) Column Space 와 비교

[[column space]] 는 $A$ column vector 의 차원 수 $m$ 을 따른다. 즉, $\mathbb{R}^{m}$ 의 [[subspace]] 를 가지는데, 반대로 nullspace 는 $\mathbb{R}^{n}$ 의 subspace 를 가진다.

이 subspace 는 [[vector space|벡터 공간]] 에 대한 조건을 만족한다: $A(c \mathbf{x})=c A \mathbf{x}=c(\mathbf{0})$ 이고, $A\left(\mathbf{x}_{1}+\mathbf{x}_{2}\right)=A \mathbf{x}_{1}+A \mathbf{x}_{2}=\mathbf{0}+\mathbf{0}$ 를 만족

# C) Nullspace 찾기

정확히는 nullspace matrix $N$ 을 찾는 방법.

1. $A \mathbf{x}=\mathbf{0}$ 에서, $A$ 에 대한 echelon(staircase, 계단) form $U$ 을 찾는다.
2. $U$ 를 reduced [[row-echelon form]] $R$ 으로 변경한다.
3. 이제, $R=\left[\begin{array}{ll}I & F \\ 0 & 0\end{array}\right]$ 의 형태로 바꾸면, $R N=0$ 을 만족하는 $N=\left[\begin{array}{r}-F \\ I\end{array}\right]$ 를 찾을 수 있다.

여기서 $N$ 의 column 들은 [[special solution]] 들을 의미한다.그리고 $A\mathbf{x}=\mathbf{0}$ 에 해당하는 special solution 들의 모든 조합들은 $A$ 의 nullspace 를 구성한다.

## C.1) 예시

1. $U$ 찾기

   $$
   A=\left[\begin{array}{rrrr}1 & 2 & 2 & 2 \\ 2 & 4 & 6 & 8 \\ 3 & 6 & 8 & 10\end{array}\right] \longrightarrow\left[\begin{array}{llll}1 & 2 & 2 & 2 \\ 0 & 0 & 2 & 4 \\ 0 & 0 & 2 & 4\end{array}\right] \longrightarrow\left[\begin{array}{llll}1 & 2 & 2 & 2 \\ 0 & 0 & 2 & 4 \\ 0 & 0 & 0 & 0\end{array}\right]=U


$$
2. $R$
 찾기

   
$$

   U=\left[\begin{array}{llll}1 & 2 & 2 & 2 \\ 0 & 0 & 2 & 4 \\ 0 & 0 & 0 & 0\end{array}\right] \rightarrow\left[\begin{array}{rrrr}1 & 2 & 0 & -2 \\ 0 & 0 & 2 & 4 \\ 0 & 0 & 0 & 0\end{array}\right] \rightarrow\left[\begin{array}{rrrr}1 & 2 & 0 & -2 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 0\end{array}\right]=R

$$
3. $N$ 찾기

   
$$

   N = \left[\begin{array}{rr}-2 & 2 \\ 0 & -2 \\ 1 & 0 \\ 0 & 1\end{array}\right]

$$

# 4. Some Properties

nullspace 는 $\mathbf{R}^{n}$ 의 subspace 이다.

# 5. 예시

1. $\left[\begin{array}{lll}1 & 1 & 2 \\ 2 & 1 & 3 \\ 3 & 1 & 4 \\ 4 & 1 & 5\end{array}\right]\left[\begin{array}{l}x_{1} \\ x_{2} \\ x_{3}\end{array}\right]=\left[\begin{array}{l}0 \\ 0 \\ 0 \\ 0\end{array}\right]$ 에 대한 matrix $A$ 의 nullspace $N(A)$ 는 $c\left[\begin{array}{r}1 \\ 1 \\ -1\end{array}\right]$ 로 구성된다. 즉, $N(A)$ 는 $\mathbb{R}^{3}$ 에 대한 line 을 나타낸다.
* $\left[\begin{array}{lll}1&2&3\end{array}\right]\left[\begin{array}{l}x\\y\\z\end{array}\right]=0$ 의 두 special solution 들은 $s_{1}=\left[\begin{array}{r}-2\\1\\0\end{array}\right]$ 와 $\boldsymbol{s}_{2}=\left[\begin{array}{r}-3\\\mathbf{0}\\\mathbf{1}\end{array}\right]$ 이므로, nullspace 는 plane 이다.
