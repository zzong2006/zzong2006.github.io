---
tags: ["linear_algebra"]
aliases: ["정방 행렬"]
---

# Symmetric Matrix ?

$\boldsymbol{A}=\boldsymbol{A}^{\top}$ 를 만족하는 matrix $\boldsymbol{A}$

## 예시

$$
\left[\begin{array}{lll}3 & 1 & 7  \\ 1 & 2 & 9 \\ 7 & 9 & 4\end{array}\right]
$$

# 특징

1. 정방 행렬 간 덧셈은 항상 정방 행렬이다. 그러나 정방 행렬간 곱셈은 이를 만족하지 않는다.  

$$
\left[\begin{array}{ll}1&0\\0&0\end{array}\right]\left[\begin{array}{ll}1&1\\1&1\end{array}\right]=\left[\begin{array}{ll}1&1\\0&0\end{array}\right]
$$

1. 어떤 matrix $R$ 에 대하여 $R^T R$ 은 항상 symmetric 이다.  
   why? $(R^T R)^T = (R^T R)$ 이므로.

# Related

# References
