---
tags: ["summarization", "NLP"]
aliases: ["Bidirectional and Auto-Regressive Transformers"]
---

# A) BART란?

[[Bidirectional Encoder Representations from Transformers|BERT]]와 [[GPT]]의 구조를 결합한 모델로, 특히 [[summarization]](요약) 작업에서 우수한 성능을 보인 것으로 알려져 있습니다. MASS와 달리, BART는 Encoder에 다양한 Noise를 추가하는 방식으로 더욱 뛰어난 성능을 기록하였습니다.

# B) 학습 방식

BART는 입력 문장의 일부에 노이즈를 추가한 뒤, 이를 원본 문장으로 복원하도록 학습하는 [[autoencoder]] 구조를 사용합니다.

# C) 한국어 BART 모델

한국어에 특화된 BART 모델로는 다음과 같은 것들이 있습니다.

* KoBART-base: [GitHub - SKT-AI/KoBART: Korean BART](https://github.com/SKT-AI/KoBART)
  * 모델 크기: 124M
  * 토크나이저: Character BPE tokenizer
	* vocabulary 크기: 30,000
* 추후 공개 예정 (TBA)
