---
title: "Kronecker product"
tags: ["linear_algebra"]
---

# A) Kronecker Product ?

Kronecker product, sometimes denoted by $\otimes$, is an operation on two matrices of arbitrary size resulting in a block matrix.

The Kronecker product is also sometimes called matrix direct product.

If $\mathbf{A}$ is an $m×n$ matrix and $\mathbf{B}$ is a $p×q$ matrix, then the Kronecker product $A⊗B$ is the $pm×qn$ block matrix.

$$
\mathbf{A}\otimes\mathbf{B}=\left[\begin{array}{ccc}a_{11}\mathbf{B}&\cdots&a_{1n}\mathbf{B}\\\vdots&\ddots&\vdots\\a_{m1}\mathbf{B}&\cdots&a_{mn}\mathbf{B}\end{array}\right]
$$

more explicitly:  

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2F-sLgPvl_qt.png?alt=media&token=2a1bad43-c0d5-4f79-a32c-a7ce29aac6e1)

각 원소는 $(A\otimes B)_{i,j}=a_{\lceil i/p\rceil,\lceil j/q]}b_{(i-1)\%p+1,(j-1)\%q+1}$ 으로 표시될 수 있다 ($i,j$ 가 $1$ 부터 시작).

# B) Example

$$
\left[\begin{array}{ll}1&2\\3&4\end{array}\right]\otimes\left[\begin{array}{ll}0&5\\6&7\end{array}\right] = \left[\begin{array}{rr}1\left[\begin{array}{ll}0&5\\6&7\end{array}\right]&2\left[\begin{array}{ll}0&5\\6&7\end{array}\right]\\3\left[\begin{array}{ll}0&5\\6&7\end{array}\right]&4\left[\begin{array}{ll}0&5\\6&7\end{array}\right]\end{array}\right] = \left[\begin{array}{cccc}1\times0&1\times5&2\times0&2\times5\\1\times6&1\times7&2\times6&2\times7\\3\times0&3\times5&4\times0&4\times5\\3\times6&3\times7&4\times6&4\times7\end{array}\right]=\left[\begin{array}{cccc}0&5&0&10\\6&7&12&14\\0&15&0&20\\18&21&24&28\end{array}\right]
$$

# C) Related

# D) References

[Kronecker product - Wikipedia](https://en.wikipedia.org/wiki/Kronecker_product)
