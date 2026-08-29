---
title: "LDA"
tags:
  - machine_learning
  - NLP
  - topic_modeling
aliases: [Latent Dirichlet Allocation]
---

# A) LDA ?

LDA(Latent Dirichlet Allocation)는 문서를 여러 latent topic 의 mixture 로 보고, 각 topic 은 word distribution 을 가진다고 가정하는 topic model 이다.

# B) 직관

문서 하나가 하나의 주제만 가진다고 보지 않는다. 예를 들어 추천 시스템 논문은 `recommender system`, `optimization`, `evaluation` topic 이 섞여 있을 수 있다. LDA 는 이런 topic mixture 와 topic-word distribution 을 함께 추정한다.

# C) Related

* [[topic modeling]]
* [[PLSI]]
* [[papers/collaborative_filtering/Latent Dirichlet Allocation]]

