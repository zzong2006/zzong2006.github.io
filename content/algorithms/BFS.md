---
title: "BFS"
tags:
  - algorithm
  - graph
aliases: [Breadth First Search, breadth-first search]
---

# A) BFS ?

BFS(Breadth First Search)는 시작 node 에서 가까운 node 부터 층별로 방문하는 graph/tree traversal 방식이다. 먼저 넣은 것을 먼저 꺼내는 queue ([[algorithms/First In First Out|FIFO]]) 를 사용한다.

가까운 것부터 방문하므로, 간선 가중치가 없는 그래프에서는 **어떤 node 에 처음 도달한 시점이 곧 최단 거리**다. 이것이 BFS 를 쓰는 가장 큰 이유다.

# B) 틀

```python
from collections import deque

def bfs(start, neighbors):
    visited = {start}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for nxt in neighbors(node):
            if nxt not in visited:
                visited.add(nxt)      # 넣는 순간 방문 표시
                queue.append(nxt)
```

- **방문 표시는 큐에 넣을 때 한다.** 꺼낼 때 표시하면, 아직 꺼내지 않은 node 가 다른 이웃을 통해 큐에 또 들어가 중복 방문이 생긴다.
- **`list.pop(0)` 대신 `deque.popleft()` 를 쓴다.** 리스트의 맨 앞을 빼면 뒤의 원소를 모두 한 칸씩 당기므로 $O(n)$ 이다. `deque` 는 양쪽 끝 연산이 $O(1)$ 이다.

정점 $V$ 개, 간선 $E$ 개인 그래프에서 각 정점과 간선을 한 번씩 보므로 [[time complexity]] 는 $O(V+E)$ 다.

# C) 레벨 단위로 끊기

"몇 단계 만에" 나 "레벨별로" 를 구하려면 큐를 레벨 단위로 끊어서 처리한다.

```python
while queue:
    for _ in range(len(queue)):   # 지금 큐에 든 것 = 현재 레벨 전부
        node = queue.popleft()
        ...                        # 다음 레벨 node 는 뒤에 쌓인다
    level += 1
```

`range(len(queue))` 는 루프를 시작할 때 한 번만 계산된다. 그래서 도는 중에 다음 레벨 node 가 뒤에 추가돼도 현재 레벨과 섞이지 않는다. `while queue:` 로 돌리면 새로 들어온 node 까지 같은 레벨에서 꺼내게 된다.

## C.1) 예제: Binary Tree Level Order Traversal

[LeetCode 102](https://leetcode.com/problems/binary-tree-level-order-traversal/). 트리를 레벨별로 묶어 반환한다.

```python
from collections import deque

class Solution:
    def levelOrder(self, root):
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            result.append(level)
        return result
```

빈 트리를 먼저 걸러야 한다. `deque([None])` 으로 시작하면 `None.val` 에서 에러가 난다. 같은 틀로 [LeetCode 199](https://leetcode.com/problems/binary-tree-right-side-view/) (레벨마다 마지막 node 만 모으기), [LeetCode 111](https://leetcode.com/problems/minimum-depth-of-binary-tree/) (자식이 없는 node 를 처음 만나는 레벨에서 바로 반환) 도 풀린다.

## C.2) 예제: Rotting Oranges (시작점이 여러 개)

[LeetCode 994](https://leetcode.com/problems/rotting-oranges/). 썩은 오렌지가 1 분마다 상하좌우의 신선한 오렌지를 썩게 할 때, 전부 썩는 데 걸리는 시간을 구한다. 불가능하면 -1 이다.

시작점이 여러 개면 **처음부터 시작점을 모두 큐에 넣고** 한 번에 퍼뜨린다. 시작점마다 BFS 를 따로 돌릴 필요가 없다.

```python
from collections import deque

class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        m, n = len(grid), len(grid[0])
        queue, fresh = deque(), 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    queue.append((i, j))
                elif grid[i][j] == 1:
                    fresh += 1

        minutes = 0
        while queue and fresh:
            for _ in range(len(queue)):
                i, j = queue.popleft()
                for di, dj in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                    ni, nj = i + di, j + dj
                    if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] == 1:
                        grid[ni][nj] = 2       # 넣는 순간 방문 표시
                        fresh -= 1
                        queue.append((ni, nj))
            minutes += 1
        return minutes if fresh == 0 else -1
```

- 신선한 오렌지 수 `fresh` 를 세 두면 끝에 격자를 다시 훑지 않아도 된다.
- 반복 조건에 `fresh` 를 넣어, 더 썩힐 것이 없으면 시간을 올리지 않는다. 그렇지 않으면 마지막 단계에서 1 분이 더 세어진다.
- 입력 격자를 직접 바꾼다. 입력을 수정해도 되는지 먼저 확인하고, 안 된다면 방문 집합을 따로 둔다.

행 $m$, 열 $n$ 일 때 칸마다 큐에 최대 한 번 들어가므로 $O(mn)$ 이다.

# D) 쓰임

Unweighted graph 에서 최단 거리, 연결 component 탐색, level-order traversal 을 구할 때 자주 사용한다. 최단 거리는 [[DFS]] 로 대신할 수 없고, "가장 가까운 것을 찾으면 멈추기" 는 DFS 로 풀면 비효율적이다. 이유는 DFS 노트의 D 절 참고.

# E) Related

* [[algorithms/First In First Out|FIFO]]
* [[DFS]]
