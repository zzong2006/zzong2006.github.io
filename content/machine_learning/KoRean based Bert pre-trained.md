---
title: "KoRean based Bert pre-trained"
tags: ["NLP", "y2020"]
aliases: ["KR-BERT"]
---

# KoRean Based Bert Pre-trained ?

# Tokenizer

* [[Bidirectional Encoder Representations from Transformers|BERT]] 에서 사용하는 일반적인 [[WordPiece]] 방식을 사용하거나 양방향 WordPiece 방식을 사용하여 실험
* 그리고 문자 단위인지 sub- 문자 단위인지에 따라서 실험
	* 여기서 문자 단위는 `춥다` 를 `춥#다` 로 바꾸고, sub- 문자 단위는 `춥#ㅂ다` 로 바꾼다.
	* 문자 단위가 BERT 에서 사용하는 토크나이저
* 실험 결과는 **문자 단위의 양방향 WordPiece** (BidirectionalWordPiece Tokenizer) 를 사용하는 것이 성능이 가장 좋다고 한다.

# 학습데이터

* documents: 20 million (2 천만)
* words: 233 million (2.33 억)

# Discussion

실험 결과를 보면 양방향 방식이 항상 모든 task 에 대해서 가장 좋은 성능을 보이는 것은 아니고, 점수 차이가 그렇게 큰편은 아니다.

그리고 오히려 토크나이징 시간이 늘어나서 인퍼런스 시간에서 감점이 있을 것으로 예상된다.

# References

* [[2008.03979] KR-BERT: A Small-Scale Korean-Specific Language Model](https://arxiv.org/abs/2008.03979)
* [GitHub - snunlp/KR-BERT: KoRean based BERT pre-trained models (KR-BERT) for Tensorflow and PyTorch](https://github.com/snunlp/KR-BERT)
