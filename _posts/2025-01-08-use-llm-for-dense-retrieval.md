---
layout: post
title: LLM 을 이용한 Dense Retrieval, LLaRA
date: 2025-01-11 16:00:00
giscus_comments: true
categories: paper-review
toc:
  beginning: true
  sidebar: left
tags: LLM dense_retrieval
---

## LLM vs. Dense Retrieval

BERT 와 같은 모델이 아닌 decoder-only LLM 으로 구성된 모델에서 임베딩을 추출하면 뭐가 문제일까? 

- LLM 은 텍스트 생성 작업을 위해 학습되었기 때문에, 토큰 예측을 위한 임베딩을 학습하게 된다. 이 때문에 임베딩은 주로 주변 토큰과 미래 토큰에 집중된다.
- 반면, dense retrieval 은 전체 문맥에 대한 전역적인 의미를 표현하는 임베딩을 필요로 한다. 

이러한 차이는 LLM 을 dense retrieval 에 직접 적용하는 것을 제한한다.

### Methodology

다음과 같이 토크나이징된 입력 시퀀스 $T: [CLS], t_1, ..., t_N, [EOS]$ 가 주어졌다고 가정하자.

BERT 에서는 다음 두가지 방법으로 임베딩을 추출하는 것이 일반적이다.

- $e_t ← \text{BERT}(T)[CLS]$
- $e_t ← \text{AVG}(\text{BERT}(T))$: mean pooling

하지만 LLM 에서 임베딩을 추출하려면, 제일 마지막 토큰인 `</s>` 또는 $\text{[EOS]}$ 를 사용한다. 예를 들어, LLaMA 에서는 다음과 같이 임베딩을 추출한다.

$e_t ← \text{LLaMA}(T)[⟨\text{EOS}⟩]$

하지만 LLM 에서의 임베딩은 전체 문맥이 아니라 local 과 near-future semantic 에 집중되어 있기 때문에, 전체 문맥을 표현하는 임베딩을 추출하는 것이 어렵다.

## LLaRA

위와 같은 LLM 의 한계를 극복하고 dense retrieval 에 적용하기 위해서 LLaRA 라는 방법을 제안한다. LLaRA 는 일종의 비지도 생성형 pretraining 이라고 볼 수 있으며, 두 전처리 훈련 작업에 기반한다.

![LLaRA](https://i.imgur.com/uUtuEIw.png){: width="100%"}

1. EBAE (Embedding-Based Auto-Encoding): LLM 이 입력 문장을 구성하는 토큰들을 예측할 수 있도록 하는 훈련. 주로 similarity search 에 사용된다.
2. EBAR (Embedding-Based Auto-Regression): EBAE 와 유사하지만, 입력 문장의 다음 문장(next sentence)을 예측할 수 있도록 하는 훈련. 주로 question answering 에 사용된다.

LLaRA 에서는 sentence-level features 을 예측하는 것은 LLM 의 linear projection 을 통해 이루어지고, 추가적인 decoding process 는 필요하지 않다. 즉, 기존의 pretrained model 에 대해 LLaRA 를 적용하는 것이 가능하므로, 효율적인 접근 방법이라고 할 수 있다.



## Reference

paper

- [Making Large Language Models A Better Foundation For Dense Retrieval](https://arxiv.org/pdf/2312.15503)

Others

- [BAAI/bge-reranker-v2-gemma (huggingface model)](https://huggingface.co/BAAI/bge-reranker-v2-gemma)
- [FlagEmbedding (github)](https://github.com/FlagOpen/FlagEmbedding)
