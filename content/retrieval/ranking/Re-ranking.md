---
title: "Re-ranking"
tags: ["retrieval", "IR", "ranking", "rerank", "listwise", "RAG"]
aliases: ["Rerank", "Reranking", "Re-rank", "Re-ranking"]
---

# A) Re-ranking

Re-ranking은 [[Cascade Ranking System]]의 후반 단계에서 이미 줄어든 후보 집합을 다시 정렬하는 과정이다. [[BM25]], [[DPR]], [[SPLADE]] 같은 retrieval 단계가 “좋은 후보를 놓치지 않는 것”에 집중한다면, re-ranking은 보통 수십~수백 개 후보를 대상으로 **정확한 relevance, 다양성, 정책, 비즈니스 KPI** 를 함께 반영한다.

검색/추천 시스템에서는 ranking과 re-ranking을 구분해서 보는 편이 좋다. Ranking은 후보별 점수를 예측해 1차 정밀 순위를 만들고, re-ranking은 더 작은 리스트에서 item 간 관계나 후처리 제약을 반영한다.

| 단계 | 후보 수 | 주된 목표 | 대표 방식 |
|---|---:|---|---|
| Retrieval / Matching | 매우 큼 → 수천~수만 | Recall | [[Inverted Index]], [[HNSW]], multi-channel retrieval |
| Ranking | 수천 → 수백 | Relevance / CTR / CVR | feature-rich ranker, cross features |
| Re-ranking | 수백 → 최종 노출 | 리스트 품질 | cross-encoder, late interaction, LLM reranker, [[Maximal Marginal Relevance|MMR]] |

# B) 평가 단위

## B.1) Point-wise

Point-wise reranking은 각 `(query, document)` 또는 `(query, item)` pair를 독립적으로 점수화한다. Cross-encoder reranker가 대표적이다. Query와 document를 한 입력으로 넣기 때문에 token-level interaction을 직접 볼 수 있어 정확하지만, 후보 수만큼 모델 호출 또는 forward pass가 필요하다.

[[Large Scale Deployment of BERT Based Cross Encoder Model for Re-Ranking in Walmart Search Engine]]처럼 production에서는 token pre-computation, batching, payload compression, GPU serving 최적화가 중요해진다.

## B.2) Pair-wise

Pair-wise 방식은 두 후보 중 어느 쪽이 더 좋은지 비교한다. 학습 목적함수로는 자주 쓰이지만, 온라인 serving에서는 비교 조합이 많아지기 때문에 point-wise나 list-wise보다 덜 단순하다.

## B.3) List-wise

List-wise reranking은 후보 리스트 전체를 한 번에 보고 순서를 만든다. 다양성, 중복 제거, category balance, 광고/organic blending처럼 **아이템 간 관계** 가 중요한 경우에 자연스럽다.

LLM reranker는 list-wise prompt로 쓰기 쉽지만, 출력 포맷 안정성, 긴 context 비용, position bias를 조심해야 한다. RAG에서는 [[CalibRAG]]처럼 relevance가 아니라 decision correctness를 기준으로 rerank하는 변형도 있다.

# C) 대표 모델 계열

## C.1) Cross-encoder Reranker

Cross-encoder는 query와 document를 함께 인코딩하여 relevance score를 낸다. Dual encoder보다 느리지만, 두 입력 사이의 세밀한 interaction을 직접 모델링하므로 small candidate set에서는 강한 baseline이다.

실무에서는 보통:

1. Retrieval로 top-k 후보를 가져온다
2. Cross-encoder로 각 후보를 점수화한다
3. 점수와 기존 ranking feature, business rule을 합쳐 최종 순서를 만든다

## C.2) Late Interaction Reranker

[[ColBERT]] 계열은 query/document를 token embedding으로 표현하고 MaxSim 같은 late interaction으로 점수화한다. Cross-encoder보다 interaction은 제한적이지만, document representation을 미리 계산할 수 있어 serving 비용을 줄이기 쉽다. [[SPLATE]]처럼 sparse candidate generation과 ColBERT MaxSim re-ranking을 한 모델 출력에서 함께 쓰는 방식도 있다.

## C.3) LLM Reranker

LLM reranker는 복잡한 의도, 다단계 조건, 자연어 기준을 다루는 데 유용하다. 다만 production에서는 latency와 비용이 크고, list-wise prompt가 길어질수록 앞쪽 후보에 유리한 bias가 생길 수 있다. [[RAGAS]] 같은 RAG 평가에서는 reranking 품질을 context relevance뿐 아니라 answer quality와 함께 봐야 한다.

# D) Serving 관점

Re-ranking serving의 핵심은 **후보 수를 얼마나 줄인 뒤 비싼 모델을 태울 것인가** 다. Candidate budget이 너무 크면 latency가 터지고, 너무 작으면 retrieval 단계에서 놓친 후보를 회복할 수 없다.

실무 체크포인트:

- `top_k` 후보 수: cross-encoder는 보통 수십~수백 개 수준에서 현실적
- batching: GPU 활용률을 높이지만 tail latency를 키울 수 있음
- pre-computation: document token, embedding, static feature는 미리 계산
- score calibration: 여러 retrieval branch나 business score와 섞을 때 필요
- fallback: reranker 장애 시 기존 ranking score로 degrade 가능한 구조

## D.1) vLLM에서 Point-wise와 List-wise

LLM/vLLM 기반 reranking에서는 point-wise가 항상 더 빠르지 않다. 100개 후보를 point-wise로 보내면 입력은 짧아도 요청이 100개가 되어 API 호출, queue 대기, scheduling overhead가 커진다.

반대로 list-wise는 긴 prompt 하나를 보내기 때문에 prefill 비용은 크지만 요청 수가 적다. vLLM의 continuous batching과 chunked prefill은 긴 prompt가 시스템 전체를 오래 막지 않도록 해주므로, 작은 요청을 많이 보내는 point-wise보다 list-wise가 더 유리한 경우가 있다.

| 비교 항목 | Point-wise | List-wise |
|---|---|---|
| 요청 형태 | 후보마다 개별 scoring 요청 | 후보 리스트 전체를 한 요청으로 전달 |
| 장점 | 구현 단순, 점수 해석 쉬움, 병렬화 가능 | 리스트 간 관계 반영, 요청 overhead 작음 |
| 병목 | 요청 수, queue 대기, scheduling overhead | 긴 prefill, 출력 포맷 안정성 |
| 잘 맞는 경우 | cross-encoder score, calibrated relevance | diversity, LLM reranking, 최종 소수 후보 정렬 |

# E) 실무적 판단 기준

Re-ranking은 “더 강한 모델을 한 번 더 붙이는 단계”라기보다, 앞 단계와 다른 목표를 최적화하는 단계다. 단순 relevance만 더 올리고 싶다면 cross-encoder point-wise reranker가 좋고, 최종 화면의 품질을 다듬고 싶다면 list-wise reranking이나 [[Maximal Marginal Relevance|MMR]] 같은 다양성 후처리가 더 직접적이다.

RAG에서는 top document 하나의 relevance보다 답변 가능성과 calibration이 중요할 수 있으므로, [[Context Precision]] 같은 retrieval 지표와 최종 answer correctness를 함께 봐야 한다.

# F) References

- [[Large Scale Deployment of BERT Based Cross Encoder Model for Re-Ranking in Walmart Search Engine]]
- [[Cascade Ranking System]]
- [[CalibRAG]]
