---
title: "Graph Embedding"
tags:
  - graph
  - representation_learning
aliases: [graph embedding]
---

# A) Graph Embedding ?

Graph Embedding 은 node, edge, subgraph, 전체 graph 를 vector 로 표현하는 방법이다. 그래프 구조를 embedding 으로 바꾸면 similarity search, classification, recommendation 같은 downstream task 에 사용할 수 있다.

# B) 무엇을 보존하나

방법마다 보존하려는 정보가 다르다. 가까운 node 를 가깝게 두는 proximity, random walk 기반 context, node feature, edge type, graph-level structure 등을 반영할 수 있다.

# C) Related

* [[Graph Neural Network]]
* [[random walk]]
* [[recommendation_system/LightGCN|LightGCN]]

