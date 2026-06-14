---
tags: ["linear_algebra"]
aliases: ["linear map"]
---

# A) Linear Mapping ?

두 real [[vector space]] $V, W$ 에 대하여, mapping $\Phi: V \rightarrow W$ 은 모든 $\boldsymbol{x}, \boldsymbol{y} \in V$ 그리고 $\lambda \in \mathbb{R}$ 에 대해 다음을 만족하는 경우, vector space 의 구조를 보존한다고 말할 수 있다.

$$
\begin{aligned}
\Phi(\boldsymbol{x}+\boldsymbol{y}) &=\Phi(\boldsymbol{x})+\Phi(\boldsymbol{y}) \\
\Phi(\lambda \boldsymbol{x}) &=\lambda \Phi(\boldsymbol{x})
\end{aligned}$$
즉, mapping이 $\forall \boldsymbol{x}, \boldsymbol{y} \in V \forall \lambda, \psi \in \mathbb{R}: \Phi(\lambda \boldsymbol{x}+\psi \boldsymbol{y})=\lambda \Phi(\boldsymbol{x})+\psi \Phi(\boldsymbol{y})$ 를 만족한다면 linear mapping 이라 부른다.

일반적으로 linear map 표기를 $\Phi(x)$ 가 아니라 ambiguity를 줄이기 위해 $\Phi x$로 설정한다고 한다.

## A.1) Homomorphism

algebraic term으로 linear mapping $\Phi: V \rightarrow W$이 성립한다면, 이를 homomorphism이라고 부른다. 그리고 그 반대($\Phi: W \rightarrow V$)도 homomorphism이 성립한다면, 이를 isomorphism 이라고 부른다.
# B) Mapping 특성

$\Phi: V \rightarrow W$ 는 다음과 같은 특성을 가질 수 있다.
* injective: if $\forall \boldsymbol{x}, \boldsymbol{y} \in \mathcal{V}: \Phi(\boldsymbol{x})=\Phi(\boldsymbol{y}) \Longrightarrow \boldsymbol{x}=\boldsymbol{y}$
* surjective: if $\Phi(\mathcal{V})=\mathcal{W}$
  $\mathcal{V}$ 의 모든 원소들은  $\mathcal{W}$ 에 $\Phi$를 통해 도작할 수 있다.
* bijective: injective 하면서 surjective 할 때 

## B.1) Special Cases of Linear Mappings

* isomorphism: $\Phi: V \rightarrow W$ 에서 linear 하고 bijective 하는 경우
* Endomorphism: $\Phi: V \rightarrow V$ linear 한 경우
* Automorphism: $\Phi: V \rightarrow V$ 에서 linear 하고 bijective 하는 경우
* 
# C) Related

# D) References
