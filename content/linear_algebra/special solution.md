---
tags: ["linear_algebra"]
aliases: ["particular solution"]
---

# Special Solution

special solution 이란, $Ax=0$ 의 계산 상황에서 [[free variable]] 를 임의의 값으로 설정하여 얻어낸 solution $x$ 를 의미한다. 그리고 special solution 들에 대한 [[linear combination|선형 결합]] 은 [[nullspace]] 를 구성한다.

만약 special solution 이 존재하지 않아서, $A$ 의 nullspace $\boldsymbol{N}(A)$ 가 오직 zero vector 만 포함한다면, 이는 $A$ 의 columns 들이 모두 [[Linear Independence]] 하다는 의미가 된다.

special solution 의 총 개수는 free variable 의 개수와 동일하다.

## 예시

![](https://i.imgur.com/W7sCuD6.png)

# 특징

$m\times n$ matrix $A$ 는 $Ax=0$ 에서 nonzero solution 을 가진다는 전제하에, $n>m$ 이라면 언제나 free column 을 가진다.

# 구하는 방법

* $A$ 를 row echelon form $R$ 로 줄인다.
	* 여기서 $R$ 을 만드는 방법은 두가지가 있다.

		1. 상위 pivot row 들을 가지고 elimination 을 통해 zero 만들기
		2. pivot row 를 가지고 전체 row 들을 나눠서 one 만들기

	* 완성된 $R$ 의 pivot column 들은 identity matrix $I$ 를 포함한다.
* $Rx=0$ 에 대한 special solution 을 구한다.
	* free column 에 해당하는 variable 들은 하나만 $1$ 의 값을 가지고 나머지는 $0$ 의 값을 가지게 설정한다.
	* 그리고 pivot column 에 해당하는 variable 을 통해 $Rx=0$ 를 푼다.

# 예시

## 예시 (1)

$Cs = \mathbf{0}$ 를 풀어보자.

![](https://i.imgur.com/ON5T6fT.png)

$U$ 에서 $R$ 에서 가는 방법: 두번째 행을 이용해 첫번째 행에 뺀 뒤에, 두번째 행을 $1/2$ 로 나누면 $I$ 를 찾을 수 있다.

![](https://i.imgur.com/Gf0o8oH.png)

그러면 세번째와 네번째 free variables $x_3,x_4$ 들은 하나를 $1$ 나머지는 $0$ 으로 설정하고, $x_1,x_2$ 에서 $Rx=0$ 를 풀면 된다. 즉, 가능한 special solution 들은 $s_{1}=(-2,0,1,0)$ 또는 $s_{2}=(0,-2,0,1)$ 이다.

## 예시 (2)

$$
\left[\begin{array}{lll}1 & -5 & 2\end{array}\right]\left[\begin{array}{l}x \\ y \\ z\end{array}\right]=[0]
$$

여기서 $1$ 에 해당하는 포지션은 [[pivot]] 을 의미하고, 나머지 둘은 free variable 이다. 푸는 방법은 free variable 중 하나에 1 을 넣고, 나머지를 0 으로 셋팅함으로써 special solution 들을 구할 수 있다.

* $y=1, z=0$ 이면 $x=5$
* $y=0, z=1$ 이면, $x=-2$

결과적으로 $C_{1} \cdot\left[\begin{array}{c}5 \\ 1 \\ 0\end{array}\right]+C_{2} \cdot\left[\begin{array}{c}-2 \\ 0 \\ 1\end{array}\right]$ 가 special solution 의 general form 이며, 3 차원 공간에서 평면 형태의 nullspace 를 나타낸다.
