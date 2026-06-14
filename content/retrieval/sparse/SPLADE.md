---
tags: ["retrieval", "IR", "embedding", "sparse_retrieval", "sparse_embedding"]
---

# A) SPLADE란

SPLADE(**SP**arse **L**exical **A**n**D** **E**xpansion model)는 NAVER LABS EUROPE에서 개발한 learned sparse retrieval 모델이다. 문장이나 문단을 vocabulary 크기(e.g. 30,522차원)의 **희소 벡터** 로 매핑하며, 의미 기반 검색(semantic search)과 희소 검색(sparse retrieval) 모두에 활용할 수 있다.

## A.1) 왜 SPLADE가 필요한가

Dense Embedding 모델은 대부분의 값이 0이 아닌 벡터(e.g. 1024차원)를 생성하는 반면, Sparse Embedding 모델은 대부분의 값이 0인 고차원 벡터를 생성한다. [[BM25]] 도 일종의 sparse embedding 방식이지만, **형태는 다르지만 의미가 같은 단어를 구별하지 못하는** 치명적 단점이 있다. 예를 들어 BM25는 '스파게티'와 '파스타'를, '식당'과 '레스토랑'을 완전히 다른 토큰으로 취급한다.

이를 해결하기 위해 "Term Expansion(단어 확장)" 연구가 활발히 진행되어 왔고, SPLADE는 그 중 가장 주목받는 모델이다.

## A.2) Sparse Retrieval 발전 흐름

SPLADE 이전에도 여러 접근이 있었다:

| 시기      | 방법               | 주요 기여                                    | 한계                     |
| ------- | ---------------- | ---------------------------------------- | ---------------------- |
| 기초      | [[TF-IDF]]       | 단순, 빠름                                   | 문맥 미이해                 |
| 개선      | [[BM25]]         | 길이 정규화, TF 포화                            | 어휘 불일치 (term mismatch) |
| 확장      | Doc2Query (2019) | 생성 모델로 문서 확장                             | 생성 비용, 간접적 확장          |
| 정교화     | DeepCT           | BERT 기반 문맥적 term 가중치                     | 주변 세부사항 미처리            |
| 정교화     | [[SparTerm]]     | Importance Predictor + Gating Controller | 복잡한 2단계 학습             |
| **단순화** | **SPLADE**       | **엔드-투-엔드, FLOPS 정규화**                   | -                      |

[[SparTerm]]은 두 개의 별도 모듈을 사용한다:

- **Importance Predictor $F(p)$**: 각 토큰이 전체 vocabulary에 대해 얼마나 중요한지를 나타내는 dense 벡터 생성 (BERT MLM Head와 유사)
- **Gating Controller $G(p)$**: 최종 벡터에서 **어떤 vocab 토큰을 활성화할지 결정하는 이진(binary) 마스크** 생성. 문을 열어줄(gate) 토큰과 닫아버릴 토큰을 선별하는 역할

최종 표현은 이 둘의 element-wise 곱이다: $p' = F(p) \odot G(p)$

Gating에는 두 가지 방식이 있다:
- **Literal-only**: 원본 문서에 실제로 등장한 단어만 활성화 (BoW 마스크)
- **Expansion-enhanced**: MLM Head 예측에서 높은 확률(e.g. ≥ 0.7)의 토큰도 추가 활성화 → term expansion 효과

문제는 Gating Controller를 **먼저 50k steps 학습 → 고정 → 그 다음 전체 모델 학습** 이라는 복잡한 2단계가 필요하다는 점이다. SPLADE는 이 과정을 없애고, `log(1 + ReLU(·))` 하나로 gating과 importance를 동시에 처리한다—ReLU가 음수를 제거하면서 자연스럽게 불필요한 토큰을 0으로 보내므로 별도의 gating이 필요 없다.

# B) 아키텍처

## B.1) MLM Head를 활용한 Term Importance 계산

SPLADE는 BERT의 **Masked Language Modeling (MLM)** 능력에 전적으로 의존한다. 먼저 BERT에서 출력되는 토큰들의 hidden state를 MLM Head에 통과시킨다:

$$z_i = \text{Transform}(h_i) \cdot E^T + b$$

여기서:
- `Transform` = Linear → GELU → LayerNorm (BERT MLM 헤드와 동일 구조)
- $h_i$: BERT가 생성한 $i$번째 토큰의 hidden state
- $E$: vocabulary embedding matrix

$z_{ij}$ 로짓은 곧 **"문맥에서 $i$ 번째 토큰이 $j$ 번째 vocab 토큰에게 주는 importance score"** 로 해석될 수 있다. 예를 들어 "The bank is near the river."에서 "bank"는 문맥상 "강둑"이므로, `"water"`, `"flow"` 에 대해서는 높은 로짓을, `"money"`, `"deposit"` 에 대해서는 낮은 로짓을 매긴다.

## B.2) Log-saturated Pooling

이후 importance score에 ReLU를 적용하여 음수를 제거하고, `log(1+x)` 변환(log-saturation)으로 값의 발산을 막은 뒤, 모든 입력 토큰에 대해 pooling하여 최종 vocab size 크기의 벡터를 만든다:

$$w_j = \text{Pool}_{i \in \{1,...,L\}} \log(1 + \max(0, z_{i,j}))$$

여기서:
- **ReLU**: 양수 증거만 누적 (음수는 무시)
- **log(1+·)**: 특정 항의 가중치 폭주 억제 + 자연적 희소성 유도
- 결과: vocabulary 크기의 희소 벡터 → **inverted index 구축 가능**

Pooling 방식에 따라 버전이 나뉜다:
- **SPLADE-v1**: Sum Pooling—$w_j = \sum_{i} \log(1 + \text{ReLU}(z_{ij}))$
- **SPLADE-v2**: **Max Pooling**—$w_j = \max_{i} \log(1 + \text{ReLU}(z_{ij}))$

"가장 강력한 신호 하나를 택하는" Max Pooling이 모든 메트릭에서 Sum보다 우월함이 실험적으로 입증되었다.

## B.3) 유사도 계산

$$s(q, d) = \langle w^{(q)}, w^{(d)} \rangle$$

활성화된 겹치는 항들만 내적에 기여하므로, inverted index 엔진에서 빠르게 실행 가능하다. 유사도 함수로는 Cosine Similarity가 아닌 **Dot Product** 를 사용한다.

## B.4) Term Expansion 예시

`"The weather is lovely today"` 라는 질의를 splade-v3에 입력하면:

- `"weather"` → `"summer"` 활성화
- `"lovely"` → `"beautiful"`, `"cool"`, `"pretty"`, `"nice"` 활성화
- `"today"` → `"currently"`, `"yesterday"` 활성화

이처럼 입력 문맥이 가장 강력하게 지지하는 토큰들의 점수로 구성된 확장된 sparse vector를 얻게 된다.

# C) 학습

## C.1) Ranking Loss (InfoNCE)

데이터는 query ($q$), positive document ($d^+$), hard negative document ($d^-$) 로 구성된 triplet을 준비한다. $q$와 $d^+$는 가깝게, $q$와 $d^-$ 및 배치 내 다른 documents는 멀어지도록 **In-Batch Negatives (IBN) 방식의 InfoNCE Loss** 로 학습한다:

$$\mathcal{L}_{\text{rank}} = -\log \frac{e^{s(q_i, d_i^+)}}{e^{s(q_i, d_i^+)} + e^{s(q_i, d_i^-)} + \sum_j e^{s(q_i, d_{i,j}^-)}}$$

## C.2) FLOPS Regularization

Ranking Loss만으로 학습하면 벡터의 0이 아닌 차원이 많아질 수 있다 (ReLU에 의해 어느 정도 sparse 해지긴 하지만). 이는 검색 엔진이 색인해야 할 양이 늘어나 **검색 속도가 느려짐** 을 의미한다.

SPLADE는 **FLOPS Regularizer** 를 도입한다. 원리는 간단하면서도 강력하다: 배치 내에서 **각 토큰의 평균 활성화 빈도를 계산하고, 이 값을 제곱하여 loss로 사용** 한다:

$$a_j = \frac{1}{N} \sum_{i=1}^{N} w_j^{(d_i)} \quad \text{(배치에서 항 } j \text{의 평균 활성화)}$$

$$\ell_{\text{FLOPS}} = \sum_{j \in V} a_j^2$$

- **제곱 연산**: 불용어처럼 모든 문서에서 활성화되는 항에 강한 패널티 → 모델이 불필요한 단어의 가중치를 0으로 보내버리고, 꼭 필요한 단어만 남기는 sparsity를 학습
- 두 개의 강도 파라미터: $\lambda_q$ (쿼리, 보통 더 강함 → 지연 시간 감소), $\lambda_d$ (문서, 더 약함)
- 예열(warm-up): 정규화 가중치를 약 50k steps에 걸쳐 점진적으로 증가 (이차 램프)

## C.3) 최종 목적함수

$$\mathcal{L} = \mathcal{L}_{\text{rank}} + \lambda_q \mathcal{L}_{\text{reg}}^{(q)} + \lambda_d \mathcal{L}_{\text{reg}}^{(d)}$$

보통 검색 속도에 더 큰 영향을 미치는 Query를 더 희소하게 만들기 위해 Query 쪽에 더 큰 가중치를 부여한다.

# D) SPLADE-v3

[SPLADE-v3 논문 (2403.06789)](https://arxiv.org/pdf/2403.06789)에서는 SPLADE++SelfDistil 체크포인트 (`naver/splade-cocondenser-selfdistil`) 를 기반으로 여러 학습 기법을 개선했다.

## D.1) 배치당 다수의 네거티브 샘플

Tevatron 방식에 따라 여러 개의 하드 네거티브 샘플을 한 번에 활용. 네거티브 수를 늘릴수록 in-domain 성능 향상이 두드러지지만, out-of-domain 일반화에는 큰 영향이 없었다.

SPLADE++ 모델에서 추출한 네거티브를 사용하였으며, 총 100개 중 상위 50개는 top-50에서, 나머지 50개는 top-1k 내에서 무작위 선택하였다.

## D.2) Cross-encoder 앙상블 기반 Distillation Score

기존 단일 모델 대신 **여러 cross-encoder re-ranker 앙상블** 을 활용해 디스틸레이션 점수를 생성했다. 두 가지 유형의 점수를 만들었다:

1. **Ensemble 점수**: ranx의 min-max 정규화 방식으로 앙상블
2. **Rescored 점수**: ensemble 점수 분포의 평균/표준편차가 기존 설정과 유사하도록 affine 변환

사용된 모델:

1. `cross-encoder/ms-marco-MiniLM-L-6-v2` ♣ (SPLADE++ 점수 생성 담당)
2. `naver/trecdl22-crossencoder-rankT53b-repro`
3. `naver/trecdl22-crossencoder-debertav3`
4. `naver/trecdl22-crossencoder-debertav2`
5. `naver/trecdl22-crossencoder-electra`

분포를 조정하면 특히 MarginMSE 적용 시 distillation 효과가 좋아지는 것으로 관찰되었으나, 그 원인까지는 깊게 분석하지 않았다.

## D.3) 두 가지 Distillation Loss 결합

- **KL-Div**: Precision에 민감 (Eff-SPLADE에서 사용)
- **MarginMSE**: Recall에 민감 (SPLADE v2 및 SPLADE++에서 사용)

두 손실 함수를 조합하여 $\lambda_{\text{KL}}=1$, $\lambda_{\text{MSE}}=0.05$ 로 사용했다.

## D.4) SPLADE++ 체크포인트 기반 파인튜닝

SPLADE++SelfDistil 체크포인트로부터 시작하여 위 개선 사항들을 적용했더니, CoCondenser나 DistilBERT 체크포인트 기반 대비 더 뛰어난 효과가 나타났다. 정확한 원인은 밝혀지지 않았으나 curriculum learning 유사 과정이 영향을 준 것으로 추정된다.

# E) Inference-Free SPLADE

## E.1) 동기: SPLADE-doc

기존 SPLADE는 query와 document **둘 다** BERT + MLM Head를 통과시켜 sparse vector를 만든다. 하지만 term mismatch의 핵심은 "문서에 `스파게티`라고 써있는데 `파스타`로 검색하면 안 걸리는 것"이다. 그렇다면 **document 쪽에서 미리 `스파게티` → `파스타`, `이탈리안` 등을 확장해두면**, query에서 `파스타`라고 검색해도 매칭된다:

```python
[기존 SPLADE]
Query:    "파스타 맛집"           → BERT → MLM Head → 확장된 sparse vector
Document: "스파게티 전문 레스토랑"  → BERT → MLM Head → 확장된 sparse vector

[SPLADE-doc]
Query:    "파스타 맛집"           → 단순 tokenize → [파스타=1, 맛집=1, 나머지=0]
Document: "스파게티 전문 레스토랑"  → BERT → MLM Head → [스파게티=2.1, 파스타=1.3, 맛집=0.9, ...]
→ "파스타"가 document의 확장 벡터에 이미 있으므로 매칭 성공
```

SPLADE-v2 저자들이 이 생각을 바탕으로 **SPLADE-doc** 을 제안했다:

- **Query**: 단순히 토크나이징된 단어들에 해당하는 위치만 1인 벡터 (Bag-of-Words)
- **Document**: SPLADE 모델을 통과하여 확장된 sparse vector

Document 인코딩은 색인 시 오프라인으로 한 번만 하면 되므로, 검색 시점에 query를 BERT에 통과시키는 비용이 완전히 사라져 latency가 크게 줄어든다. 다만 query도 확장하면 더 많은 관련 문서를 찾을 수 있기 때문에 (e.g. `"파스타 맛집"` → `"이탈리안"`, `"음식점"` 등), 일반 SPLADE 대비 **약 2점 정도의 성능 갭** 이 존재했다.

## E.2) IDF-aware FLOPS Regularization

이 성능 갭을 해결하기 위해 Amazon OpenSearch에서 **Inference-Free SPLADE** 를 제안했다.

### E.2.1) 기존 FLOPS의 문제

기존 FLOPS 정규화는 모든 토큰을 **평등하게** 처벌한다. 특정 데이터로 penalize 비율을 분석해보면:

- `"this"`, `"that"` 같은 무의미한 토큰은 자주 등장함에도 **페널티를 적게** 받고
- `"algorithms"`, `"graph"` 같은 중요한 토큰은 드물게 등장한다는 이유로 오히려 **더 강하게 penalize** 당하고 있었다

즉, FLOPS penalty가 semantic을 반영하지 않고 있다.

### E.2.2) IDF Weight 도입

**1단계:** vocab의 모든 토큰에 대해 학습 데이터에서 IDF 값을 사전 계산한다:

$$\text{idf}(t) = \log\left(1 + \frac{N - \text{df}(t) + 0.5}{\text{df}(t) + 0.5}\right)$$

**2단계:** 유사도 계산 함수에 IDF를 반영한다:

$$s_{\text{idf}}(q, d) = \langle \text{idf}(t) \odot w^{(q)},\ w^{(d)} \rangle$$

**3단계:** 최종 Loss $\mathcal{L} = \mathcal{L}_{\text{rank-idf}} + \lambda \cdot \mathcal{L}_{\text{FLOPS}}$ 를 미분하면, 유사도 식에 IDF 항이 들어가 있기 때문에 $\mathcal{L}_{\text{rank-idf}}$ 의 gradient가 IDF에 비례하게 된다:

- **IDF가 높은 중요 토큰** → Ranking Loss의 gradient가 커서 FLOPS penalty에 저항 → **살아남음**
- **IDF가 낮은 무의미 토큰** → Ranking Loss의 gradient가 작아 FLOPS penalty에 저항 불가 → **0으로 제거됨**

### E.2.3) 왜 FLOPS에 IDF를 직접 적용하지 않는가

직관적으로는 FLOPS 쪽에 IDF를 직접 적용해서 (e.g. $\sum \frac{1}{\text{idf}(j)} \cdot a_j^2$) "중요 토큰은 덜 penalize"하면 될 것 같지만, 이렇게 하지 않는 이유가 있다:

- **FLOPS는 "얼마나 sparse하게 만들 것인가"에 대한 budget 조절기이다.** 어떤 토큰을 살릴지 말지의 *판단*은 ranking loss가 해야 한다.
- FLOPS에 IDF를 넣으면, ranking loss와 무관하게 IDF만 보고 토큰을 살리거나 죽이게 되어 → **IDF가 높기만 하면 검색에 쓸모없어도 살아남는** 문제가 생긴다.
- 반면 ranking loss 쪽에 IDF를 반영하면, **IDF가 높으면서 동시에 검색 성능에도 기여하는 토큰만** 선택적으로 살아남는다.

정리하면:

```python
FLOPS penalty (균등한 sparsity 압력) → 모든 토큰을 0으로 밀어냄
         ↕ (대항)
Ranking Loss gradient (IDF 반영) → IDF 높은 중요 토큰의 저항력이 큼
         ↓
결과: 중요 + 검색에 유용한 토큰만 살아남음
```

### E.2.4) 결과

Inference-free (query는 BoW 고정)임에도 일반 sparse retriever와 거의 같은 성능을 보이며, ColBERTv2보다도 높은 성능을 기록했다 (다만 데이터 차이와 정교한 distillation의 개입이 있었음).

# F) 한국어 SPLADE 학습

> 아래 내용은 [yjoonjang의 블로그 글](https://yjoonjang.medium.com/splade-inference-free-splade%EC%97%90-%EA%B4%80%ED%95%98%EC%97%AC-%ED%95%9C%EA%B5%AD%EC%96%B4-%EB%AA%A8%EB%8D%B8-%ED%95%99%EC%8A%B5%EA%B8%B0-5db02c87226f) 및 [HuggingFace 블로그 글](https://huggingface.co/blog/yjoonjang/vocabulary-is-the-most-important-element-in-splade) 을 기반으로 정리하였다.
> 모델: [splade-ko-v1](https://huggingface.co/yjoonjang/splade-ko-v1), [inference-free-splade-ko-v1](https://huggingface.co/yjoonjang/inference-free-splade-ko-v1)

## F.1) Vocabulary가 가장 중요하다

SPLADE 학습에서 모델 크기나 사전학습 품질보다 **tokenizer가 대상 언어를 얼마나 잘 커버하는지** 가 성능의 결정적 요소이다. SPLADE는 BERT의 MLM 능력에 의존하므로, tokenizer가 해당 언어를 제대로 토크나이징하지 못하면 MLM Head가 의미있는 importance score를 생성할 수 없다.

이를 검증하기 위해, ~900k 한국어 데이터셋으로 4개 백본 모델을 **동일 조건** 에서 SPLADE 학습시킨 뒤 성능을 비교했다. 유일한 변인은 백본 모델(= tokenizer + vocab)이다.

**실험 설정:**
- **데이터**: ~900k 한국어 `<query, positive, hard_negative>` triplet
- **Loss**: Contrastive Learning (sentence-transformers 기반)
- **공통 하이퍼파라미터**: batch size 8, max length 512, query 정규화 5e-5, doc 정규화 3e-5, BF16 혼합정밀도
- **평가**: MTEB-ko-retrieval 벤치마크 (Recall@10, NDCG@10, MRR@10)

여기서 **[[Active Dimensions|활성 차원(Active Dimensions)]]** 이란 SPLADE 출력 벡터(vocab 크기)에서 0이 아닌 값을 가진 차원의 수를 말한다. 활성 차원이 너무 적으면 term expansion이 안 되고, 너무 많으면 dense에 가까워져 inverted index의 이점을 잃는다 (자세한 내용은 해당 노트 참조).

**실험 결과:**

| 모델 | Vocab Size | Recall@10 | NDCG@10 | Query 활성 차원 | Corpus 활성 차원 |
|------|-----------|-----------|---------|---------------|----------------|
| `skt/A.X-Encoder-base` (한국어) | 50,000 | **0.731** | **0.6618** | 84.23 | 650.65 |
| `klue/roberta-base` (한국어) | 32,000 | 0.6751 | 0.6234 | 28.39 | 188.05 |
| `gte-multilingual-base` (70+언어) | 250,048 | 0.61 | 0.5224 | 1115.86 | 2728.68 |
| `jhu-clsp/mmBERT-base` (1800+언어) | 256,000 | **0.023** | **0.0103** | **0** | **0** |

핵심 관찰:
- **한국어 중심 vocabulary** (klue, A.X-Encoder): 안정적 학습, 강력한 성과
- **광범위 다국어 vocabulary** (gte-multilingual): 결국 합리적 성과이나, 1000+ 활성 차원으로 dense에 가까워짐
- **초다국어 vocabulary** (mmBERT): **Representation Collapse** 발생—학습 step ~4266에서 활성 차원이 모두 0으로 붕괴

### F.1.1) Representation Collapse의 원인

1. **Tokenizer-언어 불일치**: Gemma2 tokenizer는 한국어에 최적화되지 않아, 한국어 텍스트가 rare subword로 과도하게 분절 → 모델이 vocabulary 공간에 의미있게 투영 불가
2. **과도한 Sparsity 정규화**: 이미 약한 활성화에 sparsity 페널티가 추가 → 모델이 "영벡터 = 손실 최소화"라는 지름길을 학습
3. **Dying ReLU**: LayerNorm이 한국어 분포에 미적응, ReLU에서 대부분의 값이 0으로 소멸

## F.2) Splade-ko-v1 학습

### F.2.1) 데이터 및 백본

- **1M** 샘플, 각 샘플은 query 1개 + positive 1개 + hard negative 6개로 구성
- Hard negative mining: KURE-v1 모델로 relative margin 0.5 적용 (NV-Retriever 방식)
- 백본: `skt/A.X-Encoder-base`—한국어 토큰이 풍부하고 context length가 긴 모델

### F.2.2) 학습 설정

- **InfoNCE Loss** (sentence-transformers `MultipleNegativesLoss`)
- Sparse model에서는 FLOPS regularizer와 **Gradient Cache가 충돌** 하여 사용 불가 → 대신 sentence-transformers v5.1.0의 `gather_across_devices`로 device별 document 공유

```json
{
  "per_device_train_batch_size": 4,
  "learning_rate": 2e-05,
  "query_regularizer_weight": 5e-5,
  "document_regularizer_weight": 3e-5,
  "num_train_epochs": 2,
  "warmup_ratio": 0.1,
  "bf16": true,
  "negs_per_query": 6,
  "gather_device": true
}
```

### F.2.3) 결과

- 타 sparse 모델 (opensearch, PIXIE) 대비 **매우 높은 nDCG@10**—opensearch는 document active dimension이 너무 적어 확장이 미흡
- **0.1B 파라미터임에도 0.6B Dense 모델 (KURE-v1) 급 성능** 달성

## F.3) Inference-free-splade-ko-v1 학습

### F.3.1) Distillation Score 추출

동일 데이터에 대해 **Qwen3-Reranker-8B** (`tomaarsen/Qwen3-Reranker-8B-seq-cls`)로 reranker score를 추출했다:

- **unnormalized score** 사용 (`normalize=False`)—reranker가 출력하는 raw logit을 softmax/sigmoid로 확률 변환하지 않고 그대로 사용한다는 의미. Distillation에서는 unnormalized score를 쓰는 것이 관례인데, (1) KLDiv loss가 teacher logit 간 **상대적 차이** 를 student에게 전달하는 구조이므로 normalization이 이 차이를 압축/왜곡하면 안 되고, (2) temperature scaling (`softmax(logit / T)`)이 raw logit에서만 의도대로 동작하며, (3) Hinton의 Knowledge Distillation 핵심인 **dark knowledge** (틀린 선택지들 간의 상대적 확률 정보)가 raw logit에 담겨 있기 때문이다
- **병렬 스코어링**: A6000 8장에 각각 reranker를 서빙, 데이터를 rank별로 균등 분산 (vLLM/FA2 사용, 1M 쿼리 기준 약 2일 소요)

### F.3.2) 실험 설계

| 변인 | 옵션 |
|------|------|
| IDF weight 사용 | 사용 / 미사용 |
| IDF weight 학습 | Freeze / Unfreeze |
| Loss | InfoNCE / MarginMSE / KLDiv |
| Document regularizer | 1e-6 ~ 1e-8 |

### F.3.3) IDF Weight 미사용 결과

- query lookup weight를 1로 초기화하되 학습하는 경우
- InfoNCE (lr 1e-6) 과 KLDiv (lr 1e-7) 이 가장 우수하나, splade-ko-v1 (0.738) 대비 **턱없이 부족**
- **KLDiv > MarginMSE** (모든 hyperparam에서 일관적)

### F.3.4) IDF Weight 사용 결과

학습 데이터에 대해 tokenizer의 각 token IDF weight를 사전 계산하여 사용:

**핵심 결과:**

- **InfoNCE + IDF 고정(freeze) + regularizer 1e-8** 이 압도적 최고 성능 (**0.721**)
- splade-ko-v1 (0.738) 과 견줄 만하며, PIXIE-Splade-Preview (0.718) 보다 높음
- IDF 사용 모델이 전체적으로 미사용 모델보다 **훨씬 높은 검색 성능**
- IDF weight를 학습(unfreeze)하는 것보다 **고정(freeze)하는 편** 이 더 좋았음
- Distillation 관점에서 **KLDiv > MarginMSE** (일관적)

### F.3.5) Document Active Dimension Trade-off

성능을 높일수록 **Document Active Dimension이 증가** 하여 인덱싱 비용이 늘어남 (한 document 당 19,207개의 값을 색인해야 하는 경우도 발생). 실제 서비스 적용 시 가용 메모리와 허용 latency 사이의 균형점을 찾는 것이 중요하다.

## F.4) 성능 비교 요약

- BM25 대비 splade-ko-v1, inference-free-splade-ko-v1 모두 단독 사용 시 큰 성능 향상
- 0.1B 모델임에도 0.6B Dense 모델 (KURE-v1) 과 크게 차이나지 않는 성능
- Hybrid RRF에서도 BM25 + KURE-v1 (**0.721**) 보다 splade-ko-v1 + KURE-v1 (**0.762**) 가 약 4점 높음

# G) 실무적 시사점

1. **0.1B SPLADE ≈ 0.6B Dense** → GPU 리소스 제한적인 on-premise 환경에서 강력한 대안
2. **Hybrid Retrieval 시 BM25 대체** → splade + dense가 BM25 + dense보다 일관적으로 우수
3. **Vocabulary 선택이 최우선** → 모델 크기보다 tokenizer의 대상 언어 커버리지가 결정적
4. **활성 차원 수 모니터링 필수** → 너무 많으면 인덱싱 비용 급증, 너무 적으면 term expansion 실패, collapse 조기 감지
5. **Sparse model에서 Gradient Cache 사용 불가** → `gather_across_devices`로 우회
6. **Distillation 시 KLDiv > MarginMSE** (일관적 결과)
7. **Inference-Free SPLADE에서 IDF weight 사용 + 고정(freeze)** 이 가장 효과적

# H) References

- [SPLADE-v3 논문 (2403.06789)](https://arxiv.org/pdf/2403.06789)
- [Inference-Free SPLADE 논문 (Amazon OpenSearch)](https://arxiv.org/abs/2410.16083)
- [naver/splade-v3 · Hugging Face](https://huggingface.co/naver/splade-v3)
- [SPLADE Sparse Encoder (sentence-transformers)](https://www.sbert.net/docs/sparse_encoder/usage/usage.html)
- [The Past and Present of Sparse Retrieval - yjoonjang](https://huggingface.co/blog/yjoonjang/the-past-and-present-of-sparse-retrieval)
- [Vocabulary is the most important element of Sparse Retrieval - yjoonjang](https://huggingface.co/blog/yjoonjang/vocabulary-is-the-most-important-element-in-splade)
- [SPLADE, Inference-Free SPLADE 한국어 모델 학습기 - yjoonjang (Medium)](https://yjoonjang.medium.com/splade-inference-free-splade%EC%97%90-%EA%B4%80%ED%95%98%EC%97%AC-%ED%95%9C%EA%B5%AD%EC%96%B4-%EB%AA%A8%EB%8D%B8-%ED%95%99%EC%8A%B5%EA%B8%B0-5db02c87226f)
- [splade-ko-v1 · Hugging Face](https://huggingface.co/yjoonjang/splade-ko-v1)
- [inference-free-splade-ko-v1 · Hugging Face](https://huggingface.co/yjoonjang/inference-free-splade-ko-v1)
- [Inference Free SPLADE Models Collection](https://huggingface.co/collections/sparse-encoder/inference-free-splade-models-6862be3a1d72eab38920bc6a)
