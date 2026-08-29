---
title: "orthogonal"
tags:
  - linear_algebra
aliases: [orthogonal matrix, Orthogonal Matrix]
---

# A) Orthogonal

Orthogonal은 두 vector의 dot product가 0인 관계를 뜻한다.

$$
x^\top y = 0
$$

두 non-zero vector가 orthogonal이면 기하적으로 서로 90도 방향을 이룬다고 볼 수 있다.

# B) Orthogonal Matrix

Orthogonal matrix는 column vector들이 서로 orthonormal이고, transpose가 inverse와 같은 real-valued matrix다.

$$
Q^\top Q = QQ^\top = I
$$

즉, $Q^{-1}=Q^\top$가 성립한다. Real-valued space에서는 orthogonal matrix를 쓰고, complex-valued space에서는 [[linear_algebra/unitary matrix|unitary matrix]]가 같은 역할을 한다.

# C) 왜 중요한가

Orthogonal transformation은 vector의 길이와 각도를 보존한다. 그래서 rotation, reflection, [[linear_algebra/QR decomposition|QR decomposition]], PCA의 basis 변환을 이해할 때 자주 등장한다.

[[linear_algebra/orthonormal|Orthonormal]] basis로 좌표계를 잡으면 projection과 decomposition 계산이 단순해지는 이유도 이 성질 때문이다.

# References
