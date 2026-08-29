---
title: "LFU"
tags:
  - algorithm
  - OS
  - cache
aliases: [Least Frequently Used]
---

# A) LFU

LFU(Least Frequently Used)는 사용 빈도가 가장 낮은 항목을 먼저 제거하는 replacement policy다. [[OS/cache|cache]]나 [[algorithms/페이지 교체 알고리즘|페이지 교체 알고리즘]]에서 LRU와 함께 비교된다.

# B) LRU와의 차이

[[algorithms/LRU|LRU]]는 “얼마나 최근에 썼는가”를 보고, LFU는 “얼마나 자주 썼는가”를 본다. 자주 쓰이는 hot item을 오래 보존하는 데는 LFU가 유리하지만, 예전에 많이 쓰였던 항목이 계속 남는 cache pollution 문제가 생길 수 있다.

# C) 실무에서 볼 점

실제 시스템에서는 빈도에 시간 감쇠를 넣거나, LRU와 LFU를 섞어 recency와 frequency를 같이 본다. 추천, 검색, feature store cache처럼 트래픽 패턴이 크게 바뀌는 환경에서는 단순 LFU만으로는 부족한 경우가 많다.

# References
