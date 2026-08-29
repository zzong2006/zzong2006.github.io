---
title: "Fisher information"
tags: statistic 
aliases: []
---

# A) Fisher Information ?

피셔 정보는 어떤 정보의 양을 측정하는 방법이다. 그 정보란, 랜덤 변수가 가지는 분포의 매개변수에 대해 유추할 수 있는 정보를 말한다.

## A.1) 정의

어떤 확률 분포 $f(y; \theta)$ 를 따르는 랜덤 변수 $y$ 가 주어졌을 때, 피셔 정보는 log-[[likelihood]] function $l(\theta \mid y)$ 에 대한 $\theta$ 의 [[partial derivatives]] 의 [[variance]] 를 의미한다. 여기서 $\theta$ 는 분포의 매개 변수를 의미한다.

$$
I(\boldsymbol{\theta})=\operatorname{Var}\left(\frac{\partial}{\partial \boldsymbol{\theta}} \ell(\boldsymbol{\theta} \mid \boldsymbol{y})\right)
$$

# B) 피셔 정보에서 Variance 의 의미

# C) References

* https://towardsdatascience.com/an-intuitive-look-at-fisher-information-2720c40867d8
