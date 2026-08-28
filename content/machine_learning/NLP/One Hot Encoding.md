---
title: "One Hot Encoding"
tags: ["word2vec", "machine_learning", "NLP"]
aliases: ["ohe", "OHE"]
---

# A) One Hot Encoding ?

Numerical 데이터로 바꿀 때, 0 또는 1 만을 사용하는 방법을 의미한다.

## A.1) 예시

예 1) [‘apple’, ‘dog’, ‘cat’] = `[[0, 0, 1], [0, 1, 0], [1, 0, 0]]`  
예 2, Word Representation)  
![[img-5bac312b1e.png||500]]

이렇게 하면 모든 데이터가 [[orthogonal]] vector space 에 존재하는 vector 들로 표현된다.

# B) 특징

## B.1) 장점

* 데이터 간 관계성을 없앰으로써, [[Label Encoding]] 의 단점을 해결한다.

## B.2) 단점

* high [[cardinality]] -> feature space 가 굉장히 빠르게 증가하므로 차원의 저주를 해결해야 한다.
* [[Word Embedding]] 을 위해 [[machine_learning/NLP/One Hot Encoding]] 을 사용할 경우, 각 단어 간 관계를 유추하기 어렵다.

# C) Notes

일반적으로 One Hot Encoding 이후 [[machine_learning/Principal Component Analysis]] 를 적용하는 과정을 거치면 좋다.

# D) References
