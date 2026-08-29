---
title: "memory-based CF"
tags:
  - recommendation_system
aliases: []
---

# A) Memory-based CF ?

Memory-based [[collaborative filtering|CF]] 는 다른 말로 Neighborhood-based CF(이웃 기반 CF) 이라고도 하며, 사용자 또는 아이템 간의 similarity 값을 계산하고 이를 평점 예측 또는 Top-K ranking 에 활용하는 방법이다.

Similarity 값을 계산하는 metric 은 여러 종류가 있으며, Jaccard Similarity, [[cosine similarity]], Pearson Similarity 등이 활용된다.

# B) 유저 기반 Top-N 추천 알고리즘

유저 기반 Top-N 추천 알고리즘은 유사도 기반 벡터 모델을 사용하여, 특정 유저와 가장 유사한 k 명의 다른 유저들을 찾아냅니다. 이렇게 찾아낸 k 명의 유사한 유저들의 사용자 - 아이템 행렬을 합산하여 추천할 아이템 목록을 도출합니다. 이 과정에서 자주 사용되는 방법 중 하나는 Locality-sensitive hashing (LSH) 으로, 이는 최근접 이웃 (nearest neighbor) 메커니즘을 선형 시간 내에 구현할 수 있습니다.

## B.1) 장점

이 방식의 주요 장점은 다음과 같습니다:

* **결과의 설명 가능성**: 추천 시스템에서 중요한 요소로, 결과를 쉽게 설명할 수 있습니다.
* **구현 및 사용 용이성**: 새로운 데이터를 쉽게 추가하고 사용할 수 있습니다.
* **추천 아이템의 콘텐츠 독립성**: 추천되는 아이템이 특정 콘텐츠에 의존하지 않습니다.
* **공동 평가된 (co-rated) 아이템들과의 확장성**: 공동 평가된 아이템들이 많을수록 성능이 더 좋아집니다.

## B.2) 단점

하지만 이 방식에는 몇 가지 단점도 존재합니다:

* **데이터 희소성 문제**: 웹 관련 데이터에서는 흔히 발생하는 문제로, 데이터가 희소할 경우 성능이 저하됩니다. 이는 대규모 데이터셋에서 확장성을 저해하는 요인이 됩니다.
* **새로운 아이템 추가의 복잡성**: 새로운 유저는 효율적으로 처리할 수 있지만, 새로운 아이템을 추가하는 것은 더 복잡해집니다. 이는 보통 특정 벡터 공간에 의존하기 때문에, 새롭게 추가된 아이템뿐만 아니라 기존 구조 내 모든 요소를 다시 삽입해야 하기 때문입니다.

# C) References

* [Memory-based와 Model-based Collaborative Filtering](https://glanceyes.com/entry/%EC%B6%94%EC%B2%9C-%EC%8B%9C%EC%8A%A4%ED%85%9C-Memory-based%EC%99%80-Model-based-Collaborative-Filtering)
* [Collaborative filtering - Wikipedia](https://en.wikipedia.org/wiki/Collaborative_filtering#Memory-based)
