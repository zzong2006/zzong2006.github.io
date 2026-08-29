---
title: "milvus"
tags:
  - vector_database
  - ANN
  - vector_search
aliases: [Milvus]
---

# A) Milvus

Milvus는 대규모 vector search를 위한 vector database다. 내부적으로 [[HNSW]], [[IVF]], quantization 계열 index를 선택해 사용할 수 있고, retrieval system에서는 [[faiss]] 같은 라이브러리보다 운영 기능이 더 필요한 경우 비교 대상이 된다.
