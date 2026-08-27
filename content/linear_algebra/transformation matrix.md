---
tags: ["linear_algebra"]
aliases: ["변환 행렬"]
---

# A) Transformation Matrix ?

[[vector space]] $V, W$ 에 따른 각각의 ordered bases $B=\left(\boldsymbol{b}_{1}, \ldots, \boldsymbol{b}_{n}\right)$ 그리고 $C=\left(\boldsymbol{c}_{1}, \ldots, \boldsymbol{c}_{m}\right)$ 가 있다고 했을 때, [[linear mapping]] $\Phi: V \rightarrow W$ 는 $j \in\{1, \ldots, n\}$ 에 대하여 다음과 같다.

$$
\Phi\left(\boldsymbol{b}_{j}\right)=\alpha_{1 j} \boldsymbol{c}_{1}+\cdots+\alpha_{m j} \boldsymbol{c}_{m}=\sum_{i=1}^{m} \alpha_{i j} \boldsymbol{c}_{i}
$$

이때 $m \times n$ 크기의 변환 행렬 $\boldsymbol{A}_{\Phi}$ 의 원소는 $A_{\Phi}(i, j)=\alpha_{i j}$ 이다.

# B) 예시

Consider a homomorphism $\Phi: V \rightarrow W$ and ordered bases $B=$ $\left(\boldsymbol{b}_{1}, \ldots, \boldsymbol{b}_{3}\right)$ of $V$ and $C=\left(\boldsymbol{c}_{1}, \ldots, \boldsymbol{c}_{4}\right)$ of $W$.

$$
\begin{aligned}
&\Phi\left(\boldsymbol{b}_{1}\right)=\boldsymbol{c}_{1}-\boldsymbol{c}_{2}+3 \boldsymbol{c}_{3}-\boldsymbol{c}_{4} \\
&\Phi\left(\boldsymbol{b}_{2}\right)=2 \boldsymbol{c}_{1}+\boldsymbol{c}_{2}+7 \boldsymbol{c}_{3}+2 \boldsymbol{c}_{4} \\
&\Phi\left(\boldsymbol{b}_{3}\right)=3 \boldsymbol{c}_{2}+\boldsymbol{c}_{3}+4 \boldsymbol{c}_{4}
\end{aligned}
$$

 $B$ and $C$ 에 대한 the transformation matrix $\boldsymbol{A}_{\Phi}$ 는 $\Phi\left(\boldsymbol{b}_{k}\right)=$ $\sum_{i=1}^{4} \alpha_{i k} \boldsymbol{c}_{i}$ for $k=1, \ldots, 3$ 를 만족한다.

$$
\boldsymbol{A}_{\Phi}=\left[\boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2}, \boldsymbol{\alpha}_{3}\right]=\left[\begin{array}{ccc}
1 & 2 & 0 \\
-1 & 1 & 3 \\
3 & 7 & 1 \\
-1 & 2 & 4
\end{array}\right]
$$

여기서 $\boldsymbol{\alpha}_{j}, j=1,2,3$ 는 $C$ 에 대한 $\Phi\left(\boldsymbol{b}_{j}\right)$ 의 [[coordinates]] vector 다.

# C) References
