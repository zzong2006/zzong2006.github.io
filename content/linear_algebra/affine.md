---
title: "affine"
aliases: ["아핀"]
tags:
  - linear_algebra
---

# A) Affine ?

선형 변환에 평행이동을 더한 것을 affine 이라고 한다.

$$
f(\boldsymbol{x}) = A\boldsymbol{x} + \boldsymbol{b}
$$

$\boldsymbol{b} = \boldsymbol{0}$ 이면 [[linear mapping]] 이고, $\boldsymbol{b}$ 가 0 이 아니면 affine 이다. 신경망의 한 층이 하는 `Wx + b` 가 정확히 affine 변환이다.

# B) Affine subspace

[[subspace]] 는 반드시 원점을 포함해야 한다. 영벡터에 스칼라를 곱한 것도 그 집합 안에 있어야 하기 때문이다.

affine subspace 는 이 조건을 뺀 것으로, subspace 를 통째로 평행이동한 집합이다.

$$
L = \{\boldsymbol{x}_0 + \boldsymbol{v} : \boldsymbol{v} \in U\}
$$

$U$ 가 subspace 이고 $\boldsymbol{x}_0$ 가 이동시킬 벡터다. 2차원에서 원점을 지나는 직선은 subspace 이고, 원점을 지나지 않는 직선은 affine subspace 다.

"flat" 이라는 말도 같은 뜻으로 쓴다. 휘어지지 않았다는 의미다.

# C) [[hyperplane]] 과의 연결

$p$ 차원 공간에서 hyperplane 은 $p-1$ 차원의 flat affine subspace 다. 2차원에서는 직선, 3차원에서는 평면이 된다.

$$
\beta_0 + \beta_1 x_1 + \dots + \beta_p x_p = 0
$$

$\beta_0$ 가 0 이면 원점을 지나므로 subspace 이고, 0 이 아니면 원점에서 떨어져 있어 affine subspace 다. 분류 모델에서 이 $\beta_0$ 가 절편(bias) 에 해당하고, 이것이 없으면 결정 경계가 항상 원점을 지나야 해서 표현력이 크게 제한된다.

# D) 성질

affine 변환은 직선을 직선으로, 평행한 직선을 평행한 직선으로 보낸다. 선분의 중점도 중점으로 간다. 반면 길이와 각도는 보존하지 않는다.

# E) References
