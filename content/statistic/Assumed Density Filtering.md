---
title: "Assumed Density Filtering"
tags:
  - bayesian_inference
aliases: ["ADF", "moment matching", "weak marginalization"]
---

# A) Assumed Density Filtering ?

exact posterior $p(\mathbf{y} \mid \mathbf{x})$ 를 얻기 위해, 이를 근사한 분포 $q(\mathbf{y})$ 를 찾는 방식을 의미한다. 여기서 $\mathbf{x}$ 는 observation 이고 $\mathbf{y}$ 는 latent variables 이다.

[[KL-Divergence]] 를 활용하여 임의의 분포를 [[exponential family]] 에 project 시킨다.  

$$
\hat{q}=\operatorname{proj}(p(\mathbf{y} \mid \mathbf{x}) \rightarrow q(\mathbf{y})) \triangleq \arg \min _{q} \mathrm{KL}(p(\mathbf{y} \mid \mathbf{x}) \| q(\mathbf{y}))
$$

이를 위해 다음과 같이 근사 분포는 exponential form 을 가지는데 가장 유명한 것은 [[Gaussian distribution]] 이다.  

$$
q_{\theta}(\mathbf{y})=\frac{1}{Z(\theta)} \exp \left(\theta^{\top} \Phi(\mathbf{y})\right), \quad Z(\theta)=\int \exp \left(\theta^{\top} \Phi(\mathbf{y})\right) d \mathbf{y}
$$

# B) Related

위 ADF 는 [[Kalman filtering]] 과 비슷한 아이디어이다.  

# C) References
