---
tags: ["machine_learning", "clustering"]
aliases: ["계층 군집화"]
---

# A) Hierarchical Clustering ?

객체 간 pairwise distance matrix 를 이용해서, 비슷한 객체 간 중첩된 계층 그룹을 생성하는 방법

# B) Methods

두 가지 방법이 존재한다.

1. Agglomerative: Bottom-up 방식, 각 객체를 개별적 클러스터에 속하게 만들고, 비슷한 클러스터 간 합치면서 최종적으로 하나의 클러스터가 생성될 때 까지 반복
2. Divisive: Top-down 방식, 모든 객체들을 하나의 클러스터에 넣고, 각 객체가 개별적인 클러스터에 속할 때 까지 클러스터의 분할을 반복

# C) Pros and Cons

## C.1) 장점

클러스터의 개수와 같은 parameter 를 사용자가 부여하지 않아도 된다.

## C.2) 단점

quadratic 계산 복잡도 ($O(N^2)$) 로 인해 작은 데이터셋에만 한정적으로 적용될 수 있다.

# D) Linkage Criteria

* Hierarchical clustering 은 객체 간 유사도 뿐만 아니라 집합 (또는 클러스터) 간 유사도 역시 계산할 필요성이 있는데, 이를 linkage criteria 라고 부른다.
* 아래는 두 집합 $A$ 와 $B$ 간 사용할 수 있는 linkage criteria 의 일부를 나타낸다.
* **Names****Formula**
* Maximum or complete-linkage clustering$\max{d(a,b):a\in A,b\in B}$
* Minimum or single-linkage clustering$\min{d(a,b):a\in A,b\in B}$

# E) Related

# F) References
