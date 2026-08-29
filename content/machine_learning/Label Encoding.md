---
title: "Label Encoding"
tags:
  - word2vec
  - encoding
aliases: []
---

# A) Label Encoding ?

Numerical 데이터로 바꿀 때, 0 이상의 정수를 사용하는 방법을 의미한다.

**예시**

[‘apple’, ‘dog’, ‘cat’] = `[0, 1, 2]`

# B) Pros and Cons

**문제점**

[[Label Encoding]] 의 문제는 학습 모델이 데이터에 **관계**가 있을 것으로 착각하게 만들 수 있다는 점이다.

## B.1) 예시

예 1) `[0, 1, 2]` 에서 숫자 간 관계는 전혀 없지만, 모델은 0 < 1 < 2 로 오해할 수 있다.

예 2) `[0, 1, 2]` 가 각각 [‘apple’, ‘dog’, ‘cat’] 을 나타낸 거라면, ‘cat’ 과 ‘apple’의 평균은 ‘dog’으로 오해할 수 있다: `(0 + 2) / 2 = 1`

위와 같은 단점에도 불구하고, tree based model 인 [[Decision Tree]] 또는 [[random forest]] 와 같은 모델에는 잘 적용될 수 있다.

## Pros

장점: [[machine_learning/NLP/One Hot Encoding]] 에 비해 저장 공간을 적게 필요로 한다.

# C) References
