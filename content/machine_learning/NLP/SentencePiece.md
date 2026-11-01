---
title: "SentencePiece"
tags:
  - tokenization
  - NLP
aliases: []
---

# A) SentencePiece ?

Google 이 만든 토크나이저 라이브러리다. [[Byte-Pair Encoding Tokenization|BPE]] 와 [[unigram lanugage model|Unigram]] 두 방식을 지원한다. 방식이 아니라 라이브러리라는 점이 [[WordPiece]] 나 BPE 와 다르다.

# B) 특징

1. 어휘 크기(`vocab_size`)는 사용자가 정한다. 기본값은 8,000 이고, 쓰는 모델에 따라 32k(Llama 2)부터 256k(Gemma)까지 다양하다.
2. 기존 subword 구현은 입력이 이미 단어로 나뉘어 있다고 가정하는데, SentencePiece 는 원문(raw sentence)에서 바로 학습한다. 공백도 `▁` 라는 글자로 다루므로 띄어쓰기가 없는 중국어나 일본어에 유리하다.
3. 입력 텍스트를 유니코드 문자의 시퀀스로 본다. 즉 문자에서 출발하는 BPE·Unigram 이다.
4. [[Neural machine translation|NMT]] 모델의 정확도를 높이도록 subword regularization 을 지원한다. 학습할 때마다 한 단어를 여러 방식으로 잘라 넣어 모델이 특정 분할에 덜 의존하게 한다.

# C) byte fallback

**`byte_fallback` 옵션을 켜면 어휘에 없는 글자를 UTF-8 바이트 토큰으로 쪼갠다.**

- 예를 들어 처음 보는 한글 한 글자는 `<0xED>` `<0x95>` `<0x9C>` 처럼 바이트 토큰 3 개가 된다.
- 그래서 `[UNK]` 가 나오지 않는다.
- Llama 2 와 Gemma 가 이 옵션을 쓴다.

**byte-level BPE 와는 출발 단위가 다르다.**

- byte-level BPE 는 처음부터 바이트에서 출발해 바이트끼리 병합한다.
- byte fallback 은 평소에는 문자에서 출발하고, 바이트 토큰은 모르는 글자를 만났을 때 비상용으로만 쓴다.
- 자세한 비교는 [[tokenization]] 노트에 있다.

# D) Segmentation (subword) Algorithms

SentencePiece 는 [[Byte-Pair Encoding Tokenization|BPE]] 와 [[unigram lanugage model]] 을 지원한다 (기본값은 Unigram).

- 어떤 쪽이 낫다고 정해진 것은 없다.
- Unigram 은 한 단어를 여러 방식으로 자를 수 있어서 위의 subword regularization 과 잘 맞는다.
- T5 는 Unigram 을, Llama 2 와 Gemma 는 BPE 를 썼다.

# E) References

* [GitHub - google/sentencepiece: Unsupervised text tokenizer for Neural Network-based text generation.](https://github.com/google/sentencepiece)
* [SentencePiece options](https://github.com/google/sentencepiece/blob/master/doc/options.md) — `vocab_size`, `byte_fallback`, `model_type`
