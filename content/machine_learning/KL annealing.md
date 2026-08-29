---
title: "KL annealing"
tags: optimization 
aliases: []
---

# KL Annealing ?

적절한 [[hyperparameter]] 를 선택하는 방법. [[machine_learning/deep_learning/Variational Autoencoder|VAE]] 에서 소개되었으며, 일반적으로 [[Grid Search]] 보다는 하위호환이지만, 한번의 training 으로도 나름 최적의 parameter 를 찾을 수 있는 장점이 있다.

수행 방법은 학습을 하면서 최적화 하고싶은 parameter 를 조금씩 조절해보는 것이다. 조절하는 동시에 그에 따른 metric 을 측정함으로써 적절한 수치를 파악할 수 있다.

## 예시

아래는 [[Variational Autoencoders for Collaborative Filtering|Mult-VAE]] 학습과정을 나타낸 그래프다.

초록색 선은 parameter $\beta$ 를 1 에서 부터 조금씩 줄여나가는데, 0.2 쯤에서 성능이 떨어지는 것을 확인할 수 있다. 이때 $\beta=0.2$ 로 고정하고 학습하면 빨간 선과 같은 성능을 확인할 수 있고, anneal 이 없이 단순 학습을 했을 경우 파란색 선의 성능을 보인다.

![|500](https://i.imgur.com/5qtxIgb.png)

# References
