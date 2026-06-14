---
title: "Gated Recurrent Unit"
aliases: ["GRU"]
---

# A) 정의

GRU 는 [[Recurrent Neural Network]] unit 을 하나의 (memory) cell 로 인식하고 ($a^{<t>}=c^{<t>}$), update gate $\Gamma_{u}$ 와 [[relevance gate]] $\Gamma_{r}$ 를 추가하여 [[vanishing gradients]] 문제를 완화시킨다.

두 gate 모두 [[sigmoid function]] $\sigma$ 를 사용하여 항상 0 과 1 사이의 값을 가진다.

# B) II. Forward Propagation

* $\tilde{c}^{<t>}=\tanh\left(W_{c}\left[\Gamma_r*c^{<t-1>},x^{<t>}\right]+b_{c}\right)$
* $\Gamma_{u}=\sigma\left(W_{u}\left[c^{<t-1>},x^{<t>}\right]+b_{u}\right)$
* $\Gamma_{r}=\sigma\left(W_{r}\left[c^{<t-1>},x^{<t>}\right]+b_{r}\right)$
* $c^{<t>}=\Gamma_{u}*\tilde{c}^{<t>}+\left(1-\Gamma_{u}\right)*c^{<t-1>}$

 $*$ 는 element-wise multiplication 을 의미한다.

# C) III. Two Gates of GRU

* $\Gamma_u$ 는 update gate 이다.
	* activation function 으로 [[sigmoid function]] 을 사용하며, 이전 cell 의 내용에 기반하여 현재 내용을 기억할지 말지 결정한다.
	* [[vanishing gradients]] 문제를 완화하는데 큰 도움을 준다.
		* 극단적인 예로, $\Gamma_u=0$ 인 경우, $c^{<t>}=c^{<t-1>}$ 인데, 이렇게 되면 back-propagation 을 진행하는 길이가 훨씬 짧아진다.
* $\Gamma_r$ 는 relevance gate 이다.
	* 마찬가지로 [[sigmoid function]] 을 사용하며, 이전 cell 의 내용이 현재 cell 과 얼마나 관련이 있는지를 수치화하여, 현재 cell 값 ($\tilde{c}^{<t>}$) 을 계산할 때 이전 cell 의 내용이 얼마나 들어갈지를 결정하게 된다.

# D) IV. The Figure of GRU

![RNN, T|500](https://i.loli.net/2020/11/01/9yfMxWUQ4Pj7TcY.png)

위 그림에서 $z_t$ 는 update gate $\Gamma_u$ 를 의미하고, $r_t$ 는 relevance 또는 reset gate $\Gamma_r$ 을 의미한다.

그림의 $h_{t-1}$ 는 식의 $c^{<t-1>}$ 와 동일함

# E) Related

[[Long Short-Term Memory]]
