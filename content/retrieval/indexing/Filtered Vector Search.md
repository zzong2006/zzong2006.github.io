---
title: "Filtered Vector Search"
aliases: ["filtered ANN", "pre-filtering", "post-filtering", "필터 벡터 검색"]
tags:
  - retrieval
  - ANN
  - vector_search
---

중고거래 앱에서 "자전거" 를 검색한다. 결과는 내 동네 반경 몇 km 안의 매물이어야 한다. 전국 매물은 1 억 개, 내 동네 매물은 2 만 개라고 하자.

벡터 검색은 검색어 벡터와 가까운 매물을 찾고, 필터는 "내 동네" 라는 조건을 건다. 둘을 어떤 순서로 합치느냐에 따라 결과가 크게 달라진다.

# A) 벡터 검색 뒤에 필터를 걸 때

**전국 매물에서 가까운 100 개를 먼저 뽑고 동네 필터를 걸면, 그 100 개 안에 내 동네 매물이 거의 없다.**

- 내 동네 매물은 전체의 0.02% 다 (2 만 ÷ 1 억).
- 동네와 상관없이 뽑은 100 개에 내 동네 매물이 들어 있을 기대 개수는 0.02 개다.
- 100 개 대신 수십만 개를 뽑으면 남기는 하지만, 그만큼 [[Approximate Nearest Neighbor|ANN]] 검색이 느려진다.

이 방식을 post-filtering 이라고 한다. 대부분의 매물이 조건을 통과하는 느슨한 필터에서만 쓸 만하다.

# B) 필터 뒤에 남는 후보 수에 따른 선택

**필터를 먼저 걸고, 남은 후보가 몇 개인지에 따라 검색 방법을 바꾼다.**

## B.1) 남은 후보가 적으면 전부 계산한다

- 내 동네 매물 2 만 개만 꺼내 검색어 벡터와 모두 내적한다. 768 차원이면 곱셈 1,536 만 번이다.
- 이 정도는 ANN 없이 CPU 로도 금방 끝나고, 근사가 아니라 정확한 결과가 나온다.
- 동네 단위 서비스처럼 필터 뒤 후보가 수천에서 수만 개면 가장 현실적인 선택이다.

## B.2) 필터 값마다 색인을 따로 만든다

- 지역별로 색인을 따로 두고, 검색할 때 내 지역 색인만 뒤진다.
- 지역처럼 값이 잘 바뀌지 않고 종류가 많지 않은 필터에 맞는다.
- 반경이 여러 지역에 걸치면 여러 색인을 뒤져 결과를 합쳐야 한다.
- 지역에 카테고리, 가격대까지 조합하면 색인 수가 감당할 수 없이 늘어난다.

## B.3) 그래프를 탐색하면서 필터를 함께 확인한다

- [[HNSW]] 그래프를 따라가면서 조건에 맞는 매물만 결과에 담는다. 조건에 안 맞는 노드도 길로는 지나간다.
- 후보가 많이 남는 필터에서는 ANN 의 속도를 그대로 살린다.
- 필터가 너무 좁으면 조건에 맞는 노드가 그래프 곳곳에 드문드문 흩어진다. 이웃을 따라가도 맞는 노드를 만나기 어려워 탐색이 길어지고 recall 이 떨어진다.
- 그래서 Elasticsearch 는 필터를 통과한 문서가 적으면 그래프 탐색 대신 전수 계산으로 넘어간다.
- 그래프를 만들 때부터 필터 라벨을 고려해 같은 라벨끼리 잘 이어 두는 방법도 있다 ([[Vamana]] 노트의 Filtered-DiskANN).

**남는 후보 수가 방법을 정한다.**

- 수천에서 수만 개: 필터 후 전수 계산
- 그보다 많고 필터 값이 안정적: 색인 분할 또는 탐색 중 필터 확인
- 대부분이 통과하는 느슨한 필터: 넉넉히 뽑은 뒤 post-filtering

동네 반경 조건 자체를 빠르게 거는 방법은 [[Geo Search]] 에 있다.

# C) References

- [k-nearest neighbor (kNN) search: Filtered kNN search (Elasticsearch Reference)](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html)
- Filtered-DiskANN: Graph Algorithms for Approximate Nearest Neighbor Search with Filters (Gollapudi et al., WWW 2023)
