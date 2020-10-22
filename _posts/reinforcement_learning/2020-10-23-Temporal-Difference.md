---
layout: post
title:  "Reinforcement learning: Temporal-Difference Learning"
date:   2020-10-23 22:55:30 +0900
categories: reinforcement_learning
series: 4
---

* TD = DP + MC
* model 없이 raw experience에서 학습 가능
* bootstrap함 (다른 estimates를 이용해 estimate 업데이트 가능)

## TD Prediction  

* 

* $$
  V\left(S_{t}\right) \leftarrow V\left(S_{t}\right)+\alpha\left[R_{t+1}+\gamma V\left(S_{t+1}\right)-V\left(S_{t}\right)\right]
  $$