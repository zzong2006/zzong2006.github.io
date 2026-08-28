---
title: "transpose"
tags: ["linear_algebra"]
aliases: ["transpose matrix"]
---

# Transpose ?

For $\boldsymbol{A} \in \mathbb{R}^{m \times n}$ the matrix $\boldsymbol{B} \in \mathbb{R}^{n \times m}$ with $b_{i j}=a_{j i}$ is called the transpose of $\boldsymbol{A}$. We write $\boldsymbol{B}=\boldsymbol{A}^{\top}$.

# Some Properties

$$
\begin{aligned}\left(\boldsymbol{A}^{\top}\right)^{\top} &=\boldsymbol{A} \\(\boldsymbol{A}+\boldsymbol{B})^{\top} &=\boldsymbol{A}^{\top}+\boldsymbol{B}^{\top} \\
(\alpha \mathbf{A})^{\top} &=\alpha \mathbf{A}^{\top}\\
(\boldsymbol{A} \boldsymbol{B})^{\top} &=\boldsymbol{B}^{\top} \boldsymbol{A}^{\top} \end{aligned}$$
## With Scalar
$(\lambda \boldsymbol{C})^{\top}=\boldsymbol{C}^{\top} \lambda^{\top}=\boldsymbol{C}^{\top} \lambda=\lambda \boldsymbol{C}^{\top}$ since $\lambda=\lambda^{\top}$ for all $\lambda \in \mathbb{R}$

## With Inverse
만약 $\boldsymbol{A}$ 가 [[Inverse matrix|invertible]] 하면, $\boldsymbol{A}^{\top}$ 도 그렇다. 그래서 $\left(\boldsymbol{A}^{-1}\right)^{\top}=\left(\boldsymbol{A}^{\top}\right)^{-1}=: \boldsymbol{A}^{-\top}$ 를 만족한다.
# References
