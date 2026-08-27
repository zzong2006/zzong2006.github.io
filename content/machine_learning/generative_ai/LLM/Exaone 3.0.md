---
tags: ["LG"]
---

# A) EXAONE 3.0

LG AI 연구소에서 개발한 대형 언어 모델 (LLM) 중 최초로 공개된 EXAONE 3.0 을 소개합니다. 이 모델은 instruction-tuning 기법을 적용하여 성능이 더욱 향상되었습니다.

## A.1) 주요 특징

* **최대 컨텍스트 길이**: 4,096 토큰
* **기술적 요소**:
  * Rotary Position Embeddings (RoPE)
  * Grouped Query Attention (GQA)

## A.2) 한국어 처리 방식

EXAONE 3.0 은 MeCab 을 이용해 한국어 corpora 를 먼저 토크나이징한 후, BBPE (byte-level byte-pair encoding) 토크나이저를 사용하여 학습했습니다. 이 때 사용된 어휘 크기는 102,400 입니다.

It results in a similar compression ratio in English but a lower compression ratio in Korean over existing tokenizers. A lower compression ratio indicates that the tokenizer generates fewer tokens per word, which can be beneficial as it reduces the likelihood of over-tokenization. This is particularly important for Korean language due to its agglutinative nature, where words can be formed by combining multiple morphemes, thus leading to improved model performance and generation.

# B) Exaone 3.0

Exaone 3.0 은 기존의 토크나이저에 비해 영어에서는 유사한 압축률을 보이지만, 한국어에서는 더 낮은 압축률을 나타냅니다. 낮은 압축률은 단어당 생성되는 토큰 수가 적다는 것을 의미하며, 이는 과도한 토크나이징의 가능성을 줄여줍니다. 특히 한국어는 여러 형태소가 결합하여 단어를 형성하는 교착어적 특성을 가지고 있기 때문에, 이러한 점에서 모델 성능과 생성 능력이 향상될 수 있습니다.NE 3.0 은 Llama 3.0 과 동일한 구조를 가지고 있습니다.

# C) References

* Huggingface: [LGAI-EXAONE/EXAONE-3.0-7.8B-Instruct · Hugging Face](https://huggingface.co/LGAI-EXAONE/EXAONE-3.0-7.8B-Instruct)
