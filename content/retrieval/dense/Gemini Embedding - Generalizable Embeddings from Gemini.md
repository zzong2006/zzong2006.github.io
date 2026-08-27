---
tags: ["embedding", "dense_retrieval", "Google", "Gemini"]
---

[2503.07891](https://arxiv.org/pdf/2503.07891)

# A) 🏗️ 모델 구조

- **입력 처리**: 입력 텍스트를 Gemini 기반 Transformer로 처리
- **Pooling**: Mean pooling을 사용해 전체 시퀀스를 하나의 벡터로 요약
- **투영**: 선형 투영층을 통해 원하는 차원의 임베딩 생성 (최대 3072차원)

## A.1) 🎯 학습 방식

- **Loss Function**: Noise-Contrastive Estimation (NCE) 기반
	- Query, Positive, Hard Negative를 포함한 contrastive learning
	- 다양한 임베딩 차원에 대해 MRL(Multi-loss Representation Learning) 적용
- **학습 단계**:
	
	1. **Pre-finetuning**: 대규모 noisy 데이터로 초기 적응
	2. **Finetuning**: 다양한 작업별 데이터로 세밀한 조정
	3. **Model Soup**: 여러 체크포인트를 평균화해 일반화 성능 향상

## A.2) 🧪 평가 결과

- **벤치마크**: MMTEB, MTEB(Eng), MTEB(Code), XOR-Retrieve, XTREME-UP 등
- **성과**:
	- 모든 벤치마크에서 **1위 성능** 기록
	- 특히 분류, 클러스터링, 검색 작업에서 두드러진 성능 향상
	- 저자원 언어(예: Assamese, Hindi)에서도 뛰어난 성능

## A.3) 🧬 데이터 품질 향상 전략

- **Synthetic Data Generation**: Gemini를 활용해 다양한 작업에 대한 고품질 합성 데이터 생성
- **Data Filtering**: Gemini로 잘못된 예시 제거
- **Hard Negative Mining**: Gemini 기반 평가로 효과적인 부정 예시 선택

## A.4) 🔍 Ablation Study 요약

- 영어 데이터만으로도 다국어 작업에서 강력한 성능 발휘
- 작업 다양성이 언어 다양성보다 더 중요한 요소로 작용
- Synthetic 데이터 사용 시 성능이 최대 +17.6 향상됨

### A.4.1) **Hard Negative Mining**

- Gemini를 활용해 retrieval 작업에서 어려운 부정 예시를 선택
- 적절한 수의 hard negative는 성능 향상, 과도한 수는 오히려 성능 저하

## A.5) Pre-finetuning이란?

- **Pre-finetuning**은 본격적인 학습(finetuning)에 들어가기 전에, 모델을 **대규모 데이터에 먼저 적응시키는 단계**예요.
- 이 단계에서는 **노이즈가 많고 정제되지 않은 데이터**를 사용해서 모델이 "텍스트를 임베딩하는 방식"에 익숙해지도록 합니다.
- 특히 Gemini는 원래 **생성형 모델**이라서, 임베딩처럼 **인코딩 중심의 작업**에 적응시키려면 이 단계가 꼭 필요해요.

### A.5.1) 📌 특징 요약

| 항목  | 설명                                                    |
| --- | ----------------------------------------------------- |
| 목적  | Gemini의 생성 능력을 임베딩 작업에 맞게 조정                          |
| 데이터 | 웹에서 수집한 (query, passage) 쌍 등 대규모 noisy 데이터            |
| 방식  | contrastive learning (positive만 사용, hard negative 없음) |
| 효과  | 모델이 안정적으로 임베딩을 생성할 수 있도록 기반 마련                        |

## A.6) 🧪 왜 중요한가?

- Pre-finetuning 없이 바로 학습하면 성능이 **30~40점대**로 매우 낮게 나와요.
- Pre-finetuning만 해도 성능이 **50점대 이상**으로 크게 향상됨.
- 이후 **정제된 데이터로 finetuning**을 하면 **70점대 이상**까지 올라가요.

요약하자면, Gemini Embedding은 Gemini 모델을 기반으로 만들어졌고, 그걸 임베딩 전용으로 잘 작동하게 만들기 위해 **pre-finetuning**이라는 적응 단계를 거친 거예요. 이게 없으면 모델이 임베딩을 제대로 못 뽑는다고 봐도 무방해요.

## A.7) 🧠 학습 방식: 3단계 훈련 파이프라인

### A.7.1) **초기화 (Initialization)**

- **기반 모델**: Gemini LLM의 파라미터를 그대로 가져와서 임베딩 모델의 초기값으로 사용
- 이 단계는 사실상 "사전 훈련(pre-training)"으로 간주됨
- Gemini의 다국어, 코드 이해 능력을 그대로 임베딩 모델에 이식

### A.7.2) **Pre-finetuning**

- **목적**: Gemini의 생성 중심 구조를 임베딩 중심 구조로 적응시키기
- **데이터**: 웹 기반의 대규모 noisy (query, passage) 쌍
- **특징**:
	- Hard negative 없이 positive만 사용
	- 매우 큰 배치 사이즈 사용 → 안정적인 gradient 확보
	- 많은 학습 스텝 수행 → 모델이 "인코딩"에 익숙해지도록

### A.7.3) **Fine-tuning**

- **목적**: 다양한 작업에 대한 정밀 조정
- **데이터 구성**:
	- Task 다양성: 분류, 검색, 클러스터링 등
	- 언어 다양성: 다국어 포함
	- 코드 작업: CodeSearchNet 등
- **기법**:
	- Hard negative 포함한 contrastive learning
	- 각 배치는 하나의 작업 데이터셋만 포함 → 더 강한 학습 신호
	- 다양한 하이퍼파라미터 조합으로 체크포인트 생성

### A.7.4) **Model Soup**

- 여러 fine-tuning 체크포인트를 평균화하여 일반화 성능 향상
- 다양한 조합 실험 후 최종 모델 구성

## A.8) 🧩 Masking 기법이란?

- 이 masking은 **loss 계산 시 false negative를 방지하기 위한 기법**입니다.
- 특히 **classification 작업**에서 같은 query나 같은 label이 반복될 수 있기 때문에, 잘못된 음성 예시(negative)를 제거해야 합니다.

### A.8.1) 🔍 수식에서의 역할

math

```python
mask(i, j) = 
  0 \quad \text{if } q_i = q_j \text{ or } p^+_i = p^+_j \\
  1 \quad \text{otherwise}
```

- 즉, 같은 query나 같은 positive target을 가진 경우에는 **denominator에서 제외**시켜서 잘못된 비교가 일어나지 않도록 합니다.
- 이로 인해 **false negative로 인한 성능 저하를 방지**할 수 있어요.

## A.9) 💡 왜 중요한가?

- 임베딩 모델은 유사도 기반으로 학습되기 때문에, 잘못된 음성 예시가 들어가면 모델이 혼란을 겪습니다.
- 특히 분류 작업에서는 label 수가 적고 중복이 많기 때문에, 이 masking이 없으면 성능이 크게 떨어질 수 있어요.

### A.9.1) **Hard Negative Mining**

- Gemini를 활용하여 검색(retrieval) 작업에서 모델이 구분하기 어려운 부정 예시(hard negative)를 선별합니다.
- 적절한 수의 hard negative를 사용하면 성능이 향상되지만, 너무 많을 경우 오히려 성능이 저하될 수 있습니다.

---

### A.9.2) **초기화 (Initialization)**

- **기반 모델**: 임베딩 모델의 초기값으로 Gemini LLM의 파라미터를 그대로 가져옵니다.
- 이 단계는 사실상 사전 훈련(pre-training)과 유사하며,
- Gemini가 가진 다국어 및 코드 이해 능력을 임베딩 모델에 효과적으로 이식합니다.

---

### A.9.3) **Pre-finetuning**

- **목적**: Gemini의 주 생성(generative) 구조를 임베딩 중심 구조로 자연스럽게 전환시키는 데 있습니다.
- **데이터**: 웹에서 수집한 대규모 noisy (query, passage) 쌍을 사용합니다.
- **특징**:
	- Hard negative 없이 positive 쌍만 활용합니다.
	- 매우 큰 배치 사이즈를 적용해 안정적인 gradient 흐름을 확보합니다.
	- 충분한 학습 스텝을 통해, 모델이 "인코딩" 방식에 익숙해지도록 만듭니다.

---

### A.9.4) **Fine-tuning**

- **목적**: 다양한 실제 작업(task)에 맞춰 정밀하게 조정하는 과정입니다.
- **데이터 구성**:
	- 작업 다양성: 분류, 검색, 클러스터링 등 여러 형태의 태스크 포함
	- 언어 다양성: 다국어 데이터 반영
	- 코드 관련 작업: CodeSearchNet 등 코드 데이터셋도 포함
- **학습 기법**:
	- Hard negative가 포함된 contrastive learning 방법 적용
	- 각 배치에는 하나의 작업 데이터셋만 사용하여 강한 학습 신호 제공
	- 다양한 하이퍼파라미터 조합으로 여러 체크포인트 생성

---

### A.9.5) **Model Soup**

- 여러 fine-tuning 체크포인트들의 가중치를 평균내어 결합함으로써 일반화 성능을 높입니다.
- 다양한 조합 실험을 거쳐 최종 모델을 구성합니다.

---

## A.10) 🧩 Masking 기법이란?

Masking 기법은 loss 계산 시 잘못된 음성 예시(false negative)가 포함되는 것을 방지하기 위한 방법입니다.

특히 [[classification]] 작업에서는 동일한 query나 label이 반복해서 등장할 수 있기 때문에, 이런 경우에는 음성 예시로 잘못 인식되는 데이터를 제외해야 합니다.

---

### A.10.1) 🔍 수식에서의 역할

수식으로 표현하면 다음과 같습니다:

$$
\text{mask}(i, j) = 
\begin{cases}
0 & \text{if } q_i = q_j \text{ or } p^+_i = p^+_j \\
1 & \text{otherwise}
\end{cases}
$$

즉, 같은 query 또는 같은 positive target을 갖는 경우에는 denominator(분모)에서 제외하여 잘못된 비교가 발생하지 않도록 합니다. 이를 통해 false negative로 인한 성능 저하를 효과적으로 막아줍니다.

---

## A.11) 💡 왜 중요한가?

임베딩 모델은 유사도(similarity)를 기반으로 학습되기 때문에,
잘못된 음성 예시가 들어갈 경우 모델의 혼동과 성능 저하로 이어질 수 있습니다.

특히 분류(classification) 작업처럼 label 종류가 적고 중복 빈도가 높은 상황에서는 masking 기법 없이는 성능 저하 문제가 심각하게 나타날 수 있습니다.
