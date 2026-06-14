---
title: "basis"
tags: ["linear_algebra"]
aliases: ["기저"]
---

# A) Basis ?

[[vector space|벡터 공간]] 을 만드는 벡터를 뜻한다.

다시 말하면, 어떤 벡터들의 집합이 1) [[Linear Independence|선형 독립]] 을 만족하고, 2) 이 집합의 [[span]] 이 벡터 공간 $V$ 을 구성한다면, 그 집합의 벡터들은 $V$ 에 대한 basis 라고 부를 수 있다.

사실, 모든 선형 독립을 만족하는 벡터들의 집합은 그 집합의 span 에서 basis 를 담당하게 된다. 즉, $\mathbb{R}^{n}$ 에 존재하는 $n$ 개의 column vector 를 통해 구성된 matrix 가 [[Inverse matrix|invertible]] 하다면, 해당 vector 들은 basis 를 구성한다.

## A.1) Basis for a Subspace

$\mathbb{R}^{n}$ 에 대한 모든 basis 는 정확히 $n$ 개의 vector ([[dimension]] 수) 를 만족해야 한다.그렇다고 어떤 공간에 필요한 basis 개수가 차원 개수라는 것 뿐이지, 그 공간에 basis 수가 차원 수밖에 없다는 것으로 오해하면 안된다.
$\quad$ 예시로, $\mathbb{R}^{3}$ 에 존재하는 $\left[\begin{array}{l}1 \\ 1 \\ 2\end{array}\right]$ 와 $\left[\begin{array}{l}2 \\ 2 \\ 5\end{array}\right]$ 벡터의 span 은 plane 을 구성하는데, 이는 $\mathbb{R}^{3}$ 에 대한 basis 를 구성하지 못한다 (대신 2 차원 공간 $\mathbb{R}^{2}$ 는 가능하다).

## A.2) Bases of a Column Space and Nullspace

any matrix $A$ 에 대하여 다음을 항상 만족한다.

* $A$ 의 rank = $A$ 의 [[pivot|pivot column]] 개수 = [[column space]] $C(A)$ 의 차원 수
* [[nullspace]] $N(A)$ 의 차원 수 = [[free variable]] 개수 = $n - r$
  여기서 $n$ 은 $A$ 의 column 개수이고, $r$ 은 rank

## A.3) 예시

Q. 4 개의 벡터 $(1,1,-2,0,-1)$, $(1,2,0,-4,1)$,$(0,1,3,-3,2)$,$(2,3,0,-2,0)$ 가 span 으로 구성된 벡터 공간의 basis 와 차원 수를 구하라.

A. [[elimination]] 을 통해 선형 독립을 만족하는 벡터 개수를 구하면 된다.

$$
\left[\begin{array}{ccccc}1 & 1 & -2 & 0 & -1 \\ 1 & 2 & 0 & -4 & 1 \\ 0 & 1 & 3 & -3 & 2 \\ 2 & 3 & 0 & -2 & 0\end{array}\right] \rightarrow \left[\begin{array}{ccccc}
1 & 1 & -2 & 0 & -1 \\
0 & 1 & 2 & -4 & 2 \\
0 & 0 & 1 & 1 & 0 \\
0 & 0 & 0 & 0 & 0
\end{array}\right]
$$

basis 는 $(1,1,-2,0,-1)$, $(0,1,2,-4,2)$, $(0,0,1,1,0)$ 이며, 차원 수 (i.e. basis 개수) 3 이다.

$\quad$ 중요한 점은 [[row-echelon form]] 을 통해 구해진 vector 를 그대로 basis 로 썼다는 점이다. 이게 가능한 이유는 REF form 형태의 vector 로도 original vector 를 재현해낼 수 있기 때문이다. 그렇지 않을 경우, original vector 를 basis 로 써야 한다 ([refer](https://www.youtube.com/watch?v=MMWqGD4Urso)).

# B) Orthonormal Basis

만약 기저 벡터가 unit vector 면서 서로 [[orthogonal]] 이라면, 이러한 기저 벡터를 [[orthonormal]](정규직교) basis vector 라고 부른다.

아래 그림은 정규직교 기저 벡터 $\boldsymbol{k}$, $\boldsymbol{i}$, $\boldsymbol{j}$ 를 나타낸다.

<img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/3D_Vector.svg" alt="Standard basis - Wikipedia" style="zoom:20%;" />

# C) Basis Change

[[linear mapping]] $\Phi: V \rightarrow W$ 에 대하여, $V$ 에 대한 ordered bases $B=\left(\boldsymbol{b}_{1}, \ldots, \boldsymbol{b}_{n}\right), \quad \tilde{B}=\left(\tilde{\boldsymbol{b}}_{1}, \ldots, \tilde{\boldsymbol{b}}_{n}\right)$ 가 존재하고, $W$ 에 대한 $C=\left(\boldsymbol{c}_{1}, \ldots, \boldsymbol{c}_{m}\right), \quad \tilde{C}=\left(\tilde{\boldsymbol{c}}_{1}, \ldots, \tilde{\boldsymbol{c}}_{m}\right)$ 가 존재한다고 하자.

이때 다음을 만족한다.

$$
\tilde{A}_{\Phi}=\boldsymbol{T}^{-1} A_{\Phi} \boldsymbol{S}
$$

$$
\

[[transformation matrix|변환 행렬]]이 다음과 같다고 하자.
$$

A=\left[\begin{array}{ll}2 & 1 \\ 1 & 2\end{array}\right]

$$

만약 새로운 basis

$$

B=\left(\left[\begin{array}{l}1 \\ 1\end{array}\right],\left[\begin{array}{c}1 \\ -1\end{array}\right]\right)

$$ 를 정의한다면, 다음과 같은 $B$ 에 대한 새로운 대각 변환 행렬을 얻을 수 있다.

$$
\tilde{A}=\left[\begin{array}{ll}3 & 0 \\ 0 & 1\end{array}\right]$$
이는 $A$ 보다 훨씬 작업하기가 쉬운 형태다.
# D) Related

# E) References
