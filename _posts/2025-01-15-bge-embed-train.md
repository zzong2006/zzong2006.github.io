---
layout: post
title: BGE 임베딩 학습 방법 탐방해보기 
date: 2025-01-15 10:35:00
giscus_comments: true
categories: code-review
toc:
  beginning: true
tags: embedding RAG LLM WIP
---

성능 좋은 한국어 임베딩 중에 [BAAI/bge-multilingual-gemma2](https://huggingface.co/BAAI/bge-multilingual-gemma2) 가 있다.

이 임베딩 모델을 커스텀 데이터셋으로 튜닝하고 싶은데 어떤식으로 진행하면 좋을지 확인해보자.

[FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding/tree/master/examples/finetune/embedder#2-data-format) 에서 파인튜닝을 위한 간단한 문서를 찾아볼 수 있다.

## Dataset

학습 데이터셋은 [hanhainebula/bge-multilingual-gemma2-data](https://huggingface.co/datasets/hanhainebula/bge-multilingual-gemma2-data/viewer/multilingual_miracl/ko_train) 에서 확인할 수 있다. 구분하기 쉽게 한국어 데이터셋 위주로 구성했다.

query, pos, neg, pos_scores, neg_scores, prompt 로 구성되어 있다. pos 와 neg 는 각각 쿼리와 관련된 문서들과 관련이 없는 문서들을 의미한다. pos 와 neg 모두 여러개의 sentences 로 구성되어 있다.

pos_scores 와 neg_scores 는 pos, neg 의 각 문서에 대한 점수를 의미하고, knowledge distillation 과정에서 사용되는 점수인것으로 보인다. 구체적인 방법은 찾아봐야 할것 같음 (TODO).

prompt 는 retrieval 과정에서 query 와 함께 사용할 문장인것으로 보인다.

## Finetuning process

Negative examples are important during the training of embedding models. If you have no negative texts for a query, you can random sample some from the entire corpus as the negatives.



### 예시 샘플

- query : e스포츠란?
- pos: E스포츠\n일렉트로닉 스포츠(), 또는 간단히 줄여서 e스포츠()는 컴퓨터 통신이나 인터넷 따위를 통해서 온라인상으로 이루어지는 게임을 통틀어 이르는 말이다. (.. 생략 ..)
- neg: 국제 e스포츠 연맹\n국제e스포츠연맹은 2014년 7월부터 종목에 따라 남성부와 여성부로 분리하던 정책을 개정하여 여성도 남성부에 참가할 수 있도록 하였다.
- pos_scores: 90.75
- neg_scores: 89.81
- prompt: Given a question, retrieve Wikipedia passages that answer the question.

