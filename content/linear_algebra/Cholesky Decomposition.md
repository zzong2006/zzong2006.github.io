---
title: "Cholesky Decomposition"
tags: ["linear_algebra"]
aliases: ["숄레스키 분해"]
---

# A) Cholesky Decomposition ?

$\mathbf{A}$ 가 실수로 이루어진 symmetric [[positive definite]] matrix 인 경우, 다음과 같이 분해될 수 있다.

$$
\mathbf{A}=\mathbf{L} \mathbf{L}^{\mathrm{T}}
$$

 $\mathbf{L}$ 는 real lower triangular matrix with positive diagonal entries 다.

# B) 예시

$$
\left(\begin{array}{rrr}
4 & 12 & -16 \\
12 & 37 & -43 \\
-16 & -43 & 98
\end{array}\right)=\left(\begin{array}{rrr}
2 & 0 & 0 \\
6 & 1 & 0 \\
-8 & 5 & 3
\end{array}\right)\left(\begin{array}{rrr}
2 & 6 & -8 \\
0 & 1 & 5 \\
0 & 0 & 3
\end{array}\right)
$$

# C) Related

# D) References
