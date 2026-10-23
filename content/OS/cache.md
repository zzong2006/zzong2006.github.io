---
title: "cache"
tags:
  - operating_system
  - computer_architecture
aliases: [cache, cache locality, cache prefetch, 캐시 지역성]
---

# A) Cache ?

Cache 는 느린 저장소나 계산 결과 앞에 더 빠른 저장 공간을 두어 반복 접근 비용을 줄이는 구조다. OS/architecture 에서는 CPU cache, page cache, disk cache 등이 대표적이다.

# B) 왜 빠른가

Cache 는 locality 를 이용한다.

| Locality | 의미 |
| --- | --- |
| Temporal locality | 최근 사용한 데이터가 곧 다시 사용될 가능성 |
| Spatial locality | 가까운 주소의 데이터가 함께 사용될 가능성 |

## B.1) Cache Locality 와 자료구조

CPU 는 특정 메모리에 접근할 때 그 주소 하나만 가져오지 않고, 근처 주소를 묶은 chunk 를 cache 에 함께 올려둔다. 그래서 다음 접근이 근처 주소이면 메인 메모리까지 가지 않고 cache 에서 바로 읽는다. 접근 패턴이 이 동작과 잘 맞으면 "cache locality 가 좋다" 고 한다 ([참조](https://stackoverflow.com/questions/12065774/why-does-cache-locality-matter-for-array-performance)).

Array 는 원소가 연속된 메모리 블럭에 놓이고, linked list 는 각 노드의 메모리가 연속이라는 보장이 없다. 아래는 두 자료구조의 memory layout 이다.

```
Address      Contents       | Address      Contents
ffff 0000    data[0]        | ffff 1000    l_data
ffff 0040    data[1]        |   ....
ffff 0080    data[2]        | ffff 3460    l_data->next
ffff 00c0    data[3]        |   ....
ffff 0100    data[4]        | ffff 8dc0    l_data->next->next
                            | ffff 8e00    l_data->next->next->next
                            |   ....
                            | ffff 8f00    l_data->next->next->next->next
```

`ffff 0000` 에 접근할 때 cache 가 `ffff 2000` 정도까지의 메모리를 함께 올린다고 하자. Array 는 다음 원소들이 모두 이 범위 안에 있어서 cache 에서 바로 읽힌다. Linked list 는 다음 노드가 `ffff 3460` 처럼 범위 밖에 있어서 매번 메인 메모리에 다녀와야 한다. 그래서 같은 순회라도 array 가 훨씬 빠르고, 이를 array 의 cache locality 가 더 좋다고 말한다.

## B.2) Cache Prefetch

Cache prefetch 는 CPU 가 곧 사용할 것으로 보이는 데이터를 메인 메모리에서 cache 로 미리 올려놓는 방식이다. 위 array 순회처럼 접근 주소가 규칙적으로 증가하면 하드웨어가 이 패턴을 감지해 다음 chunk 를 요청이 오기 전에 가져온다 ([Cache prefetching - Wikipedia](https://en.wikipedia.org/wiki/Cache_prefetching)).

# C) 주의점

Cache 는 빠르지만 일관성 문제가 생길 수 있다. 여러 계층에 같은 데이터가 있으면, 어느 copy 가 최신인지 관리해야 한다.

# D) Related

* [[Memory]]
