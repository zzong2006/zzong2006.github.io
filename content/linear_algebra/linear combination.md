---
title: "linear combination"
tags: ["linear_algebra"]
aliases: ["선형 결합"]
---

# A) Linear Combination ?

벡터들의 집합 $\left\{\boldsymbol{v}^{(1)}, \ldots, \boldsymbol{v}^{(n)}\right\}$ 에 대한 선형 결합이란, 각 벡터 $\boldsymbol{v}^{(i)}$ 에 대해 scalar 계수를 곱해서 더한 것을 의미한다.

$$
\sum_{i} c_{i} \boldsymbol{v}^{(i)}
$$

이는 matrix 와 vector 곱의 경우도 선형 결합으로 볼 수 있는데, 왜냐하면 각 벡터의 원소가 그에 따른 matrix 의 column vector 와 곱해지는 것으로 볼 수 있기 때문이다.

$$
\boldsymbol{A} \boldsymbol{x}=\sum_{i} x_{i} \boldsymbol{A}_{:, i}
$$

2 차원 벡터 기준으로, 벡터 개수에 따른 모든 선형 결합은 다음을 만족한다.

![](https://i.imgur.com/z988Oi1.png)

* single vector, $\boldsymbol{u}$: line
* double vector, $u$, and $v$: plane
* triple vector, $\boldsymbol{u},\boldsymbol{v},\boldsymbol{w}$: 전체 공간 $\mathbf{R}^{3}$

세 벡터 $\boldsymbol{u}$ and $\boldsymbol{v}$ and $\boldsymbol{u}$ 의 선형 결합은 다음과 같다: $c\boldsymbol{u}+d\boldsymbol{v}+e\boldsymbol{w}$

# B) 예시

다음 식

$$
\left[\begin{array}{cc}2 & -1 \\ -1 & 2\end{array}\right]\left[\begin{array}{l}x \\ y 
 \end{array}\right]=\left[\begin{array}{l}0 \\ 3\end{array}\right]
$$

 는 다음과 같이 바뀐다.

$$
x\left[\begin{array}{r}2 \\ -1\end{array}\right]+y\left[\begin{array}{c}-1 \\ 2\end{array}\right]=\left[\begin{array}{l}0 \\ 3\end{array}\right]
$$

# C) References
