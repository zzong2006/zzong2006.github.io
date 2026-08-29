---
title: "DFS"
aliases: ["depth-first search", "깊이 우선 탐색"]
tags:
  - algorithm
  - graph
---

# A) DFS ?

Depth-First Search. 그래프나 트리에서 한 갈래를 끝까지 따라 내려간 뒤, 더 갈 곳이 없으면 한 칸 되돌아와 아직 안 가본 갈래로 다시 내려가는 탐색 방식이다. "깊이 우선" 이라는 이름은 이웃을 폭넓게 훑기 전에 한 방향으로 먼저 파고든다는 뜻이다.

되돌아오는 동작이 필요하므로 방문 경로를 [[stack]] 에 쌓는다. 재귀 호출로 쓰면 함수 호출 스택이 그 역할을 대신하기 때문에 코드가 짧아진다.

# B) 동작

```python
def dfs(graph, node, visited):
    visited.add(node)
    for nxt in graph[node]:
        if nxt not in visited:
            dfs(graph, nxt, visited)
```

`visited` 로 이미 방문한 정점을 걸러내지 않으면 사이클이 있는 그래프에서 무한히 돈다. 정점 $V$ 개, 간선 $E$ 개인 그래프에서 각 정점과 간선을 한 번씩 보므로 [[time complexity]] 는 $O(V+E)$ 다.

# C) BFS 와의 차이

[[BFS]] 는 큐를 써서 시작점에서 가까운 정점부터 층층이 훑는다. 그래서 간선 가중치가 없는 그래프에서 최단 경로를 찾을 때는 BFS 가 맞다. DFS 가 먼저 도달한 경로는 최단이라는 보장이 없다.

대신 DFS 는 "끝까지 가본다" 는 성질 때문에 다음 쪽에 어울린다.

- 사이클 검출, 위상 정렬, 연결 요소 찾기
- 모든 경우를 만들어 보며 조건에 안 맞으면 되돌아오는 완전 탐색 (backtracking)
- 트리 순회 — [[pre-order]], [[Inorder Search]], [[post-order]] 는 모두 DFS 의 방문 시점 차이다

탐색 상태가 반복되는 문제에서는 DFS 로 상태 공간을 훑되 이미 계산한 상태의 결과를 저장해 두는 memoization 을 얹는다.

# D) References
