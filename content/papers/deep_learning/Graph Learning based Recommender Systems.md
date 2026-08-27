---
tags: ["deep_learning", "graph", "paper_review", "recommendation_system"]
aliases: ["GLRS"]
---

# A) Graph 기반 추천을 하는 이유

1. 추천 시스템 내 대부분의 데이터는 그래프 구조를 가진다.
real world 에서 객체들은 서로 explicit 또는 implicit 하게 연결되어 있다. 그리고 그 객체는 사용자, 아이템, 속성등 이 될 수 있다.
2. 그래프 학습은 복잡한 관계를 학습할 수 있다.
[[random walk]] 나 [[graph/Graph Neural Network|GNN]] 과 같은 GL 방식이 그래프에서 모델링된 특정 타입의 관계를 학습하는데 효율적임을 보였다.

# B) References

* [Graph Learning based Recommender Systems: A Review](https://arxiv.org/pdf/2105.06339.pdf) (2021)
