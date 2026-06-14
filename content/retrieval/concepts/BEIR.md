---
tags: ["retrieval", "IR", "benchmark"]
aliases: ["BEIR Benchmark"]
---

# A) BEIR

BEIR는 zero-shot retrieval 평가를 위해 자주 쓰이는 benchmark suite다. 단일 데이터셋 성능만 보는 대신 여러 도메인의 retrieval task를 묶어 평가하므로, [[DPR]], [[SPLADE]], [[ColBERT]], [[MUVERA]] 같은 retriever가 out-of-domain에서도 잘 일반화되는지 확인할 때 유용하다.

# B) 볼 때 주의할 점

BEIR 점수는 모델의 평균적인 일반화 능력을 보는 데 좋지만, 실제 서비스에서는 query 분포, corpus freshness, latency budget, [[Cascade Ranking System]] 안에서의 위치가 함께 성능을 결정한다. 따라서 BEIR 성능이 높아도 production에서는 [[BM25]]나 domain-specific dense model과 hybrid로 비교하는 편이 안전하다.

# C) References

- [BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models](https://arxiv.org/abs/2104.08663)
