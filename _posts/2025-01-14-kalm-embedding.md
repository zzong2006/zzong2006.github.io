---
layout: post
title: 임베딩도 더 좋은 데이터가 필요하다, KaLM-Embedding
date: 2025-01-14 23:00:00
giscus_comments: true
categories: paper-review
toc:
  beginning: true
tags: embedding RAG LLM
---

KaLM-Embedding이라는 multi-lingual 임베딩 모델을 소개한다. Qwen2-0.5B 기반 임베딩 모델에 좋은 데이터를 부어서 임베딩 성능을 높인 전략이다.

## Massive Dataset

기존의 유명한 임베딩 모델들과 비교했을때 fine-tuning 데이터 양의 비율을 크게 높인걸 확인할 수 있다.

![Image](https://i.imgur.com/DXEs65z.png){: width="100%"}

약 70개 이상의 학습 dataset 을 사용했으며, 대부분 중국어나 영어로 구성된 데이터로 구성되었다. 하지만 다국어 케이스에서도 성능이 좋았다고 함.

## Proposed Methods

더 많으면서 깨끗하고, 다양하고, 도메인 특화된 학습 데이터를 구하는 세가지 방법

1. Diversity: LLM에서 추출한 다양한 예제를 생성하는 페르소나 기반 합성 데이터 
2. Quality: 덜 유익한 샘플을 제거하는 ranking consistency filtering
3. Efficiency: 학습 효율성을 높이는 semi-homogeneous task batch

### (1) Persona-based Synthetic Data 

- Qwen2-72B-Instruct를 사용하여 55만 개의 합성 데이터를 생성:  6 types of tasks with 40k unique instructions
- Persona Hub 에서 시스템 프롬프트를 랜덤으로 추출하여 domain diversity 를 높임

### (2) Ranking Consistency Filtering

![Image](https://i.imgur.com/EHjO00K.png){: width="100%"}

어떤 쿼리는 너무 광범위해서 모든 문서와 연관도가 높아서, 하나의 쿼리가 여러개의 문서에 positive case 로 고려될 수 있다. 이런 경우 hard negative mining 과정에서 noisy 한 데이터로 처리될 수 있다.

이러한 문제를 해결하기 위해, query 와 corpus 의 유사도를 계산시, positive document 가 top-k 안에 들지 못한 경우 해당 데이터를 제거하는 방식을 취했다.

### (3) Semi-homogeneous Task Batch

**최종 모델에 적용된 방법은 아니지만**, 제안 느낌으로 소개되었다.

![Image](https://i.imgur.com/8daD7KG.png){: width="70%"}

동일한(homogeneous) task 내에서 negative sample 을 뽑으면 in-batch negative sample 에서 hardness 를 높이므로 성능에 좋은 영향을 줄 수 있지만, 동시에 대용량 데이터를 다룬다고 생각해보면 false negative 의 위험도 감수해야 한다.

이러한 문제를 해결하기 위해, 각 task 에서 일정 비율로 샘플링을 진행하고 다른 배치로 할당하는 방식을 시도했다고 한다.

아래는 semi-homogeneous ratio (다른 taks 끼리 얼마나 데이터를 섞을지 비율) 에 따른 MTEB 점수 결과이다.

![Image](https://i.imgur.com/SktSktk.png){: width="50%"}

보다시피 semi-homogeneous ratio 가 높으면 성능이 감소해서 최종 모델에는 채택이 되지 않았다 (근데 왜 논문에는 소개했을까..).

### (4) Matryoshka Representation Learning (MRL)

이 외에도 Matryoshka Representation Learning 방식을 취해서 896, 512, 256, 128, and 64 차원에 대해서 loss weight 를 1.0, 0.3, 0.2, 0.1, and 0.1 로 설정하고 학습을 진행했다고 한다.

아래 실험 결과에서도 차원수가 작으면 MRL 방식이 효과가 좋은것으로 보인다.

![Image](https://i.imgur.com/fkz5LZg.png){: width="50%"}

## Ablation Study

![Image](https://i.imgur.com/5rYgKvt.png){: width="70%"}

가장 효과가 좋았던건 task instruction ... 인데, 이건 임베딩 모델을 파인튜닝 할때 task 마다 instruction 을 다르게 주는 방식이다.

아래는 그 예시 (역시 diversity 를 높이는 방식이 효과가 좋다).

![Image](https://i.imgur.com/7yQXsZj.png){: width="100%"}

그나저나 페르소나 데이터는 왜 ablation 결과에 없을까?

## 느낀점

많은 시도를 해본것 같은데, 결국 다양한 데이터가 중요하다는걸 다시 느낀 report paper 였다.

## References

- [KaLM-Embeddings: Superior Training Data Brings A Stronger Embedding Model](https://arxiv.org/pdf/2501.01028)
