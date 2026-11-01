---
title: "Zzong's Notes"
tags: ["MOC"]
aliases: ["Home"]
enableToc: false
---

LLM, 검색, 추천 모델을 만드는 머신러닝 엔지니어입니다. 일하고 공부하며 정리한 노트를 이곳에 모았습니다. 개념 설명, 논문 읽은 기록, 직접 해 본 실험이 있습니다. 쓴 사람이 궁금하다면 [[resume|이력서]]를 보세요.

## 주제별로 둘러보기

> [!topic] 검색
> 많은 문서 중에서 질문에 맞는 것을 빠르게 찾아오고, 찾은 결과의 순서를 정하는 방법.
>
> - [[retrieval/sparse/BM25|BM25]]
> - [[retrieval/dense/DPR|DPR]]
> - [[retrieval/multi_vector/ColBERT|ColBERT]]
> - [[retrieval/ranking/Re-ranking|Re-ranking]]
>
> [[retrieval/Retrieval|검색 노트 전체]]

> [!topic] 추천 시스템
> 사용자가 좋아할 상품이나 글을 골라 주는 방법과, 그 결과가 정말 나아졌는지 실험으로 확인하는 방법.
>
> - [[recommendation_system/collaborative filtering|collaborative filtering]]
> - [[recommendation_system/matrix factorization|matrix factorization]]
> - [[recommendation_system/Multi-Armed Bandit|Multi-Armed Bandit]]
> - [[recommendation_system/AB Test|A/B Test]]
>
> [[recommendation_system/index|추천 노트 전체]]

> [!topic] LLM
> 대형 언어 모델을 학습시키고, 사람이 원하는 대로 답하게 다듬고, 가볍게 만들어 서비스하는 방법.
>
> - [[generative_ai/LLM/Large Language Model|Large Language Model]]
> - [[generative_ai/training/LoRA|LoRA]]
> - [[generative_ai/post_training/DPO|DPO]]
> - [[generative_ai/inference/Quantization|Quantization]]
>
> [[generative_ai/index|생성형 AI 노트 전체]]

> [!topic] 머신러닝 기초
> 모델이 데이터에서 배우는 원리와, 배운 모델이 처음 보는 데이터에서도 잘 맞게 만드는 기본기.
>
> - [[machine_learning/Rules of ML|Rules of ML]]
> - [[machine_learning/generalization/Bias-variance tradeoff|Bias-variance tradeoff]]
> - [[machine_learning/generalization/regularization|regularization]]
> - [[machine_learning/deep_learning/backpropagation|backpropagation]]
>
> [[machine_learning/index|머신러닝 노트 전체]]

> [!topic] 논문 읽기
> 읽은 논문을 한국어로 요약했습니다. 분야별로 나뉘어 있습니다.
>
> - [[papers/language_model/index|언어 모델]]
> - [[papers/recommender_system/index|추천 시스템]]
> - [[papers/e-commerce/index|이커머스]]
> - [[papers/bias_fairness/index|편향과 공정성]]
>
> [[papers/index|논문 노트 전체]]

> [!topic] 통계와 수학
> 확률 분포, 추정, 가설 검정처럼 실험 결과를 해석할 때 필요한 도구. 선형대수 노트도 따로 있습니다.
>
> - [[statistic/통계적 유의성 계산법|통계적 유의성 계산법]]
> - [[statistic/Maximum Likelihood Estimation|Maximum Likelihood Estimation]]
> - [[statistic/Bayes theorem|Bayes theorem]]
> - [[statistic/KL-Divergence|KL-Divergence]]
>
> [[statistic/index|통계 노트 전체]] · [[linear_algebra/index|선형대수 노트 전체]]

> [!topic] 강화학습
> 행동한 결과로 받는 보상을 보고 더 나은 행동을 배우는 방법. LLM 을 다듬는 GRPO 같은 방법의 바탕이기도 합니다.
>
> - [[RL/Markov Decision Process|Markov Decision Process]]
> - [[RL/Q-learning|Q-learning]]
> - [[RL/Policy Gradient|Policy Gradient]]
> - [[RL/REINFORCE|REINFORCE]]
>
> [[RL/index|강화학습 노트 전체]]

> [!topic] 시스템과 데이터
> 모델을 서비스로 띄우고 데이터를 흘려보내는 데 쓰는 도구. 컨테이너, 메시지 큐, 데이터베이스.
>
> - [[server/docker|Docker]]
> - [[K8s/Kubernetes|Kubernetes]]
> - [[data_engineering/Kafka|Kafka]]
> - [[database/Redis|Redis]]
>
> [[server/index|서버]] · [[K8s/index|K8s]] · [[data_engineering/index|데이터 엔지니어링]] · [[database/index|DB]]
