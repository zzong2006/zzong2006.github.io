---
tags: ["linear_algebra", "math"]
aliases: ["matrices", "행렬"]
---

# Matrix?

matrix 는 [[linear mapping]] 또는 vector 의 collection 이라고 생각할 수 있다. [[vector space|벡터 공간]] 은 꽤 추상적이므로, 이를 컴퓨터에 표현하고 다루기 위해서는 숫자들로 구성된 직사각형 array 들, 즉, 행렬을 사용할 필요가 있다.

# The Matrix of a Linear Map

$W$ 와 $V$ 가 유한 차원의 벡터 공간을 이루고, 이에 대한 기저들이 $\mathbf{v}_{1}, \ldots, \mathbf{v}_{n}$ and $\mathbf{w}_{1}, \ldots, \mathbf{w}_{m}$ 로 구성된다고 가정하자. 그리고 linear map $T: V \rightarrow W$ 이 존재한다고 할 경우, 행렬 $T$ 는 원소 $A_{ij}$ 로 구성되며 다음과 같이 표현된다 ($i = 1, …, m$ , $j = 1, …, n$).

$$
T \mathbf{v}_{j}=A_{1 j} \mathbf{w}_{1}+\cdots+A_{m j} \mathbf{w}_{m}
$$

위 뜻은 $T\mathbf{v}_j$ 를 표현하기 위해 $\mathbf{A}$ 의 $j$ 번째 column 이 $W$ 의 기저에 대한 [[coordinates]] 를 구성하고 있다는 의미가 된다.

반대로 생각하면, 모든 행렬 $\mathbf{A} \in \mathbb{R}^{m \times n}$ 는 선형 매핑 $T: \mathbb{R}^{n} \rightarrow \mathbb{R}^{m}$ 을 다음과 같이 나타낸다고 볼 수 있다. 즉, row 는 output dim 이고 column 은 input dim 으로 생각하면 편하다.

$$
T \mathbf{x}=\mathbf{A} \mathbf{x}
$$

# Inverse Matrix

[[Inverse matrix]] 참조

# Transpose

[[transpose]] 참조

## Related

[[symmetric matrix]]

# Square Matrix

만약 어떤 정방 행렬이 invertible 하면, 그 행렬을 tranpose 한 행렬도 inverse matrix 를 가진다. 즉, $\left(\boldsymbol{A}^{-1}\right)^{\top}=\left(\boldsymbol{A}^{\top}\right)^{-1}=: \boldsymbol{A}^{-\top}$ 을 만족한다.

# Elimination Matrix

* 실제로 triangular matrix 를 만들 때는 matrix multiplication 연산을 통해 coefficient 를 0 으로 만들면서 진행한다.
* 예시: $E_{31}=\left[\begin{array}{rll}1&0&0\\0&1&0\\-\ell&0&1\end{array}\right]$
	* 첫번째 행에 $-l$ 을 곱하고, 세번째 행에서 빼준다.
	* $E\boldsymbol{b}=\left[\begin{array}{rll}1&0&0\\0&1&0\\-4&0&1\end{array}\right]\left[\begin{array}{l}1\\3\\9\end{array}\right]=\left[\begin{array}{l}1\\3\\5\end{array}\right]$

# Augmented Matrix

compact matrix notation 을 위한 행렬 표기로, 주로 [[Gaussian elimination]] 에서 사용하기 위해 활용한다.

즉, $\boldsymbol{A} \boldsymbol{x}=\boldsymbol{b}$ 를 풀기 위해 $[\boldsymbol{A} \mid \boldsymbol{b}]$ 로 표기하는 방법이다.

## 예시

$$
\begin{aligned}
&-2 x_{1}+4 x_{2}-2 x_{3}-x_{4}+4 x_{5}=-3\\
&4 x_{1}-8 x_{2}+3 x_{3}-3 x_{4}+x_{5}=2\\
&x_{1}-2 x_{2}+x_{3}-x_{4}+x_{5}=0\\
&x_{1}-2 x_{2}-3 x_{4}+4 x_{5}=a
\end{aligned}
$$

가 있다고 가정하면, 다음과 같이 표기될 수 있다.

$$
\left[\begin{array}{rrrrr|r}
-2 & 4 & -2 & -1 & 4 & -3 \\
4 & -8 & 3 & -3 & 1 & 2 \\
1 & -2 & 1 & -1 & 1 & 0 \\
1 & -2 & 0 & -3 & 4 & a
\end{array}\right]
$$
