---
layout: default
title:  "Search"
category: Artificial Intelligence
order: 1
---

## Search

* 많은 AI 관련 문제들이 검색 방법으로 풀리는 경우가 많음 (games)
* 주어진 문제를 search로 풀려면 다음과 같은 요소들을 정의해야됨
  * state space
  * initial state : 현재 상태
  * goal : 달성하기 원하는 state
  * actions : 한 state에서 다른 state로 이동하는 방법
  * (부수적 요소) costs: 현재 state에서 다른 state로 이동할 때 드는 비용
* Solution은 현재 state에서 goal에 다다르기 까지의 요구되는 일련의 actions을 의미
* 예제: The 8-Puzzle
  * <img src="https://i.loli.net/2020/10/19/lTEkHuhYA85MPvS.png" alt="image-20201019230347144" style="zoom: 80%;" />

* Search 문제를 Tree 또는 Graph 형식으로 나타낼 수 있음
  * <img src="https://i.loli.net/2020/10/19/a9MnGbClm3czgQq.png" alt="image-20201019230552906" style="zoom:50%;" />
  * <img src="https://i.loli.net/2020/10/19/gUorHPtCfiRJscN.png" alt="image-20201019230604669" style="zoom: 67%;" />

## Uninformed search techniques

* Breadth-Frist Search (BFS)
* Depth-First Search (DFS)
* Depth-Limited Search (DLS)
* Uniform-Cost Search (UCS)
* Iterative-Deepening Search (IDS)

### Breadth-First Search (BFS)

* Frontier에서 항상 첫번째 element만 선택한다.
  * Frontier: explore하지 않은 nodes(또는 states)를 저장한 list
* Time Complexity : $1+b+b^2+b^3+\cdots+b^{d-1}+b^d+b(b^d - 1) = O(b^{d+1})$
  * $b$ : search graph의 maximal branching factor
  * $d$ : 가능한 solution들 중 가장 짧은 depth (Root는 $d$=0, 즉, $d$=path의 길이 - 1)
  * goal 노드까지 $d$ 의 깊이를 가지고, goal node에 관련된 node를 frontier에 모두 추가하므로  $b^{d+1}$
* Space Complexity: $O(b^{d+1})$
* Optimality: 가장 짧은 길이를 가진 solution을 찾을 수 있음
* Completeness: 깊이가 $d$인 모든 paths를 검사하므로, 솔루션이 존재한다면 반드시 찾을 수 있음
* <img src="https://i.loli.net/2020/10/19/T6dIflCJmYnZgxN.png" alt="image-20201019232318606" style="zoom: 80%;" />
* <img src="https://i.loli.net/2020/10/19/H7PwCb5uDj9eKS2.png" alt="image-20201019232641873" style="zoom:80%;" />
  * frontier에 포함된 node들은 부모에 대한 reference를 가지고 있음

* Uniform-Cost
* Depth-First
* Depth-Limited
* Iterative-Deepening



