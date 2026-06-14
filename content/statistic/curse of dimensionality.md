---
tags: ["machine_learning", "feature_engineering"]
aliases: ["차원의 저주"]
---

# A) Curse of Dimensionality ?

데이터의 차원이 증가할수록, 해당 공간의 크기 (부피) 가 기하급수적으로 증가하기 때문에, 동일한 개수의 데이터의 밀도는 차원이 증가할수록, 급속도로 희박해진다. 따라서, 차원이 증가할수록 데이터의 분포 분석 또는 모델 추정에 필요한 샘플 데이터의 개수가 기하급수적으로 증가하게 된다.

![image-20201202171616505|450](https://i.loli.net/2020/12/02/NmbtJ3XDyf4qeW8.png)

# B) Reasonable Distance Metric

의미적으로 가깝다고 생각되는 고차원 공간에서의 두 샘플들 간의 거리는 먼 경우가 많다.

고차원 공간에서 가까운 두 샘플들은 의미적으로는 굉장히 다를 수 있다.

curse of dimensionality 로 인해 고차원에서의 유의미한 거리 측정 방식을 찾기 어렵다.

![image-20201202171915482](https://i.loli.net/2020/12/02/6ei3suCvwYjakmF.png)

# C) About Clustering

다차원 (high dimensional) 데이터를 이용한 클러스터링은 의미없을 수 있다 (may be meaningless). 왜냐하면 가장 가까운 이웃 간 거리와 이웃들 간 평균 거리의 비율이 차원이 증가할수록 1 로 빠르게 접근하기 때문이다. 즉, **가까운 이웃과 먼 이웃의 구분이 힘들어진다**는 의미가 된다.

# D) Related

# E) References
