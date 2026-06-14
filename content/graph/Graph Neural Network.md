---
title: "Graph Neural Network"
tags: ["graph", "deep_learning"]
aliases: ["GNN"]
---

# A) Graph Neural Network ?

## A.1) 기존 그래프 알고리즘과의 비교

전통적인 그래프 관련 알고리즘들의 limitation 이 존재
기존 알고리즘들: [[BFS]], [[DFS]], [[Dijkstra algorithm]], [[Prim algorithm]] etc.

Limitation: 알고리즘을 적용하기 전에 입력 그래프에 대한 사전 지식이 필요하기 때문에 graph level 에서의 예측이 불가능하다 (graph level: graph 의 edge 나 node 가 아닌 여러개의 graph 를 다루는 레벨을 의미).

Graph Neural Network 는 graph 의 사전 지식이 필요없으며, 이 신경망은 node, edge 그리고 graph level 의 prediction 작업에 사용된다.

# B) GNN 종류

## B.1) Recurrent Graph Neural Network (Recurrent GNN)

[[Banach Fixed-Point Theorem]] 에 기반한 신경망

## B.2) Spatial Convolutional Network

[[Convolution Neural Network]] 의 아이디어를 활용한 GNN
![|500](https://i.imgur.com/SCBUagv.png)

* Spectral Convolutional Network
* [[Temporal Graph Network]]

# C) GNN Tasks

* node classification: 노드를 분류하는 문제
* link prediction: 그래프의 노드들 사이의 관계를 파악하고 두 노드 사이의 연관성이 얼마인지 예측하는 문제
* graph classification: 그래프 자체를 분류하는 문제

# D) Related

# E) References
