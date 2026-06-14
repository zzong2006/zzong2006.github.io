---
title: "SPLADE on Elasticsearch"
tags: ["retrieval", "IR", "sparse_retrieval", "sparse_embedding", "search_engine", "elasticsearch"]
aliases: ["ELSER", "Elastic Learned Sparse Encoder"]
---

# A) 개요

[[Elasticsearch]]에서 [[SPLADE]] 기반 sparse retrieval을 사용하는 방법을 정리한다. 크게 두 가지 접근이 있다:

1. **ELSER** (Elastic Learned Sparse Encoder): Elastic이 SPLADE에서 영감 받아 자체 학습한 sparse 모델
2. **커스텀 SPLADE 모델 업로드**: Eland를 통해 HuggingFace의 SPLADE 모델을 ES에 직접 배포

ES 8.17+부터 커스텀 sparse vector 모델 업로드를 지원하면서, ELSER 외에도 `naver/splade-v3-distilbert`나 한국어 모델(`yjoonjang/splade-ko-v1`) 등을 직접 사용할 수 있게 되었다.

# B) ELSER vs 커스텀 SPLADE

| 항목 | ELSER | 커스텀 SPLADE |
|------|-------|--------------|
| 제공 방식 | ES 내장 (Platinum 라이선스) | Eland로 HF 모델 업로드 |
| 배포 | 원클릭 UI 배포 | `eland_import_hub_model` CLI |
| 성능 | 영어 out-of-domain에서 SPLADE 대비 우수 (Elastic 벤치마크 기준) | 도메인/언어 특화 파인튜닝 모델 사용 가능 |
| 한국어 | 미지원 | `splade-ko-v1` 등 사용 가능 |
| 필요 버전 | ES 8.11+ | ES 8.17+ (Eland 8.17.0+) |
| 필드 타입 | `sparse_vector` | `sparse_vector` |

둘 다 내부적으로 Lucene의 [[Inverted Index|inverted index]]를 그대로 활용하므로, dense vector retrieval 대비 수십 년간의 검색 엔진 최적화를 그대로 누릴 수 있다.

# C) 커스텀 SPLADE 모델 배포

## C.1) Eland 설치

```bash
pip install 'eland[pytorch]'
```

Eland 8.17.0 이상이 필요하다.

## C.2) 모델 업로드

`eland_import_hub_model` CLI로 HuggingFace 모델을 ES 클러스터에 업로드한다:

```bash
eland_import_hub_model \
  --url https://<ES_HOST>:9200 \
  --hub-model-id naver/splade-v3-distilbert \
  --task-type sparse_embedding \
  --es-model-id splade-v3
```

한국어 환경이라면:

```bash
eland_import_hub_model \
  --url https://<ES_HOST>:9200 \
  --hub-model-id yjoonjang/splade-ko-v1 \
  --task-type sparse_embedding \
  --es-model-id splade-ko-v1
```

**`--task-type sparse_embedding`** 이 핵심이다. Dense 모델은 `text_embedding`을 사용하지만, SPLADE 같은 sparse 모델은 `sparse_embedding`으로 지정해야 한다.

## C.3) 모델 배포

업로드 후 Kibana ML UI에서 배포하거나, API로 직접 배포한다:

```json
POST _ml/trained_models/splade-v3/deployment/_start
{
  "number_of_allocations": 1,
  "threads_per_allocation": 2
}
```

- **`number_of_allocations`**: 모델의 **독립적인 인스턴스 수** 이다. 각 allocation은 모델의 전체 사본을 메모리에 로드하며, 서로 다른 요청을 **병렬로** 처리한다. 즉 allocation 수 = 동시에 처리 가능한 inference 요청 수이다. 늘리면 throughput이 올라가지만 메모리 사용량도 비례하여 증가한다
- **`threads_per_allocation`**: 각 allocation이 **하나의 inference 요청을 처리할 때 사용하는 CPU 스레드 수** 이다. 늘리면 개별 요청의 latency가 줄어든다 (모델 내부 연산을 병렬화). 단, 수확체감이 있으므로 보통 2-4가 적절하다

정리하면: `number_of_allocations`은 **동시 처리량(throughput)** 을, `threads_per_allocation`은 **개별 요청 속도(latency)** 를 제어한다.

# D) 인덱스 설정

## D.1) 매핑

`sparse_vector` 필드 타입을 사용한다. 이전에는 `rank_features`로 불렸으나, ES 8.15+부터 `sparse_vector`로 통합되었다.

```json
PUT my-splade-index
{
  "mappings": {
    "properties": {
      "content": { "type": "text" },
      "content_embedding": { "type": "sparse_vector" }
    }
  }
}
```

## D.2) Ingest Pipeline

문서 색인 시 자동으로 sparse vector를 생성하는 inference processor를 설정한다:

```json
PUT _ingest/pipeline/splade-pipeline
{
  "processors": [
    {
      "inference": {
        "model_id": "splade-v3",
        "input_output": [
          {
            "input_field": "content",
            "output_field": "content_embedding"
          }
        ]
      }
    }
  ]
}
```

## D.3) 문서 색인

```json
POST my-splade-index/_doc?pipeline=splade-pipeline
{
  "content": "스파게티 전문 이탈리안 레스토랑"
}
```

SPLADE의 term expansion에 의해 `content_embedding`에는 원문에 없는 `"파스타"`, `"맛집"` 등의 확장 토큰도 가중치와 함께 저장된다:

```json
{
  "content_embedding": {
    "스파게티": 2.1,
    "파스타": 1.3,
    "이탈리안": 1.8,
    "레스토랑": 1.5,
    "맛집": 0.7,
    ...
  }
}
```

# E) 검색

## E.1) Sparse Vector Query

ES 8.15+에서 `text_expansion`과 `weighted_tokens` 쿼리가 deprecated되고 **`sparse_vector` 쿼리** 로 통합되었다.

### E.1.1) Inference ID 방식

ES가 쿼리를 모델에 통과시켜 실시간으로 sparse vector를 생성한 뒤 검색한다:

```json
GET my-splade-index/_search
{
  "query": {
    "sparse_vector": {
      "field": "content_embedding",
      "inference_id": "splade-v3",
      "query": "파스타 맛집 추천"
    }
  }
}
```

### E.1.2) Precomputed Query Vector 방식

Inference-Free SPLADE처럼 query가 BoW인 경우, 또는 외부에서 이미 sparse vector를 생성한 경우 직접 전달할 수 있다:

```json
GET my-splade-index/_search
{
  "query": {
    "sparse_vector": {
      "field": "content_embedding",
      "query_vector": {
        "파스타": 1.0,
        "맛집": 1.0,
        "추천": 0.8
      }
    }
  }
}
```

이 방식은 쿼리 시점에 모델 인퍼런스가 필요 없으므로 latency가 크게 줄어든다.

## E.2) Hybrid Search

### E.2.1) 왜 SPLADE + Dense인가

Hybrid Search의 핵심은 **서로 다른 강점을 가진 retriever를 결합** 하는 것이다. 결합 효과는 두 retriever가 얼마나 상호보완적인지에 달려 있다:

| 조합 | Retriever 1 | Retriever 2 | 상호보완성 |
|------|------------|------------|----------|
| BM25 + Dense | 키워드 매칭 | 의미 매칭 | 높음 |
| **SPLADE + Dense** | 확장된 키워드 매칭 | 의미 매칭 | **더 높음** |
| BM25 + SPLADE | 키워드 매칭 | 확장된 키워드 매칭 | **낮음** (많이 겹침) |

BM25 + SPLADE 조합은 효과가 제한적이다. SPLADE가 이미 BM25의 키워드 매칭 능력을 포함하면서 term expansion까지 수행하기 때문에, 두 retriever의 결과가 상당 부분 겹친다.

반면 **SPLADE + Dense** 는:
- **SPLADE**: inverted index 기반, 토큰 단위 매칭 + 확장 → 정확한 키워드가 있을 때 강함
- **Dense**: ANN 기반, 전체 문맥의 의미를 하나의 벡터로 압축 → 표현이 완전히 다른 동의어/패러프레이즈에 강함
- 내부 동작 원리가 근본적으로 다르므로 상호보완 효과가 크다

[[SPLADE]] 노트의 실무적 시사점에서도 SPLADE + KURE-v1 (Dense) 의 Hybrid RRF가 **0.762** 로, BM25 + KURE-v1의 **0.721** 보다 약 4점 높았다.

### E.2.2) ES에서의 구현 (SPLADE + Dense)

ES에서는 [[Reciprocal Rank Fusion|RRF]]로 여러 retriever를 결합한다. SPLADE(sparse)와 Dense 모델을 함께 사용하려면, 인덱스에 두 종류의 임베딩 필드가 모두 필요하다:

```json
PUT my-hybrid-index
{
  "mappings": {
    "properties": {
      "content": { "type": "text" },
      "content_sparse": { "type": "sparse_vector" },
      "content_dense": {
        "type": "dense_vector",
        "dims": 768,
        "index": true,
        "similarity": "cosine"
      }
    }
  }
}
```

검색 시 RRF로 결합한다:

```json
GET my-hybrid-index/_search
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {
          "standard": {
            "query": {
              "sparse_vector": {
                "field": "content_sparse",
                "inference_id": "splade-v3",
                "query": "파스타 맛집"
              }
            }
          }
        },
        {
          "knn": {
            "field": "content_dense",
            "query_vector_builder": {
              "text_embedding": {
                "model_id": "dense-model",
                "model_text": "파스타 맛집"
              }
            },
            "k": 100,
            "num_candidates": 200
          }
        }
      ]
    }
  }
}
```

- **`sparse_vector` query**: SPLADE 모델(`splade-v3`)이 쿼리를 sparse vector로 변환 → inverted index에서 토큰 매칭으로 검색
- **`knn` query**: Dense 모델(`dense-model`)이 쿼리를 고정 길이 dense vector(e.g. 768차원)로 변환 → ANN(Approximate Nearest Neighbors)으로 벡터 유사도 검색
- **`rrf`**: 두 retriever의 결과를 점수가 아닌 **순위(rank) 기반** 으로 결합. 스케일이 다른 점수를 직접 비교하지 않아도 되는 것이 장점이다

## E.3) Semantic Text 필드 (간소화)

ES 8.15+에서는 `semantic_text` 필드 타입을 사용하면 매핑에 inference endpoint를 직접 연결할 수 있다. 별도의 ingest pipeline 없이 색인과 검색이 자동으로 처리된다:

```json
PUT my-simple-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "semantic_text",
        "inference_id": "splade-v3"
      }
    }
  }
}
```

# F) 인덱스 크기 추정

## F.1) 공간 복잡도

SPLADE inverted index의 총 크기는 **O(N × D_avg)** 이다:

- N: 문서 수
- D_avg: 문서당 평균 [[Active Dimensions|활성 차원]] 수
- M (vocab size)이 아닌 D_avg에 비례하는 이유: SPLADE 출력은 sparse vector이므로 대부분의 차원이 0이고, 0인 차원은 posting list에 저장하지 않는다

각 posting list 엔트리는 `(doc_id, weight)` 쌍이다:

- **doc_id**: Lucene이 delta encoding + PFOR 블록 압축 적용 → ~1-2 bytes
- **weight**: float 또는 양자화 저장 → ~2-4 bytes
- **엔트리당 약 4-6 bytes** (Lucene 압축 후, 중간값 ~5 bytes로 추정)

## F.2) 계산 예시

N=1억, D_avg=200(BM25 기준)일 때:

```
총 엔트리 수 = N × D_avg = 1억 × 200 = 200억 개
인덱스 크기  = 200억 × 5 bytes/entry = 1,000억 bytes ≈ 100 GB
```

다만 BM25은 term frequency(작은 정수)만 저장하므로 엔트리당 ~3-4 bytes로 더 작을 수 있고, SPLADE는 float weight를 저장해서 ~5-6 bytes로 더 클 수 있다. 아래 표에서는 동일한 5 bytes/entry로 단순 비교한 것이다.

## F.3) D_avg 별 인덱스 크기 (N=1억 문서 기준)

| 모델/설정              | D_avg   | 총 엔트리 수 | 추정 인덱스 크기    | BM25 대비 |
| ------------------ | ------- | ------- | ------------ | ------- |
| BM25 (참고)          | ~200    | 200억    | **~100 GB**  | 1x      |
| 강한 정규화 SPLADE      | ~300    | 300억    | **~150 GB**  | 1.5x    |
| `splade-ko-v1`     | ~650    | 650억    | **~325 GB**  | 3.3x    |
| `gte-multilingual` | ~2,700  | 2,700억  | **~1.35 TB** | 13.5x   |
| 약한 정규화             | ~19,000 | 1.9조    | **~9.5 TB**  | 비현실적    |

## F.4) 문서 수별 인덱스 크기 (D_avg=650 기준)

| 문서 수 (N) | 총 엔트리  | 추정 인덱스 크기 |     |
| -------- | ------ | --------- | --- |
| 100만     | 6.5억   | ~3.3 GB   |     |
| 1,000만   | 65억    | ~33 GB    |     |
| 1억       | 650억   | ~325 GB   |     |
| 10억      | 6,500억 | ~3.25 TB  |     |

## F.5) FLOPS Regularizer와 인덱스 크기의 관계

[[SPLADE]] 노트의 FLOPS 정규화($\ell_{\text{FLOPS}} = \sum_{j \in V} a_j^2$)는 사실상 **posting list 길이의 제곱합을 최소화** 하는 것과 같다:

- term $j$의 평균 활성화 $a_j$ ∝ term $j$의 posting list 길이
- $a_j^2$으로 페널티 → 긴 posting list(= 불용어 등)를 제곱으로 강하게 억제
- $\lambda_d$ (문서 정규화 강도)를 높이면 D_avg 감소 → 인덱스 축소, 하지만 검색 성능도 하락

따라서 **$\lambda_d$ 튜닝 = 인덱스 크기와 검색 성능 간의 trade-off** 를 조절하는 것이다.

## F.6) 참고: Term Dictionary

위 추정은 posting list 크기만 고려한 것이다. Term dictionary(vocab의 각 term 문자열 저장)는 M에 비례하지만 N과 무관하므로, 대규모 코퍼스에서는 posting list 대비 무시할 수 있는 수준이다 (BERT vocab M=30,522 → term dictionary ~수 MB).

# G) 실무적 고려사항

1. **인덱스 크기 관리**: D_avg에 따라 BM25 대비 2-10배 이상 커질 수 있다. FLOPS regularizer 강도($\lambda_d$)로 D_avg를 조절하거나, weight 양자화(float16/int8)로 엔트리 크기를 줄이는 방법을 고려한다
2. **ML 노드 리소스**: ES에서 SPLADE 모델을 배포하려면 ML 노드에 충분한 메모리가 필요하다. `number_of_allocations`와 `threads_per_allocation`로 리소스를 조절한다
3. **Inference-Free SPLADE 활용**: 쿼리 latency가 중요한 경우, document 쪽만 SPLADE로 확장하고 query는 BoW로 처리하는 inference-free 방식을 고려한다. 이 경우 `query_vector`에 토큰을 직접 전달하면 된다
4. **ELSER의 zero-shot 강점**: 도메인별 파인튜닝 없이 빠르게 시작하려면 ELSER가 유리하다. 다만 영어 외 언어에서는 커스텀 모델이 필수다
5. **버전 호환성**: `sparse_vector` 쿼리는 ES 8.15+, 커스텀 모델 업로드는 ES 8.17+ 필요
6. **shard 분산**: 1억 문서 기준 인덱스가 수백 GB에 달하므로, ES 클러스터의 shard 수와 노드 수를 인덱스 크기에 맞게 설계해야 한다

# H) OpenSearch와의 비교

OpenSearch에서의 SPLADE 사용법은 [[Sparse Retrieval Serving]] 노트를 참조. 주요 차이점:

| 항목           | Elasticsearch                | OpenSearch                  |
| ------------ | ---------------------------- | --------------------------- |
| 필드 타입        | `sparse_vector`              | `rank_features`             |
| 쿼리           | `sparse_vector` query        | `neural_sparse` query       |
| 자체 모델        | ELSER                        | opensearch-neural-sparse 모델 |
| 모델 업로드       | Eland CLI                    | ML Commons Plugin           |
| Two-Phase 검색 | 미지원 (precomputed vector로 대체) | 네이티브 지원                     |

# I) References

- [Sparse Embeddings - Elasticsearch Labs](https://www.elastic.co/search-labs/blog/sparse-vector-embedding)
- [ELSER Introduction - Elasticsearch Labs](https://www.elastic.co/search-labs/blog/introducing-elastic-learned-sparse-encoder-elser)
- [ELSER Retrieval Performance](https://www.elastic.co/search-labs/blog/elastic-learned-sparse-encoder-elser-retrieval-performance)
- [Sparse Vector Query Reference](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-sparse-vector-query)
- [Dense and Sparse Ingest Pipelines Tutorial](https://www.elastic.co/docs/solutions/search/vector/dense-versus-sparse-ingest-pipelines)
- [Semantic Search with ELSER](https://www.elastic.co/docs/solutions/search/semantic-search/semantic-search-elser-ingest-pipelines)
- [Eland GitHub](https://github.com/elastic/eland)
- [Hybrid Search with Elasticsearch (Blog)](https://ufarooqi.com/blog/hybrid-search-with-elasticsearch/)
