---
title: "MLOps"
tags:
  - machine_learning
  - pipeline
aliases: []
---

# A) MLOps 정의

MLOps (Machine Learning Operations) is an emerging discipline, and comprises a set of tools and principles to support progress through the ML project lifecycle.

# B) MLOps Course Notes

실제 프로덕션 상황에서 발생할 수 있는 이슈들

1. concept drift, data drift issue
   offline 에서 학습한 데이터 외 예상치 못한 데이터가 발생할 수 있다.
2. POC to Production Gap
   POC 를 위해 작성한 ML 코드보다 production 을 위해 작성한 코드가 훨씬 많이 필요하다: [[Hidden Technical Debt in Machine Learning Systems]] 를 참조하라.
   ![|650](https://i.imgur.com/mdji73e.png)

# C) Vs. [[LLMOps]]

[Fetching Title#qxm1](https://www.youtube.com/watch?v=1jvxxa7tdjw&t=141s&ab_channel=Databricks)

# D) 도움이 될만한 [[tech blogs]]

* [새로운 루다를 지탱하는 모델 서빙 아키텍처 — 2편: ArgoCD와 모델 서빙 – 스캐터랩 기술 블로그](https://tech.scatterlab.co.kr/serving-architecture-2/)
