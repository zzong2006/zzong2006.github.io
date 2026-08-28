---
title: "elimination"
tags: ["linear_algebra"]
aliases: ["elimination matrix"]
---

# 1. Elimination ?

Elimination 은 [[system of linear equations]] 을 풀기 위한 방식이다. 즉, $A \mathbf{x}=\mathbf{b}$ 에서 $\mathbf{x}$ 를 찾기 위한 전략을 의미한다.

## 1.1. Elimination 과정 (with example)

다음과 같이 $A=\left[\begin{array}{lll}1 & 2 & 1 \\ 3 & 8 & 1 \\ 0 & 4 & 1\end{array}\right]$ 그리고 $\mathbf{b}=\left[\begin{array}{r}2 \\ 12 \\ 2\end{array}\right]$ 가 주어졌다고 해보자.

elimination 과정의 첫번째는 $A$ 를 upper triangular matrix $U$ 로 바꾸는 것이다.

$$
A=\left[\begin{array}{lll}1 & 2 & 1 \\ 3 & 8 & 1 \\ 0 & 4 & 1\end{array}\right] \longrightarrow\left[\begin{array}{rrr}1 & 2 & 1 \\ 0 & 2 & -2 \\ 0 & 4 & 1\end{array}\right] \longrightarrow U=\left[\begin{array}{rrr}1 & 2 & 1 \\ 0 & 2 & -2 \\ 0 & 0 & 5\end{array}\right]
$$

여기서 각 행마다 0 이 아닌 첫번째 열 원소를 [[pivot]] 이라 부른다. 위 예시에서는 $U$ 의 1, 2, 5 가 각각 pivot 값이다.

물론 $A$ 에서 $U$ 로 바꾸면 $\mathbf{b}$ 또한 영향이 간다. 이렇게 바꿔진 값을 $\mathbf{c}$ 가 되며, 결과적으로 $A \mathbf{x}=\mathbf{b}$ 는 $U \mathbf{x}=\mathbf{c}$ 가 된다.

위 예시에서는 $c=\left[\begin{array}{r}2 \\ 6 \\ -10\end{array}\right]$ 가 된다.

## 1.2. Back Substitution

이제 $\mathbf{x}$ 를 구하는 것은 쉽다. $U \mathbf{x}=\mathbf{c}$ 에서 가장 밑의 행부터 $\mathbf{x}$ 의 원소를 찾으면 된다. 이를 back substitution 방식이라고 한다.

위 예시에서는 $z=-2, y=1$ 그리고 $x=2$ 를 구할 수 있다.

# 2. Elimination Matrix

$A$ 에서 $U$ 를 만드는 것은 행렬을 통해서도 가능하다. 그 작업을 도와주는 것이 elimination matrix 이다.

elimination 예시에서 $A$ 의 첫번째 pivot 을 찾기 위해서 다음과 같이 elimination matrix 를 적용할 수 있다.

$$
\left[\begin{array}{rrr}1 & 0 & 0 \\ -3 & 1 & 0 \\ 0 & 0 & 1\end{array}\right]\left[\begin{array}{lll}1 & 2 & 1 \\ 3 & 8 & 1 \\ 0 & 4 & 1\end{array}\right]=\left[\begin{array}{rrr}1 & 2 & 1 \\ 0 & 2 & -2 \\ 0 & 4 & 1\end{array}\right]
$$

이 행렬을 해석하자면, “$A$ 의 첫번째 행에서 -3 을 곱하고 두번째 행에 더하라 ” 라는 의미가 된다.

더 간단하게 $E_{21} A$ 로 표현할 수 있다. 여기서 $21$ 은 2 번째 행, 1 번째 열에 위치한 pivot 을 위해 적용한 matrix 라는 뜻이다.

즉, $U \mathbf{x}=E A \mathbf{x}=E \mathbf{b}=\mathbf{c}$ 를 푸는 것으로, 선형 시스템을 보다 쉽게 풀 수 있는 것이다.

## 2.1. Inverse

elimination matrix 의 [[Inverse matrix]] 는 무엇일까?

예를 들어 $E_{21}=\left[\begin{array}{rrr}1 & 0 & 0 \\ -3 & 1 & 0 \\ 0 & 0 & 1\end{array}\right]$ 라면, inverse matrix 는 $E_{21}^{-1}=\left[\begin{array}{lll}1 & 0 & 0 \\ 3 & 1 & 0 \\ 0 & 0 & 1\end{array}\right]$ 가 된다. $E_{21}^{-1} E_{21}=I$ 로 검증이 가능하다.

# 3. Pivot Issue

만약 pivot 이 $0$ 이라면 어떻게 될까? 이 경우, [[permutation matrix]] 를 통해 다른 행에 대한 pivot 을 구할 수 있다.

이것마저 통하지 않는다면, 결과적으로 $A$ 에 invertible 하지 않다고 말할 수 있다 (i.e. [[singular]])

# 4. How Expensive is Elimination?

$n \times n$ matrix 에 대하여 elimination 을 적용한다면 얼만큼의 비용이 드는가?

일반적으로 행렬의 첫번째 pivot 을 만들기 위해 어떤 행에서 다른 행을 빼야하는 $n$ operations 을 총 $n$ 개의 행에 대해서 수행하므로, 총 $n^2$ 의 작업량이 소요된다. 그럼 두번째 pivot 은 $(n-1)^2$ 이 요구되고, .. 이를 마지막 pivot 까지 반복할 수 있다.

결과적으로 이는 $n^3$ 의 operation 이 요구된다.

$$
1^{2}+2^{2}+\cdots+(n-1)^{2}+n^{2}=\sum_{i=1}^{n} i^{2} \approx \int_{0}^{n} x^{2} d x=\frac{1}{3} n^{3}
$$

Elimination 뿐만 아니라 $A$ 를 [[LU decomposition]] 을 통해 $LU$ 로 만드는 작업도 동일한 비용이 요구된다 (결국 $LU$ 도 elimination 작업의 종류 중 하나일 뿐이므로).

# 5. Related

[[Gauss-Jordan Elimination]]

# 6. References
