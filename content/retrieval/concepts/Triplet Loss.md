---
title: "Triplet Loss"
tags:
  - loss_function
  - metric_learning
  - retrieval
aliases: [Triplet Loss, triplet loss]
---

# A) Triplet Loss ?

**Anchor, Positive, Negative 세 샘플 간의 상대적 거리를 학습**하는 metric learning loss.

# B) 수식

$$\mathcal{L}_{\text{triplet}} = \max(0, d(a, p) - d(a, n) + m)$$

- $a$: anchor (기준 샘플)
- $p$: positive (anchor와 같은 클래스)
- $n$: negative (anchor와 다른 클래스)
- $d(\cdot, \cdot)$: 거리 함수 (보통 L2 또는 cosine distance)
- $m$: margin (양수)

**의미**: "anchor-positive 거리가 anchor-negative 거리보다 margin $m$ 이상 가까워야 함"

# C) 직관적 이해

```python
학습 전:   a ------- p
                \
                 n

학습 후:   a -- p
                         \
                          n
```

Positive는 가깝게, Negative는 멀리 밀어냄.

# D) InfoNCE와의 비교

| 구분 | Triplet Loss | [[InfoNCE]] |
|------|-------------|-------------|
| **Negative 수** | 1개 (쌍으로 비교) | batch 내 모든 샘플 (N-1개) |
| **수식 형태** | hinge loss | softmax cross-entropy |
| **비교 방식** | 상대적 거리 차이 | 전체 대비 확률 |
| **학습 효율** | Hard negative mining 필요 | Batch 크게 하면 자연스럽게 해결 |
| **장점** | 직관적, 해석 쉬움 | 더 많은 negative 활용, 안정적 |
| **단점** | negative 선택에 민감 | 큰 batch size 필요 |

**예시: Query-Item Retrieval**

Triplet Loss:
```python
L = max(0, sim(q, item-) - sim(q, item+) + m)
```
→ "클릭한 item이 안 클릭한 item보다 가까워야 해"

InfoNCE:
```python
L = -log( exp(sim(q, item+)) / Σ exp(sim(q, item_i)) )
```
→ "클릭한 item이 batch 내 모든 item 중 가장 가까울 확률을 최대화"

# E) Hard Negative Mining

Triplet Loss는 **어떤 negative를 쓰느냐에 따라 성능 차이가 큼**:

| Negative 유형 | 설명 | 학습 효과 |
|--------------|------|----------|
| Easy negative | anchor와 이미 멀리 떨어진 샘플 | gradient ≈ 0 (학습 안 됨) |
| **Hard negative** | anchor와 가깝지만 다른 클래스 | gradient 큼 (효과적 학습) |
| Semi-hard negative | margin 내에 있는 샘플 | 안정적 학습 |

```python
margin = 0.3 일 때:

Easy:      a ------ p         n (멀리)
           loss = max(0, 0.1 - 0.9 + 0.3) = 0 ❌

Hard:      a -- p -- n (가까이)
           loss = max(0, 0.1 - 0.2 + 0.3) = 0.2 ✓
```

# F) 실무에서의 활용

1. **Face Recognition**: FaceNet에서 처음 제안
2. **Image Retrieval**: 유사 이미지 검색
3. **E-commerce Search**: [[papers/advertisement/UniERF - A Uniform Embedding-based Retrieval Framework for E-Commerce Search|UniERF]] 등

# G) 변형들

- **Batch Hard**: batch 내에서 가장 어려운 triplet 선택
- **Batch All**: 모든 valid triplet의 평균
- **Lifted Structured Loss**: batch 내 모든 positive/negative 쌍 활용
- **N-pair Loss**: 여러 negative 동시 사용 (InfoNCE와 유사)

# H) References

- FaceNet: A Unified Embedding for Face Recognition and Clustering (2015)
