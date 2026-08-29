---
title: "FP-growth algorithm"
aliases: []
tags:
  - algorithm
  - recommendation_system
---

# A) FP-growth Algorithm ?

FP-growth algorithm 알고리즘은 FP-tree 를 이용한다.

DB 를 두번만 scan 해서 [[Association Rule Learning]] 이 가능하다.

* 한번은 frequency table 을 만들기 위해서 scan(Frequency 측정)
* 그 다음은 기존의 transaction 에 포함된 itemset 을 통해 새로운 itemset 을 구성하기 위해 scan 한다 (FP-Tree 구성).

# B) FP-Tree Construction

![[img-08013b6a05.jpg|img]]

1. 우선 Apriori 와 동일하게, 각 transaction 에 해당하는 itemset 의 원소들을 count 하여 table 형태를 만든다. (위 그림의 Header Table)
2. 이후, 최소 support 값을 만족하는 item 만을 남기고, table 내의 item 순서를 frequency 순으로 정렬한다.
3. 각 transaction 의 itemset 도, table 에 해당하는 item 만 남기고 frequency 순으로 정렬한다: 위 그림의 (ordered) frequent items
4. 이제 FP-tree 를 만들어야 한다. 정렬된 transactions(TID: 100,200,300,400,500) 을 root tree 에 넣으면서 각 노드의 원소마다 count 를 증가시킨다. 이 구조는 Trie 와 흡사하다.
5. 또한, 트리의 노드를 만들때 마다, 해당 노드를 가리키는 포인터를 table 에 저장한다 (Header Table 의 header).

# C) References
