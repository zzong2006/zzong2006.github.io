---
title: "priority queue"
tags: ["data_structure"]
aliases: ["우선순위 큐"]
---

# Priority Queue ?

일반적인 큐 (Queue) 는 먼저 집어넣은 데이터가 먼저 나오는 FIFO (First In First Out) 구조로 저장하는 선형 자료구조입니다.

하지만 우선순위 큐 (Priority Queue) 는 들어간 순서에 상관없이 우선순위가 높은 데이터가 먼저 나오는 것을 말합니다.

## 특징

1. 모든 원소에는 우선순위가 존재한다.
2. 우선 순위가 높은 요소는 우선 순위가 낮은 요소보다 먼저 queue 에서 처리 (제외) 된다.
3. 두 요소의 우선 순위가 같으면 queue 의 순서에 따라 처리된다.

## 구현

일반적으로 [[Heap]] 을 통해 구현할 수 있다.

# Related

# References
