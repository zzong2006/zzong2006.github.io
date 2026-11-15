---
title: "Approximate Nearest Neighbor"
tags:
  - retrieval
  - ANN
  - vector_search
aliases: ["ANN", "근사 최근접 탐색"]
---

상품 1 억 개를 768 차원 벡터로 만들어 두었다. 검색어 벡터와 가장 가까운 상품 10 개를 찾으려면, 정직하게는 1 억 개 모두와 내적해 봐야 한다.

# A) 정확한 탐색이 어려운 이유

**검색어 하나에 곱셈이 768 억 번 필요하다.**

- 1 억 × 768 이다. CPU 한 코어로는 수 초가 걸려 검색 한 번에 쓸 수 없다.
- 벡터를 메모리에 올리는 것도 부담이다. float32 로 1 억 × 768 × 4 바이트 ≈ 307 GB 다.

**ANN(Approximate Nearest Neighbor)은 정답 일부를 놓치는 대신 훨씬 적은 벡터만 보고 찾는다.**

- 정확한 탐색의 상위 10 개 중 9 개를 찾았으면 recall@10 은 0.9 다.
- 얼마나 놓칠지는 설정으로 조절한다. 더 많이 뒤지면 recall 이 오르고 느려진다.

# B) 탐색 범위를 줄이는 세 가지 방식

**ANN 색인은 무엇으로 탐색 범위를 줄이느냐에 따라 크게 셋으로 나뉜다.**

- 그래프: 가까운 벡터끼리 이어 두고 이웃을 따라간다.
- 클러스터: 벡터를 무리로 나누고 가까운 무리만 뒤진다.
- 압축: 벡터를 작게 줄여 계산과 메모리를 아낀다.
- 실제 색인은 이 셋을 섞어 쓴다. 클러스터와 압축을 합친 IVF-PQ 가 대표적이다.

비슷한 벡터를 같은 해시 버킷에 모으는 [[locality sensitive hashing]] 도 있지만, 벤치마크에서는 앞의 방식들에 밀린다.

## B.1) 그래프: HNSW

- 각 벡터를 가까운 이웃 M 개와 연결한 그래프를 만든다.
- 검색은 시작점에서 출발해 "이웃 중 검색어에 더 가까운 쪽으로 옮겨 가기" 를 더 가까워지지 않을 때까지 반복한다.
- 층을 여러 개 두어 위층에서는 멀리 건너뛰고 아래층에서 촘촘히 찾는다.
- recall 과 속도가 좋은 대신 원본 벡터와 연결 정보를 모두 메모리에 둔다.
- 검색할 때 들고 다니는 후보 수(efSearch)를 키우면 recall 이 오르고 느려진다. 자세한 내용은 [[HNSW]] 에 있다.

## B.2) 클러스터: IVF

- k-means 로 벡터를 nlist 개 무리로 나누고, 무리마다 속한 벡터 목록을 저장한다 ([[IVF]]).
- 검색할 때는 검색어와 가장 가까운 무리 nprobe 개만 뒤진다.
- nlist 는 색인을 만들 때 정하는 무리 수이고, nprobe 는 검색할 때 뒤지는 무리 수다. nprobe 를 키우면 recall 이 오르고 느려진다.
- 정답이 무리 경계 바로 너머에 있으면 그 무리를 뒤지지 않아 놓친다. IVF 의 recall 손실은 주로 여기서 온다.

## B.3) 압축: PQ

- PQ(product quantization)는 벡터를 m 조각으로 나누고, 조각마다 대표값 256 개를 k-means 로 만든다. 각 조각을 가장 가까운 대표값의 번호(1 바이트)로 바꾼다.
- 768 차원 float32 벡터는 3,072 바이트인데, 64 조각으로 나누면 64 바이트가 된다. 48 분의 1 이다.
- 거리를 대표값으로 계산하므로 근사다. 그래서 상위 후보 수백 개만 원본 벡터로 다시 계산해 순서를 바로잡는다.
- IVF 와 함께 쓰는 IVF-PQ 가 흔하다. 검색 과정은 [[faiss]] 에 있다.

# C) 메모리 어림

**같은 1 억 개 768 차원이라도 방식에 따라 메모리가 수십 배 차이 난다.**

| 구성 | 메모리 |
| --- | --- |
| 원본 벡터 (float32) | 약 307 GB |
| HNSW (원본 + 연결 정보, M = 32) | 약 333 GB |
| IVF-PQ (64 바이트 코드 + id 8 바이트) | 약 7 GB |

- HNSW 의 연결 정보는 맨 아래층만 세어 벡터당 이웃 64 개 × 4 바이트로 잡았다.
- 한 대에 안 들어가면 벡터를 여러 대에 나눠 담고(sharding), shard 마다 찾은 상위 결과를 모아 다시 정렬한다.
- 메모리를 줄이려면 PQ 로 압축하거나, 원본을 SSD 에 두는 [[Vamana]](DiskANN) 계열을 쓴다.

# D) 조건이 붙은 검색

"내 동네 매물 중에서" 처럼 필터가 붙으면, 벡터 검색 뒤에 필터를 거는 단순한 방법은 결과가 거의 남지 않는다. 필터가 얼마나 좁은지에 따라 방법을 고르는 이야기는 [[Filtered Vector Search]] 에 있다.

# E) 라이브러리

- [[faiss]], [[scann]], [[Hnswlib]], [[milvus]], [[weaviate]]
- [[TOROS N2|N2]]
- [GitHub - milvus-io/milvus: Vector database for scalable similarity search and AI applications.](https://github.com/milvus-io/milvus)
- [GitHub - criteo/autofaiss: Automatically create Faiss knn indices with the most optimal similarity search parameters.](https://github.com/criteo/autofaiss)
