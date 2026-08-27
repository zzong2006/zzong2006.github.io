---
tags: ["embedding", "IR", "dense_retrieval"]
aliases: ["Qwen3-Embedding", "Qwen3 Embedding"]
---

# A) Qwen3 Embedding

Qwen3 Embedding은 Qwen3 계열 foundation model을 기반으로 만든 dense embedding model이다. 검색, STS, classification, bitext mining처럼 서로 다른 similarity task를 하나의 embedding model로 다루기 위해 대규모 synthetic pair data와 supervised fine-tuning을 함께 사용한다.

[[SPLARE]]처럼 dense model을 sparse representation으로 확장하는 흐름에서는 Qwen3 Embedding이 강한 dense baseline으로 등장한다. 반대로 production retrieval 관점에서는 [[DPR]]식 dual encoder의 현대적인 대형 모델 계열로 보면 이해하기 쉽다.

# B) 핵심 아이디어

1. **Synthetic weak supervision**: Q&A나 논문 같은 공개 데이터에만 의존하지 않고, Qwen3 foundation model로 query-document pair를 직접 합성한다.
2. **다차원 prompt control**: task, language, length, difficulty, query type을 프롬프트에서 조절해 데이터 분포를 넓힌다.
3. **High-quality SFT data filtering**: 합성 데이터 중 cosine similarity가 높은 pair를 선별해 supervised fine-tuning에 다시 사용한다.
4. **Model merging**: 여러 fine-tuned checkpoint를 slerp 기반으로 병합해 robustness와 일반화 성능을 높인다.

# C) Synthetic Dataset

합성 데이터는 retrieval, bitext mining, classification, [[Semantic Textual Similarity|STS]] 등 여러 범주의 text pair를 포함한다. 문서마다 특정 role을 부여하고, 사용자가 그 문서를 검색할 만한 상황을 시뮬레이션해 query를 생성하는 방식이다.

논문 설명 기준으로 약 **150M pair** 규모의 multitask weak-supervision data를 만들고, 이후 cosine similarity **0.7 이상**의 고품질 pair 약 **12M**개를 supervised fine-tuning에 사용한다.

# D) 실무적으로 볼 점

Qwen3 Embedding은 “모델이 커서 좋다”보다 **합성 데이터 설계와 filtering이 성능을 만든다**는 점이 중요하다. 사내 검색 도메인에 적용할 때도 query type, language, difficulty, document role을 명시적으로 나누어 synthetic pair를 만들면 단순 paraphrase 생성보다 검색 학습에 더 쓸모 있는 데이터가 된다.

다만 이미 좋은 pretrained embedding representation을 가진 모델을 도메인 contrastive loss로 세게 밀면 catastrophic forgetting이 생길 수 있다. 이 경우 full fine-tuning보다 LoRA, soft label distillation, checkpoint merging을 먼저 비교하는 편이 안전하다.

# E) References

- [Qwen/Qwen3-Embedding-8B - Hugging Face](https://huggingface.co/Qwen/Qwen3-Embedding-8B)
