---
title: "column space"
tags: ["linear_algebra"]
aliases: ["range"]
---

# 1. Column Space ?

column space $C(A)$ 는 matrix $A$ 의 columns 들의 모든 [[linear combination|선형 결합]] 을 통해 구성되는 [[subspace]] 를 의미한다.

$A$ 의 column 이 [[Linear Independence|linearly independent]] 하다는 의미는 해당 column 이 column space 를 구성하는데 기여하고 있다는 의미가 된다.

# 2. Column Space 의 필요성

column space 가 중요한 이유는 $Ax=b$ 를 풀기 위해서는 **$b$ 를 $A$ columns 들의 선형 조합으로 표현해야 하기 때문이다**. 즉, $Ax=b$ 를 만족하는 $x$ 를 찾기 위해서는 $A$ 의 column space 에 $b$ 가 존재해야된다는 필요충분조건을 지닌다.

다시 말하면, $Ax=b$ 에서 $A$ 의 열은 $C(A)$ 라는 column space (plane) 에 존재하고, $b$ 가 $C(A)$ 에 존재할 경우 $Ax=b$ 가 풀린다.

![](https://i.imgur.com/Lzhu702.png)

# 3. 특징

만약 $A$ 가 $m\times n$ 행렬이라면, $A$ 의 column space 는 $R^m$ 의 subspace 를 의미한다.

# 4. 예시

* $I=\left[\begin{array}{ll}1&0\\0&1\end{array}\right]$ 의 column space 는 $\mathbf{R}^{2}$ 전체 공간이다.
* $A=\left[\begin{array}{ll}1&2\\2&4\end{array}\right]$ 의 column space 는 line 이다. 즉, $\mathbb{R}^{2}$ 에서의 1 차원 공간 (line) 을 의미한다. 왜냐하면 $(2,4)$ 열 벡터가 $(1,2)$ 열 벡터와 선형 독립이 아니기 때문이다.

# 5. Related

# 6. References
