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

# C) TabFM 이 문제를 보는 방식

TabFM 의 핵심은 tabular prediction 을 "새 모델을 학습하는 문제"가 아니라 "비어 있는 target cell 을 채우는 문제"로 본다는 점이다.

개념적으로는 아래와 같은 하나의 table 을 모델에 주는 것에 가깝다.

```text
age  job       income   target
25   engineer   80000   low_risk
45   manager   120000   high_risk
35   engineer   90000   low_risk
30   engineer   85000   ?
48   manager   125000   ?
```

위쪽의 target 이 채워진 row 들은 context 이고, 아래쪽의 `?` row 들은 예측 대상이다. TabFM 은 이 table 전체를 보고, feature column 과 target column 사이의 관계를 추론한 뒤 `?` 에 들어갈 값을 한 번의 forward pass 로 채운다.

일반적인 supervised learning 은 특정 데이터셋에 맞는 parameter 를 새로 찾는다.

```text
theta_D = train(D_train)
y_hat = f_theta_D(x_test)
```

반면 TabFM 은 이미 pretraining 된 고정된 모델 $F_{\phi}$ 를 사용한다.

```text
y_hat = F_phi({(x_i, y_i)} context, x_test)
```

여기서 $\phi$ 는 synthetic table 들로 미리 학습된 TabFM 의 weight 이고, 현재 데이터셋을 넣는다고 업데이트되지 않는다. 즉 `X_train, y_train` 은 parameter 를 학습하기 위한 재료라기보다, 이번 table 에서 "이런 feature pattern 은 이런 target 으로 이어진다"는 것을 보여주는 in-context example 이다.

그래서 TabFM 에서 "zero-shot" 이라는 말은 아무 예시도 안 준다는 뜻이 아니다. 데이터셋별 gradient update 나 hyperparameter tuning 없이, train rows 를 context 로 읽고 test rows 의 target 을 채운다는 뜻에 가깝다.

# D) 내부 구조

Google Research 블로그 기준으로 TabFM 은 [[papers/deep_learning/TabPFN|TabPFN]] 과 TabICL 계열 아이디어를 섞은 hybrid architecture 에 가깝다. 여기서 ICL 은 in-context learning 이고, TabICL 도 tabular data 에서 in-context learning 을 크게 확장하려는 모델이다.

## D.1) Row / column attention

표는 텍스트처럼 1차원 sequence 가 아니다. row 나 column 의 순서를 바꿔도 본질적인 의미가 유지되는 경우가 많다. 그래서 TabFM 은 raw table 에 대해 row 방향과 column 방향 attention 을 번갈아 적용하면서 feature interaction 과 row-level pattern 을 잡는다.

## D.2) Row compression

각 row 를 `h_i` 같은 하나의 dense vector 로 압축한다. table 의 모든 cell 을 끝까지 별도 token 으로 들고 가지 않고, column 관계가 반영된 row 하나를 fixed-dimensional embedding 하나로 요약하는 단계다.

직관적으로는 sequence length 를 `n * d` 개 cell 에서 `n` 개 row 로 줄이는 것이다. 그래서 row compression 뒤의 최종 ICL Transformer 만 보면 attention 비용은 cell 기준 `O((n * d)^2)` 가 아니라 row 기준 `O(n^2)` 에 가까워진다.

다만 TabFM 전체 비용이 `n^2` 만 남는다는 뜻은 아니다. row embedding 을 만들기 전에는 여전히 row / column attention 으로 raw grid 를 contextualize 하는 단계가 있다. row compression 의 의미는 최종 ICL 단계의 attention 단위를 "개별 cell" 에서 "예시 row" 로 바꾼다는 데 있다.

결국 앞단에서는 feature interaction 을 섞고, 뒤쪽 ICL Transformer 에서는 train row 와 test row 사이의 관계를 본다. train row 가 `n_train` 개이고 test row 가 `n_test` 개라면, 이 마지막 단계의 sequence length 는 대략 `n_train + n_test` 로 보면 된다.

## D.3) In-context learning

압축된 row embedding sequence 를 Transformer 가 처리한다. train row 는 context 역할을 하고, test row 에 대해서는 이 context 를 바탕으로 label 또는 regression target 을 예측한다. 모델 파라미터를 업데이트하지 않는다는 점이 일반적인 supervised learning 과 다르다.

## D.4) Gemma 같은 LLM 기반인가?

아니다. 여기서 FM 은 Gemma 나 Gemini 같은 language model 계열을 가져다 썼다는 뜻이 아니라, 많은 tabular task 로 미리 학습된 foundation model 이라는 뜻에 가깝다.

TabFM 은 텍스트 tokenizer, vocabulary, language modeling head 를 중심으로 돌아가는 LLM 이 아니다. numerical / categorical cell 을 embedding 하고, column / row attention 과 row compression 을 거친 뒤, tabular ICL Transformer 로 target 을 예측하는 tabular-native architecture 에 가깝다.

비슷한 이름 때문에 헷갈릴 수 있는 별도 흐름으로 TabGemma 같은 연구가 있다. 그런 접근은 Gemma 계열 LLM 을 tabular ICL 에 맞게 계속 학습시키는 쪽이고, TabFM 은 TabPFN / TabICL 계열에 더 가깝다.

# E) 학습 데이터

TabFM 은 실제 산업 데이터를 그대로 대량 수집해서 학습한 모델이 아니라, structural causal model 기반으로 생성한 수억 개의 synthetic dataset 으로 학습했다고 설명된다.

Google 의 설명에 따르면, 고품질 tabular dataset 은 schema 가 제각각이고 민감정보나 소유권 문제가 많아 foundation model pretraining 에 충분한 규모로 모으기 어렵다. 그래서 다양한 causal structure 와 feature relationship 을 갖는 synthetic table 을 생성해 학습 데이터로 사용한 것이다.

# F) TabArena

TabArena 는 tabular ML 모델을 비교하기 위한 living benchmark 다. 고정된 벤치마크가 아니라, 데이터셋, 모델, 평가 방식, 리더보드를 계속 유지보수하는 시스템이라는 점이 중요하다.

TabFM 블로그에서는 TabFM 평가를 TabArena 로 수행했다고 설명한다. 평가 범위는 38개 classification dataset 과 13개 regression dataset 이고, 데이터 크기는 약 700개에서 150,000개 sample 까지다. TabArena 는 head-to-head win rate 기반 Elo score 로 모델을 비교한다.

이 맥락에서 TabArena 는 "TabFM 이 기존 tree model 대비 어느 정도인지 확인하는 공개 경기장"에 가깝다. 특히 [[papers/deep_learning/TabPFN|TabPFN]], TabICL, TabFM 같은 tabular foundation model 이 늘어나면서 공정한 비교 기준으로 중요해졌다.

# G) Hugging Face: [google/tabfm-1.0.0-pytorch](https://huggingface.co/google/tabfm-1.0.0-pytorch)

[`google/tabfm-1.0.0-pytorch`](https://huggingface.co/google/tabfm-1.0.0-pytorch) 는 TabFM 1.0.0 의 PyTorch weight 를 올려둔 Hugging Face 모델 저장소다. JAX/Flax weight 는 별도 저장소로 제공된다.

모델 카드 기준 사용 범위는 다음과 같다.

1. numerical / categorical column 이 섞인 tabular data
2. binary / multiclass classification
3. continuous target regression
4. pandas DataFrame 또는 numpy array 기반 입력
5. zero-shot inference, 즉 dataset-specific training 이나 hyperparameter tuning 없이 사용

다만 classification 은 최대 10개 class 로 제한된다. 또한 모든 training row 를 context 로 넘기므로 row 수가 늘수록 메모리 사용량도 커진다. feature 수는 500개 정도까지를 주요 대상처럼 설명하며, 매우 wide 한 table 에서는 성능이 떨어질 수 있다.

# H) TabFM-Ensemble

Google 블로그에서는 기본 TabFM 과 TabFM-Ensemble 을 구분한다.

기본 TabFM 은 tuning 이나 cross-validation 없이 single forward pass 로 예측한다. TabFM-Ensemble 은 cross feature, [[Singular Value Decomposition|SVD]] feature, 32-way ensemble, non-negative least squares blending 을 사용한다. classification 에서는 [[probability calibration|Platt scaling]] 도 추가한다.

그래서 "TabFM 이 튜닝 없이 강하다"는 주장과 "TabFM-Ensemble 이 최고 성능을 낸다"는 주장은 구분해서 봐야 한다. 후자는 이미 여러 보강 절차가 들어간 설정이다.

# I) 주의할 점

Hugging Face weight 는 TabFM Non-Commercial License v1.0 이다. 비상업, 비프로덕션 목적의 테스트, 평가, 연구 용도로 제한된다. 상업적 사용이나 production system 사용은 별도 commercial license 가 필요하다.

또한 synthetic dataset 으로 학습된 모델이므로 특정 도메인, minority group, edge distribution 에서의 성능은 별도 검증이 필요하다. 특히 high-stakes decision 에 바로 쓰기보다는 held-out data 로 검증한 뒤 기존 XGBoost, CatBoost, AutoML 결과와 비교해야 한다.

# J) 내 생각

TabFM 은 tabular ML 에서 "foundation model workflow" 가 실제로 들어오기 시작했다는 신호로 볼 수 있다. 지금 당장 기존 tree model 을 완전히 대체한다기보다는, feature engineering 과 tuning 없이 빠르게 baseline 을 세우고 기존 모델과 비교하는 용도가 현실적이다.

API 모양보다 중요한 것은 table completion 관점이다. TabFM 은 현재 데이터셋에 맞는 모델을 새로 만드는 대신, "label 이 채워진 row 들을 보고 label 이 비어 있는 row 를 완성하는 pretrained inference machine" 에 가깝다. production 적용은 라이선스, 비용, latency, 메모리, 데이터 보안, explainability 를 모두 확인해야 한다.

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
* [TabGemma: Text-Based Tabular ICL via LLM using Continued Pretraining and Retrieval](https://arxiv.org/abs/2511.03570)
