---
layout: post
title: Algorithm lesson learned - array
date: 2025-01-06 10:00:00
giscus_comments: true
categories: algorithm
toc:
  beginning: true
  sidebar: left
tags: competitive-programming array string lesson-learned
---

알고리즘 문제를 풀면서 인사이트를 얻은 내용들을 정리합니다.

## 구간 처리

어떤 구간을 처리하는 문제는 해당 구간을 모두 처리할려 하지말고, 구간의 앞과 끝 부분만 다룰 수 있는지 생각해보자.

auxiliary array (difference array) 을 사용하여 범위 업데이트 작업을 효율적으로 적용할 수 있다. 
범위 내의 모든 요소를 직접 업데이트하는 대신, 범위의 시작점과 끝점을 표시하고 나중에 prefix sum을 사용하여 업데이트를 적용한다.

예를 들어, 주어진 배열에 대해 [0, 4] 구간에 +1을 적용하고, [2, 5] 구간에 -1을 적용한다고 가정해보자.

- auxiliary 배열의 [0] 인덱스에 +1을, [5] 인덱스에 -1을 적용하고, [2] 인덱스에 +1을, [6] 인덱스에 -1을 적용
- 각 요소가 원래 배열에서 얼마나 증가하거나 감소했는지를 결정하기 위해 prefix sum을 사용하여 누적 합을 계산

### 관련 문제

- [leetcode: shifting-letters-ii](https://leetcode.com/problems/shifting-letters-ii/description/)

