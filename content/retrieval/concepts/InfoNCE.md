---
tags: ["loss_function", "contrastive_learning", "retrieval"]
aliases: ["InfoNCE", "Info-NCE", "Noise Contrastive Estimation"]
---

# A) InfoNCE (Information Noise Contrastive Estimation) ?

**Batch 내 모든 negative 대비 positive의 확률을 최대화**하는 contrastive loss.

# B) 수식

$$\mathcal{L}_{\text{InfoNCE}} = -\log \frac{\exp(\text{sim}(q, k^+) / \tau)}{\sum_{i=0}^{K} \exp(\text{sim}(q, k_i) / \tau)}$$

- $q$: query (anchor)
- $k^+$: positive key
- $k_i$: batch 내 모든 key (positive 포함)
- $\tau$: temperature (보통 0.07~0.1)
- $\text{sim}(\cdot, \cdot)$: similarity function (보통 cosine)

**의미**: "positive가 batch 내 모든 샘플 중에서 가장 유사할 확률을 최대화"

# C) 직관적 이해

Softmax cross-entropy와 동일한 형태:

```python
Query: "아이폰 케이스"

Batch items:
  [0] 아이폰 케이스 (positive) → sim = 0.9 → exp(0.9/0.1) = 8103
  [1] 갤럭시 케이스 (negative) → sim = 0.6 → exp(0.6/0.1) = 403
  [2] 충전기 (negative)        → sim = 0.3 → exp(0.3/0.1) = 20
  [3] 신발 (negative)          → sim = 0.1 → exp(0.1/0.1) = 2.7

L = -log(8103 / (8103 + 403 + 20 + 2.7))
  = -log(0.95)
  = 0.05  (낮은 loss = 좋음)
```

# D) Temperature ($\tau$)의 역할

| $\tau$ | 효과 | 학습 특성 |
|--------|------|----------|
| 낮음 (0.01) | similarity 차이 증폭 | hard negative에 집중, 불안정 |
| 높음 (1.0) | similarity 차이 완화 | 모든 negative 균등 취급, 학습 느림 |
| **적당 (0.07~0.1)** | **균형** | **일반적 선택** |

# E) Triplet Loss와의 비교

| 구분 | [[Triplet Loss]] | InfoNCE |
|------|-----------------|---------|
| **Negative 수** | 1개 | batch size - 1개 |
| **수식 형태** | hinge loss | softmax |
| **비교 방식** | pair-wise (anchor-pos vs anchor-neg) | 전체 대비 확률 |
| **장점** | 직관적, 해석 쉬움 | 더 많은 negative 활용 |
| **단점** | hard negative mining 필요 | 큰 batch size 필요 |

**핵심 차이**:
- Triplet: "positive가 negative보다 가까우면 됨" (상대적 순서)
- InfoNCE: "positive가 모든 것 중 가장 가까울 확률" (전체 분포)

# F) In-batch Negative

InfoNCE의 큰 장점: **별도 negative sampling 불필요**

```python
Batch of (query, item) pairs:
  (q1, i1), (q2, i2), (q3, i3), (q4, i4)

q1의 학습:
  positive: i1
  negative: i2, i3, i4  ← 같은 batch의 다른 item들

q2의 학습:
  positive: i2
  negative: i1, i3, i4
```

Batch size = N이면 자동으로 N-1개의 negative 확보.

# G) 대표적 활용

1. **SimCLR**: self-supervised image representation
2. **CLIP**: image-text contrastive learning
3. **Dense Retrieval**: [[papers/advertisement/UniERF - A Uniform Embedding-based Retrieval Framework for E-Commerce Search|UniERF]] 등 two-tower 모델
4. **Sentence Embedding**: SimCSE, E5

# H) 변형들

- **NT-Xent** (Normalized Temperature-scaled Cross Entropy): SimCLR에서 사용, InfoNCE와 거의 동일
- **SupCon**: supervised contrastive loss, 같은 클래스 샘플을 모두 positive로 취급
- **Hard Negative Mining**: batch 외에 추가로 어려운 negative 포함

# I) References

- Representation Learning with Contrastive Predictive Coding (Oord et al., 2018)
- A Simple Framework for Contrastive Learning of Visual Representations (SimCLR, 2020)
