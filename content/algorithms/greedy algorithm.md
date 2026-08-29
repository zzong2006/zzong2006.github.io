---
title: "greedy algorithm"
aliases: ["greedy", "탐욕 알고리즘"]
tags:
  - algorithm
---

# A) Greedy Algorithm ?

매 단계에서 그 순간 가장 좋아 보이는 선택을 하고, 한 번 고른 것은 되돌리지 않는 방식이다. 전체를 내다보지 않으므로 계산이 싸지만, 그 대가로 최종 답이 최적이라는 보장이 사라진다.

되돌아가서 다른 선택을 시도하는 완전 탐색([[DFS]] + backtracking)이나, 부분 문제의 답을 모두 저장해 두고 조합하는 동적 계획법과 대비된다.

# B) 언제 최적이 보장되나

두 조건이 성립하면 greedy 선택이 전체 최적해로 이어진다.

1. **greedy choice property**: 각 단계의 국소적 최선을 포함하는 최적해가 항상 존재한다
2. **optimal substructure**: 문제의 최적해가 부분 문제의 최적해로 이루어진다

[[Prim algorithm]] 과 [[Dijkstra algorithm]] 은 이 조건이 증명돼 있어서 greedy 하게 골라도 결과가 최적이다. 반대로 동전 액면가가 임의로 주어진 거스름돈 문제는 큰 동전부터 고르는 greedy 가 최적이 아니다.

# C) 근사와 최적화에서의 greedy

최적이 보장되지 않아도 greedy 를 쓰는 경우가 많다. 최적해를 구하는 비용이 너무 크고, greedy 가 그럴듯한 해를 빠르게 주기 때문이다.

[[AdaBoost]] 가 그 예다. 여러 약한 분류기의 가중합을 한 번에 최적화하는 대신, 앞 단계까지의 결과를 고정해 두고 지금 추가할 분류기 하나와 그 가중치만 손실이 가장 줄어드는 쪽으로 고른다. 이전에 고른 분류기들은 다시 조정하지 않는다는 점에서 greedy 하며, 이런 방식을 stagewise additive modeling 이라고 부른다.

# D) References
