---
title: "variational EM algorithm"
tags: ["optimization", "bayesian_inference"]
---

# A) Variational EM Algorithm ?

간단한 모델에서는 $p\left(z\mid x;\theta\right)$ 에 대한 analytical solution 이 존재하여 $q(z)=p\left(z\mid x;\theta\right)$ 을 구하는 것이 tractable 했다. 대신, $x$ 가 주어졌을 때, latent variables 의 집합이 나머지 latent variables 에 대하여 독립임을 가정하면 복잡도를 줄일 수 있다.

좀 더 강력하게, 모든 latent variables 가 독립임을 가정하면 다음과 같다

$$
z_{i},\perp z_{j}\text{ for }i\neq j
$$

이러한 가정은 [[mean field approximation]] 으로 알려져 있다.

이렇게 하면, 각 latent variable 에 대하여 update rule 계산을 독립적으로 수행할 수 있다.

**수식 유도**

$q(z)=\prod_{i}q\left(z_{i}\right)$ 임을 가정하자. 그러면, [[Evidence Lower Bound]] 는 $z_j$ 에 대하여 factorized 될 수 있다.

# B) Related

[[machine_learning/EM algorithm]], [[variational inference]]

# C) References

* [chrischoy blog](https://chrischoy.github.io/research/Expectation-Maximization-and-Variational-Inference/)
