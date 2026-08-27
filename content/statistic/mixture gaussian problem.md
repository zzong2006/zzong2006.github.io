---
tags: ["statistic", "bayesian_inference"]
---

# Mixture Gaussian Problem ?

![|500](https://i.imgur.com/WMjvlHI.png)

데이터 $\left(x_{1},x_{2},\ldots,x_{n}\right)$ 가 주어졌을 때, 주어진 데이터들이 단일 가우시안이 아닌 여러개의 [[Gaussian distribution]] ([[Gaussian Mixture Model]]) 에서 온것이라고 가정하자.

이때, 모든 데이터에 대해서 어떤 가우시안 분포에서 발생했는지 확률을 찾는 문제를 mixture gaussian problem 이라고 한다.

# Solution

이 문제에 [[Maximum Likelihood Estimation]] 은 적용할 수 없다. 대신, $x_{i}\in\text{Gaussian}_{j}$ 의 경우라면 $z_{ij}=1$ 이고 아니라면 $z_{ij}=0$ 인 latent variable $Z$ 를 활용할 수 있다.

그리고 이 latent variable 은 [[machine_learning/EM algorithm]] 을 통해 찾을 수 있다 ([[Gaussian Mixture Model#Training GMM EM algorithm|GMM]] 참조)

# References
