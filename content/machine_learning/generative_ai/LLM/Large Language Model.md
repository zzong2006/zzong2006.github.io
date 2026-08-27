---
tags: ["NLP", "LLM"]
aliases: ["LLM"]
---

# A) Prompt 종류

## A.1) Instruction Prompt

```python
Extract the name of the author from the quotation below.
#아래 인용문에서 저자의 이름 추출

“Some humans theorize that intelligent species go extinct before they can expand into outer space. If they're correct, then the hush of the night sky is the silence of the graveyard.” ― Ted Chiang, Exhalation

>> Ted Chiang
```

## A.2) 구문 완성 (Completion) Prompt

구문 완성 프롬프트는 대규모 언어 모델이 다음에 나올 가능성이 높다고 생각되는 텍스트를 작성하려고 하는 방식을 활용

```python
“Some humans theorize that intelligent species go extinct before they can expand into outer space. If they're correct, then the hush of the night sky is the silence of the graveyard.” ― Ted Chiang, Exhalation 

The author of this quote is 

>> Ted Chiang
```

## A.3) 미세 조정 (Fine-tuned) Prompt

충분한 예제로 학습하여 지시가 불필요한 경우.

```python
“Some humans theorize that intelligent species go extinct before they can expand into outer space. If they're correct, then the hush of the night sky is the silence of the graveyard.”
― Ted Chiang, Exhalation
 
###
 
>> Ted Chiang
```

위 예시에서 보듯이 `###` 와 같이 구분 기호를 넣어주지 않으면 모델이 의도한대로 동작하지 않을 수 있다.

## A.4) 그 외

### A.4.1) 코드 작성

* OpenAI 의 코드 특화 모델을 Codex 라고 합니다: https://openai.com/blog/openai-codex
* GitHub copilot (VS Code 및 기타 IDE 에서 코드 자동 완성 지원)

# B) LLM 모델 성능을 높이는 법

출처: [techniques_to_improve_reliability.md](https://github.com/openai/openai-cookbook/blob/main/techniques_to_improve_reliability.md)

LLM 모델이 의도한대로 동작하지 않으면 시도해 볼법한 것들

1. 더 나은 프롬프트 방식을 찾는다.
2. 커스텀 모델을 미세 조정하기 위해 수천 개의 예제를 넣는다.
3. 모델이 작업을 수행할 수 없다고 가정하고 다른 작업을 진행한다.

프롬프트만으로 원하는 말투나 행동이 안정적으로 나오지 않으면 post-training을 고려한다. 특히 자연스러운 한국어 instruction-following은 단순 [[DPO]] 적용보다 SFT, preference tuning, distillation, [[GRPO]] 계열 RL의 역할을 나눠 보는 편이 좋다. 이 관점은 [[LLM Post-Training for Natural Korean]]에 정리해둔다.

## B.1) 더 나은 프롬프트 방식 ([[Prompt Engineering]])

모델이 주어진 명령을 제대로 수행하지 못하거나 문제를 잘 못푼다고 해서 그걸 진짜 못하는건 아니다. 프롬프트 엔지니어링으로 해결할 수 있다. 예를 들어, 수학 문제를 푸는경우 `Let's think step by step` 이라고 입력을 넣어주면 정확도가 크게 향상된다 (참고: [Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)).

일반적으로 ==복잡한 작업을 더 간단한 하위 작업으로 나눔==으로써, 모델의 성능을 높일 수 있다.

**예시** (번역)

* 주어진 텍스트를 원래 언어로 요약해줘 (bad)
* 첫번쨰로 주어진 텍스트의 언어를 식별해. 두번쨰로 해당 언어로 텍스트를 요약해줘. (good)

# C) LLM 셋팅

## C.1) Temperature

세팅 설정을 조정하여, 결과의 완성도를 제어할 수 있다. 가장 중요한 설정 중 하나는 `Temperature`(온도) 다.

`Temperature` 가 0 으로 설정되어 있으면, 같은 프롬프트에 대해 항상 동일하거나 거의 유사한 답변을 받을 수 있고, 1 에 가까울수록 다양한 답변을 얻을 수 있다.

# D) LLM 활용 방안

## D.1) 검색 기능

사용자 질문을 받으면 질문에 대답하는 기능을 개발해보자.

1. 텍스트 데이터를 사이트에서 크롤링해온다.
2. 가져온 텍스트 데이터를 전처리하여 embedding 을 생성한다.
	1. 전처리 시, 모델이 처리할 수 있는 최대 입력 토큰 길이가 있기때문에 맞춰서 잘라줘야 한다.
3. 질문을 받게되면 질문에 대한 임베딩 데이터와 기존 context 간 임베딩 거리를 계산한다.
4. Context 의 전처리된 텍스트 데이터와 임베딩 정보, 그리고 질문에 대한 임베딩 정보 등을 prompt 로 구성하여 LLM 모델에 입력하여 결과를 받아낸다.
	1. 이때 질문에 대한 답변이 어려운 경우, “ 잘 모른다 ” 라는 답변을 하도록 prompt 를 구성할 수 있다.
	   예시) `Answer the question based on the context below, and if the question can't be answered based on the context, say \"I don't know\"\n\nContext: {context}\n\n---\n\nQuestion: {question}\nAnswer:`

# E) LLM의 입력부터 출력까지의 전체 과정

LLM(Large Language Model)이 사용자의 자연어 입력을 받아 다음 토큰(단어)을 생성하는 과정은 다음과 같은 단계로 이루어집니다. 이 설명은 GPT(Generative Pre-trained Transformer)와 같은 생성 모델을 기준으로 합니다.

**1. 입력 (Input) 및 토큰화 (Tokenization)**

* **자연어 입력:** 사용자가 "오늘 날씨는"과 같은 문장을 입력합니다.

* **토큰화:** 모델은 문장을 그대로 이해하지 못합니다. 먼저 문장을 의미 있는 최소 단위인 '토큰(Token)'으로 분해합니다. 예를 들어, "오늘 날씨는"은 ['오늘', '날씨', '는']과 같은 토큰으로 나뉩니다.

**2. 임베딩 (Embedding)**

* 각 토큰은 컴퓨터가 처리할 수 있는 숫자 형태, 즉 '벡터(Vector)'로 변환됩니다. 이를 '임베딩'이라고 합니다.

* 이 벡터는 단어의 의미를 다차원 공간에 표현한 것으로, 의미가 비슷한 단어들은 벡터 공간에서 가까운 위치에 존재하게 됩니다.

**3. 위치 인코딩 (Positional Encoding)**

* 트랜스포머(Transformer)의 기본 구조인 셀프 어텐션은 단어의 순서를 고려하지 않습니다. "나는 너를 좋아해"와 "너는 나를 좋아해"를 같은 단어의 집합으로만 인식할 수 있습니다.

* 이 문제를 해결하기 위해, 각 토큰의 임베딩 벡터에 해당 토큰의 순서 정보를 담은 '위치 인코딩' 벡터를 더해줍니다. 이를 통해 모델은 단어의 위치와 순서를 학습하게 됩니다.

**4. 트랜스포머 블록 (Transformer Block - Decoder)**
위치 정보까지 더해진 벡터들은 여러 개의 트랜스포머 블록을 순차적으로 통과하며 정보가 가공됩니다. 각 블록은 주로 두 가지 핵심 요소로 구성됩니다.

* **마스크드 셀프 어텐션 (Masked Self-Attention):**

	* **셀프 어텐션:** 문장 내의 단어들이 서로 얼마나 중요한 연관성을 갖는지 계산하는 과정입니다. 예를 들어 '그녀'라는 대명사가 문장 앞의 '수지'를 가리키는 것과 같은 관계를 파악합니다.

	* **마스크드(Masked):** GPT와 같은 생성 모델의 가장 큰 특징입니다. **다음 단어를 예측할 때, 현재 예측하려는 위치 뒤에 오는 단어들의 정보는 참고할 수 없도록 가립니다(masking).** 오직 이전에 등장한 단어들만을 바탕으로 다음에 올 단어를 예측해야 하기 때문입니다. 이는 마치 사람이 순서대로 글을 쓰는 것과 같습니다.

* **피드 포워드 신경망 (Feed-Forward Network):**

	* 어텐션을 통해 얻은 문맥 정보를 더욱 복잡하고 깊이 있게 처리하는 단계입니다. 각 토큰에 대해 독립적으로 적용되어 더 풍부한 표현을 학습합니다.

**5. 출력 (Output Layer & Softmax)**

* 마지막 트랜스포머 블록을 통과한 벡터는 '출력 레이어'로 전달됩니다.

* 이 레이어는 모델이 아는 모든 단어(어휘 사전, Vocabulary)에 대한 점수(logit)를 계산합니다.

* '소프트맥스(Softmax)' 함수가 이 점수들을 확률값으로 변환하여, 각 단어가 다음에 올 확률을 나타냅니다. 예를 들어, '맑다' 95%, '흐리다' 4%, '좋다' 1% 와 같이 계산됩니다.

* 모델은 이 확률에 기반해 가장 가능성이 높은 '맑다'를 다음 토큰으로 선택하거나, 확률에 따라 샘플링하여 선택합니다.

**6. 자기회귀 (Autoregressive) 방식**

* "오늘 날씨는" 다음에 "맑다"가 생성되었다면, 이제 모델의 입력은 "오늘 날씨는 맑다"가 됩니다.

* 이 새로운 시퀀스를 다시 모델에 입력하여 그 다음 토큰(예: '입니다')을 생성합니다. 이처럼 이전에 생성된 출력을 다시 입력으로 사용하는 방식을 '자기회귀'라고 하며, 문장이 끝날 때까지(또는 지정된 길이가 될 때까지) 이 과정이 반복됩니다.
