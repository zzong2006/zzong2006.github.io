---
tags: ["linear_algebra"]
---

* Elimination produces an upper triangular system.
* To eliminate $x$ : Subtract a multiple of equation 1 from equation 2.

# A) 예시

$$
\begin{aligned}x-2y&=1\\3x+2y&=11\end{aligned}
$$

위 식에서 첫번째 식에 $3$ 을 곱해서 두번째 식에 뺀다.

![|500](https://i.imgur.com/jSMFfKJ.png)

여기서 첫번째 식에 곱해줘야할 값 $3$ 을 multiplier 라고 한고, 첫번째 식에 있는 값 $1$ 을 (first) pivot 이라 한다.

## A.1) About Pivots

pivots 에 관한 특징들

* 0 값은 pivot 이 될 수 없다.
* $n$ 개의 equations 을 풀기 위해서는 $n$ 개의 pivots 이 필요하다.
  예를 들어, 4 개의 방정식을 풀기위해서는 upper triangular system 으로 변환했을 때, $0$ 이 아닌 값을 가지는 4 개의 pivot 이 있어야 한다는 의미다.

위 예시에서 second pivot 은 $8$ 이다 ($8y=8$).

# B) Find Inverse Matrix Using GE

Gaussian elimination 을 이용하면 [[Inverse matrix]] 를 찾을 수 있음

$AB=I$ 에서 $A$ 를 gaussian elimination 을 통해 identity matrix $I_A$ 로 바꾸면 $I_{A}B=A^{-1}$ 가 된다. 즉, $B=A^{-1}$ 를 찾게 된다.

# C) Singular & Non-singular

* singular: solution 이 아주 많거나 아예 없거나 case
* non-singular: 정확히 하나의 solution 만 존재하는 case
* solution 이 무한하지 않으면서 2 개 이상 존재하는 경우는 없다. 왜냐하면 두 solution 벡터 ($x$ 그리고 $y$) 들은 또 다른 벡터 (solution) 만들 수 있기 때문이다.
	* $\boldsymbol{z}=\alpha\boldsymbol{x}+(1-\alpha)\boldsymbol{y}$
* The original $A\boldsymbol{x}=\boldsymbol{b}$ has been converted into an upper triangular $U\boldsymbol{x}=\boldsymbol{c}$.
	* ![[img-47f9a1faa3.png]]
