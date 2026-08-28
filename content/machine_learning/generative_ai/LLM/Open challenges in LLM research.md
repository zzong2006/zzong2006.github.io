---
title: "Open challenges in LLM research"
tags: ["LLM", "research"]
---

# A) Open Challenges in LLM Research ?

현재 연구되고 있는 LLM 고도화 방향

특정 부분을 개선하면 우리만의 세일즈 포인트를 찾아볼 수 있을지…?

개선 포인트에서 현실성이 떨어지는 부분은 제외함

## A.1) 할루시네이션 감소

* 창의적인 task 에서는 환각은 일종의 feature 역할을 한다. 하지만 대부분의 경우 버그 취급.
* 환각 현상을 줄이는 것도 중요하고, 현상을 측정하는 metric 을 develop 하는것도 중요하다.
* Ad-hoc 방식의 트릭이 존재: 프롬프트를 자세하게 쓰거나, chain-of-thought, self-consistency 등

## A.2) Context 길이 및 구성 최적화

### A.2.1) Context in LLM

* QA 상황에서 대부분의 질문은 context 를 요구함
	* 예를 들어, “ 최고의 베트남 음식 전문점은 어딘가?” → 미국에서 최고? 베트남에서 최고?
* QA 상황에서 16.5% 의 질문이 context 에 의존적인 질문임
	* 하지만 엔터프라이즈 환경에서는 해당 지분이 더 높을것임
	* 예를 들어, 고객은 단순히 어떤 물품에 대한 질답을 원하지 않고, 사용자 히스토리나, 물품 정보에 기반한 대답을 원함
* (charlie) 요약 task 도 context 가 요구될 수 있음. 단순히 몇 줄 요약이 아니라, 대화 내 여행/쇼핑 내용 위주의 요약을 해달라는 등의 구체적인 요청이 발생할 수 있음.

### A.2.2) Context Length and Efficiency

* Context 길이는 특히 RAG 에서 중요함
	* 길이가 길수록 벡터 DB 에 저장할 수 있는 document 의 context 압축 정도가 향상됨 → 더 많은 데이터에 접근할수록 더 나은 응답을 기대
* 그럼 context 길이를 무작정 늘리면 좋은거냐?
	* 그렇지만도 않음. context 를 어떻게 효율적으로 사용하냐도 중요함.
	* 어떤 논문에서는 언어 모델은 일반적으로 context 의 앞과 끝 부분에 비해, 가운데 부분을 잘 활용하지 못한다고 주장.
* (charlie) 요약 모델의 경우 context 가 긴것을 선호하지만, 막상 context 를 늘렸을 때 실제 성능이 잘 나올 수 있을지는 추가적으로 고려할 문제

## A.3) 더 저렴하고 빠른 LLM

* Four major techniques for model optimization/compression:

	1. Quantization: Quantization reduces a model’s size by using fewer bits to represent its parameters, e.g. instead of using 32 bits to represent a float, use only 16 bits, or even 4 bits.
	2. Knowledge distillation: a method in which a small model (student) is trained to mimic a larger model or ensemble of models (teacher).
	3. Low-rank factorization (e.g. LoRA): the key idea here is to replace high-dimensional tensors with lower-dimensional tensors to reduce the number of parameters.
	4. Pruning

* 매우 challenging 하지만, 새로운 하드웨어가 나오는 이상 피할수 없다.
	* new architecture will need to be optimized for common hardware, and hardware will need to support common architecture

## A.4) Agent 를 더 유용하게

## A.5) 사용자 선호도로 부터 학습하기

## A.6) 비 영어권 LLM 모델 만들기

* 영어 기반 LLM 모델에서 비 영어는 영어보다 성능과 속도 모두 취약하다.
	* 예를 들어, ChatGPT 토크나이저에서는 평균적으로 한국어보다 약 2.2 배 정도 더 많은 토큰이 필요하다 ([All languages are NOT created (tokenized) equal](https://blog.yenniejun.com/p/all-languages-are-not-created-tokenized)).
	* 더 많은 토큰을 요구할수록 (1) prompt 에 입력할 수 있는 정보량이 제한되고, (2) 더 많은 비용이 필요하며, (3) 더 실행에 오랜시간이 걸린다.
* 사실 이 이슈는 모두 어떻게 해결하는지 알고 있다: 모델에 특정 언어의 데이터를 학습시키기만 하면 된다.
* 하지만 쉽지 않다. (1) 영어나 중국어에 비해 좋은 퀄리티의 데이터가 부족하며, (2) 투자할 비용과 노력도 부족하다.
* 다른 언어를 학습할때는 다른 학습 방식이 필요할지 모른다.

# B) Discussion

그 외의 것들

* evaluation
* Interpretable
* multi-modality

# C) References

* [Open challenges in LLM research](https://huyenchip.com/2023/08/16/llm-research-open-challenges.html?utm_source=tldrai)
