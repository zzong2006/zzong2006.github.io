---
title: "Deep RNN"
tags: ["NLP", "deep_learning"]
aliases: ["DRNN"]
---

# A) DRNN ?

DRNN(Deep RNN) 은 [[Recurrent Neural Network|RNN]] 을 여러 층으로 쌓은 모델을 의미한다.

# B) The Figure of DRNN

![image-20201101223235795](https://i.loli.net/2020/11/01/u2yzFhIK48btPmZ.png)

여기서 $a^{[l]<t>}$ 의 $l$ 은 layer 의 번호고, $t$ 는 시간을 의미한다.

# C) Forward Propagation of DRNN

각 cell 들은 해당 cell 에 있는 왼쪽과 아래의 cell state 를 이용해 계산된다. 위 Figure 에서 그림의 보라색 동그라미 ($a^{[2]\langle3\rangle}$) 는 다음과 같이 계산된다.

$$
a^{[2]\langle3\rangle}=g(W_{a}^{[2]}[a^{[2]<2>},a^{[1]<3>}]+b_{a}^{[2]})
$$

# D) Related

# E) References
