---
title: "GPT"
tags:
  - NLP
  - LLM
aliases: ["Generative Pre-trained Transformer"]
---

# A) GPT ?

Generative Pre-trained Transformer. [[transformer]] 의 디코더만 쌓아 만든 언어모델 계열로, 다음 토큰을 예측하는 방식으로 사전학습한다. OpenAI 가 2018년 첫 모델을 낸 이후 [[GPT-2]], GPT-3 로 이어졌다.

# B) 구조: 디코더만 쓴다

원 transformer 는 인코더와 디코더를 모두 갖는 번역 모델이었다. GPT 는 디코더 쪽만 남기고, attention 에 causal mask 를 걸어 각 위치가 자기보다 앞의 토큰만 보게 한다.

이 제약이 학습 목표와 맞물린다. 다음 토큰을 맞히는 것이 목표인데 뒤를 볼 수 있으면 답이 입력에 들어 있게 되므로, 앞만 보게 막아야 한다.

$$
\mathcal{L} = -\sum_{t} \log P(w_t \mid w_1, \dots, w_{t-1})
$$

# C) [[Bidirectional Encoder Representations from Transformers|BERT]] 와의 대비

같은 transformer 를 쓰지만 무엇을 남겼는지와 학습 목표가 갈린다.

| | GPT | BERT |
| --- | --- | --- |
| 구조 | 디코더 (단방향) | 인코더 (양방향) |
| 학습 목표 | 다음 토큰 예측 | [[masked language modeling]] |
| 잘 맞는 작업 | 생성 | 이해·분류 |

BERT 는 가려진 토큰을 맞히므로 앞뒤를 모두 볼 수 있고, 그래서 문장 전체를 이해해 분류하는 작업에 강하다. 대신 생성에는 그대로 쓸 수 없다. GPT 는 반대다.

[[BART]] 는 이 둘을 한 모델에 넣는다. 손상된 입력을 양방향 인코더로 읽고 단방향 디코더로 원문을 복원하게 해서, 이해와 생성을 모두 다룬다. 요약처럼 입력 전체를 파악한 뒤 새 문장을 써야 하는 작업에서 이 구조가 잘 맞았다.

# D) 규모가 만든 변화

GPT-3 에 이르러 모델을 키우자 미세조정 없이 프롬프트의 예시만으로 새 작업을 수행하는 성질이 뚜렷해졌다(in-context learning). 작업마다 모델을 따로 학습시키던 방식에서 하나의 모델에 요청을 적어 넣는 방식으로 넘어가는 계기가 됐고, [[Prompt Engineering]] 이라는 작업이 생긴 배경이기도 하다.

# E) References
