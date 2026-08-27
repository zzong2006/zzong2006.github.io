---
tags: ["linear_algebra"]
aliases: ["L1 Norm", "Taxicab Norm"]
---

# A) Manhattan Norm

Manhattan Norm은 vector 성분의 절댓값 합으로 정의되는 [[linear_algebra/norm|norm]]이다. 보통 $L_1$ norm이라고도 부른다.

$$
\|x\|_1 = \sum_i |x_i|
$$

# B) Euclidean Norm과의 차이

[[Euclidean distance]]가 직선 거리를 재는 느낌이라면, Manhattan Norm은 격자 위에서 가로와 세로로만 이동한 거리처럼 계산한다. 그래서 sparse solution을 유도하는 [[lasso regression|Lasso]] regularization에서도 자주 등장한다.

# References
