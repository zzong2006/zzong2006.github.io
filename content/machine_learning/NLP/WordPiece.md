---
title: "WordPiece"
tags:
  - tokenization
  - NLP
aliases: []
---

# A) WordPiece ?

[[Bidirectional Encoder Representations from Transformers|BERT]], [[Electra]] 에서 쓰여 널리 알려진 subword 토크나이징 방식이다.

# B) Vs. BPE

**[[Byte-Pair Encoding Tokenization|BPE]] 처럼 두 조각을 합쳐 어휘를 키우지만, 어떤 쌍을 합칠지 고르는 기준이 다르다.**

- BPE 는 가장 **자주** 붙어 나오는 쌍을 합친다.
- WordPiece 는 각자 나오는 횟수에 비해 **유난히 자주** 붙어 나오는 쌍을 합친다.

이 기준은 아래 점수로 계산한다. 학습 데이터의 [[likelihood]] 를 가장 크게 올리는 쌍을 고르는 것과 같다.

$$
\text{score}(a, b) = \frac{\text{freq}(ab)}{\text{freq}(a) \times \text{freq}(b)}
$$

- `s` 와 `t` 처럼 둘 다 흔한 글자는 붙어 나오는 횟수가 많아도 분모가 커서 점수가 낮다.
- `f` 와 `a` 처럼 따로는 드문데 나올 때마다 붙어 나오는 쌍은 횟수가 적어도 점수가 높다.
- 같은 데이터로 BPE 와 WordPiece 의 첫 병합을 비교한 예시는 [[tokenization]] 노트에 있다.

# C) 토큰화 규칙

- 단어 중간에서 이어지는 조각에는 `##` 을 붙인다. 예를 들어 `hugs` 는 `hug` `##s` 가 된다.
- 단어 앞에서부터 어휘에 있는 가장 긴 조각을 차례로 떼어 낸다.
- 끝까지 쪼개지지 않으면 단어 전체를 `[UNK]` 하나로 바꾼다. BPE 는 모르는 글자 자리만 `[UNK]` 가 되는 것과 다르다.

# D) References

* [Summary of the tokenizers](https://huggingface.co/docs/transformers/tokenizer_summary#wordpiece)
* [Hugging Face LLM course: WordPiece tokenization](https://huggingface.co/learn/llm-course/chapter6/6)
* 이 논문에서 소개되었다: [Japanese and Korean Voice Search (Schuster et al., 2012)](https://static.googleusercontent.com/media/research.google.com/ja//pubs/archive/37842.pdf)
