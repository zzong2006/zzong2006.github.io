---
title: "Solving Ax=b"
tags: ["linear_algebra"]
---

# 1. Solving Ax=b ?

$A \mathbf{x}=\mathbf{b}$ 를 푼다고 했을 때, solution 이 얼마나 많은지 어떻게 아는가?

$A \mathbf{x}=\mathbf{b}$ 의 모든 solution 을 찾기 위해서는 1) 우선 이 수식이 풀리는지 확인하고, 2) 이후 [[special solution|particular solution]] 을 찾아야 한다.

1. $A \mathbf{x}=\mathbf{b}$ 가 풀리는 경우는 $\mathbf{b}$ 가 반드시 $A$ 의 [[column space]] $C(A)$ 에 있어야 한다.
2. 이를 확인했다면, 임의의 한 particular solution $\mathbf{x}_p$ 을 찾는다. 그리고 이를 [[nullspace]] 에 있는 generic vector $\mathbf{x}_n$ 과 합쳐서 general solution $\mathbf{x}_{\text {complete }}=\mathbf{x}_{p}+\mathbf{x}_{n}$ 을 찾는다.

# 2. 예시

$$
A=\left[\begin{array}{rrrr}1 & 2 & 2 & 2 \\ 2 & 4 & 6 & 8 \\ 3 & 6 & 8 & 10\end{array}\right]
$$

$A$ 의 세번째 행은 두번째 행과 세번째 행의 합이므로 $A \mathbf{x}=\mathbf{b}$ 가 solution 을 가지려면 $\mathbf{b}$ 도 $b_{3}=b_{1}+b_{2}$ 를 만족해야 한다. 즉, [[augmented matrix]] 를 통해 다음과 같이 표현할 수 있다.

$$
\left[\begin{array}{rrrrr}1 & 2 & 2 & 2 & b_{1} \\ 2 & 4 & 6 & 8 & b_{2} \\ 3 & 6 & 8 & 10 & b_{3}\end{array}\right] \rightarrow \cdots \rightarrow\left[\begin{array}{lllll}1 & 2 & 2 & 2 & b_{1} \\ 0 & 0 & 2 & 4 & b_{2}-2 b_{1} \\ 0 & 0 & 0 & 0 & b_{3}-b_{2}-b_{1}\end{array}\right]
$$

위 matrix $A$ 의 [[free variable]] 은 2 개이고, [[pivot]] 은 2 개이다.

여기서 $b_{3}-b_{2}-b_{1}=0$ 를 만족해야 하므로, 한가지 예로 $\mathbf{b}=\left[\begin{array}{l}1 \\ 5 \\ 6\end{array}\right]$ 를 택할 수 있다. 그리고 free variable 을 0 으로 설정하면 particular solution 을 얻는다.

$$
\mathbf{x}_{p}=\left[\begin{array}{r}-2 \\ 0 \\ 3 / 2 \\ 0\end{array}\right]
$$

그 다음 nullspace 의 generic vector 를 구할 차례다. $A \mathbf{x}_{n}=\mathbf{0}$ 를 기반으로 special solution 을 구한다면, $A x=\left[\begin{array}{l}1 \\ 5 \\ 6\end{array}\right]$ 에 대한 전체 solution 은 다음과 같다.

$$
\mathbf{x}_{\text {complete }}=\left[\begin{array}{r}-2 \\ 0 \\ 3 / 2 \\ 0\end{array}\right]+c_{1}\left[\begin{array}{r}-2 \\ 1 \\ 0 \\ 0\end{array}\right]+c_{2}\left[\begin{array}{r}2 \\ 0 \\ -2 \\ 1\end{array}\right]
$$

보다시피 $A$ 의 nullspace 는 $\mathbb{R}^{4}$ 에 대한 2 차원 [[subspace]] 이다. 그리고 $A \mathbf{x}=\mathbf{b}$ 에 대한 모든 solution 들은 $x_{p}$ 를 통과하는 plane 에 평행한 plane 을 나타낸다.

# 3. Complete Solution

# 4. Related

# 5. References
