---
title: "SentencePiece"
tags: ["tokenization", "NLP"]
---

# A) SentencePiece ?

[[Byte-Pair Encoding Tokenization|BPE]] 와 unigram language model 을 지원한다.

# B) 특징

1. 유니크 토큰 개수가 정해져 있다: 8k, 16k, 32k.
2. 기존 sub-word 구현체는 입력 문장들이 이미 토크나이징 되어 있다고 가정하는데, 이거는 Raw sentence 로 부터 학습한다. 띄어쓰기가 없는 중국어나 일본어한테 유리한 특징이라고 한다.
3. 입력 텍스트를 유니코드 문자들의 시퀀스로 인식한다.
4. [[Neural machine translation|NMT]] 모델의 정확도 향상에 도움이 되도록 subword regularization 을 적용

# C) 조사

사용처를 찾아보니 메모리 이슈로 많이 고생한다고 한다. 적절한 대안을 찾아보자.

# D) Segmentation(subword) Algorithms

SentencePiece 는 [[Byte-Pair Encoding Tokenization|BPE]] 와 [[unigram lanugage model]] 을 지원한다. 어떤 방식이 더 좋은것인지?

# E) Related

# F) References

* [GitHub - google/sentencepiece: Unsupervised text tokenizer for Neural Network-based text generation.](https://github.com/google/sentencepiece)
