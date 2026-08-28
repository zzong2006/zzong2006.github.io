---
title: "positive definite"
tags: ["linear_algebra"]
aliases: ["positive semi-definite"]
---

# 1. Positive Definite ?

선형대수학에서 보면 가끔 어떤 행렬 A 가 positive definite 다, positive semi-definite 다 하는 용어들이 나오는데 이는 대칭행렬 ([[symmetric matrix]]) 에 대해서만 정의되는 용어들로서 이 용어들의 정의는 다음과 같다.

* $\forall z\neq0,\quad z^{T}Az>0\rightarrow\text{}$ positive definite
* $\forall z\neq0,\quad z^{T}A z\geq0\rightarrow\text{}$ positive semi-definite

즉, 어떤 대칭행렬 A 가 영벡터가 아닌 모든 열벡터 z 에 대해 항상 $z^{T}Az>0$ 을 만족할 때 이 행렬을 positive definite 행렬이라고 부르며 negative definite 등도 유사하게 정의된다. 

# 2. Positive Definite Matrix 성질

이러한 행렬들의 중요한 성질은 고유값 ([[eigenvalue]]) 도 동일한 부호를 갖는다는 점이다.즉, 어떤 대칭행렬 $A$ 가 positive definite 하면 이 행렬의 모든 eigenvalue 은 항상 양수이다.

만일 $A$ 가 positive semidefinite 하면 eigenvalue 들도 $≥0$ 이고, negative definite 면 모든 eigenvalue 들이 음수이다.

# 3. Related

* [[machine_learning/Singular Value Decomposition]]

# 4. References
