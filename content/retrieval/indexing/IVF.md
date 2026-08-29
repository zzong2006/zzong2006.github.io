---
title: "IVF"
tags:
  - ANN
  - vector_search
aliases: [Inverted File Index]
---

# A) IVF

IVF(Inverted File Index)는 vector space를 여러 centroid 또는 cluster로 나눈 뒤, query와 가까운 cluster 안에서만 후보를 찾는 ANN indexing 방식이다. [[faiss]]에서 자주 쓰이며, exhaustive search보다 빠르지만 `nlist`, `nprobe` 설정에 따라 recall과 latency가 크게 달라진다.
