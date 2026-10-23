---
title: "SimLM"
aliases: []
tags:
  - embedding
---

# A) SimLM의 핵심 특징

- **효율적 문서 임베딩**
  SimLM은 자체 지도 방식(self-supervised pre-training)을 통해, 문서 정보를 밀도 높은 벡터(dense vector)로 압축하는 방법을 학습합니다.

- **학습 효율성 향상**
  ELECTRA 모델에서 도입한 ‘대체 언어 모델링(Replaced Language Modeling, RLM)’ 기법을 적용하여 샘플 효율성을 높이고, 사전 훈련과 파인튜닝 간 입력 분포 차이를 최소화하였습니다.

- **라벨 불필요**
  라벨링된 데이터나 쿼리가 없어도, 일반 텍스트 데이터(unlabeled corpus)만으로 사전 훈련이 가능합니다.

- **우수한 성능**
  여러 대규모 문서 검색 데이터셋에서 기존 강력한 기준 모델들을 능가하는 성능을 보였으며, 특히 ColBERTv2와 같은 다중 벡터 접근법보다도 뛰어난 결과를 달성했습니다.

---

# B) SimLM의 두 단계 학습 과정

## B.1) 1단계: 사전 훈련(Pre-training)—RLM(Replaced Language Modeling)

- **목적:**
  라벨이 없는 대규모 텍스트 데이터를 사용하여, 모델이 단어 및 문장의 문맥적 의미를 깊게 이해하도록 만듭니다.
- **방법:**
  ELECTRA와 동일하게, 작은 생성자(Generator)가 문장 내 일부 단어를 그럴듯한 다른 단어로 바꿉니다. 판별자(Discriminator)는 각 토큰이 원래 단어인지 혹은 바뀐 단어인지를 구분하도록 학습됩니다. 이 판별자가 곧 사전 훈련된 SimLM 모델이 됩니다.
- **결과:**
  범용적인 언어 이해력을 갖춘 트랜스포머 인코더를 획득할 수 있습니다.

## B.2) 2단계: 파인튜닝(Fine-tuning)—대조 학습(Contrastive Learning)

- **목적:**
  사전 훈련된 범용 모델을 특정 목적(문서 검색)에 맞게 최적화합니다.

- **방법:**
  `(query, positive document, negative document)` 형태의 데이터셋을 활용합니다. 바이-인코더(Bi-Encoder) 구조 위에서 InfoNCE Loss와 같은 대조 학습 손실 함수를 적용합니다.

- **결과:**
  쿼리와 의미적으로 연관된 문서는 벡터 공간에서 가깝게, 관련 없는 문서는 멀리 배치하는 전문적인 검색 모델이 완성됩니다.

---

# C) 파인튜닝 과정 상세 설명

### C.1.1) 목표 및 구조

파인튜닝의 목표는 쿼리(Query)에 연관된 긍정 문서(Positive Passage)는 임베딩 공간에서 가깝게, 연관 없는 부정 문서(Negative Passage)는 멀리 떨어지도록 임베딩을 학습하는 것입니다. 이를 위해 바이-인코더(Bi-Encoder) 구조를 사용하며, 쿼리 인코더($E_q$)와 문서 인코더($E_p$)는 일반적으로 동일한 트랜스포머 아키텍처 및 가중치를 공유하고, 사전 훈련된 SimLM 파라미터로 초기화됩니다.

## C.2) 파인튜닝 흐름

1. **데이터 준비:**
   학습 데이터는 $(q,\;p^+,\;\{p_i^-\}_{i=1}^N)$ 형태로 구성됩니다.
   - $q$: 사용자 쿼리
   - $p^+$: 정답에 해당하는 긍정 문서
   - $p_i^-$: 부정 샘플들 (쿼리와 관련 없는 여러 개)
	 - *In-batch Negatives*: 한 배치 내 다른 쿼리의 정답을 현재 쿼리에 대한 부정 샘플로 사용하는 방식으로 구현이 쉽고 효율적입니다.
	 - *Hard Negatives*: 의미적으로 유사하지만 실제 정답은 아닌 어려운 부정 샘플들로 ANCE 등 기법으로 미리 선별하여 추가하면 성능 향상에 효과적입니다.
   
2. **Forward Pass:**
   각 인코더에 데이터를 넣어 임베딩 벡터를 얻습니다.
   - $q \rightarrow E_q(q) = v_q$
   - $p^+ \rightarrow E_p(p^+) = v_{p^+}$
   - $p_i^- \rightarrow E_p(p_i^-) = v_{p_i^-}$

3. **유사도 계산:**
   쿼리 벡터와 각 문서 벡터 사이 내적(Dot Product)을 통해 유사도를 산출합니다.

   $$ s(q,p) = E_q(q)^T \cdot E_p(p) $$

4. **손실 함수 계산(Loss Calculation):**
   InfoNCE Loss 형태의 Negative Log-Likelihood Loss를 사용합니다:

	$$
    L = -\log \left[ 
      \frac{\exp(s(q,p^+)/\tau)}
      {\exp(s(q,p^+)/\tau)+\sum_{i=1}^{N} \exp(s(q,p_i^-)/\tau)}
    \right]
    $$

	여기서,
	- $s(q,p)$: 내적(dot product)을 통한 유사도 점수
	- $\tau$: 온도(temperature)를 조절하는 하이퍼파라미터 (낮을수록 분포가 뾰족해지고 Hard Negative에 민감해짐)

5. **역전파 및 최적화:**
   계산된 손실값으로부터 기울기를 구해 AdamW 등 옵티마이저로 파라미터를 업데이트합니다.

6. **반복(Epochs):**
   위 과정을 여러 에포크(epoch)에 걸쳐 반복하여 의미적으로 정교한 임베딩 공간을 구축하게 됩니다.

---

# D) SimLM의 기반 아키텍처—트랜스포머 인코더

SimLM은 BERT나 RoBERTa처럼 트랜스포머 인코더 구조를 그대로 채택하고 있습니다. 핵심적인 차별점은 새로운 네트워크 구조 개발보다는 ‘사전 훈련 방식을 어떻게 개선할 것인가’에 있습니다.

## D.1) ELECTRA 기반 RLM 방식 도입 이유

BERT의 MLM(Masked Language Modeling)은 입력 토큰 중 일부만 마스킹되어 실제 전체 입력 토큰 중 약 15%만 활용되는 반면,

ELECTRA/SimLM의 RLM(Replaced Language Modeling)은 생성자(Generator)가 입력 토큰 일부를 그럴듯하게 변형하고, 판별자(Discriminator)는 모든 토큰에 대해 원본 여부 판별 이진 분류 태스크로 학습하게 됩니다.

따라서 RLM 방식은 더 많은 토큰 정보를 활용할 수 있어 MLM 대비 훨씬 더 높은 샘플 효율성을 발휘하며 빠른 수렴과 우수한 성능 달성이 가능합니다.

---

## D.2) Negative Sampling 전략과 중요성

Dense Passage Retrieval(DPR)의 성능에서 ‘Negative Sampling’ 전략 선택은 매우 핵심적인 요소입니다. Query에 대한 Positive passage는 명확하게 정의되지만 Negative passage는 나머지 모든 passage가 될 수 있으므로 어떤 negative들을 선정하느냐가 최종 성능을 크게 좌우하게 됩니다.

여러 연구 결과에 따르면 ‘모델이 혼동하기 쉬운(hard), 그러나 실제 답은 아닌’ negative들을 포함시켰을 때 무작위 negative sampling보다 훨씬 더 우수한 결과가 나옵니다.

### D.2.1) 주요 Negative Sampling 방식

1. **In-batch Negatives**

   하나의 미니배치 내 다른 query들의 positive passage들을 해당 query의 negative passage로 동시에 사용하는 방법입니다. 구현이 간편하고 랜덤성이 보장되어 매우 널리 쓰이는 방식입니다.

2. **BM25 Hard Negatives**

   BM25 알고리즘으로 query와 가장 유사하지만 실제 답변(passage)은 아닌 candidate들을 선별해 negative sample로 활용합니다.
   
	 - 만약 BM25 상위 후보군 안에 진짜 정답 passage가 있다면 사전에 휴먼 레이블링 등을 통해 반드시 제외해야 합니다.
	 - BM25 Hard Negatives는 query와 keyword overlap 등 표면상 유사도가 매우 높으나 실질적으로 답변 역할은 하지 않는 passage들이기 때문에 ‘모델 혼동’을 극대화시켜 효과적인 negative 역할을 수행할 수 있습니다.

실제 Dense Retrieval 시스템에서는 in-batch negatives와 BM25 hard negatives 두 방식을 모두 병행하여 사용하면 더욱 강력한 성능 향상을 기대할 수 있습니다.

---
