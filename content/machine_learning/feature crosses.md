---
title: "feature crosses"
tags: feature_engineering
aliases: ["특성 교차"]
---

# A) Feature Crosses ?

서로 다른 성격 (도메인) 을 지닌 feature 를 섞어서 하나의 context 로 표현하는 것

(예시)  
어느 사람이 바나나를 샀고, 요리책을 샀다면 믹서기를 살 확률이 높다. 이때, 바나나를 샀다는 feature 와 요리책을 샀다는 feature 의 조합을 feature cross 라고 부른다.  
![](https://i.imgur.com/bvnjo5p.png)

# B) 문제점

* 특성 교차 학습하기의 어려움
* 일반적인 feature 들은 sparse 하고 large 하기 때문에 학습하기 어려움
* 어떤 feature 가 효과적인지 구분하려면 수동 & exhaustive search 가 요구됨
* 전통적인 MLP 도 2nd 또는 3rd order feature cross 를 찾기가 어려움

# C) 주의점

Feature crosses 를 만들 때, 다소 직관에 반할 수 있지만, 원래의 (cross 되지 않은) feature 들도 모델에 포함시켜야 합니다. 예를 들어, (위도, 경도) feature cross 뿐만 아니라 위도와 경도를 개별적인 feature 로 제공해야 합니다.

# D) Related

DCN (Deep & Cross Network): cross feature 를 효과적으로 학습하기 위해 디자인 된 모델

# E) References
