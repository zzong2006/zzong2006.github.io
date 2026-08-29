---
title: "WordPiece"
tags:
  - tokenization
  - NLP
aliases: []
---

# A) WordPiece ?

[[Bidirectional Encoder Representations from Transformers|BERT]], [[Electra]] 에서 사용되어 인기가 많아진 토크나이징 방식.

# B) Vs. BPE

[[Byte-Pair Encoding Tokenization|BPE]] 와 비슷하지만, 다른점은 symbol pair 를 선택하여 단어집에 넣는 방식에 있다. 가장 빈도수가 높은 pair 를 찾기보다는 WordPiece 는 학습 데이터의 [[likelihood]] 를 최대화하는 방향으로 선택한다.

우도를 최대화 하는 것은 특정 심볼 쌍 (symbol pair) 을 찾는것과 같다. 심볼 pair 중에서 첫번째 심볼에 따라나올 심볼 중 가장 그럴듯한 (확률이 높은) 심볼을 찾는것이다.

> Maximizing the likelihood of the training data is equivalent to finding the symbol pair, whose probability divided by the probabilities of its first symbol followed by its second symbol is the greatest among all symbol pairs. E.g. “u”, followed by “g” would have only been merged if the probability of “ug” divided by “u”, “g” would have been greater than for any other symbol pair.

# C) References

* [Summary of the tokenizers](https://huggingface.co/docs/transformers/tokenizer_summary#wordpiece)
* 이 논문에서 소개되었다: [Japanese and Korean Voice Search (Schuster et al., 2012)](https://static.googleusercontent.com/media/research.google.com/ja//pubs/archive/37842.pdf)
