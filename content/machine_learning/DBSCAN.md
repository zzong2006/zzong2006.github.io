---
tags: ["machine_learning", "clustering"]
aliases: ["Density-Based Spatial Clustering of Applications with Noise"]
---

# A) DBSCAN

DBSCAN은 density 기반 clustering 알고리즘이다. 가까운 이웃이 충분히 많은 point를 core point로 보고, core point들이 이어진 dense region을 cluster로 만든다.

# B) 핵심 파라미터

| 파라미터 | 의미 |
| --- | --- |
| `eps` | 이웃으로 볼 거리 반경 |
| `min_samples` | core point가 되기 위한 최소 이웃 수 |

# C) K-Means와의 차이

[[K-means]]는 cluster 수를 미리 정하고 대체로 둥근 cluster를 잘 찾는다. DBSCAN은 cluster 수를 직접 주지 않아도 되고, noise point를 따로 분리할 수 있으며, 비구형 cluster에도 더 잘 맞는다. 대신 density가 지역마다 크게 다른 데이터에서는 파라미터 하나로 모든 cluster를 잡기 어렵다.

# References
