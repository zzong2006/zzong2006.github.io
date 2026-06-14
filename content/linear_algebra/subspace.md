---
tags: ["linear_algebra"]
---

# 1. Subspace ?

[[vector space|벡터 공간]] 은 또 다른 벡터 공간을 포함할 수 있다. 벡터 공간에 존재하는 또 다른 벡터 공간을 subspace 라고 한다.

만약 $V$ 라는 벡터 공간에 대한 subspace $S$ 가 존재하는 경우 $S \subseteq V$ 로 표현하며, 다음을 만족한다.

1. $\mathbf{0} \in S$ : zero vector 를 포함해야 한다.
   왜냐하면 어떤 벡터에 scalar 0 을 곱하면 항상 zero vector 가 나오기 때문이다. 이는 조건 (3) 을 만족해야 하는 것과 동일하다.
2. $\mathbf{x}, \mathbf{y} \in S$ 인 경우 $\mathbf{x}+\mathbf{y} \in S$ 를 만족한다.
3. $\mathbf{x} \in S, \alpha \in \mathbb{R}$ 인 경우 $\alpha \mathbf{x} \in S$ 를 만족한다.

# 2. Notes

1. $V$ 는 언제나 $V$ 에 대한 subspace 이다.
2. zero vector 자체가 subspace 가 될 수 있다 (위 세개의 조건을 만족함).

# 3. Subspace 의 합

 $U$ 와 $W$ 가 $V$ 에 대한 subspace 라면, 이 두 공간의 합은 다음과 같이 정의된다.

$$
 U+W=\{\mathbf{u}+\mathbf{w} \mid \mathbf{u} \in U, \mathbf{w} \in W\}
$$

 물론 공간의 합 역시 $V$ 에 대한 subspace 이다.

## 3.1. Direct Sum

벡터 공간끼리 겹치는 것이 영 벡터 밖에 없다면 ($U \cap W=\{\mathbf{0}\}$), 이 두 공간의 합은 direct sum 이라 하며 $U \oplus W$ 로 표현한다. 즉, $U \oplus W$ 공간안에 있는 모든 벡터는 $\mathbf{u}+\mathbf{w}$ ($\mathbf{u} \in U$ and $\mathbf{w} \in W$) 로 나타낼 수 있는 것이다.  

## 3.2. Dimension of Sums of Subspaces

subspace 들의 합에 대한 차원은 다음과 같이 표현이 가능하다.

$$
\operatorname{dim}(U+W)=\operatorname{dim} U+\operatorname{dim} W-\operatorname{dim}(U \cap W)
$$

만약 sum 이 direct 라면, $\operatorname{dim}(U \cap W)=\operatorname{dim}(\{\mathbf{0}\})=0$ 를 만족하므로, 부분 공간의 합에 대한 차원은 다음과 같이 간략히 표현된다.

$$
\operatorname{dim}(U \oplus W)=\operatorname{dim} U+\operatorname{dim} W
$$

# 4. 특징

[[span]] 과의 관계

* $V$ 라는 벡터 공간에 존재하는 벡터 집합을 $S$ 라 하고, $S$ 벡터들의 모든 조합들을 $SS$ 라 할때, $S$ 의 [[span]] 은 subspace $SS$ 라고 할 수 있다.

# 5. Related

# 6. References

* [MIT Course - 5. Transposes, Permutations, Spaces R^n](youtube.com/watch?v=JibVXBElKL0)
