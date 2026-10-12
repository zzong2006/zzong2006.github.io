---
title: "Resume"
tags: ["resume", "profile"]
aliases: ["CV", "이력서", "Woosung Hwang"]
---

# A) Resume

LLM, 검색, 추천 등 production ML 을 다루는 Machine Learning Engineer 입니다. 연구 아이디어를 실제 서비스에 적용하고, 데이터 파이프라인부터 모델 학습, 평가, 서빙, 온라인 실험까지 이어지는 workflow 를 구성하는 업무를 좋아합니다. 현재는 AI Search Modeling 리드로 검색 모델링 조직을 이끌면서, 모델 개발에도 직접 참여하고 있습니다.

[PDF Resume 다운로드](/static/resume/hwang-woosung-resume-250603.pdf)

# B) Profile

| Item | Details |
| --- | --- |
| Name | 황우성 (Woosung Hwang) |
| Role | AI Search Modeling Lead, Machine Learning Engineer |
| Email | zzong2006@gmail.com |
| GitHub | [zzong2006](https://github.com/zzong2006) |
| Blog | [zzong2006.github.io](https://zzong2006.github.io) |

# C) Experience

## Kakao (2020.12 - Present)

**AI Search Modeling Lead**  
2026.03 - Present

- 7명 규모의 모델러·데이터 엔지니어 조직을 이끌며, 웹·쇼핑 검색 모델(LLM, Cross-Encoder, Embedding 등)과 카카오톡 지면의 온디바이스 맥락 기반 추천 모델 개발을 리드합니다.
- Google Grounding, Perplexity 등 상용 검색 API를 자체 웹 검색 시스템으로 대체하는 조직 목표를 수립하고, LLM·랭킹 모델·평가 체계의 개발 우선순위와 일정을 결정합니다.
- Kanana Foundation Model·인퍼런스 최적화·서빙 플랫폼 조직과 공동 개발 범위와 담당 역할을 정했습니다.
- 개발용 GPU를 산정해 확보하고, 자체 검색과 상용 검색 API의 품질과 호출당 비용을 비교해 전환 근거를 마련했습니다.
- 조직을 이끄는 동시에 웹 문서 품질 모델과 커머스 검색어 분류 모델의 데이터 구축·학습·평가·배치 적용을 직접 수행했습니다.

**Machine Learning Engineer, Search Agent TF**  
2025.07 - 2026.02

- 임베딩·리랭커 기반 벡터 검색을 구성하고 Arena 방식(LLM judge 쌍대 비교) 평가 체계를 만들어, Perplexity 등 상용 검색 API의 대체 가능성을 검증했습니다.
- 키워드 검색 중심이던 커머스 검색에 멀티모달 시맨틱 검색과 GBM 리랭커를 도입하기 위한 모델을 개발했습니다.

**Machine Learning Engineer, LLM Alignment Team**  
2023.10 - 2025.06

- 장소 추천, 프로야구봇 요약, 도메인 QA·RAG, LLM 라우팅 등 실제 서비스에 적용되는 LLM 모델을 개발했습니다.
- 학습 데이터 합성을 통한 데이터 구축부터 모델 파인튜닝, 평가, vLLM 기반 모델 서빙까지 맡아 서비스 품질과 운영 비용을 함께 개선했습니다.

**Machine Learning Engineer, Recommendation Team**  
2021.04 - 2023.10

- 다음(Daum) 검색 키워드 광고의 CTR 예측 모델을 개선해 노출 순위를 입찰가 중심에서 기대 수익 중심으로 바꿨고, BERT 임베딩 기반 쿼리-광고 매칭도 실험했습니다.
- 카카오톡 뷰탭, 피코마 등의 콘텐츠 추천에 contextual bandit 기반 개인화 추천을 도입하고, 온라인 A/B 테스트를 반복하며 CTR을 개선했습니다.

**Machine Learning Engineer Intern, Recommendation Team**  
2020.12 - 2021.02

- Piccoma 웹툰 추천 알고리즘을 개선하며 Random Walk with Restart 기반 추천, sequence similarity matching, graph pruning, parallel processing을 다뤘습니다.

# D) Projects

## D.1) AI Search Modeling (2025 - Present)

### D.1.1) Agentic Web Search And Grounding LLM

**2025.07 - Present**

### D.1.2) Web Corpus Quality Models And Large-Scale Processing

**2026.04 - 2026.09**

### D.1.3) Commerce Search Ranking And Multimodal Product Embedding

**2025.10 - 2026.06**

### D.1.4) Commerce Query Understanding And Product Data

**2026.01 - Present**

### D.1.5) Web Search Ranking Models

**2026.07 - Present**

### D.1.6) On-Device Context-Based Personalized Query Recommendation

**2026.04 - 2026.09**

## D.2) LLM Services (2023 - 2025)

### D.2.1) LLM-Based Place Recommendation Model

**2025.01 - 2025.06**  
`#LLM` `#FunctionCalling` `#GRPO` `#Reranking`

역할: 데이터 구축·모델 학습 직접 수행

카카오맵(KakaoMap)에서 대화로 장소를 추천하는 LLM 모델 프로젝트입니다.

- 실제 검색 패턴과 장소 추천 의도를 반영한 합성 학습 데이터를 구축했습니다.
- 32B 자체 모델을 파인튜닝해 tool-call 정확도에서 GPT-4o를 넘어섰습니다.
- 후보 밖 장소 ID 출력·후보 개수 초과·금칙어를 감점하는 보상 함수를 설계해 Gemma3-12B 리랭킹 모델을 GRPO로 학습했습니다.
- 이 모델로 GPT-4.1 수준의 리랭킹 F1(0.667 vs 0.682)을 GPT-4.1 API보다 약 2.5배 빠른 속도로 달성해 배포했습니다.
- Multi-node 학습에서 Megatron-LM이 DeepSpeed ZeRO-3 대비 최소 2배(MoE 모델은 최대 20배) 빠른 것을 확인했습니다.

### D.2.2) Cost-Aware LLM Router

**2024.09 - 2024.12**  
`#LLMRouting` `#SyntheticData` `#PromptCompression`

역할: 4인 팀 리드 (아키텍처·로드맵·스프린트 운영)

요청마다 가장 비용 효율적인 LLM을 고르는 라우팅 시스템입니다.

- Instruction Evolution과 Magpie 방식으로 라우터 학습 데이터를 합성했습니다.
- 프롬프트 압축과 모델 라우팅을 결합해 대상 시나리오에서 GPT-4o 품질의 99%를 유지하면서 LLM 운영 비용을 약 60% 줄였습니다.
- if(kakao) 2024 CEO 키노트에서 모델 오케스트레이션 사례로 소개되었습니다.

### D.2.3) KBO Baseball Bot Summarization

**2024.03 - 2024.09**  
`#LLM` `#Summarization` `#vLLM`

역할: LLM 개발 리드

카카오톡 채널 '프로야구봇'의 경기 요약, 실시간 응원 분석, 숏폼 요약 서비스입니다.

- GPT 프롬프트 프로토타입부터 운영 요약 로직까지 개발하고, 평가 파이프라인으로 프롬프트와 모델 개선을 반복했습니다.
- vLLM 서빙을 적용하고, 불필요한 중국어 응답을 줄이는 패치를 제안했습니다.
- 경기 요약에서 GPT-4-Turbo 대비 61% 사람 선호도를 달성했습니다.
- 전년 대비 채널 친구 수 +40%(+10만 이상), 월 활성 사용자 +52%(+7만 이상)를 기록했고, 카카오 본사에서 오픈소스 LLM으로 낸 첫 실서비스 사례가 되었습니다.

### D.2.4) Domain QA LLM And RAG System

**2023.06 - 2024.01**  
`#RAG` `#EmbeddingFineTuning` `#QA`

역할: QA 모델·RAG 직접 구축

고트래픽 챗봇에 맞춘 도메인 QA 모델과 RAG 파이프라인입니다.

- BM25와 벡터 검색을 결합한 RAG를 설계하고 RAGAS, ROUGE, 부분 일치, 할루시네이션 지표로 평가했습니다.
- 작은 도메인 데이터로 임베딩 모델을 파인튜닝해 RAGAS 기준 검색 품질을 최대 30% 개선했습니다.
- 사람 라벨링 가이드와 데이터 수집 도구를 설계했고, 라벨링 데이터로 학습한 모델이 합성 데이터 대비 Rouge +30%를 기록했습니다.
- 의료 도메인 QA 평가에서 Llama2-7B 경량 모델이 GPT-3.5-turbo와 동급 이상의 품질(65%)을 달성했습니다.

## D.3) Recommendation & Ads (2021 - 2023)

### D.3.1) Keyword Ads Recommendation And Matching

**2022.07 - 2023.03**  
`#Ads` `#CTRPrediction` `#ANN`

역할: CTR 예측·노출 순위 로직 직접 개발

다음(Daum) 검색 키워드 광고의 노출 순위와 매칭 로직을 개선한 프로젝트입니다.

- LR, DNN, FM, GBRT를 비교해 CTR 예측 모델을 개선했고, FM 기반 모델로 오프라인 AUC를 약 12% 높였습니다.
- 입찰가 중심이던 노출 순위를 기대 수익 기준으로 바꿔 온라인 A/B 테스트에서 광고 CTR을 4% 높였고, 연간 약 7억 원의 추가 매출에 기여했습니다.
- Word2Vec과 BERT 임베딩 기반 분산 ANN 매칭(약 1,000만 광고)으로 광고 노출 커버리지가 35%에서 64%로 넓어지는 것을 오프라인에서 확인하고 온라인 적용을 시도했습니다.

### D.3.2) Bandit-Based Personalized Recommendation Platform

**2021.05 - 2023.03**  
`#Recommendation` `#ContextualBandit` `#Kafka`

역할: 추천 플랫폼 개발·운영

카카오톡 뷰탭, 피코마 등 콘텐츠 서비스의 contextual bandit 기반 개인화 추천 플랫폼입니다.

- Kafka 기반 실시간 데이터 파이프라인으로 사용자 행동을 학습에 바로 반영했습니다.
- 카카오톡 뷰탭에서 클릭수 +16.49%, 구독수 +30.62%, 체류시간 +13.71%를 달성했습니다.
- 온라인 A/B 테스트를 반복해 뉴스·엔터테인먼트 등 여러 도메인에서 CTR을 최대 5.27% 높였습니다.
- 콜드스타트 추천 로직을 도입해 신규 사용자 전환을 약 3% 개선했습니다.
- Sanic 서빙 API와 학습 모듈을 리팩터링해 I/O 부하와 메모리 사용을 줄였습니다.

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
