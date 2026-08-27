---
tags: ["machine_learning"]
---

# A) Computational Graph ?

[[backpropagation]] 을 쉽게 이해하기 위한 일종의 언어

# B) Graph 구성

graph 의 각 노드들은 variable 을 의미

## B.1) Variable

variable 은 vector, matrix, scalar, tensor 등이 될 수 있음

## B.2) Operation

operation: 한개 이상의 variables 에 적용되는 간단한 function

# C) 예시

## C.1) Logistic Regression

$$
\hat{y}=\sigma\left(\boldsymbol{x}^{\top}\boldsymbol{w}+b\right)
$$

![[img-5d9019a6aa.png||300]]
