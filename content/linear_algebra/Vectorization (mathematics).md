---
tags: ["linear_algebra"]
---

# A) Vectorization (mathematics) ?

* The vectorization of a matrix is a linear transformation which **converts** the matrix **into** a column vector.
* Specifically, the vectorization of $m×n$ matrix $A$, denoted $vec(A)$, is the $mn×1$ column vector obtained by stacking the columns of the matrix $A$ on top of one another.
	* $\operatorname{vec}(A)=\left[a_{1,1},\ldots,a_{m,1},a_{1,2},\ldots,a_{m,2},\ldots,a_{1,n},\ldots,a_{m,n}\right]^{\mathrm{T}}$
		* Here, $a_{i,j}$ represents $A(i,j)$

# B) Example

for the $2\times2$ matrix $A=\left[\begin{array}{ll}a&b\\c&d\end{array}\right]$, the vectorization is $\operatorname{vec}(A)=\left[\begin{array}{l}a\\c\\b\\d\end{array}\right]$

# C) Compatibility with [[Kronecker product]]s

* The vectorization is frequently used together with the [[Kronecker product]] to express matrix multiplication as a linear transformation on matrices.
* $\operatorname{vec}(AB)=\left(I_{m}\otimes A\right)\operatorname{vec}(B)=\left(B^{\mathrm{T}}\otimes I_{k}\right)\operatorname{vec}(A)$
	* $A$ and $B$ of dimensions $k×l$ and $l×m$, respectively.

# D) Compatibility with Inner Products

* Vectorization is a unitary transformation from the space of $n×n$ matrices with the Frobenius (or Hilbert–Schmidt) inner product to $\mathbf{C}^{n^{2}}$.
* $\operatorname{tr}\left(A^{\top}B\right)=\operatorname{vec}(A)^{\top}\operatorname{vec}(B)=\operatorname{vec}(B)^{\top}\operatorname{vec}(A)$
	* 쉽게 말해서 $\operatorname{tr}\left(A^{\top}B\right)$ 의 경우, 같은 위치에 해당하는 두 matrix 의 원소를 각기 서로 곱한다음 다 더한 값이 된다: $\sum a_{i,j}\cdot b_{i,j}$

# E) References

* https://en.wikipedia.org/wiki/Vectorization_(mathematics)
