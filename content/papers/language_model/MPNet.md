---
title: "MPNet"
tags: ["language_model", "Microsoft", "NIPS", "NLP", "nlp", "paper_review", "y2020"]
---

>MPNet - Masked and Permuted Pre-training for Language Understanding

# A) Abstract

[[Bidirectional Encoder Representations from Transformers|BERT]] 과 XLNet 의 장점을 가지면서 단점을 극복한 pre-training 학습 모델.

BERT 단점

* 예측된 토큰들의 의존성을 무시한다.

XLNet 단점

* 문장의 포지션 정보를 전체적으로 활용하지 못한다. 그래서 pre-training 과 fine-tuning 간 위치적 불일치 (position discrepancy) 가 생긴다.

MPNet 은 [[permuted language modeling|PLM]] 방식을 통해 예측된 토큰간의 의존성을 활용한다. 그리고 auxiliary 위치 정보를 모델의 입력으로 받아서 전체 문장을 보아 위치적 불일치를 줄인다.

# B) Discussion

[[Kaggle]] 대회에서 사용되는 것 같아서 한번 찾아봤다: [Retriever Ensemble | Kaggle](https://www.kaggle.com/code/kojimar/retriever-ensemble)

# C) Related

* [paper](https://proceedings.neurips.cc/paper/2020/file/c3a690be93aa602ee2dc0ccab5b7b67e-Paper.pdf)

# D) References
