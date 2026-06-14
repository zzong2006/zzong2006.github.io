---
tags: ["NIPS", "collaborative_filtering", "paper_review", "y2007"]
aliases: ["PMF"]
---

# A) Probabilistic Matrix Factorization ?

matrix factorization 은 다음과 같은 확률 모델로 바뀔 수 있다.

$$
p\left(y_{ui}=y\right)=\mathcal{N}\left(y\mid\mu+b_{u}+c_{i}+\boldsymbol{u}_{u}^{\top}\boldsymbol{v}_{i},\sigma^{2}\right)
$$

이에 대한 [[negative log likelihood|NLL]] 은 일반적인 MF loss 식과 동일하다

$$
\displaystyle\mathcal{L}(\mathbf{Z})=\sum_{ij:Y_{ij}\neq?}\left(Z_{ij}-Y_{ij}\right)^{2}=\|\mathbf{Z}-\mathbf{Y}\|_{F}^{2}
$$

$\displaystyle\min_{U,V}\sum_{i,j}\left(r_{ij}-u_{i}^{T}v_{j}\right)^{2}+\lambda_{u}\left\|u_{i}\right\|^{2}+\lambda_{v}\left\|v_{j}\right\|^{2}$ 을 최소화하는 방식

* $u_{i}\in\mathbb{R}^{K}$ 는 $i$ 번째 user 의 latent vector, $v_{j}\in\mathbb{R}^{K}$ 는 $i$ 번째 item latent vector
* $\lambda_{u}$ 와 $\lambda_{v}$ 는 regularization factor

# B) Related

  * [Collaborative Topic Modeling for Recommending GitHub Repositories](http://www.cs.cmu.edu/afs/cs.cmu.edu/Web/People/norii/pub/github-ctr.pdf)

# C) References

* [paper link](https://proceedings.neurips.cc/paper/2007/file/d7322ed717dedf1eb4e6e52a37ea7bcd-Paper.pdf)
