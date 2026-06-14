---
title: "Long Short-Term Memory"
tags: ["NLP"]
aliases: ["LSTM"]
---

# A) LSTM ?

GRU 보다 좀 더 복잡하고 강력한 memory cell

LSTM 은 [[Gated Recurrent Unit|GRU]] 에 비해 gate 가 많아서 성능이 좋지만, 계산량이 많아서 network 사이즈를 늘리기에는 부담이 크다.

# B) The Figure of LSTM

**단일 cell 모양**  
![image-20201101213612591](https://i.loli.net/2020/11/01/RVcyXODha8qtnWB.png)

**multiple cells**  
![image-20201101213643402](https://i.loli.net/2020/11/01/aWev4oj52UQOGZr.png)

# C) GRU 와 차이점

* GRU 와 달리 cell state 를 update 하기 위한 두 개의 gate $\Gamma_u$, $\Gamma_f$ 를 가진다.
* relevant gate 가 없고 output gate $\Gamma_{o}$ 가 존재한다.
* GRU 는 $c^{<t>}=a^{<t>}$ 이지만, LSTM 에서는 $a^{<t>}$ 를 위해 output gate 와 [[tanh function]] 를 적용한다.

# D) The Gates of LSTM

Output gate $\Gamma_{o}$ 는 출력 또는 다음 cell unit 으로 넘길 $a^{<t>}$ 의 정도를 결정한다.  
$\Gamma_{u}$ is a vector of dimension equal to the number of hidden units $a^{<t>}$ in the LSTM.

# E) LSTM forward Propagation

* Update Gate: $\Gamma_{u}=\sigma\left(W_{u}\left[a^{<t-1>},x^{<t>}\right]+b_{u}\right)$
* Forget Gate: $\Gamma_{f}=\sigma\left(W_{f}\left[a^{<t-1>},x^{<t>}\right]+b_{f}\right)$
* Output gate: $\Gamma_{o}=\sigma\left(W_{o}\left[a^{<t-1>},x^{<t>}\right]+b_{o}\right)$
* $\tilde{c}^{<t>}=\tanh\left(W_{c}\left[a^{<t-1>},x^{<t>}\right]+b_{c}\right)$
* $c^{<t>}=\Gamma_{u}*\tilde{c}^{<t>}+\Gamma_{f}*c^{<t-1>}$
* $a^{<t>}=\Gamma_{o}*\tanh(c^{<t>})$

# F) Peephole Connection

[[peephole connection]] 이란, 각 gate 의 weight 에 곱해질 vector 에 이전 cell state 를 포함하는 방법을 말한다. 즉, $[a^{<t-1>},x^{<t>}]$ 를 $[a^{<t-1>},x^{<t>},c^{<t-1>}]$ 로 변경하는 방식이다.

# G) Related

# H) References
