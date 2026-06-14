---
title: "Resume"
tags: ["resume", "profile"]
aliases: ["CV", "이력서", "Woosung Hwang"]
---

# A) Resume

LLM, recommendation system, advertising, search, and production ML을 다루는 Machine Learning Engineer입니다. 연구 아이디어를 실제 서비스 문제로 번역하고, 데이터 파이프라인부터 모델 학습, 평가, 서빙, 온라인 실험까지 이어지는 전체 흐름을 만드는 일을 좋아합니다.

[PDF Resume 다운로드](/static/resume/hwang-woosung-resume-250603.pdf)

# B) Profile

| Item | Details |
| --- | --- |
| Name | 황우성 (Woosung Hwang) |
| Role | Machine Learning Engineer |
| Email | zzong2006@gmail.com |
| GitHub | [zzong2006](https://github.com/zzong2006) |
| Blog | [zzong2006.github.io](https://zzong2006.github.io) |

# C) Experience

## C.1) Kakao

**Machine Learning Engineer**  
2021.04 - Present

- LLM 기반 장소 추천, KBO 야구봇 요약, domain QA, RAG, cost-aware LLM routing처럼 실제 사용자 흐름에 붙는 GenAI 서비스를 개발했습니다.
- LLM fine-tuning, tool/function calling, synthetic data generation, model evaluation, vLLM serving, distributed training을 서비스 품질과 운영 비용 관점에서 다뤘습니다.
- 키워드 광고 추천/매칭, CTR prediction, embedding 기반 query-ad matching을 개선해 온라인 A/B 테스트에서 CTR과 광고 노출 품질을 높였습니다.
- KakaoTalk Viewtab, Piccoma 등에서 bandit 기반 개인화 추천 플랫폼을 개발하고 운영했습니다.

**Machine Learning Engineer Intern**  
2020.12 - 2021.02

- Piccoma 웹툰 추천 알고리즘을 개선하며 Random Walk with Restart 기반 추천, sequence similarity matching, graph pruning, parallel processing을 다뤘습니다.

# D) Projects

## D.1) LLM-Based Place Recommendation Model

KakaoMap의 대화형 장소 추천을 위해 사용자 의도 이해, tool/function calling, retrieved place reranking을 결합한 LLM 기반 추천 모델을 개발했습니다.

- 실제 검색 패턴과 장소 추천 intent를 반영한 synthetic/refined training dataset을 구성했습니다.
- In-house LLM fine-tuning으로 tool-call 정확도와 추천 품질을 개선했습니다.
- GRPO 기반 lightweight rerank model을 실험해 대화 맥락과 사용자 선호에 맞게 후보 장소를 정렬했습니다.
- 12B급 모델로 GPT-4.1 API 수준에 가까운 target workflow 성능과 더 빠른 inference를 목표로 검증했습니다.

## D.2) Cost-Aware LLM Router

사용자 요청별로 가장 비용 효율적인 LLM을 선택하는 routing system을 리드했습니다.

- 4인 개발팀에서 system architecture, roadmap, sprint execution을 담당했습니다.
- Instruction Evolution과 Magpie 스타일의 데이터 생성 전략으로 router tuning 데이터를 만들었습니다.
- Prompt Compression과 model routing을 결합해 target scenario에서 GPT-4o 수준 품질의 99%를 유지하면서 LLM 운영 비용을 약 60% 줄였습니다.
- if(kakao) 2024 CEO Keynote에서 model orchestration 사례로 소개되었습니다.

## D.3) KBO Baseball Bot Summarization

KakaoTalk 프로야구봇의 경기 요약, 실시간 응원 분석, 숏폼 요약을 위한 LLM 개발을 리드했습니다.

- GPT 기반 prompt prototype부터 production summarization logic까지 개발했습니다.
- Evaluation pipeline을 구축해 prompt와 model 개선을 반복했습니다.
- vLLM 기반 serving을 적용하고, 불필요한 중국어 응답을 줄이기 위한 패치를 제안했습니다.
- KBO 경기 요약에서 GPT-4-Turbo 대비 61% human preference를 달성했고, 채널 지표도 전년 대비 개선되었습니다.

## D.4) Domain QA LLM And RAG System

고트래픽 chatbot scenario에 맞춘 domain-specific QA 모델과 RAG pipeline을 구축했습니다.

- BM25와 vector search를 결합한 RAG를 설계하고, RAGAS, ROUGE, partial matching, hallucination metric으로 평가했습니다.
- 작은 domain dataset으로 embedding model을 fine-tuning해 RAGAS 기반 retrieval quality를 최대 30% 개선했습니다.
- Human labeling guideline과 데이터 수집 도구를 설계해 QA 학습 데이터 품질을 관리했습니다.
- Target medical-domain QA 평가에서 Llama 2 기반 모델이 GPT-3.5-turbo와 유사한 품질을 보이도록 검증했습니다.

## D.5) Keyword Ads Recommendation And Matching

Daum Search keyword ad ranking과 matching logic을 개선했습니다.

- LR, DNN, FM, GBRT를 비교해 CTR prediction 모델을 개선했고, FM 기반 접근으로 offline AUC를 약 12% 높였습니다.
- 온라인 A/B 테스트에서 ad CTR을 4% 개선했습니다.
- Word2Vec과 BERT embedding을 활용해 약 1,000만 광고 unit 대상 distributed ANN matching을 설계했습니다.
- 개선된 광고 노출 로직으로 연간 약 7억 원 규모의 추가 매출 기여를 만들었습니다.

## D.6) Bandit-Based Personalized Recommendation Platform

KakaoTalk Viewtab, Piccoma 등 여러 content domain에서 bandit 기반 개인화 추천 시스템을 개발하고 운영했습니다.

- Kafka 기반 real-time data pipeline으로 사용자 행동을 학습 데이터에 반영했습니다.
- News, entertainment 등 여러 domain에서 CTR을 최대 5.27% 개선했습니다.
- Cold-start recommendation logic을 도입해 신규 사용자 전환을 약 3% 개선했습니다.
- Sanic serving API와 training module을 리팩터링해 I/O load와 memory usage를 줄였습니다.

# E) Education

| Period | School | Program |
| --- | --- | --- |
| 2019.03 - 2020.08 | Yonsei University | M.S. in Computer Science, Database Lab |
| 2011.03 - 2019.02 | Yonsei University | B.S. in Computer Engineering |
| 2016.08 - 2017.05 | Toronto University | Exchange Program |

# F) Publications

- 색인 구조를 활용한 효율적인 데이터 시퀀스 매칭 기법 연구, M.S. Thesis, Yonsei University, 2020.
- 단조 증가 성질을 지닌 데이터 도메인에서의 집합 유사 시퀀스 매칭 방법, 정보과학회, 2021.
- Optimal Precoder Selection for Spatially Multiplexed MIMO Systems With Maximum Likelihood Detection, IEEE Access, 2020.
- Clustering Performance Analysis for Time Series Data: Wavelet vs. Autoencoder, 한국정보처리학회, 2018.

# G) Awards

- DACON 국내 LLM 경진대회 3위, 도배 하자 질의 응답 처리: 한솔데코 시즌2 AI 경진대회, 2024.
- Kakao 사내 AI 해커톤 2023 24K 1위, Stable Diffusion 기반 카카오톡 이모티콘 생성 서비스 제안, 2023.

# H) Skills

| Area | Keywords |
| --- | --- |
| LLM & Generative AI | SFT, DPO, GRPO, RLHF, RAG, Function Calling, Prompt Engineering, Synthetic Data Generation, LLM Evaluation, vLLM |
| ML & Recommendation | Recommendation Systems, Contextual Bandit, Thompson Sampling, CTR Prediction, Learning to Rank, Embedding Fine-Tuning, Hybrid Search, ANN |
| Data & MLOps | Python, PySpark, Kafka, Airflow, Kubernetes, RocksDB, SQLite, MongoDB, Sanic, Distributed Training |
