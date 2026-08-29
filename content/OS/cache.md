---
title: "cache"
tags:
  - operating_system
  - computer_architecture
aliases: [cache]
---

# A) Cache ?

Cache 는 느린 저장소나 계산 결과 앞에 더 빠른 저장 공간을 두어 반복 접근 비용을 줄이는 구조다. OS/architecture 에서는 CPU cache, page cache, disk cache 등이 대표적이다.

# B) 왜 빠른가

Cache 는 locality 를 이용한다.

| Locality | 의미 |
| --- | --- |
| Temporal locality | 최근 사용한 데이터가 곧 다시 사용될 가능성 |
| Spatial locality | 가까운 주소의 데이터가 함께 사용될 가능성 |

# C) 주의점

Cache 는 빠르지만 일관성 문제가 생길 수 있다. 여러 계층에 같은 데이터가 있으면, 어느 copy 가 최신인지 관리해야 한다.

# D) Related

* [[cache locality]]
* [[cache prefetch]]
* [[Memory]]

