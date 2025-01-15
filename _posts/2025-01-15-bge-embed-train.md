---
layout: post
title: BGE 임베딩 학습 방법 탐방해보기 
date: 2025-01-15 10:35:00
giscus_comments: true
categories: code-review
toc:
  beginning: true
tags: embedding RAG LLM finetuning WIP
---

성능 좋은 한국어 임베딩 중에 [BAAI/bge-multilingual-gemma2](https://huggingface.co/BAAI/bge-multilingual-gemma2) 가 있다.

이 임베딩 모델을 커스텀 데이터셋으로 튜닝하고 싶은데 어떤식으로 진행하면 좋을지 확인해보자.

[FlagEmbedding](https://github.com/FlagOpen/FlagEmbedding/tree/master/examples/finetune/embedder#2-data-format) 에서 파인튜닝을 위한 간단한 문서를 찾아볼 수 있다.

## Dataset

학습 데이터셋은 [hanhainebula/bge-multilingual-gemma2-data](https://huggingface.co/datasets/hanhainebula/bge-multilingual-gemma2-data/viewer/multilingual_miracl/ko_train) 에서 확인할 수 있다. 구분하기 쉽게 한국어 데이터셋 위주로 구성했다.

query, pos, neg, pos_scores, neg_scores, prompt 로 구성되어 있다. pos 와 neg 는 각각 쿼리와 관련된 문서들과 관련이 없는 문서들을 의미한다. pos 와 neg 모두 여러개의 sentences 로 구성되어 있다.

pos_scores 와 neg_scores 는 pos, neg 의 각 문서에 대한 점수를 의미하고, knowledge distillation 과정에서 사용되는 점수인것으로 보인다. 구체적인 방법은 찾아봐야 할것 같음 (TODO).

prompt 는 retrieval 과정에서 query 와 함께 사용할 문장인것으로 보인다.

### 예시 샘플

- query : e스포츠란?
- pos: E스포츠\n일렉트로닉 스포츠(), 또는 간단히 줄여서 e스포츠()는 컴퓨터 통신이나 인터넷 따위를 통해서 온라인상으로 이루어지는 게임을 통틀어 이르는 말이다. (.. 생략 ..)
- neg: 국제 e스포츠 연맹\n국제e스포츠연맹은 2014년 7월부터 종목에 따라 남성부와 여성부로 분리하던 정책을 개정하여 여성도 남성부에 참가할 수 있도록 하였다.
- pos_scores: 90.75
- neg_scores: 89.81
- prompt: Given a question, retrieve Wikipedia passages that answer the question.

## Finetuning process

Negative mining -> Teacher Scores (optional) -> Data split -> Finetuning 순으로 진행된다.

### Negative Mining

임베딩 모델을 학습할 때 negative examples 은 매우 중요하다. 만약 특정 query 에 대해 negative text 가 없다면, 전체 corpus 에서 랜덤으로 샘플링해서 negative 로 사용할 수 있다.

FlagEmbedding 에서 지원하는 negative examples 샘플링은 상당히 직관적인데 ([github code](https://github.com/FlagOpen/FlagEmbedding/blob/master/scripts/hn_mine.py)), 다음과 같은 스텝을 거쳐서 뽑는다.

1. query 와 corpus 를 준비한다. 
2. faiss 를 이용해서 index 를 구성하고, 각 query 마다 top-k 문서를 corpus 에서 뽑는다 (일반적으로 2 ~ 200).
3. 뽑은 문서들 중에서 쿼리와 positive 관계가 있는 문서들은 제외하고 나머지를 뽑아서 negative 로 사용한다.
   1. negative 수준의 난이도를 낮추고 싶다면, top-k 를 더 낮추면 된다 (60 ~ 300).
4. 만약 뽑은 negative 가 충분하지 않다면, 전체 corpus 에서 랜덤하게 뽑아서 채워준다.

### Teacher Scores

reranker 모델(e.g. [BAAI/bge-reranker-v2-m3](https://huggingface.co/BAAI/bge-reranker-v2-m3))을 이용해서 query 와 각 pos, neg 문서들의 점수를 계산한다.

계산된 점수는 실제 학습에서 아래와 같이 loss 계산에 사용된다 ([코드 참고](https://github.com/FlagOpen/FlagEmbedding/blob/b7efd286adbecff049949f3717b21a7b21c9d5ed/FlagEmbedding/abc/finetune/embedder/AbsModeling.py#L280-L318)).

```python
def distill_loss(kd_loss_type, teacher_targets, student_scores, group_size=None):
  """
  teacher_targets: (batch_size, group_size) / (world_size * batch_size, group_size)
  student_scores: (batch_size, group_size) / (world_size * batch_size, group_size)
  """

  return - torch.mean(
      torch.sum(torch.log_softmax(student_scores, dim=-1) * teacher_targets, dim=-1)
  )
```

여기서 group_size 는 `group_size = p_reps.size(0) // q_reps.size(0)` 과 같이 한 query 가 처리할 수 있는 pessage 수를 의미하는데, 각 그룹당 local 의 개념을 가지고 있는것 같다.

### Data split (by length)

학습할 데이터를 일정 길이 구간에 따라 나눈다: [0, 500], [500, 1000], [1000, 1500] ...

여기서 데이터 길이란 각 샘플 (query, pos, neg) 중 가장 긴 문장에 대한 길이를 의미한다.
