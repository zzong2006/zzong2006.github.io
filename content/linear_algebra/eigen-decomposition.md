---
tags: ["linear_algebra"]
---

정수를 소인수분해할 수 있듯이 ($12=2\times2\times3$), 행렬도 분해 (decomposition) 가 가능합니다.

예를 들어, 어떤 행렬 $\boldsymbol{A}$ 가 $n$ 개의 선형 독립인 [[eigenvector]] $\left\{\boldsymbol{v}^{(1)}, \ldots, \boldsymbol{v}^{(n)}\right\}$ 와 그에 대응하는 [[eigenvalue]] $\left\{\lambda_{1}, \ldots, \lambda_{n}\right\}$ 를 가진다고 합시다. 이 때, 모든 [[eigenvector]] 를 열 단위로 이어붙여서 $\boldsymbol{V}=[\boldsymbol{v}^{(1)}, \ldots, \boldsymbol{v}^{(n)}]$ 라는 행렬을 만들 수 있습니다. 마찬가지로, 모든 [[eigenvalue]] 를 모아서 벡터 $\boldsymbol{\lambda}=[\lambda_{1},\ldots,\lambda_{n}]^{\top}$ 로 표현할 수 있습니다.

이때, $A$ 의 eigen-decomposition 은 다음과 같이 쓸 수 있습니다.

$$
\boldsymbol{A} = \boldsymbol{V} \operatorname{diag}(\boldsymbol{\lambda}) \boldsymbol{V}^{-1}
$$

특히, 모든 실대칭행렬 (real symmetric matrix) 은 오직 실수값의 [[eigenvector]] 와 [[eigenvalue]] 만을 사용하여 다음과 같이 분해할 수 있습니다.

$$
\boldsymbol{A} = \boldsymbol{Q}\Lambda\boldsymbol{Q}^{\top}
$$
