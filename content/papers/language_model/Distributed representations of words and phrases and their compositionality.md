---
tags: ["language_model", "NIPS", "nlp", "paper_review", "word2vec"]
---

[paper link](https://proceedings.neurips.cc/paper/2013/file/9aa42b31882ec039965f3c4923ce901b-Paper.pdf)

# A) Abstract

[[skip-gram]] 모델의 extension 을 제안함으로써 학습 속도와 vector quality 상승을 보였다.

* How? subsampling of the frequent words
* [[negative sampling]] 제안 ([[hierarchical softmax]] 의 alternative)

## A.1) 기존 방식의 문제점

단어 순서를 고려하지 못하고, 관용 (idiomatic) 어구에 대한 표현이 불가능

### A.1.1) 예시

“Canada” 그리고 “Air” -> “Air Canada”
