---
title: "Inverted Index"
tags:
  - retrieval
  - IR
  - sparse_retrieval
  - search_engine
  - data_structure
aliases: [역색인, inverted index, 역인덱스, posting list]
---

블로그 글 네 개가 있고, 검색창에 `Quick Foxes` 를 쳤다고 하자.

```text
doc1  The Quick Brown Fox
doc2  Foxes jumping over dogs
doc3  A quick lunch near the park
doc4  Quick tips for a quick breakfast
```

글이 넷뿐이면 하나씩 열어 봐도 된다. 글이 1억 개라면 매번 다 열어 볼 수 없다. 그래서 검색 엔진은 글을 넣을 때 **단어마다 그 단어가 나온 글 목록**을 미리 만들어 두고, 검색할 때는 그 목록만 꺼내 본다. 이 목록이 역색인(inverted index)이다.

# A) 역색인 한눈에 보기

- **구조**: 단어(term)마다 그 단어가 나온 문서 ID 목록(posting list)을 저장한 구조로, 책 뒤의 찾아보기와 같은 모양이다.
- **검색**: 검색어의 term 마다 posting list 를 꺼내 OR 면 합집합, AND 면 교집합을 구하므로 전체 문서를 훑지 않는다.
- **쓰임**: Lucene·Elasticsearch 의 키워드 검색과 SPLADE 같은 learned sparse retrieval 이 모두 이 구조 위에서 동작한다.

# B) 문서 → 단어에서 단어 → 문서로

**보통 문서는 문서 → 단어 방향으로 적혀 있다.** 글을 열면 그 안의 단어가 보인다.

```text
doc1 → quick, brown, fox
doc2 → fox, jump, over, dog
doc3 → quick, lunch, near, park
doc4 → quick, tip, quick, breakfast
```

이 모양으로는 `fox` 가 든 글을 찾으려면 네 줄을 전부 읽어야 한다. 방향을 뒤집어 단어 → 문서로 저장하면 `fox` 줄 하나만 읽으면 된다.

```text
breakfast → doc4
brown     → doc1
dog       → doc2
fox       → doc1, doc2
jump      → doc2
lunch     → doc3
near      → doc3
over      → doc2
park      → doc3
quick     → doc1, doc3, doc4
tip       → doc4
```

방향을 뒤집었다(invert)고 해서 inverted index, 역색인이라 부른다. 책 뒤의 찾아보기가 정확히 이 모양이다.

- 왼쪽 단어를 term 이라 부른다.
	- 원문 단어 그대로가 아니라 검색하기 좋게 다듬은 단어다 (`Foxes` 가 `fox` 가 되고 `The` 는 빠졌다).
	- 다듬는 과정(analyzer)은 [[Elasticsearch 검색 과정]] 에서 다룬다.
- 오른쪽 문서 목록을 posting list 라 부른다.
- term 들을 정렬해 모아 둔 사전을 term dictionary 라 부른다.

# C) posting list 에 담기는 정보

**posting list 에는 문서 ID 말고도 두 가지가 더 붙는다.**

- 그 문서에서 term 이 몇 번 나왔는지 (term frequency, TF): doc4 의 `quick` 은 2 번이다.
	- 검색 결과에 점수를 매길 때 쓴다 ([[BM25]]).
- term 이 문서의 몇 번째 단어인지 (position): doc1 에서 `brown` 은 `quick` 바로 다음 자리다.
	- `"quick brown"` 처럼 붙어 있는 구절을 찾는 phrase 검색에 쓴다.

실제로는 term dictionary 를 [[Finite State Transducer|FST]] 로 압축하고, posting list 의 문서 ID 도 정렬해서 압축해 둔다. 그래서 수억 문서의 역색인도 디스크와 메모리에 들어간다.

**역색인은 문서를 찾는 목록이지 원문을 담는 곳이 아니다.**

- 원문은 따로 저장된다. Elasticsearch 에서는 `_source` 필드다.
- 검색 결과로 원문을 돌려줄 때는 역색인으로 문서 ID 를 찾은 뒤 원문 저장소에서 꺼낸다.

# D) posting list 합집합과 교집합

검색어 `Quick Foxes` 가 `quick`, `fox` 두 term 이 되면, 두 term 의 posting list 를 꺼낸다.

```text
quick → doc1, doc3, doc4
fox   → doc1, doc2
```

- OR (합집합): doc1, doc2, doc3, doc4
	- 단어 하나라도 들어 있으면 결과에 넣는다.
- AND (교집합): doc1
	- 단어가 전부 들어 있는 문서만 남는다.

**posting list 는 문서 ID 순으로 정렬돼 있어서 합치는 데 한 번만 훑으면 된다.** 두 목록의 맨 앞을 비교하며 작은 쪽을 한 칸씩 넘기면, 병합 정렬의 병합 단계처럼 합집합과 교집합이 동시에 나온다.

실제로는 posting list 에 건너뛰기 정보(skip data)가 붙어 있어서, 교집합을 구할 때 한쪽에 없는 구간은 통째로 건너뛴다.

걸린 문서의 순서는 TF 와 문서 길이, 단어가 얼마나 드문지로 매긴 점수가 정한다 ([[BM25]]).

# E) 역색인을 쓰는 곳

**[[Lucene]] 과 Elasticsearch 의 키워드 검색이 역색인 위에서 동작한다.**

- Lucene 은 역색인을 한 번 쓰면 안 바뀌는 작은 묶음([[Lucene Segment|segment]])으로 쌓는다.
- Elasticsearch 는 index 를 shard 로 나누고, shard 마다 Lucene 역색인을 따로 둔다 ([[Elasticsearch 검색 과정]]).

**[[SPLADE]] 같은 learned sparse retrieval 도 같은 역색인을 쓴다.**

- SPLADE 는 문서를 단어 사전 크기의 sparse vector 로 바꾼다.
- 0 이 아닌 차원(단어)과 그 가중치만 posting list 에 넣으면 기존 검색 엔진을 그대로 쓸 수 있다.
	- dense retrieval 처럼 별도 vector DB 를 둘 필요가 없다.

**[[faiss]] 의 `IndexIVFFlat`, `IndexIVFPQ` 도 이름처럼 inverted file 구조를 쓴다.**

- 단어 대신 클러스터 중심(centroid)이 key 이고, 그 클러스터에 속한 벡터가 posting list 다.

반대로 dense vector 검색(kNN)은 역색인이 아니라 HNSW 그래프 같은 별도 구조를 쓴다.

# F) References

- [Apache Lucene 10.3.0 - org.apache.lucene.index package summary](https://lucene.apache.org/core/10_3_0/core/org/apache/lucene/index/package-summary.html)
- [Apache Lucene - Index File Formats](https://lucene.apache.org/core/3_6_2/fileformats.html)
- [Elasticsearch Docs - index_options](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/index-options)
