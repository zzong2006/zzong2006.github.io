---
title: "Batch Normalization"
tags: ["deep_learning"]
aliases: ["BN"]
---

# A) Batch Normalization ?

BN 은 [[neural network]] 학습 시간을 줄여주고 generalization 을 향상시킨다.

# B) Basics of Batch Normalization

$x$ 는 normalization 하기 원하는 network 내 signal 이라고 해보자. signal $x_{1}, x_{2}, \ldots, x_{n}$ 이 batch 로 주어졌을 때, 각각은 다음과 같이 normalized 된다.

$$
\hat{x}_{i}=\gamma \frac{x_{i}-\mu}{\sqrt{\sigma^{2}+\epsilon}}+\beta
$$

$\mu$ 와 $\sigma^2$ 는 각 batch 에 대한 [[mean]] 값과 [[variance]] 를 의미한다. 그리고 $\epsilon$ 는 small constant 이며 $\gamma$ 는 scaling factor 및 $\beta$ 는 shift factor 를 나타낸다.

학습 과정에서 $\mu$ 와 $\sigma$ 는 각 batch 에 대하여 다음과 같이 계산된다.

$$
\begin{gathered}
\mu=\frac{1}{n} \sum x_{i} \\
\sigma^{2}=\frac{1}{n} \sum\left(x_{i}-\mu\right)^{2}
\end{gathered}$$
학습 과정에서 $\gamma$ 와 $\beta$는 [[gradient descent]]를 통해 신경망의 다른 파라매터와 함께 천천히 학습된다. Test 과정에서는 이미지를 배치로 받지 않기 때문에 mean과 variance 를 위와 같이 계산할 수 없다. 대신, [[exponential moving average]]를 활용하여 $\hat{\mu}$ 와 $\hat{\sigma}^{2}$ 로 근사시킨다.

# C) Related

# D) References
* https://nenadmarkus.com/p/fusing-batchnorm-and-conv/
