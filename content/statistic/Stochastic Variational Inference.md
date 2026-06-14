---
tags: ["bayesian_inference"]
aliases: ["SVI"]
---

# A) Stochastic Variational Inference ?

 [[Evidence Lower Bound]]($\equiv\mathbb{E}_{q_{\phi}(\mathbf{z})}\left[\logp_{\theta}(\mathbf{x},\mathbf{z})-\log q_{\phi}(\mathbf{z})\right]$) 에 대한 parameter $\theta,\phi$ 를 [[stochastic gradient descent]] 를 통해 최적화 하는 방식을 stochastic varitional inference (SVI) 라고 부른다.

## A.1) General Concept

베이지안 사후 분포들에 연관된 대부분의 확률 분포들은 너무 복잡해서 직접적으로 표현할 수 없다. 그래서 반드시 더욱 작은 subspace 에서 정의해야만 하는데, 이 space 는 실수값 parameter $\phi$ 에 의해 index 되면서 $q_{\phi}(\mathbf{z})$ 라는 tractable 한 approximation, 즉 variational 분포를 따르도록 하게 만든다.

다만, 이렇게 만들어진 분포는 true posterior 분포 $p_{\theta}(\mathbf{z}\mid\mathbf{x})$ 와는 조금 거리가 있다.

![|500](https://i.imgur.com/zoCENtD.png)

# B) Related

[[variational inference]]

# C) References
