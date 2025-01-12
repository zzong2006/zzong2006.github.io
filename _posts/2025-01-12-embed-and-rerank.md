---
layout: post
title: Embedding 과 Reranker 은 무슨 차이일까?
date: 2025-01-12 10:00:00
giscus_comments: true
categories: miscellaneous
toc:
  beginning: true
  sidebar: left
tags: Retrieval RAG
---

임베딩과 리랭킹 모델은 어떤 차이가 있는지 궁금해서 찾아봤다.

## Embedding

임베딩 모델은 말 그대로 text 를 임베딩으로 변환하는 모델이다.

query 와 passage 를 입력으로 받아서, 임베딩 모델은 각 임베딩을 출력하고, 유사도 계산으로 두 임베딩을 활용할 수 있다.

## Reranker

리랭킹 모델은 임베딩 모델과 다르게 입력으로 question 과 document 를 입력으로 받아서, 직접적으로 유사도를 계산하는 방식이다. 즉, 임베딩을 생성하지 않고, relevance score 를 계산한다.

score 는 일반적으로 sigmoid 함수를 통해서 [0,1] 사이의 float 값으로 변환된다.

## Reference

Reranker

- [FlagEmbedding - reranker](https://github.com/FlagOpen/FlagEmbedding/tree/master/examples/inference/reranker)
- [BAAI/bge-reranker-base](https://huggingface.co/BAAI/bge-reranker-base)
