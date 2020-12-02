---
layout: default
title:  "The Curse of Dimensionality"
category: Deep Learning
order: 5.1
---

데이터의 차원이 증가할수록, 해당 공간의 크기(부피)가 기하급수적으로 증가하기 때문에, 동일한 개수의 데이터의 밀도는 차원이 증가할수록, 급속도로 희박해진다.

따라서, 차원이 증가할수록 데이터의 분포 분석 또는 모델 추정에 필요한 샘플 데이터의 개수가 기하급수적으로 증가하게 된다.

<img src="https://i.loli.net/2020/12/02/NmbtJ3XDyf4qeW8.png" alt="image-20201202171616505" style="zoom:50%;" />

## 매니폴드 가정 (Manifold Hypothesis (assumption) 

고차원의 데이터의 밀도는 낮지만, 이들의 집합을 포함하는 저차원의 매니폴드가 있다. 이 저차원의 매니폴드를 벗어나는 순간 급격히 밀도는 낮아진다.

> Natural data in high dimensional spaces concentrates close to lower dimensional manifolds. Probability density decreases very rapidly when moving away from the supporting manifold.

![image-20201202171754694](https://i.loli.net/2020/12/02/yI3FfKYk8L4zEtd.png)

## Reasonable distance metric

의미적으로 가깝다고 생각되는 고차원 공간에서의 두 샘플들 간의 거리는 먼 경우가 많다. 고차원 공간에서 가까운 두 샘플들은 의미적으로는 굉장히 다를 수 있다. 차원의 저주로 인해 고차원에서의 유의미한 거리 측정 방식을 찾기 어렵다.

<img src="https://i.loli.net/2020/12/02/6ei3suCvwYjakmF.png" alt="image-20201202171915482" style="zoom: 67%;" />