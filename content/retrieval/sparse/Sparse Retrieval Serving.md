---
tags: ["retrieval", "IR", "sparse_retrieval", "sparse_embedding", "search_engine"]
---

Sparse retrieval 모델([[BM25]], [[SPLADE]] 등)은 [[Inverted Index]] 위에서 동작하며, 기존 검색 엔진 인프라를 그대로 재활용할 수 있다. 이 노트에서는 SPLADE의 인퍼런스 흐름과 OpenSearch/Elasticsearch에서의 실무 적용을 다룬다.

# A) SPLADE 인퍼런스 흐름

## A.1) 오프라인 (인덱싱 단계)

문서를 BERT + MLM Head에 통과시켜 sparse vector를 만들고, 0이 아닌 항목을 inverted index에 저장한다.

```python
Document "스파게티 전문 레스토랑"
    → BERT + MLM Head
    → sparse vector: {스파게티: 2.1, 파스타: 1.3, 이탈리안: 0.9, 레스토랑: 1.8, 맛집: 0.7, ...}
    → inverted index에 저장:
        "스파게티" → [doc1: 2.1, ...]
        "파스타"   → [doc1: 1.3, ...]   ← term expansion으로 추가된 항목
        "맛집"     → [doc1: 0.7, ...]   ← term expansion
```

## A.2) 온라인 (검색 단계)

```python
Query "파스타 맛집"
    → BERT + MLM Head (또는 inference-free면 단순 BoW)
    → query sparse vector: {파스타: 1.0, 맛집: 1.2, 이탈리안: 0.3, ...}

# 1) 각 활성 토큰의 포스팅 리스트를 가져옴
"파스타"   → [doc1: 1.3, doc3: 2.1, doc7: 1.5]
"맛집"     → [doc1: 0.7, doc3: 1.0, doc12: 3.2]
"이탈리안" → [doc1: 0.9, doc3: 0.4]

# 2) 문서별로 query_weight × doc_weight 합산 (= dot product)
score(doc1) = (1.0 × 1.3) + (1.2 × 0.7) + (0.3 × 0.9) = 1.3 + 0.84 + 0.27 = 2.41
score(doc3) = (1.0 × 2.1) + (1.2 × 1.0) + (0.3 × 0.4) = 2.1 + 1.20 + 0.12 = 3.42
score(doc7) = (1.0 × 1.5)                               = 1.50
score(doc12)=                (1.2 × 3.2)                 = 3.84
```

포스팅 리스트에 없는 토큰은 가중치 0이므로 해당 항만 건너뛴다. 전체 vocab에 대해 계산하는 것이 아니라 **쿼리와 문서 모두에서 활성화된 토큰의 교집합** 만 계산하면 되므로 효율적이다.

## A.3) BM25와의 비교

| 단계             | BM25             | SPLADE                 |
| -------------- | ---------------- | ---------------------- |
| 토큰화            | 단순 tokenizer     | BERT tokenizer         |
| 가중치 계산         | TF-IDF 공식        | BERT + MLM Head        |
| Term Expansion | 없음               | 있음 (핵심 차별점)            |
| 저장 구조          | inverted index   | **동일한** inverted index |
| 검색 엔진          | ES/OpenSearch 기본 | ES/OpenSearch 위에서 동작   |

핵심은 SPLADE가 **기존 inverted index 인프라를 그대로 재활용** 한다는 점이다. Dense retrieval처럼 별도의 vector DB (Milvus, Pinecone 등)가 필요 없고, 이미 운영 중인 ES/OpenSearch 클러스터에서 바로 사용할 수 있다.

# B) OpenSearch에서의 사용

OpenSearch 2.11+부터 **neural sparse search** 를 네이티브로 지원한다.

## B.1) 인덱스 생성

`rank_features` 필드 타입으로 sparse vector를 저장한다.

```json
{
  "mappings": {
    "properties": {
      "text_sparse": {
        "type": "rank_features"
      }
    }
  }
}
```

`rank_features`는 Lucene의 `FeatureField`를 사용하며, 각 토큰-가중치 쌍을 **기존 inverted index 위에** 저장한다.

## B.2) 모델 등록 및 인덱싱

1. SPLADE 모델을 OpenSearch ML 노드에 배포 (또는 외부 서빙 후 connector로 연결)
2. `ingest pipeline`을 설정하면, 문서 삽입 시 자동으로 SPLADE 인퍼런스를 수행하여 `{"파스타": 1.3, "스파게티": 2.1, ...}` 형태로 저장

## B.3) 검색

`neural_sparse` 쿼리를 사용한다.

```json
{
  "query": {
    "neural_sparse": {
      "text_sparse": {
        "query_text": "파스타 맛집",
        "model_id": "<등록된 SPLADE 모델 ID>"
      }
    }
  }
}
```

내부적으로 OpenSearch가 쿼리를 SPLADE에 통과시키고, 나온 sparse vector의 각 활성 토큰을 `rank_features` 필드에 대해 매칭한다.

## B.4) Two-Phase 검색 (Inference-Free SPLADE 활용)

OpenSearch는 inference-free 모드도 지원한다:

1. **Phase 1**: 쿼리를 단순 tokenize (BoW) → inverted index로 빠르게 후보 문서 검색
2. **Phase 2**: 후보 문서에 대해 SPLADE 모델로 정밀 re-scoring

이 방식은 쿼리 시점에 BERT 인퍼런스가 불필요하므로 latency가 크게 줄어든다.

# C) Elasticsearch에서의 사용

ES 8.17+부터 Eland를 통해 커스텀 SPLADE 모델을 직접 업로드할 수 있게 되었다. ELSER(자체 sparse 모델) 사용법, 커스텀 모델 배포, `sparse_vector` 쿼리, Hybrid Search 등 자세한 내용은 [[SPLADE on Elasticsearch]] 참조.

# D) 실무적 고려사항

1. **인덱스 크기**: [[Active Dimensions|활성 차원]] 수가 많을수록 inverted index 크기가 커진다. SPLADE의 FLOPS regularizer 강도를 조절하여 sparsity와 성능 간 균형을 맞춰야 한다.
2. **인덱싱 비용**: 문서 인코딩에 BERT 인퍼런스가 필요하므로, 대규모 코퍼스 인덱싱 시 GPU 리소스와 시간을 고려해야 한다.
3. **Hybrid Retrieval**: SPLADE sparse vector와 dense vector를 결합하는 hybrid 검색이 일반적으로 단독 사용보다 우수한 성능을 보인다. OpenSearch와 ES 모두 hybrid 쿼리를 지원한다.

# E) References

- [OpenSearch Neural Sparse Search](https://opensearch.org/docs/latest/search-plugins/neural-sparse-search/)
- [Elasticsearch ELSER](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html)
- [Inference-Free SPLADE 논문 (Amazon OpenSearch)](https://arxiv.org/abs/2410.16083)
