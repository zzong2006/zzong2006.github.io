---
title: "Active Dimensions"
tags: ["retrieval", "IR", "sparse_retrieval", "sparse_embedding"]
aliases: ["활성 차원"]
---

# A) Active Dimensions란

Active Dimensions(활성 차원)은 sparse embedding 벡터에서 **0이 아닌 값을 가진 차원의 수** 를 말한다. [[SPLADE]] 같은 learned sparse retrieval 모델은 vocabulary 크기(e.g. 30,522 또는 50,000차원)의 벡터를 출력하는데, 대부분의 차원은 0이고 일부만 값을 가진다.

예를 들어 50,000차원 벡터에서:

```python
[0, 0, 0, 1.2, 0, 0, 0.8, 0, ..., 0, 3.1, 0]
            ↑               ↑              ↑
         활성 차원         활성 차원       활성 차원
```

이 경우 active dimensions = 3이다.

Query와 Document 각각에 대해 별도로 측정하며, 보통 Document가 Query보다 활성 차원이 더 많다 (문서가 더 많은 정보를 담고 있으므로).

# B) 왜 중요한가

Active dimensions 수는 **검색 성능과 효율성 모두** 에 직접적으로 영향을 미친다. Sparse retrieval은 inverted index를 사용하는데, 각 활성 차원은 해당 vocab 토큰의 posting list에 엔트리를 추가한다. 따라서 활성 차원이 많을수록 저장해야 할 posting이 늘어나고, 검색 시 순회해야 할 엔트리도 많아진다.

| Active Dimensions       | 의미                               | 문제                                           |
| ----------------------- | -------------------------------- | -------------------------------------------- |
| **0**                   | 모든 차원이 0 (영벡터)                   | Representation collapse—검색 완전 불가           |
| **너무 적음** (e.g. < 30)   | 원본 토큰 일부만 활성화, term expansion 미미 | 의미적 확장 부족, BM25와 다를 바 없음                     |
| **적당함** (e.g. 50~700)   | 핵심 단어 + 의미적으로 확장된 단어 활성화         | 이상적—효율적이고 정확함                              |
| **너무 많음** (e.g. 1,000+) | 대부분의 vocab 토큰이 활성화               | Dense에 가까워짐, inverted index 이점 상실, 인덱싱 비용 급증 |

# C) 실제 사례

[[SPLADE]] 한국어 백본 비교 실험에서 활성 차원 차이가 극명하게 나타났다:

| 모델 | Query 활성 차원 | Corpus 활성 차원 | 상태 |
|------|---------------|----------------|------|
| `skt/A.X-Encoder-base` | 84 | 650 | 적당한 sparsity |
| `klue/roberta-base` | 28 | 188 | 다소 보수적 |
| `gte-multilingual-base` | 1,115 | 2,728 | 지나치게 많음 (dense에 근접) |
| `jhu-clsp/mmBERT-base` | **0** | **0** | 완전 붕괴 |

`gte-multilingual-base`의 경우 250k vocab 중 2,728개가 활성화되어 sparse의 이점이 크게 줄어들었고, `mmBERT-base`는 활성 차원이 0으로 떨어지는 representation collapse가 발생했다.

# D) 제어 방법

Active dimensions 수는 주로 **FLOPS Regularization** 으로 제어한다:

$$\ell_{\text{FLOPS}} = \sum_{j \in V} a_j^2$$

여기서 $a_j$는 배치 내에서 vocab 토큰 $j$의 평균 활성화 값이다. 이 정규화 항의 가중치($\lambda_q$, $\lambda_d$)를 키우면 활성 차원이 줄어들고, 줄이면 늘어난다.

- **Query regularizer** ($\lambda_q$): 보통 더 강하게 설정 → query를 더 sparse하게 만들어 검색 latency 감소
- **Document regularizer** ($\lambda_d$): 보통 더 약하게 설정 → document는 더 많은 term을 포함하도록 허용

학습 시 활성 차원 수를 지속적으로 모니터링하여, 갑작스러운 감소(collapse 징후)나 과도한 증가(효율성 저하)를 조기에 감지하는 것이 중요하다.

# E) References

- [Vocabulary is the most important element of Sparse Retrieval - yjoonjang](https://huggingface.co/blog/yjoonjang/vocabulary-is-the-most-important-element-in-splade)
