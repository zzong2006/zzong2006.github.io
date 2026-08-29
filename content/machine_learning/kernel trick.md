---
title: "kernel trick"
tags:
  - machine_learning
  - kernel_method
aliases: [Kernel Trick]
---

# A) Kernel Trick

Kernel trick은 데이터를 고차원 feature space로 직접 변환하지 않고, 그 공간에서의 inner product 값만 kernel function으로 계산하는 방법이다. [[Support Vector Machine|SVM]] 같은 kernel method에서 비선형 decision boundary를 만들 때 중요하다.

# B) 왜 필요한가

고차원 feature map $\phi(x)$를 명시적으로 만들면 계산 비용이 커진다. 대신 kernel $K(x,z)=\langle \phi(x), \phi(z)\rangle$를 쓰면, 모델은 고차원 공간에서 선형 분리를 하는 것처럼 동작하지만 계산은 원래 입력 위에서 할 수 있다.

# C) 주의할 점

Kernel을 쓰면 feature engineering 부담은 줄지만, 데이터 수가 커질수록 kernel matrix 계산과 저장 비용이 커진다. 대규모 학습에서는 linear model, approximate kernel, neural representation을 쓰는 쪽이 더 현실적인 경우가 많다.

# References
