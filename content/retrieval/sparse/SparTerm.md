---
title: "SparTerm"
tags: ["retrieval", "IR", "embedding", "sparse_retrieval", "sparse_embedding"]
---

# A) SparTerm이란

SparTerm (Yang Bai et al., 2020)은 BERT의 MLM(Masked Language Modeling) Head를 활용하여 **문서/쿼리를 vocab 크기의 sparse vector로 변환** 하는 learned sparse retrieval 모델이다. [[SPLADE]]의 직접적인 전신으로, SPLADE가 해결하고자 한 "복잡한 2단계 학습"의 원형이 바로 SparTerm이다.

## A.1) 핵심 아이디어

기존 sparse retrieval 방식들(Doc2Query, DeepCT)은 term 가중치를 예측하거나 문서를 확장하는 데 그쳤지만, SparTerm은 **어떤 term을 활성화할지 선별(gating)** 하는 것과 **각 term의 중요도를 계산(importance)** 하는 것을 분리한다.

# B) 아키텍처

SparTerm의 최종 문서 표현은 두 모듈의 element-wise 곱이다:

$$p' = F(p) \odot G(p)$$

여기서:
- $F(p)$: Importance Predictor (dense 벡터)
- $G(p)$: Gating Controller (binary sparse 벡터)

## B.1) Importance Predictor $F(p)$

각 입력 토큰 $i$에 대해, BERT MLM Head와 유사한 구조로 **전체 vocabulary에 대한 중요도 분포** 를 생성한다:

$$I_i = \text{Transform}(h_i) \cdot E^T + b$$

여기서:
- $h_i$: BERT가 생성한 $i$번째 토큰의 hidden state
- $E$: vocabulary embedding matrix
- `Transform` = Linear → GELU → LayerNorm

이후 모든 토큰에 대해 ReLU를 적용하고 합산하여, 문장 전체를 아우르는 vocab 크기의 벡터를 만든다:

$$I = \sum_{i=0}^{L} \text{ReLU}(I_i)$$

이 벡터의 각 원소는 "해당 vocab 토큰이 이 문서에서 얼마나 중요한가"를 나타낸다.

## B.2) Gating Controller $G(p)$

Importance Predictor가 모든 vocab 토큰에 대한 점수를 매기지만, 실제로 sparse vector에 포함시킬 토큰을 **선별** 하는 역할을 한다. 두 가지 방식이 있다:

### B.2.1) Literal-Only Gating

원본 문서에 **실제로 등장한 단어만** 활성화한다:

$$G(p) = \text{BoW}(p)$$

Bag-of-Words 마스크로, 문서에 있는 단어 위치만 1이고 나머지는 0이다. Term expansion 없이, 기존 단어의 **재가중화(re-weighting)** 만 수행한다.

### B.2.2) Expansion-Enhanced Gating

문서에 없는 단어도 활성화하여 **term expansion** 을 수행한다. 구체적인 절차:

**Step 1.** Gating Controller가 passage-wise로 전체 vocabulary에 대한 확률 분포 $G$ 를 생성

**Step 2.** Binarizer를 적용하여 확률이 임계값 $k$ (e.g. 0.7) 이상인 항목만 1로 설정: $G' = \text{Binarizer}(G)$

**Step 3.** 원본에 **없는** 새로운 항목만 선택: $G_e = G' \odot \neg\text{BoW}(p)$

**Step 4.** 새로운 항목과 원본 항목을 결합:

$$G_{le} = G_e + \text{BoW}(p)$$

예를 들어 문서에 `"hives"`(두드러기)가 있으면, MLM이 `"allergic"`, `"reactions"` 등을 높은 확률로 예측하여 이를 추가 활성화한다.

# C) 학습

## C.1) 2단계 학습 과정

SparTerm의 가장 큰 특징이자 한계는 **2단계 학습** 이 필요하다는 점이다:

**1단계**: Gating Controller만 먼저 학습 (약 50k steps)

$$\mathcal{L}_{\text{exp}} = -\lambda_1 \sum_{j \in \{m \mid T_m=0\}} \log(1 - G_j) - \lambda_2 \sum_{k \in \{m \mid T_m=1\}} \log(G_k)$$

여기서:
- $T$: target 텍스트 (query 또는 summary)의 이진 BoW 벡터
- $G$: passage의 gating 확률 분포
- 첫 번째 항 ($T_m = 0$): target에 **없는** 단어의 gating 확률을 억제
- 두 번째 항 ($T_m = 1$): target에 **있는** 단어의 gating 확률을 활성화

**2단계**: Gating Controller를 **고정** 한 뒤, Importance Predictor를 포함한 전체 모델 학습

$$\mathcal{L}_{\text{rank}} = -\log \frac{e^{\text{sim}(q'_i, p'_{i,+})}}{e^{\text{sim}(q'_i, p'_{i,+})} + e^{\text{sim}(q'_i, p'_{i,-})}}$$

InfoNCE 스타일의 triplet 손실로, query와 positive document는 가깝게, negative document는 멀어지도록 학습한다.

## C.2) 구현 상세

- 두 모듈 (Importance Predictor, Gating Controller) 모두 **BERT-base에서 각각 초기화**—가중치 공유 없이 별도의 BERT 인스턴스 2개 사용
- 학습 데이터: MS MARCO passage-ranking 학습 세트
- 최종 목적함수: $\mathcal{L} = \mathcal{L}_{\text{rank}} + \mathcal{L}_{\text{exp}}$

## C.3) 왜 2단계가 필요한가

Gating과 Importance를 동시에 학습하면, 초기에 gating이 불안정하여 importance 학습이 올바른 방향으로 진행되지 않는다. 비유하자면, "어떤 단어를 볼지"도 모르는 상태에서 "각 단어가 얼마나 중요한지"를 학습하는 것은 비효율적이다.

# D) 실험 결과

MS MARCO passage-ranking에서의 결과:

- **SparTerm (expansion-enhanced)**: 최고 MRR@10 달성
- **SparTerm (literal-only)**: DeepCT 초과—expansion 없이 re-weighting만으로도 경쟁력 있음
- 다만 T5 기반 Doc2Query-T5보다는 낮은 성능 → 더 강력한 PLM을 사용하면 단순한 문서 확장 방식도 강력할 수 있음을 시사

## D.1) 정성적 분석

DeepCT 대비 더 넓은 범위의 중요 단어를 캡처한다:

- `"hives"` (두드러기) → `"allergic"`, `"reactions"` 활성화
- `"sign"` → `"symptom"` 확장
- `"pregnancy"` → `"women"` 확장

DeepCT는 문서에 등장하는 단어의 가중치만 조절하는 반면, SparTerm의 expansion-enhanced gating은 문서에 없는 의미적으로 관련된 단어까지 활성화할 수 있다.

# E) SPLADE와의 관계

SparTerm의 2단계 학습은 구현이 복잡하고 학습 비용이 높다. [[SPLADE]]는 이를 다음과 같이 단순화했다:

| SparTerm | SPLADE |
|----------|--------|
| Importance Predictor + Gating Controller 분리 | `log(1 + ReLU(·))` 하나로 통합 |
| 2단계 학습 (gating 먼저 → 전체 모델) | 엔드-투-엔드 단일 학습 |
| Triplet Loss | InfoNCE (in-batch negatives) |
| 별도의 sparsity 제어 없음 | FLOPS Regularization으로 sparsity 직접 제어 |

SPLADE에서 ReLU가 음수를 제거하면서 자연스럽게 불필요한 토큰을 0으로 보내므로, 별도의 gating이 필요 없어졌다.

# F) References

- [SparTerm: Learning Term-based Sparse Representation for Fast Text Retrieval (2020)](https://arxiv.org/abs/2010.00768)
