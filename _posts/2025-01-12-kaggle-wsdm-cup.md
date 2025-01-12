---
layout: post
title: kaggle 의 multilingual-chatbot-arena 대회
date: 2025-01-12 10:00:00
giscus_comments: true
categories: competition
toc:
  beginning: true
tags: kaggle LLM 
---

kaggle 에서 진행되는 [WSDM Cup Multilingual Chatbot Arena](https://www.kaggle.com/competitions/wsdm-cup-multilingual-chatbot-arena/) 대회가 있다.

대회는 모델 a 와 b 의 응답이 주어졌을때 어떤 응답이 더 좋은지 판단하는 모델을 만드는 대회이다.

현재 2025년 01월 12일 기준으로 상위권 리더보드 점수는 accuracy 기준으로 대략 0.700 ~ 0.708 사이의 점수를 기록하고 있다.

[Dicussion 에 작성된 상위권 방식](https://www.kaggle.com/competitions/wsdm-cup-multilingual-chatbot-arena/discussion/552368)을 참고해보니 아래와 같다.

- 모델은 Gemma2-9b-it (bf16): fp16 을 사용했더니 정확도가 감소했다고 함.
- Cross validation 을 통해 학습하며, fold 는 5개 (fold 0 에서 가장 좋은 성적을 보이는듯 함)
- 길이(max_length) 는 2048 보다는 3072 가 더 좋은 스코어를 보여주는 것으로 보임
- TTA 를 수행하는 경우 accuracy 가 꽤 올라가는 모습을 보인다

그 외에도 inference 를 빠르게 하는것이 핵심인것으로 보인다.

## Other notebooks 탐방

- [LGBM 기반 분류모델: 0.612 정도의 점수를 기록](https://www.kaggle.com/code/artemgoncarov/multilingual-chatbot-arena-challenge-baseline/notebook)이다.

