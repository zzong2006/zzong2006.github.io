---
title: "LRU"
tags:
  - algorithm
  - OS
  - cache
aliases: [Least Recently Used]
---

# A) LRU

LRU(Least Recently Used)는 가장 오래 사용되지 않은 항목을 먼저 제거하는 replacement policy다. [[OS/cache|cache]]와 [[algorithms/페이지 교체 알고리즘|페이지 교체 알고리즘]]에서 자주 등장한다.

# B) 핵심 아이디어

최근에 접근한 데이터는 가까운 미래에도 다시 접근될 가능성이 높다는 locality 가정에 기대고 있다. 그래서 접근 시점을 계속 갱신하고, 공간이 부족해지면 마지막 접근 시점이 가장 오래된 항목을 내보낸다.

# C) 실무에서 볼 점

정확한 LRU는 접근 순서를 매번 갱신해야 하므로 구현 비용이 든다. 그래서 운영체제나 대규모 cache에서는 clock algorithm처럼 LRU를 근사하는 방식도 많이 쓴다.

# References
