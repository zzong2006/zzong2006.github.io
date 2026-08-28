---
title: "mean field approximation"
tags: ["bayesian_inference", "optimization"]
---

# A) Mean Field Approximation ?

[[variational inference]] 와 동일한 아이디어를 채택한 방식이다. 즉, posterior density 인 $p(\theta \mid x)$ 를 $g(\theta \mid \phi)$ 라는 density 로 근사시키는데, 이때 factorize 되는 형태를 취하게 한다.

$$
g(\theta \mid \phi)=\prod_{j=1}^{J} g_{j}\left(\theta_{j} \mid \phi_{j}\right)
$$

위 식에서 확인할 수 있듯이, 각 $\theta=\theta_{1}, \cdots, \theta_{J}$ 에 대해 density $g$ 는 factorize 한다.

결국 아래와 같은 objective function 을 만족하는 parameter $\phi$ 를 찾아야 한다.

$$
\phi^{*}=\arg \min _{\phi} K L(g(\theta \mid \phi) \| p(\theta \mid x))
$$

# B) References
