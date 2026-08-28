---
title: "Two-tower Model"
tags: ["retrieval", "dense_retrieval", "recommendation_system"]
aliases: ["Two-tower", "Dual Encoder"]
---

# A) Two-Tower Model

Two-tower model은 query/user tower와 item/document tower를 분리해서 embedding을 만든 뒤, 두 embedding의 similarity로 match score를 계산하는 구조다. retrieval과 recommendation candidate generation에서 자주 쓰인다.

# B) 왜 tower를 나누나

Item/document embedding을 offline으로 미리 계산해 index에 넣을 수 있기 때문이다. Online에서는 query 또는 user embedding만 빠르게 만들고, ANN search로 가까운 item을 찾는다.

# C) 주의할 점

두 tower가 dot product 하나로 만나는 구조라 cross feature를 세밀하게 보기는 어렵다. 그래서 candidate generation에서는 빠르게 넓게 가져오고, 뒤의 ranking model에서 query-item interaction feature를 더 자세히 본다.

# References
