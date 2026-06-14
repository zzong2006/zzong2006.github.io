---
title: "Doc2Vec"
tags: ["NLP"]
---

# A) Doc2Vec ?

문서 내 단어를 벡터로 임베딩하는 [[Word2Vec]] 과 달리, 전체 문서를 벡터로 임베딩하는 모델이다.

일반적으로 Paragraph Vector model 이라 불리며, Word2Vec 에서 얻어지는 벡터를 평균내는 방식보다 효과가 좋다고 알려져있다.

핵심 아이디어는 다음과 같다: Word2Vec 에서 단어를 벡터로 취급하는 것처럼, 문서도 어떤 하나의 벡터로 취급하는 것이다. 그리고 [[CBOW]] 또는 [[skip-gram]] 과 같은 전략을 취한다. 예를 들어 CBOW 의 경우, word vector 들과 document vector 를 context vector 로 입력을 받고 target word 를 예측하는 방법으로 학습할 수 있다.

# B) Related

# C) References

* https://radimrehurek.com/gensim/auto_examples/tutorials/run_doc2vec_lee.html
