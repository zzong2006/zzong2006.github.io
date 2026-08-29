---
title: "RoBERTa"
tags:
  - language_model
  - -
  - NLP
  - nlp
  - paper_review
  - NLP
  - y2019
  - BERT
aliases:
  - RoBERTa
  - A Robustly Optimized BERT Pretraining Approach
---

# A) Roberta ?

Pretrained model on English language using a [[masked language modeling]] (MLM) objective.

# B) Vs. BERT

**[[Bidirectional Encoder Representations from Transformers|BERT]] 와 차이점**

* large-scale text copora dataset (160GB)
* dynamic masking
* model input format and next sentence

## B.1) Dynamic Masking

매 epoch 마다 각 training instance 에서 같은 mask 를 사용하는 것을 피하기 위해서 epoch 마다 다른 masking 사용한다.

예를 들어 data 를 10 개 복제하여 각 sequence 가 40 epoch 에 걸쳐 10 가지 방법으로 masking 되도록 처리한다면, 학습 중 동일한 mask 는 4 번만 보게 된다.

# C) References

* [arxiv - RoBERTa: A Robustly Optimized BERT Pretraining Approach](https://arxiv.org/abs/1907.11692)
* [pororo/BrainRoBERTa.py at master · kakaobrain/pororo · GitHub](https://github.com/kakaobrain/pororo/blob/master/pororo/models/brainsbert/BrainRoBERTa.py)
