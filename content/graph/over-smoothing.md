---
title: "over-smoothing"
tags: ["graph"]
---

# A) Over-smoothing

[[graph/Graph Neural Network]]에서 자주 발생하는 문제 중 하나로, 네트워크의 layer 수가 깊어질수록 각 정점의 임베딩이 점차 비슷해지는 현상을 말한다.

즉, 레이어가 쌓일수록 서로 다른 노드 간 표현이 구분되지 않고 유사하게 수렴하는 경향이 나타나며, 이를 **over-smoothing**이라고 한다.
