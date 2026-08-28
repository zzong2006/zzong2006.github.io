---
title: "Embedding-based Retrieval"
tags: ["retrieval", "dense_retrieval", "embedding"]
aliases: ["EBR"]
---

# A) Embedding-Based Retrieval

Embedding-based Retrieval(EBR)은 query와 document/item을 vector로 표현한 뒤, vector similarity로 후보를 가져오는 retrieval 방식이다. lexical match가 약한 표현 차이를 넘어서 semantic recall을 넓히는 데 자주 사용한다.

# B) 기본 흐름

1. Query encoder가 query embedding을 만든다.
2. Document/item encoder가 corpus embedding을 만든다.
3. [[retrieval/indexing/ANN|ANN]] index에서 query embedding과 가까운 후보를 찾는다.
4. ranking 단계에서 lexical, behavioral, business feature와 함께 다시 정렬한다.

# C) 실무에서 볼 점

EBR은 recall을 넓히는 데 강하지만, embedding space가 모든 relevance를 보장하지는 않는다. 그래서 [[BM25]] 같은 lexical baseline, hard negative sampling, reranking, freshness, diversity를 함께 설계해야 한다.

# References
