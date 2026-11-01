---
title: "Resume"
tags: ["resume", "profile"]
aliases: ["CV", "이력서", "Woosung Hwang"]
---

# A) Resume

카카오에서 검색 모델링 조직을 이끄는 Machine Learning Engineer 입니다. 웹·쇼핑 검색 모델과 Grounding LLM 으로 상용 검색 API 를 자체 웹 검색으로 대체하는 일을 맡고 있고, 경량 모델 개발과 대규모 데이터 처리에도 직접 참여합니다.

그전에는 LLM 서비스 개발, 검색 키워드 광고의 CTR 예측, Bandit 기반 콘텐츠 추천을 했습니다. 연구를 실제 서비스에 적용해 측정 가능한 성과를 내는 일을 좋아합니다.

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

- **Modeling Lead, AI Search Modeling** (2026.03 - Present): 약 10명 규모 모델링 조직(모델러·데이터 엔지니어)을 이끌며 웹·쇼핑 검색 모델과 온디바이스 맥락 기반 추천 모델의 개발 방향을 정합니다.
- **ML Engineer, Search Agent TF** (2025.07 - 2026.02): 시맨틱 검색 실험과 Arena 평가를 구축하고 커머스 검색 랭킹 모델을 개발했습니다.
- **ML Engineer, LLM Alignment Team** (2023.10 - 2025.06): QA·요약·장소 추천 서비스용 언어 모델을 개발했습니다.
- **ML Engineer, Recommendation Team** (2021.04 - 2023.10): Bandit 기반 개인화 추천과 키워드 광고 추천 시스템을 개발했습니다.
- **Intern, Recommendation Team** (2020.12 - 2021.02): 피코마(Piccoma) 웹툰 추천 알고리즘을 개선해 응답 속도를 2배 이상 높이고 메모리 사용량을 50% 줄였습니다.

# D) Projects

## D.1) AI Search Modeling (2025 - Present)

### D.1.1) Agentic Web Search And Grounding LLM

**2025.07 - Present** · 역할: 조직 리드(개발 방향 설정·리뷰), 검색 평가·시맨틱 검색 구축

웹 검색 결과를 근거로 답하는 Grounding LLM 과 자체 웹 검색을 개발해 상용 검색 API(Google Grounding, Perplexity)를 대체하는 프로젝트입니다.

- 실 서비스 쿼리 기반 정답셋과 LLM judge pairwise 비교(Arena 방식) 평가 파이프라인을 구축했습니다.
- Vector Search → Snippet Selector → Cross-Encoder 리랭커 → LightGBM 으로 이어지는 검색 랭킹 구조의 개발 방향을 정하고 리뷰했습니다.
- 사내 품질 평가에서 서비스 쿼리 응답 품질이 Google Grounding 수준임을 확인했습니다.
- 쿼리의 약 25% 만 상용 검색으로 보내고 나머지는 자체 검색을 쓰는 구성이, 상용 검색만 쓸 때보다 응답 품질이 높았습니다.
- 랭킹·임베딩 모델을 경량화해 같은 트래픽에 필요한 GPU 를 줄였습니다 (랭킹 서빙 1/3, 문서 색인 1/8 수준).
- 2026년 10월 정부 AI 서비스 베타 테스트에 자체 웹 검색 API 를 제공했습니다.

### D.1.2) On-Device Context-Based Personalized Query Recommendation

**2026.04 - 2026.09** · 역할: 범용 구조 제안·유관 조직 조율(조직 리드), 서빙 API 개발

사용자 대화를 서버로 보내지 않고, 단말의 초경량 모델이 요약한 맥락으로 검색어를 추천하는 기능입니다.

- 온디바이스 모델의 대화 요약으로 검색어와 추천 메시지를 만드는 서버 모델 서빙 API 를 개발했습니다.
- 서비스마다 온디바이스 모델을 따로 올리면 발열·배터리 부담이 커져, 대화 속 entity 를 담은 공통 스키마 하나를 여러 서비스가 재사용하는 구조를 제안했습니다.
- 특정 서비스 전용이던 온디바이스 모델이 공통 스키마를 쓰는 통합 모델로 바뀌었습니다 (2026년 11월 카카오톡 업데이트 반영 예정).

### D.1.3) Commerce Search Ranking And Query Understanding

**2025.10 - Present** · 역할: 임베딩·리랭커·검색어 이해 모델 개발, 온라인 A/B 테스트 분석

외부 키워드 검색 엔진에 의존하던 카카오톡 커머스 서비스의 검색에 멀티모달 시맨틱 검색과 자체 랭킹 모델을 더한 프로젝트입니다.

- 상품 이미지·텍스트를 함께 받는 4B 수준 VLM 기반 임베딩을 멀티 노드로 학습하고, 수십 개 피처 기반 LightGBM 리랭커를 개발했습니다.
- 1차 A/B 에서 거래액이 줄자 원인을 영역·카테고리·가격대별로 분해해, 롤백 대신 실험을 이어 2·3차에서 CVR 과 거래액을 모두 개선했습니다.
- 2026년 6월 전체 사용자에 적용했습니다 (검색 CVR +11.8%, 인당 검색 매출 +2.3%).
- LLM judge 라벨을 distillation 해 300M 수준 경량 검색어 분류 모델(카테고리 분류, 부적절 검색어 필터)을 만들어 운영에 배포했습니다.

### D.1.4) Web Search Corpus: Target Crawling And Quality Processing

**2026.05 - 2026.08** · 역할: 크롤링 파트 임시 리드, 저품질 문서 필터 모델 개발·정제 파이프라인 구축

자체 웹 검색 색인에 쓸 문서를 모으고 정제하는 프로젝트입니다. 백억 건 이상의 웹 문서에 깨진 문서·광고·유해 문서가 섞여 있어, GPU 없이 대규모로 걸러내야 했습니다.

- 정보성·광고성·유해성 모두 LLM teacher 판정 → 사람 검수 → 경량 모델(char n-gram LightGBM, 선형 SVM) 학습 순서로 문서 품질 모델을 개발했습니다.
- 사람 검수 기준으로 광고성·유해 문서 판별 ROC-AUC 0.95 이상을 확보했습니다.
- Spark 기반 CPU 분산 처리로 수십억 건 문서의 품질을 채점했습니다 (소형 인코더 모델 대비 연산량 약 1/80).
- 정제한 문서는 억 단위 자체 검색 색인과 랭킹 모델·Grounding LLM 학습 데이터로 쓰입니다.

## D.2) LLM Services (2023 - 2025)

### D.2.1) LLM-Based Place Recommendation Model

**2025.01 - 2025.06** · 역할: Tool Call·Rerank 모델 학습, 학습 데이터 구축

카카오맵(KakaoMap)에서 대화로 장소를 추천하는 LLM 모델입니다.

- 32B 자체 모델을 파인튜닝해 tool-call 정확도에서 GPT-4o 를 앞섰습니다.
- GRPO 로 학습한 12B 리랭크 모델이 GPT-4.1 수준의 F1(0.667 vs 0.682)을 약 2.5배 빠른 추론 속도로 달성해 배포했습니다.
- Multi-node 학습에서 Megatron-LM 이 DeepSpeed ZeRO-3 보다 2배 이상(MoE 는 최대 20배) 빠른 것을 확인했습니다.
- verl 오픈소스에 Megatron 백엔드 MoE 학습의 optimizer offload 지원을 기여했습니다.

### D.2.2) Cost-Aware LLM Router

**2024.09 - 2024.12** · 역할: 4인 팀 리드(아키텍처·스프린트 운영), 라우터 모델·평가 파이프라인 개발

쿼리에 따라 GPT-4o 와 경량 모델 중 적합한 모델로 보내는 라우터입니다.

- Instruction Evolution·Magpie 방식으로 라우터 학습 데이터를 합성하고 Prompt Compression 을 결합했습니다.
- GPT-4o 대비 99% 성능을 유지하며 LLM 운영 비용 약 40% 절감을 기대합니다 (GPT-4o 호출 비율 100% → 67%).
- if(kakao) 2024 CEO 키노트에서 모델 오케스트레이션 사례로 소개됐습니다.

### D.2.3) KBO Baseball Bot Summarization

**2024.03 - 2024.09** · 역할: 개발 리드, 모델 구조 설계·학습 데이터·평가 파이프라인 구축

카카오톡 채널 '프로야구봇'의 KBO 경기 요약과 실시간 요약에 쓰는 LLM 입니다.

- 2-Stage 경량 오픈소스 모델을 SFT·DPO 로 학습하고, Airflow 평가 파이프라인과 vLLM 서빙을 구축했습니다.
- 경기 요약에서 GPT-4-Turbo 대비 사람 선호율 61% 를 기록했습니다.
- 2023년 대비 채널 친구 수 +40%(+10만 이상), 월 활성 사용자 +52%(+7만 이상)를 기록했습니다.
- 카카오 본사에서 오픈소스 LLM 으로 낸 첫 실서비스입니다.

### D.2.4) Domain QA LLM And RAG System

**2023.06 - 2024.01** · 역할: QA 모델·RAG 검색 개발, 사람 라벨링 프로젝트 리드

대용량 트래픽 챗봇에 적용할 도메인 QA 모델과 RAG 시스템입니다.

- Llama 2 기반 QA 모델을 DPO 로 학습해 할루시네이션을 줄이고, BM25·벡터 검색을 결합한 Hybrid Search 를 설계했습니다.
- 의료 도메인 7B QA 모델이 GPT-3.5-turbo 와 동급 이상의 품질(65%)을 냈습니다.
- 도메인 임베딩 파인튜닝으로 검색 성능(RAGAS)을 최대 30% 높였습니다.
- 사람 라벨 데이터로 학습한 모델이 합성 데이터 대비 Rouge +30% 이상을 기록했습니다.

## D.3) Recommendation & Ads (2021 - 2023)

### D.3.1) Keyword Ads Recommendation And Matching

**2022.07 - 2023.03** · 역할: CTR 예측·노출 순위 로직 개발

다음(Daum) 검색 키워드 광고의 노출 순위와 매칭 로직을 개선한 프로젝트입니다.

- 입찰가 중심이던 노출 순위를 기대 수익 기준으로 바꿔 연간 +7억 원의 추가 매출을 냈고, 전체 트래픽으로 넓혀 +28억 원까지 늘었습니다.
- 온라인 A/B 테스트에서 광고 CTR +4%, 오프라인에서 FM 모델 AUC +12% 를 기록했습니다.
- Word2Vec·BERT 임베딩 기반 분산 ANN 매칭(1,000만 단위 광고)으로 광고가 노출되는 검색어 비율을 넓혔습니다 (오프라인 35% → 64%).

### D.3.2) Bandit-Based Personalized Recommendation Platform

**2021.05 - 2023.03** · 역할: 실시간 데이터 파이프라인·Bandit 알고리즘 개발, 서비스 운영

카카오톡 뷰탭, 피코마 등 콘텐츠 서비스의 contextual bandit 기반 개인화 추천 플랫폼입니다.

- Kafka 실시간 학습 파이프라인과 Sanic 서빙을 개선하고, 파라미터 감쇠·Cold-Start 로직을 넣었습니다.
- 카카오톡 뷰탭에서 클릭수 +16.49%(+500만 이상), 구독수 +30.62%, 체류시간 +13.71% 를 달성했습니다.
- Cold-Start 로직으로 신규 사용자 전환율 +3%, 도메인별 CTR 최대 +5.27% 를 기록했습니다.

# E) Education

| Period | School | Program |
| --- | --- | --- |
| 2019.03 - 2020.08 | Yonsei University | M.S. in Computer Science, Database Lab |
| 2011.03 - 2019.02 | Yonsei University | B.S. in Computer Engineering, 최우등 졸업 |
| 2016.08 - 2017.05 | Toronto University | Exchange Program |

# F) Publications

- 색인 구조를 활용한 효율적인 데이터 시퀀스 매칭 기법 연구, M.S. Thesis, Yonsei University, 2020.
- 단조 증가 성질을 지닌 데이터 도메인에서의 집합 유사 시퀀스 매칭 방법, 정보과학회, 2021.
- Optimal Precoder Selection for Spatially Multiplexed MIMO Systems With Maximum Likelihood Detection, IEEE Access, 2020.
- Clustering Performance Analysis for Time Series Data: Wavelet vs. Autoencoder, 한국정보처리학회, 2018.

# G) Awards

- DACON 국내 LLM 경진대회 3위 (참가자 500명 이상, 비공개 리더보드 1위), 도배 하자 질의 응답 처리: 한솔데코 시즌2 AI 경진대회, 2024.
- Kakao 사내 AI 해커톤 2023 24K 1위 (팀 리드, 참가자 300명 이상), Stable Diffusion 기반 카카오톡 이모티콘 생성 서비스 제안, 2023.

# H) Presentations

- [if(kakao)25 — All About LLM: 카카오 AI메이트, 학습부터 서빙까지의 모든 것](https://if.kakao.com/2025/session?tab=day2&sessionId=36), 공동 발표(장소 추천 리랭커 파트), 2025.

# I) Skills

| Area | Keywords |
| --- | --- |
| LLM & Generative AI | SFT, DPO, GRPO, LoRA, Knowledge Distillation, Multi-node Distributed Training (Megatron-LM, DeepSpeed), Agentic Search, Function Calling, RAG, Synthetic Data Generation, LLM-as-a-Judge |
| Search & Recommendation | Multimodal Embedding, Cross-Encoder Reranker, Learning to Rank (LightGBM), Hybrid Search, ANN, Contextual Bandit, Thompson Sampling, CTR Prediction |
| Data & Serving | Python, PySpark, Trino, Iceberg, Kafka, Airflow, MongoDB, Kubernetes, vLLM, SGLang |
