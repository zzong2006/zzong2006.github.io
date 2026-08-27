---
tags: ["MLOps", "LLM", "generative_model", "server", "inference", "pipeline"]
aliases: ["FMOps"]
---

# A) LLMOps vs. [[MLOps]]?

Reference: [대규모 언어 모델의 핵심 기술 LLMOps를 알아보자! | KT Enterprise](https://enterprise.kt.com/bt/dxstory/2530.do)

LLMOps 와 MLOps 는 머신러닝 모델을 효율적으로 운영하고 관리하기 위해 존재합니다. 목적은 같지만, 명확한 차이점이 있는데요. LLMOps 는 주로 대규모 언어 모델에 MLOps 는 기계 학습 모델에 적용되죠. 차이점을 알면 LLMOps 를 더 쉽게 이해할 수 있습니다.

## A.1) 컴퓨팅 리소스

일반 머신러닝 모델과 달리 초거대언어모델 (LLM) 을 학습하고 조정하려면 대규모 데이터셋에서 많은 연산을 수행해야 하는데요. LLMOps 는 강력한 컴퓨팅 파워를 필요로 합니다. 특수한  GPU 나 TPU 와 같은 하드웨어를 사용해야 하죠.

## A.2) 전이학습 (Transfer Learning)

일반적인 머신러닝 모델은 사전 학습 없이 맨땅에서 학습을 진행하는데요. 초거대언어모델 (LLM) 은 기존의 모델을 기반으로 특정 분야의 성능을 높이기 위해 추가 데이터를 학습하는 파인튜닝이라는 작업을 거칩니다.

## A.3) [[Prompt Engineering]] & [[Retrieval-Augmented Generation|RAG]]

일반 MLOps 와 차별을 가지는 부분이 있음.

PE 도 버저닝이 필요하고, RAG 방식 역시 버저닝이 필요하다.

## A.4) 하이퍼파라미터 조정의 목적

비용 절감과 효율적인 연산을 위해 하이퍼파라미터 조정을 합니다. 
