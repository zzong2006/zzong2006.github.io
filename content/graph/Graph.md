---
title: "Graph"
tags: ["graph"]
---

# A) Graph

Graph는 node(vertex)와 edge로 관계를 표현하는 자료구조이자 수학적 모델이다. 사용자-아이템 상호작용, 웹 링크, 지식 그래프, social network처럼 “대상이 있고 대상 사이의 연결이 중요한” 문제를 다룰 때 기본 언어가 된다.

# B) 구성

기본적으로 graph는 $G=(V,E)$로 쓴다. $V$는 node 집합이고, $E$는 node 사이의 edge 집합이다.

| 구분 | 의미 |
| --- | --- |
| Undirected graph | edge에 방향이 없는 graph |
| Directed graph | edge에 방향이 있는 graph |
| Weighted graph | edge에 가중치가 있는 graph |
| Bipartite graph | node 집합을 둘로 나누고 서로 다른 집합 사이에만 edge가 있는 graph |

# C) ML에서 왜 중요한가

추천에서는 user-item bipartite graph가 기본 구조가 되고, [[graph/Graph Neural Network|GNN]]은 graph 위에서 neighborhood 정보를 모아 node representation을 만든다. Temporal interaction을 다룰 때는 [[graph/Temporal Graph Network|Temporal Graph Network]]처럼 시간 축까지 함께 모델링한다.

# References
