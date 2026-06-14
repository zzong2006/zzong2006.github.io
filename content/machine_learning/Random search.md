---
title: "Random search"
tags: ["machine_learning", "hyperparameter_optimization"]
aliases: ["random search"]
---

# A) Random Search ?

Random Search 는 [[hyperparameter]] 탐색 공간에서 조합을 무작위로 sampling 해서 평가하는 방법이다. 모든 조합을 훑는 [[Grid Search]] 와 달리, 주어진 budget 안에서 다양한 영역을 넓게 찍어본다.

# B) 왜 쓸까

실제로 성능에 큰 영향을 주는 hyperparameter 는 일부인 경우가 많다. Grid Search 는 덜 중요한 축에도 같은 간격으로 비용을 쓰지만, Random Search 는 더 많은 고유 조합을 탐색할 수 있어 제한된 실험 budget 에서 효율적일 수 있다.

# C) 실무 감각

처음에는 Random Search 로 대략 좋은 범위를 찾고, 이후 좁아진 범위에서 [[Grid Search]] 나 [[Bayesian Optimization]] 으로 세밀하게 탐색하는 흐름이 자연스럽다.

# D) Related

* [[Hyperparameter Optimization]]
* [[Grid Search]]
* [[Bayesian Optimization]]

