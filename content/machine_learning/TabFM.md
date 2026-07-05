---
title: "TabFM"
tags: ["machine_learning", "tabular", "foundation_model"]
aliases: ["Tabular Foundation Model", "google/tabfm-1.0.0-pytorch"]
---

# A) TabFM ?

TabFM 은 Google Research 가 공개한 tabular data 용 foundation model 이다. 분류와 회귀 문제를 대상으로 하며, 일반적인 [[Extreme Gradient Boosting|XGBoost]] 나 [[CatBoost]] 처럼 데이터셋마다 새로 학습하고 하이퍼파라미터를 튜닝하는 방식이 아니라, train row 와 예측 대상 row 를 context 로 넣어 한 번의 forward pass 로 예측한다.

Google Research 블로그에서는 이를 시계열 foundation model 인 TimesFM 의 zero-shot 아이디어를 tabular data 로 확장한 사례로 설명한다. 핵심은 tabular prediction 을 [[machine_learning/NLP/transformer|Transformer]] 기반 in-context learning 문제로 바꾸는 것이다.

# B) 왜 필요한가?

Tabular data 는 고객 이탈 예측, 금융 사기 탐지, 수요 예측처럼 기업 데이터 분석에서 자주 등장한다. 지금까지는 트리 기반 supervised model 이 강했지만, 실제로는 feature engineering, 하이퍼파라미터 탐색, 데이터셋별 재학습이 계속 필요했다.

TabFM 은 이 반복 작업을 줄이는 쪽을 노린다. 모델 weight 를 task 마다 업데이트하지 않고, 예시 row 들을 보고 inference time 에 컬럼과 row 사이의 관계를 해석한다. 그래서 "학습 없이 바로 쓰는 baseline" 또는 "기존 tree model 의 challenger" 로 보기 좋다.

# C) 구조

Google Research 블로그 기준으로 TabFM 은 [[papers/deep_learning/TabPFN|TabPFN]] 과 TabICL 계열 아이디어를 섞은 hybrid architecture 에 가깝다.

## C.1) Row / column attention

표는 텍스트처럼 1차원 sequence 가 아니다. row 나 column 의 순서를 바꿔도 본질적인 의미가 유지되는 경우가 많다. 그래서 TabFM 은 raw table 에 대해 row 방향과 column 방향 attention 을 번갈아 적용하면서 feature interaction 과 row-level pattern 을 잡는다.

## C.2) Row compression

각 row 에 대해 cross-attention 으로 얻은 정보를 dense vector 로 압축한다. raw grid 전체에 그대로 attention 을 적용하면 계산량이 커지기 때문에, row 단위 embedding 으로 줄여 이후 ICL Transformer 가 다루기 쉽게 만든다.

## C.3) In-context learning

압축된 row embedding sequence 를 Transformer 가 처리한다. train row 는 context 역할을 하고, test row 에 대해서는 이 context 를 바탕으로 label 또는 regression target 을 예측한다. 모델 파라미터를 업데이트하지 않는다는 점이 일반적인 supervised learning 과 다르다.

# D) 학습 데이터

TabFM 은 실제 산업 데이터를 그대로 대량 수집해서 학습한 모델이 아니라, structural causal model 기반으로 생성한 수억 개의 synthetic dataset 으로 학습했다고 설명된다.

Google 의 설명에 따르면, 고품질 tabular dataset 은 schema 가 제각각이고 민감정보나 소유권 문제가 많아 foundation model pretraining 에 충분한 규모로 모으기 어렵다. 그래서 다양한 causal structure 와 feature relationship 을 갖는 synthetic table 을 생성해 학습 데이터로 사용한 것이다.

# E) TabArena

TabArena 는 tabular ML 모델을 비교하기 위한 living benchmark 다. 고정된 벤치마크가 아니라, 데이터셋, 모델, 평가 방식, 리더보드를 계속 유지보수하는 시스템이라는 점이 중요하다.

TabFM 블로그에서는 TabFM 평가를 TabArena 로 수행했다고 설명한다. 평가 범위는 38개 classification dataset 과 13개 regression dataset 이고, 데이터 크기는 약 700개에서 150,000개 sample 까지다. TabArena 는 head-to-head win rate 기반 Elo score 로 모델을 비교한다.

이 맥락에서 TabArena 는 "TabFM 이 기존 tree model 대비 어느 정도인지 확인하는 공개 경기장"에 가깝다. 특히 [[papers/deep_learning/TabPFN|TabPFN]], TabICL, TabFM 같은 tabular foundation model 이 늘어나면서 공정한 비교 기준으로 중요해졌다.

# F) Hugging Face: google/tabfm-1.0.0-pytorch

`google/tabfm-1.0.0-pytorch` 는 TabFM 1.0.0 의 PyTorch weight 를 올려둔 Hugging Face 모델 저장소다. JAX/Flax weight 는 별도 저장소로 제공된다.

모델 카드 기준 사용 범위는 다음과 같다.

1. numerical / categorical column 이 섞인 tabular data
2. binary / multiclass classification
3. continuous target regression
4. pandas DataFrame 또는 numpy array 기반 입력
5. zero-shot inference, 즉 dataset-specific training 이나 hyperparameter tuning 없이 사용

다만 classification 은 최대 10개 class 로 제한된다. 또한 모든 training row 를 context 로 넘기므로 row 수가 늘수록 메모리 사용량도 커진다. feature 수는 500개 정도까지를 주요 대상처럼 설명하며, 매우 wide 한 table 에서는 성능이 떨어질 수 있다.

# G) TabFM-Ensemble

Google 블로그에서는 기본 TabFM 과 TabFM-Ensemble 을 구분한다.

기본 TabFM 은 tuning 이나 cross-validation 없이 single forward pass 로 예측한다. TabFM-Ensemble 은 cross feature, [[Singular Value Decomposition|SVD]] feature, 32-way ensemble, non-negative least squares blending 을 사용한다. classification 에서는 [[probability calibration|Platt scaling]] 도 추가한다.

그래서 "TabFM 이 튜닝 없이 강하다"는 주장과 "TabFM-Ensemble 이 최고 성능을 낸다"는 주장은 구분해서 봐야 한다. 후자는 이미 여러 보강 절차가 들어간 설정이다.

# H) BigQuery 통합

Google Research 블로그는 TabFM 을 BigQuery 에 직접 통합할 계획도 언급한다. 예고대로라면 사용자는 BigQuery 에서 `AI.PREDICT` SQL 명령으로 regression 또는 classification 을 수행할 수 있게 된다.

이 부분이 실무적으로 중요하다. TabFM 을 단순히 Python 모델로 배포하는 것이 아니라, [[data_engineering/data warehouse|data warehouse]] 안에서 바로 호출하는 prediction primitive 로 만들려는 방향이기 때문이다.

# I) 주의할 점

Hugging Face weight 는 TabFM Non-Commercial License v1.0 이다. 비상업, 비프로덕션 목적의 테스트, 평가, 연구 용도로 제한된다. 상업적 사용이나 production system 사용은 별도 commercial license 가 필요하다.

또한 synthetic dataset 으로 학습된 모델이므로 특정 도메인, minority group, edge distribution 에서의 성능은 별도 검증이 필요하다. 특히 high-stakes decision 에 바로 쓰기보다는 held-out data 로 검증한 뒤 기존 XGBoost, CatBoost, AutoML 결과와 비교해야 한다.

# J) 내 생각

TabFM 은 tabular ML 에서 "foundation model workflow" 가 실제로 들어오기 시작했다는 신호로 볼 수 있다. 지금 당장 기존 tree model 을 완전히 대체한다기보다는, feature engineering 과 tuning 없이 빠르게 baseline 을 세우고 기존 모델과 비교하는 용도가 현실적이다.

특히 BigQuery 통합이 잘 되면 데이터 분석가가 별도 모델 학습 파이프라인 없이 SQL 로 예측을 시도할 수 있다는 점에서 영향이 클 수 있다. 반대로 production 적용은 라이선스, 비용, latency, 메모리, 데이터 보안, explainability 를 모두 확인해야 한다.

# K) Related

* [[papers/deep_learning/TabPFN]]
* [[papers/deep_learning/Tabular Data_Deep Learning is Not All You Need]]
* [[Extreme Gradient Boosting]]
* [[CatBoost]]
* [[Hyperparameter Optimization]]
* [[Singular Value Decomposition]]
* [[probability calibration]]

# L) References

* [Introducing TabFM: A zero-shot foundation model for tabular data](https://research.google/blog/introducing-tabfm-a-zero-shot-foundation-model-for-tabular-data/)
* [google/tabfm-1.0.0-pytorch](https://huggingface.co/google/tabfm-1.0.0-pytorch)
* [google-research/tabfm](https://github.com/google-research/tabfm)
* [TabArena: A Living Benchmark for Machine Learning on Tabular Data](https://arxiv.org/abs/2506.16791)
* [autogluon/tabarena](https://github.com/autogluon/tabarena)
