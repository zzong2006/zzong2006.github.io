---
title: "label smoothing"
tags: machine_learning
aliases: ["라벨 스무딩"]
---

# A) Label Smoothing ?

라벨 스무딩은 Hard label(One-hot encoded vector 로 정답 인덱스는 1, 나머지는 0 으로 구성) 을 Soft label(라벨이 0 과 1 사이의 값으로 구성) 로 스무딩하는 것을 뜻한다.

$K$ 개의 클래스에 대해서, 스무딩 파라미터 (Smoothing parameter) 를 $α$ 라고 할 때, $k$ 번째 클래스에 대해서 다음과 같이 스무딩을 합니다.

# B) References

* [라벨 스무딩(Label smoothing), When Does Label Smoothing Help?](https://blog.si-analytics.ai/21)
