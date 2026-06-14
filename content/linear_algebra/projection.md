---
tags: ["machine_learning", "linear_algebra"]
aliases: ["projection matrix"]
---

# Projection 정의

$V$ 가 벡터 공간이고 $U \subseteq V$ 는 $V$ 의 [[subspace]] 라고 하자.

이때, $\pi^{2}=\pi \circ \pi=\pi$ 을 만족하는 경우, linear mapping $\pi: V \rightarrow U$ 을 projection 이라고 부른다.

# Projection Matrix

linear mapping 은 transformation matrix 에 의해 표현될 수 있으므로, projection matrices $\boldsymbol{P}_{\pi}$ 를 정의할 수 있다.

이 행렬은 다음과 같은 특징을 지닌다: $\boldsymbol{P}_{\pi}^{2}=\boldsymbol{P}_{\pi}$

# 1 차원 Subspaces 으로 Projection (Lines)
