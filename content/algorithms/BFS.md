---
title: "BFS"
tags: ["algorithm", "graph"]
aliases: ["Breadth First Search", "breadth-first search"]
---

# A) BFS ?

BFS(Breadth First Search)는 시작 node 에서 가까운 node 부터 층별로 방문하는 graph/tree traversal 방식이다. 보통 queue 를 사용한다.

# B) 동작 흐름

1. 시작 node 를 queue 에 넣고 방문 처리한다.
2. queue 에서 하나를 꺼낸다.
3. 아직 방문하지 않은 이웃 node 를 queue 에 넣는다.
4. queue 가 빌 때까지 반복한다.

# C) 쓰임

Unweighted graph 에서 최단 거리, 연결 component 탐색, level-order traversal 을 구할 때 자주 사용한다.

# D) Related

* [[algorithms/First In First Out|FIFO]]
* [[DFS]]

