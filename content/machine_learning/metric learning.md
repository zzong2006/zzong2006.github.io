---
title: "metric learning"
tags: ["recommendation_system", "machine_learning"]
---

# A) Metric Learning ?

## A.1) 정의

metric learning 은 데이터 포인트 간의 거리를 측정하는 방법을 학습하는 기법입니다.

## A.2) Metric Learning 의 두 가지 방식

1. **[[supervised learning]]**  
   label 이 붙어 있는 데이터 포인트 집합을 학습하여, 같은 레이블을 가진 데이터는 서로 가깝게, 다른 레이블을 가진 데이터는 멀리 떨어지도록 거리를 학습합니다.

2. **weakly supervised learning**  
   [[supervised learning]] 과 유사하지만, 접근 가능한 데이터가 tuple 단위로만 제공됩니다. positive pair 는 가까워지고, negative pairs 는 멀어지도록 하는 거리를 학습합니다.

## A.3) 관련 개념

* [[Mahalanobis distance]]
