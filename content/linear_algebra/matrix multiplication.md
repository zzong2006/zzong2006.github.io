---
tags: ["linear_algebra"]
---

# Matrix Multiplication

## Vector 의 경우

$A\boldsymbol{x}=\boldsymbol{b}$ 의 경우 다음과 같이 행 또는 열을 나눠서 계산할 수 있다.

### Multiplication by Rows

$$
A\boldsymbol{x}=\left[\begin{array}{l}(\operatorname{row}1)\cdot{x}\\(\operatorname{row}2)\cdot{x}\\(\operatorname{row}3)\cdot{x}\end{array}\right]
$$

### Multiplication by Columns

$$
Ax=x(\text{column}1)+y(\text{column}2)+z(\text{column3)}
$$

또는

$$
AB=A\left[\begin{array}{lll}b_{1}&b_{2}&b_{3}\end{array}\right]=\left[\begin{array}{ll}Ab_{1}&Ab_{2}&Ab_{3}\end{array}\right]
$$

이를 [[linear combination]] of columns 라고 표현한다.

## Blocks

matrix $A$ 와 $B$ 가 block 형태로 나눠진다면, $A B=C$ 는 block 들의 곱 형태로 표현할 수 있다.

$$
\left[\begin{array}{ll}A_{1} & A_{2} \\ A_{3} & A_{4}\end{array}\right]\left[\begin{array}{ll}B_{1} & B_{2} \\ B_{3} & B_{4}\end{array}\right]=\left[\begin{array}{ll}C_{1} & C_{2} \\ C_{3} & C_{4}\end{array}\right]
$$

인 경우: $C_{1}=A_{1} B_{1}+A_{2} B_{3}$

# Dot Product 를 활용한 계산

위 $x$ 와 달리 여기 $x,y,z$ 는 scalar 로, vector 의 element (from $\boldsymbol{b}$)

* $A\boldsymbol{x}=\boldsymbol{b}$ 가 unique solution 을 만족하 위한 조건은 무엇이 있는가?
	* $A$ 가 invertible.
	* columns are independent.
	* the determinant isn’t zero.

# References
