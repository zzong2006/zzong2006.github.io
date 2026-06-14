---
tags: ["linear_algebra"]
aliases: ["linearly independent", "선형 독립", "linearly dependent"]
---

# A) Linear Independence?

벡터 공간 $V$ 에 존재하는 벡터 $\boldsymbol{x}_{1},\ldots,\boldsymbol{x}_{k}\in V,k\in\mathbb{N}$ 들에 대해서, 만약 $\mathbf{0}=\sum_{i=1}^{k}\lambda_{i}\boldsymbol{x}_{i}$ 을 만족하는 $\lambda_i$ 가 $\lambda_{1}=\ldots=\lambda_{k}=0$ 밖에 없다면, 벡터 $\boldsymbol{x}_{1},\ldots,\boldsymbol{x}_{k}$ 들은 linearly independent 하다고 한다.

그러나, 만약 $\lambda_{i}\neq0$ 에 대한 solution 이 하나라도 존재한다면 벡터 $\boldsymbol{x}_{1},\ldots,\boldsymbol{x}_{k}$ 들은 linearly dependent 하다.

$A \mathbf{x}$ 를 $A$ 의 column 에 대한 [[linear combination|선형 결합]] 으로 생각할때, 만약 $A$ 의 [[nullspace]] 가 zero vector 밖에 포함하지 않는다면, 이 경우 $A$ 의 column vector 들은 선형 독립으로 생각할 수 있다.

그리고 $A$ 의 모든 column 이 독립이라 [[pivot|pivot column]] 을 나타낸다면, $A$ 의 [[the rank of a matrix|rank]] 는 $n$ 이 되고, 이는 [[free variable]] 이 없는 것으로 생각할 수 있다. 반대로, $A$ 의 column 들이 종속이라면 $A$ 의 rank 는 $n$ 보다 낮을 것이고, free variable 이 존재하는 것으로 생각할 수 있다.

## A.1) 관련된 사실들

* 어떤 $k$ 개의 벡터가 존재한다면, 그 벡터들은 반드시 선형 종속이거나 선형 독립이다.
* 만약 $k$ 개의 벡터 중 하나라도 0 벡터라면, 해당 벡터들은 선형 종속이다.
* $\boldsymbol{x}_{i}=\lambda\boldsymbol{x}_{j},\lambda\in\mathbb{R}$ 를 하나라도 만족하면, 집합 $\left\{\boldsymbol{x}_{1},\ldots,\boldsymbol{x}_{k}:\boldsymbol{x}_{i}\neq\mathbf{0},i=1,\ldots,k\right\}$ 은 선형 종속이다.

# B) 선형 종속 체크 방법

실질적으로 벡터 간 선형 독립을 쉽게 확인하는 방법은 [[Gaussian elimination]] 을 통해 [[row-echelon form]] 으로 바꾸는 것이다.

# C) Application

* $Ax=b$ 에서 $b$ 의 모든 값에 대해 solution 이 존재하기 위한 조건은 $A$ 가 정확히 $m$ 개의 선형 독립인 열 벡터들을 가져야 한다는 것이다.
* $A$ 는 $m\times n$ matrix

# D) Related

[[singular]]
