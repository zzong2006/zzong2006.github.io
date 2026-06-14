---
tags: ["reinforcement_learning"]
aliases: ["actor-critic"]
---

# A) Actor–Critic Method ?

baseline 을 사용한 [[REINFORCE]] 방법이 policy 와 state value 모두 학습하지만, state value 가 baseline 으로만 사용되고 critic 으로 사용되지 않으므로, 이를 actor-critic 이라고 말하지는 않는다.

	- 즉, baseline은 [[bootstrapping]]을 위해 사용되고 있지 않다.

* baseline 이 있는 REINFORCE 는 bias 를 가지지 않으며 local optima 에 점근적으로 수렴한다.
	* 하지만, 몬테카를로 방법의 한계로 학습 속도가 느릴 뿐더러, 온라인 문제나 연속적인 문제 (episode 가 없는 문제) 에 적용하기 불편한 측면이 있다.
* 이러한 문제를 완화하기 위해서 TD 방법을 적용한다.
	* One-step actor-critic 방법은 REINFORCE 방식에서 full return 대신 one-step return 을 사용한 것과 같다.

$$
\begin{aligned}\boldsymbol{\theta}_{t+1}&\doteq\boldsymbol{\theta}_{t}+\alpha\left(G_{t:t+1}-\hat{v}\left(S_{t},\mathbf{w}\right)\right)\frac{\nabla\pi\left(A_{t}\midS_{t},\boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t}\midS_{t},\boldsymbol{\theta}_{t}\right)}\\&=\boldsymbol{\theta}_{t}+\alpha\left(R_{t+1}+\gamma\hat{v}\left(S_{t+1},\mathbf{w}\right)-\hat{v}\left(S_{t},\mathbf{w}\right)\right)\frac{\nabla\pi\left(A_{t}\midS_{t},\boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t}\mid S_{t},\boldsymbol{\theta}_{t}\right)}\\&=\boldsymbol{\theta}_{t}+\alpha\delta_{t}\frac{\nabla\pi\left(A_{t}\midS_{t},\boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t}\mid S_{t},\boldsymbol{\theta}_{t}\right)}\end{aligned}
$$

![image-20201107010652280](https://i.loli.net/2020/11/07/46s8biEarjHPOTl.png)
