---
title: "EmbeddingGemma - Powerful and LightweightText Representations"
tags:
  - embedding
  - dense_retrieval
  - DeepMind
  - y2025
aliases: []
---


# A) EmbeddingGemma

[(Arxiv) EmbeddingGemma: Powerful and Lightweight Text Representations](https://arxiv.org/pdf/2509.20354)

EmbeddingGemma is an encoder-only transformer model adapted from a pretrained 300M decoderonly Gemma 3 model.
We then employ a mean pooling P, which averages the token embeddings along the sequence axis to generate a single embedding representing all the information in the input

Projection 을 두개 사용: 768 -> 3072 -> 768

- adapt Gemma 3 into an encoder-decoder model using the UL2 objective, following T5Gemma --> then initialize EmbeddingGemma from the encoder of this encoder-decoder model
- 기하학적 임베딩 증류(geometric embedding distillation)**를 통해 대규모 모델의 지식을 전략적으로 흡수하는 혁신적인 학습 방식을 도입
- **spread-out regularizer**를 적용해 모델의 **견고함과 표현력을 강화**
- **다양하게 최적화된 혼합 체크포인트들을 병합**함으로써 **일반화 성능**을 극대화
이 모델을 **Massive Text Embedding Benchmark (MTEB)** 에서 다국어, 영어, 코드 영역에 걸쳐 평가한 결과, **EmbeddingGemma (300M)**는 **최첨단 성능(state-of-the-art)**을 달성했습니다. 특히 **500M 미만의 파라미터를 가진 모델 중**에서는 기존 최고 수준의 모델(상용·오픈소스 모두)을 능가했으며, **두 배 규모의 모델과 비슷한 성능**을 보여 **탁월한 성능 대비 비용 효율**을

더욱 놀라운 점은, **모델 가중치를 양자화(quantization)**하거나 **임베딩 출력 차원을 축소(truncation)**해도 이러한 우위가 유지된다는 것입니다. 덕분에 **저지연·고처리량**이 필요한 **온디바이스(on-device)** 응용 환경에 특히 적합
