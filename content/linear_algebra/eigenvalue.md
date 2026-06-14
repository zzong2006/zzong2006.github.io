---
tags: ["linear_algebra"]
aliases: ["고유값"]
---

# 1. Eigenvalue ?

# 2. Inverse Matrix 의 Eigenvalues

> [[Inverse matrix]] 가 eigenvalues 를 갖기 위한 조건은 무엇일까?

A matrix $A$ has an eigenvalue $λ$ if and only if $A^{−1}$ has eigenvalue $λ^{−1}$.

To see this, note that  

$$
A\mathbf{v}=\lambda\mathbf{v}\Longrightarrow A^{-1}A\mathbf{v}=\lambda A^{-1}\mathbf{v}\Longrightarrow A^{-1}\mathbf{v}=\frac{1}{\lambda}\mathbf{v}
$$

If your matrix $A$ has eigenvalue $λ$, then $I−A$ has eigenvalue $1−λ$ and therefore $(I−A)^{−1}$ has eigenvalue $\frac{1}{1-\lambda}$ (출처: [stackoverflow](https://math.stackexchange.com/questions/237871/inverse-matrixs-eigenvalue)).

# 3. Related

* [[eigenvector]]

# 4. References
