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
- 모든 경우를 만들어 보며 조건에 안 맞으면 되돌아오는 완전 탐색 (backtracking). 예: [[Generate Parentheses]], [[Permutations]]
- 트리 순회 — [[pre-order]], [[Inorder Search]], [[post-order]] 는 모두 DFS 의 방문 시점 차이다

탐색 상태가 반복되는 문제에서는 DFS 로 상태 공간을 훑되 이미 계산한 상태의 결과를 저장해 두는 memoization 을 얹는다.

# D) 깊이를 인자로 넘기는 재귀

레벨 순서 결과가 필요한 문제 ([LeetCode 102](https://leetcode.com/problems/binary-tree-level-order-traversal/)) 는 큐 없이 재귀로도 풀린다. 재귀에 **깊이를 인자로 같이 넘기고**, 각 node 를 자기 깊이의 칸에 넣는다.

```python
class Solution:
    def levelOrder(self, root):
        result = []

        def dfs(node, depth):
            if not node:
                return
            if depth == len(result):      # 이 깊이를 처음 방문하면 새 칸을 만든다
                result.append([])
            result[depth].append(node.val)
            dfs(node.left, depth + 1)     # 왼쪽을 먼저 가야 같은 레벨 안의 순서가 맞다
            dfs(node.right, depth + 1)

        dfs(root, 0)
        return result
```

방문 순서는 [[BFS]] 와 다르지만, node 를 깊이별 칸에 나눠 담으므로 결과는 같다. 이것은 **BFS 가 아니라 DFS** 다. 결과만 레벨별로 묶을 뿐이다.

## D.1) 이 요령이 통하지 않는 경우

| 문제 유형 | 깊이 인자 재귀 | 큐 BFS |
| --- | --- | --- |
| 레벨별로 묶기 (102) | 된다 | 된다 |
| 최단 거리, 최단 시간 (994, 미로 탈출) | 안 된다 | 된다 |
| 가장 가까운 것을 찾으면 멈추기 (111 최소 깊이) | 비효율적 | 된다 |

- **최단 거리**: DFS 는 먼 길로 먼저 도착할 수 있다. 더 짧은 경로로 같은 칸에 다시 오면 값을 갱신해야 하므로 같은 칸을 여러 번 방문하게 된다.
- **조기 종료**: 트리의 최소 깊이를 구할 때 BFS 는 첫 번째 잎을 만나면 끝나지만, DFS 는 깊은 쪽부터 끝까지 내려가 봐야 할 수 있다.

방문 순서가 답에 영향을 주면 큐 BFS 를 쓴다.

## D.2) 자주 하는 실수

- **재귀 함수 이름을 `bfs` 로 짓기.** 깊이 인자 재귀는 DFS 다. 이름과 실제 동작이 다르면 설명할 때 개념을 헷갈린 것처럼 보인다.
- **결과를 클래스 변수에 저장하기.** `class Solution: results = {}` 처럼 클래스 변수로 두면 모든 인스턴스가 공유해서, 초기화를 빠뜨리면 이전 입력의 결과가 남는다. 지역 변수나 클로저로 둔다.
- **재귀 깊이.** 재귀는 깊이만큼 호출 스택을 쓴다. 한쪽으로 길게 늘어진 트리나 큰 격자에서는 Python 기본 재귀 한도 (약 1000) 에 걸릴 수 있으므로, 입력이 크면 큐 BFS 나 명시적 [[stack]] 으로 바꾼다.
