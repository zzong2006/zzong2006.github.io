---
tags: ["retrieval", "e-commerce", "multimodal", "dense_retrieval", "Amazon", "paper_review"]
---

[2501.07365](https://arxiv.org/pdf/2501.07365)

# A) 🎯 연구 동기 및 문제 정의

**기존 문제점:**

- 이커머스 검색에서 Semantic Retrieval은 주로 **텍스트 기반**으로만 연구됨
- 상품 이미지는 구매 결정에 중요한 요소인데, dense retrieval에서의 영향이 **체계적으로 연구되지 않음**
- 기존 multimodal 연구들의 한계:
	- MaxSim 같은 score function은 **대규모 인덱스에서 확장성 문제**
	- 독립적으로 학습된 text encoder와 visual encoder 간 **misalignment 이슈**

**연구 목표:**

- Text-only vs Multimodal representation 비교
- Cosine similarity 기반의 **확장 가능한(scalable)** 솔루션 제시
- 수백만 개 상품 인덱스에서의 실제 성능 검증

---

# B) 🏗️ 모델 아키텍처

## B.1) Text-Only Baseline

- Query encoder + Product text encoder (2-tower)
- NT-Xent loss로 학습

## B.2) 4-Tower Multimodal Model

```python
Query Tower → Query Embedding
Product Text Tower → Text Embedding  ─┬→ Fusion → Product Embedding
Product Image Tower → Image Embedding ─┘
(+ Optional: Query Image Tower)
```

- Text와 Image를 **별도 encoder**로 인코딩
- Fusion module로 결합 (Concatenation, MLP 등)
- Pre-trained visual encoder 활용 가능

## B.3) 3-Tower Multimodal Model

```python
Query Tower → Query Embedding
Product Text Tower → Text Embedding  ─┬→ Fusion → Product Embedding
Product Image Tower → Image Embedding ─┘
```

- 4-tower에서 Query Image Tower 제거
- **더 경량화**된 구조
- Fine-tuning으로 4-tower에 근접한 성능 달성 가능

---

# C) 🔬 실험 설정

**데이터셋:**

- 이커머스 데이터셋 (수백만 개 상품)
- Query-Product positive pair로 학습
- In-batch negatives + 추가 hard negatives (query당 3개)

**평가 지표:**

- **Purchase Recall**: 실제 구매로 이어진 상품의 recall
- **Relevance Accuracy**: 검색 관련성 정확도
- Exclusive match 분석 (Multimodal에서만 검색되는 상품)

**인프라:**

- Cosine similarity 기반 scoring (ANN indexer 호환)
- 대규모 인덱스(수백만 상품)에서 효율적 검색

---

# D) 📊 주요 결과

## D.1) 핵심 발견

1. **Multimodal > Text-only**
	- Purchase recall 또는 Relevance accuracy에서 개선

2. **4-tower 모델의 장점**
	- Pre-trained visual encoder 통합 시 relevance score **유의미하게 향상**

3. **3-tower 모델의 실용성**
	- Fine-tuning으로 4-tower에 **근접한 성능** 달성
	- 더 적은 파라미터로 효율적

4. **Exclusive Match 분석**
	- Multimodal 모델에서만 검색되는 상품들 존재
	- → 이미지 정보가 **텍스트로 표현 못하는 정보**를 보완

---

# E) 💡 Contribution 정리

1. Text-only, 3-tower, 4-tower 모델을 **체계적으로 비교** → Language-Visual alignment 이해
2. Pre-trained visual encoder 통합이 4-tower에서 **큰 기여**
3. 3-tower도 fine-tuning으로 4-tower에 **근접 가능** (약간의 성능 저하)
4. **대규모 인덱스(수백만)** + **Cosine similarity**로 실용적 검색 가능
5. Purchase recall과 relevance accuracy 두 지표 모두에서 효과 검증

# F) 임베딩 차원

논문에서 **구체적인 차원 수치는 명시하지 않았습니다.** 다만 모델 구조 정보는 나와있어요:

- **BiBERT (Text-only baseline)**: 2-layer Transformer, 4 attention heads
- CLIP 모델의 text/image encoder 사용
- 최종 embedding dimension은 "N"으로만 표기

CLIP 기반이니까 아마 **512 또는 768차원**일 것으로 추정되는데, 정확한 수치는 논문 본문을 봐야 할 것 같습니다.

---

# G) Text-only Vs Multimodal 효과 비교

## G.1) 주요 수치

|모델|Relevance (Exact+Substitute)|Purchase Recall|
|---|---|---|
|**CLIP alone**|71.9%|46% (낮음)|
|**BiBERT (Text-only)**|baseline|baseline|
|**4-tower Multimodal**|개선|개선|

## G.2) Exclusive Match 분석 (Multimodal만 검색한 상품)

- Query당 **60~80개**의 exclusive matches
- Ground-truth 대비 **10~20% recall** 차지
- Precision도 높음: **~50% Exact match, ~30% Substitute match**

---

# H) 핵심 발견

1. **CLIP만 쓰면** relevance는 높은데 purchase recall이 낮음 (46%)
	- → 이미지 유사성 ≠ 구매 의도
2. **Multimodal이 Text-only보다 나은 점**:
	- Relevance accuracy **또는** Purchase recall 개선
	- 둘 다 동시에 최적화하기는 어려움 (trade-off 존재)
3. **Fine-tuning + Hard negatives** 추가 시:
	- Relevance precision 크게 개선 (irrelevant 감소)
	- 단, recall은 약간 하락

# I) 📐 임베딩 차원

**논문에서 구체적인 차원 수치는 명시하지 않았습니다.**

- 수식에서 `N`으로만 표기 (q ∈ ℝᴺ, d ∈ ℝᴺ)
- BiBERT: 2-layer Transformer, 4 attention heads
- CLIP: 50억 이미지로 pre-trained된 모델 사용

Fusion 방식에 따라 최종 차원이 달라짐:

- **Concatenation**: BiBERT dim + CLIP dim
- **MLP fusion**: MLP output dim

---

# J) 📊 Text-only Vs Multimodal 성능 비교 (Table 2)

|Model|Recall@100|Exact|Substitute|Irrelevant|
|---|---|---|---|---|
|**BiBERT (Text-only)**|**78.1%**|52.7%|30.3%|13.6%|
|CLIP alone|46%|45.4%|26.5%|25.4%|
|4tMM cat|**78.6%**|52.5%|31.1%|14%|
|4tMM α-cat|78.5%|51.9%|31.2%|14.5%|
|4tMM (BiBERT+MLP joint)|73.3%|**54%**|26.8%|**11.9%**|
|3tMM (BiBERT+MLP joint)|73.1%|53.8%|26.8%|12.1%|

---

# K) 🎯 핵심 결과 요약

## K.1) Concatenation만 했을 때

- Recall: 78.1% → **78.6%** (+0.5%p 개선)
- Relevance는 비슷하거나 약간 혼합된 결과

## K.2) Joint Training (BiBERT + MLP 같이 학습)

- **Exact: 52.7% → 54%** (+1.3%p)
- **Irrelevant: 13.6% → 11.9%** (-1.7%p) ← 이게 큼
- 대신 Recall: 78.1% → 73.3% (-4.8%p) **하락**

## K.3) Trade-off 존재

> **Recall ↔ Relevance Precision은 반비례 관계**

---

# L) 🔍 Exclusive Match 분석 (Table 4) - Multimodal만 찾은 상품

|Model|Query당 Exclusive 상품|Net Recall|Net Exact|Net Irrelevant|
|---|---|---|---|---|
|4tMM (joint)|60개|56.2%|**57.6%**|11.4%|
|3tMM (joint)|59개|56.2%|57.6%|11.5%|

**→ Multimodal에서만 검색된 상품들도 품질이 높음** (Exact 57.6%, Irrelevant 11.4%)

---

# M) ✅ 결론: Text-only보다 효과적인가?

|관점|결과|
|---|---|
|**Relevance Precision**|✅ Multimodal이 더 좋음 (Exact↑, Irrelevant↓)|
|**Purchase Recall**|❌ 오히려 하락 (78.1% → 73.3%)|
|**Exclusive Match 품질**|✅ 텍스트로 못 찾는 고품질 상품 발견|

## M.1) 논문의 결론

> "Multimodal models show **larger potential on improving relevance accuracy** (higher exact, lower irrelevant) **than purchase prediction**."

즉, **구매 예측보다는 관련성 정확도 개선에 더 효과적**이라는 것이 이 논문의 핵심 발견입니다.

# N) 📏 평가 지표 측정 방법

## N.1) Recall@100

```python
Recall@100 = (Top-100 예측 중 실제 구매된 상품 수) / (해당 쿼리의 실제 총 구매 수)
```

- 쿼리별로 계산 후 전체 평균
- **Ground truth = 실제 구매 기록**
- 즉, "구매로 이어진 상품을 얼마나 잘 찾았나"

## N.2) Exact / Substitute / Complement / Irrelevant

- **별도의 Relevance Annotation 모델**로 라벨링
- 각 query-product pair에 대해 4가지 중 하나로 분류:

|라벨|의미|예시 (쿼리: "아이폰 15 케이스")|
|---|---|---|
|**Exact**|정확히 원하는 상품|아이폰 15 전용 케이스|
|**Substitute**|대체 가능한 상품|아이폰 14 케이스 (호환됨)|
|**Complement**|보완재|아이폰 15 강화유리|
|**Irrelevant**|관련 없음|갤럭시 케이스|

- Top-100 예측 결과에서 각 라벨의 **비율(%)** 을 계산
- 좋은 모델 = **Exact↑, Irrelevant↓**

---

# O) 🔀 Α-cat (Alpha-weighted Concatenation)

논문 Eq.4에 정의되어 있어요:

```python
f_α-cat(v₁, v₂) = (α · v₁) ⊕ ((1-α) · v₂),  α ∈ (0, 1)
```

## O.1) 일반 Concatenation (cat)

```python
[BiBERT_emb, CLIP_emb]  ← 그냥 이어붙이기
```

## O.2) Α-weighted Concatenation (α-cat)

```python
[α × BiBERT_emb, (1-α) × CLIP_emb]  ← 가중치 부여 후 이어붙이기
```

**의도**: BiBERT와 CLIP 임베딩의 **상대적 중요도를 조절**

- α = 0.7이면 텍스트(BiBERT) 더 중시
- α = 0.3이면 이미지(CLIP) 더 중시

## O.3) 실험 결과 (Table 2)

|Fusion|Recall@100|Exact|
|---|---|---|
|cat|78.6%|52.5%|
|α-cat|78.5%|51.9%|

→ 큰 차이 없음. 단순 concat이랑 거의 비슷한 성능

---

# P) 즉, "Sentinel"이라는 내부 모델

- Amazon 내부에서 만든 **Query-Product Relevance 분류 모델**
- 입력: (query, product) pair
- 출력: Exact / Substitute / Complement / Irrelevant 중 하나

```python
Sentinel("아이폰 15 케이스", 상품A) → "Exact"
Sentinel("아이폰 15 케이스", 상품B) → "Irrelevant"
```

---

# Q) 왜 이런 모델을 쓰나?

## Q.1) 문제

- 3.38M 상품 × 38K 쿼리 = **1,280억 개 pair**
- 사람이 일일이 라벨링 불가능

## Q.2) 해결

- 일부 데이터에 대해 사람이 라벨링 → **Relevance 분류 모델 학습**
- 이 모델로 나머지 전체 데이터 자동 라벨링

# R) 요약

| 용어                       | 설명                                               |
| ------------------------ | ------------------------------------------------ |
| **Recall@100**           | 구매 기록 기반, 실제 구매 상품을 Top-100에서 얼마나 찾았나            |
| **Exact/Substitute/...** | Annotation 모델이 분류한 관련성 라벨 비율                     |
| **α-cat**                | 두 임베딩에 가중치 α, (1-α) 곱해서 concat                   |

| 항목                       | 내용                                               |
| ------------------------ | ------------------------------------------------ |
| **모델 이름**                | Sentinel (Amazon 내부 모델)                          |
| **역할**                   | Query-Product pair의 관련성 자동 분류                    |
| **출력**                   | 4-class (Exact/Substitute/Complement/Irrelevant) |
| **구조**                   | 논문에 미공개 (아마 Cross-Encoder 기반 추정)                 |

결국 **사람 라벨링을 대체하는 자동화된 평가 모델**

|Dataset|Distinct Products|
|---|---|
|Training|581,158 (약 **58만**)|
|Evaluation|3,384,067 (약 **338만**)|

**→ 억 단위 아니고 백만 단위입니다.**

## R.1) 실제 Amazon 규모 참고

- Amazon 전체 상품: 3억 개 이상
- 이 논문은 **특정 마켓/카테고리 샘플**로 실험한 것으로 추정

---

# S) ANN (Approximate Nearest Neighbor)

## S.1) 논문 Page 4

> "using **KNN (k-nearest neighbors) algorithm in FAISS library** for top-100 relevant products retrieval"

## S.2) 사용한 것: **FAISS** (Facebook AI Similarity Search)

```python
Query Embedding → FAISS Index (338만 상품) → Top-100 검색
```

## S.3) FAISS 특징

- Meta(Facebook)에서 만든 벡터 검색 라이브러리
- GPU 가속 지원
- 다양한 인덱스 타입: IVF, HNSW, PQ 등

논문에서 **구체적인 인덱스 타입(IVF, HNSW 등)은 명시 안 함**—아마 기본 설정이나 IVF 계열 사용 추정

---

# T) 요약

| 질문    | 답변                            |
| ----- | ----------------------------- |
| 실서비스? | ❌ 오프라인 실험만 (배포 언급 없음)         |
| 상품 개수 | 338만 개 (억 단위 아님)              |
| ANN   | **FAISS** 사용 (구체적 인덱스 타입 미명시) |
