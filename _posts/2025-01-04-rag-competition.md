---
layout: post
title: "RAG Competition"
date: 2025-01-04
giscus_comments: true
toc:
  beginning: true
  sidebar: left
tags: RAG competition
---

RAG 관련 대회 목록을 정리해보려 한다.

---

### 1. FinanceRAG Challenge at ICAIF '24 (종료)

5th ACM International Conference on AI in Finance (ICAIF'24)에서 RAG 관련 경진대회를 개최했습니다.

최근 금융권에서도 LLM 사용에 대해 매우 많은 관심들을 갖고 계시고, 보다 정교한 사용을 위해 RAG이 많은 주목을 받고 있습니다.

이번 경진대회는 참가자들이 직접 RAG 시스템을 구현해볼 수 있도록 준비 하였습니다. Linq에서 직접 미국의 증권시장 공시, 리포트 등을 바탕으로 query-corpus dataset을 세심하게 준비해주셨습니다. 특히 금융분야에는 이러한 데이터셋이 없는데요, 참가자들이 매우 좋은 데이터셋을 바탕으로 RAG 시스템을 구현해보고 evaluation도 해볼 수 있는 매우 좋은 기회라고 생각합니다.

https://www.kaggle.com/competitions/icaif-24-finance-rag-challenge/overview


### 2. Dacon: [재정정보 AI 검색 알고리즘 경진대회](https://dacon.io/competitions/official/236295/overview/description) (종료)

대회 기간: 2024년 7월 29일 ~ 2024년 8월 23일

특이한점은 RAG 로 활용할 데이터를 PDF 형태로 제공한다는 점이다.

물론 LLM 학습에 필요한 Question-Answer pair 역시 제공된다.

대부분 e5 모델로 vector search 를 위한 임베딩을 진행하였다.

한 우승팀에서는 YOLOv10 기반 Document Layout Analysis를 통해 PDF parser를 구현하였다고 한다.

### 3. AiCrowd: [CRAG: Comprehensive RAG Benchmark](https://www.aicrowd.com/challenges/meta-comprehensive-rag-benchmark-kdd-cup-2024) (종료)

대회 기간: 2024년 5월 20일 ~ 2025년 1월 25일

