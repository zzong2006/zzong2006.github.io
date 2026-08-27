---
tags: ["math", "linear_algebra", "machine_learning"]
---

norm $V$ 이란, 벡터 공간에 존재하는 벡터의 크기를 측정하기 위한 함수를 의미한다.

$$
\begin{aligned}\|\cdot\|: V & \rightarrow \mathbb{R} \\ \boldsymbol{x} & \mapsto\|\boldsymbol{x}\| \end{aligned}
$$

* $\boldsymbol{x}, \boldsymbol{y} \in V$
* each vector $\boldsymbol{x}$ its length $\|\boldsymbol{x}\| \in \mathbb{R}$
* $\lambda \in \mathbb{R}$

norm 은 아래와 같은 조건을 만족한다.

* Absolutely homogeneous: $\|\lambda \boldsymbol{x}\|=\mid \lambda\|\| \boldsymbol{x} \|$
* [[Triangle inequality]]: $\|\boldsymbol{x}+\boldsymbol{y}\| \leqslant\|\boldsymbol{x}\|+\|\boldsymbol{y}\|$
* Positive deﬁnite: $\|\boldsymbol{x}\| \geqslant 0$ and $\|\boldsymbol{x}\|=0 \Longleftrightarrow \boldsymbol{x}=\mathbf{0}$

# Related

[[Manhattan Norm]]

[[Euclidean distance]]

$L^p$ norm

$$
\displaystyle\|\boldsymbol{x}\|_{p}=\left(\sum_{i}\left|x_{i}\right|^{p}\right)^{\frac{1}{p}} \text{for} \ \ p\in\mathbb{R},p\geq1
$$

* properties: norm 함수는 다음과 같은 특징들을 따른다.
	* $f(\boldsymbol{x})=0\Rightarrow\boldsymbol{x}=\mathbf{0}$
	* $f(\boldsymbol{x}+\boldsymbol{y})\leq f(\boldsymbol{x})+f(\boldsymbol{y})$ (the triangle inequality)
	* $\forall\alpha\in\mathbb{R},f(\alpha\boldsymbol{x})=|\alpha|f(\boldsymbol{x})$
* max norm: $L^{\infty}$
	* $\|x\|_{\infty}=\max_{i}\left|x_{i}\right|$
* unit norm
	* unit vector is a vector with unit norm: $\|\boldsymbol{x}\|_{2}=1$
	* related with [[orthonormal]]
