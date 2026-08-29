---
title: "Grid Search"
tags:
  - machine_learning
  - hyperparameter_optimization
aliases: [grid search, GridSearchCV]
---

# A) Grid Search ?

Grid Search 는 후보 [[hyperparameter]] 값들을 미리 정해두고, 가능한 조합을 모두 평가해서 가장 좋은 조합을 찾는 방법이다.

예를 들어 learning rate 후보가 `[0.1, 0.01]`, max depth 후보가 `[3, 5, 7]` 이라면 총 6개 조합을 모두 학습/평가한다.

# B) 장점과 단점

| 장점 | 단점 |
| --- | --- |
| 단순하고 재현하기 쉬움 | 후보가 많아지면 조합 수가 폭발 |
| 작은 탐색 공간에서는 강한 baseline | 중요하지 않은 parameter 에도 같은 비용을 씀 |
| 결과 해석이 쉬움 | 연속적인 좋은 영역을 세밀하게 찾기 어려움 |

# C) Random Search 와 비교

[[Random search]] 는 후보 공간에서 무작위로 조합을 뽑는다. 중요한 hyperparameter 가 일부에 집중되어 있다면, 같은 budget 에서 Grid Search 보다 Random Search 가 더 효율적일 수 있다.

# D) Related

* [[Hyperparameter Optimization]]
* [[Random search]]
* [[Bayesian Optimization]]

