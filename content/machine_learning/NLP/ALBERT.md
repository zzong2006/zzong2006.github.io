---
title: "ALBERT"
tags:
  - NLP
  - BERT
aliases: ["A Lite BERT for Self-supervised Learning of Language Representations"]
---

# ALBERT

[[Bidirectional Encoder Representations from Transformers|BERT]] 모델의 크기는 줄이고 성능은 높임.

![](https://i.imgur.com/f9OZOOQ.png)

# 학습 방식

Next Sentence Prediction (NSP) 보다 SOP 방식으로 학습을 진행

## Sentence Order Prediction(SOP)

실제로 연속하는 두 문장 (positive example) 과 두 문장의 순서를 앞뒤로 바꾼 것 (negative example) 으로 구성되어 문장의 순서가 옳은지 predict

# References
