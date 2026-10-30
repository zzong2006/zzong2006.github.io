---
title: "deepspeed"
tags:
  - deep_learning
  - LLM
aliases: []
---

# A) ZeRO 의 역할

ZeRO(Zero Redundancy Optimizer)는 데이터 병렬(data parallelism) 학습에서 생기는 메모리 중복을 없애 각 GPU 의 메모리 부담을 줄이는 기술이다.

- 학습에 필요한 상태(가중치, 그래디언트, 옵티마이저 상태)를 여러 학습 하드웨어(GPU·CPU)에 나눠 저장한다.
- 일반적인 data parallelism 은 모델 상태(model states)를 디바이스마다 복제해서 메모리를 낭비한다.
  - ZeRO-DP(Data Parallelism)는 이 model states 를 분할해 중복을 없앤다.
  - 기존 data parallelism 과 model parallelism 이 가진 메모리 문제를 해결하려고 나온 방식이다.
- 디바이스 메모리가 충분하면 매우 큰 모델도 학습할 수 있다.
- 최적화는 단계별로 쌓인다. 앞 단계의 최적화는 다음 단계에서도 그대로 쓴다.
- 자세한 내용은 [논문](https://arxiv.org/abs/1910.02054v3) 에 있다.

# B) ZeRO 최적화 단계

![](https://i.imgur.com/1nyXR8B.png)

| 구분 | ZeRO-1 | ZeRO-2 | ZeRO-3 |
| --- | --- | --- | --- |
| 기법 이름 | Optimizer States Partitioning | Optimizer States Partitioning + Gradient Partitioning | Optimizer States Partitioning + Gradient Partitioning + Parameter Partitioning |
| 분할 대상 | 옵티마이저 상태 (Optimizer States) | ZeRO-1 대상 + 그래디언트 (Gradients) | ZeRO-2 대상 + 모델 파라미터 (Parameters) |
| 메모리 절감 | 약 4배 | 약 8배 | GPU 수(N)에 비례 (GPU 64개면 최대 64배) |
| 핵심 아이디어 | 옵티마이저 상태(예: Adam 의 모멘텀·분산)는 메모리를 많이 차지하지만 업데이트할 때만 필요하다.<br/>GPU 마다 나눠 저장해 중복을 없앤다. | 그래디언트도 파라미터 업데이트 때만 전체가 필요하므로 함께 나눠 저장한다. | 파라미터 자체를 나눈다.<br/>각 GPU 는 일부 파라미터만 갖고, 순전파·역전파 때 필요한 파라미터를 다른 GPU 에서 받아 쓴다. |

- ZeRO-3 는 메모리 절감이 가장 크지만 통신량(Comm. Volume)이 약 50% 늘어난다.

## B.1) ZeRO-1

ZeRO-1 은 Optimizer States Partitioning 만 적용한 첫 단계로, optimizer 상태를 분할해 메모리를 아낀다.

## B.2) ZeRO-2

ZeRO-2 는 ZeRO-1 보다 큰 모델을 학습하도록 설계됐고, 학습 효율을 두 배로 높인다. Residual States 문제를 다뤄 gradient, activation, 메모리 단편화(fragmented memory) 같은 학습 중 메모리 소비를 줄인다.

- **Model State Memory**: ZeRO-1 의 Optimizer States Partitioning 에 Gradient Partitioning 을 더해 디바이스당 메모리를 두 배 더 줄인다.
- **Activation Memory**: activation partitioning 으로 model parallelism 에서 생기는 activation 복제를 없앤다.
  - 모델이 매우 크거나 GPU 메모리가 부족하면 activation 을 CPU 로 옮겨 처리할 수도 있다.
- **Fragmented Memory**: tensor 마다 생명 주기가 달라 생기는 메모리 단편화를 줄인다.
  - 연속된 빈 공간이 부족한 상황에서도 메모리를 효율적으로 쓸 수 있다.
- **Constant Size Buffer**: all-reduce 에 쓰는 bucket 크기를 일정하게 유지해 성능을 높인다.
  - bucket 크기가 어느 정도 크기만 하면 충분히 좋은 효율이 나온다.
- 설정 예시: [zero2-bf16.yaml](https://github.com/CarperAI/trlx/blob/main/configs/accelerate/zero2-bf16.yaml)

# C) Megatron-LM 과의 조합

[[Megatron-LM]] 은 tensor-slicing model parallelism 을 쓴다. 여기에 DeepSpeed ZeRO-2 의 data parallelism 을 더하면 DeepSpeed 가 Megatron-LM 보다 10x 빠르다.

# D) 병렬 처리 기법 비교

모델 병렬 처리는 모델이 너무 커서 GPU 한 장에 올라가지 않을 때 모델을 여러 GPU 로 나누는 기술이다.

| 구분 | 데이터 병렬 (DP, Data Parallelism) | 텐서 병렬 (TP, Tensor Parallelism) | 파이프라인 병렬 (PP, Pipeline Parallelism) | 시퀀스 병렬 (SP, Sequence Parallelism) |
| --- | --- | --- | --- | --- |
| 개념 | 같은 모델을 여러 GPU 에 복제하고 데이터를 나눠 처리 | 모델의 단일 레이어(연산)를 여러 GPU 로 나눠 병렬 처리 | 모델을 여러 레이어 청크로 나눠 GPU 마다 할당 | Transformer 의 입력 시퀀스를 나눠 병렬 처리 |
| 분할 단위 | 미니배치 데이터 | 행렬 연산 (텐서) | 모델 레이어 그룹 | 입력 데이터의 시퀀스 차원 |
| 장점 | 구현이 가장 간단하고 일반적이다. | 레이어가 매우 큰 모델(Wide Model)에 효과적이다. | 매우 깊은 모델(Deep Model)에 효과적이다.<br/>activation 메모리를 아낄 수 있다. | 긴 시퀀스(Long Context)에서 급증하는 attention 계산량과 activation 메모리를 크게 줄인다. |
| 단점 | GPU 마다 모델 전체를 복제해 메모리 효율이 낮다. | 구현이 복잡하고 일부 레이어에만 적용할 수 있다.<br/>레이어마다 all-reduce 가 필요해 GPU 간 통신량이 많다. | 파이프라인 버블(bubble) 때문에 GPU 유휴 시간(idle time)이 생길 수 있다. | Transformer 아키텍처에 특화돼 있고, TP 와 함께 쓸 때 가장 효과적이다. |
| 주요 적용 대상 | 대부분의 딥러닝 학습 | 은닉층이 거대한 모델 (예: GPT 의 MLP, Attention) | 레이어가 수백 개인 초거대 모델 (예: GPT-3) | 문서 요약, 긴 대화처럼 긴 컨텍스트를 다루는 모델 |

- 컨텍스트 병렬(Context Parallelism)은 흔히 시퀀스 병렬(SP)과 같은 개념으로 쓴다.
  - Transformer 에서는 입력 길이를 context 라고 부르기 때문이다.

## D.1) 기법 조합

초거대 모델 학습은 DP·TP·PP·SP 와 ZeRO 를 섞어 쓴다.

1. **데이터 병렬(DP)이 기본**: 여러 GPU 에 데이터를 나눠 학습 속도를 높인다.
2. **메모리가 부족하면 ZeRO**: DP 환경에서 GPU 메모리가 부족하면 ZeRO 를 적용한다 (ZeRO-DP).
3. **모델이 너무 크면 PP 와 TP**: ZeRO 를 써도 모델이 GPU 한 장에 안 들어가면 모델 자체를 나눈다.
    - PP 로 모델을 여러 GPU 에 나눠 배치한다.
    - TP 로 개별 레이어의 크기를 줄인다.
4. **컨텍스트가 길면 SP**: 긴 문서·대화로 입력 시퀀스가 길어지면 SP 를 더해 activation 메모리 부담을 줄인다.

DP·TP·PP 를 함께 쓰는 방식을 3D Parallelism 이라 부르고, ZeRO 를 더하면 3D Parallelism (+ZeRO) 라고도 한다. 초거대 모델은 여기에 SP 까지 더해 GPU 메모리 효율을 최대로 끌어올린다.

# E) ZeRO-3 와 텐서 병렬(TP) 비교

ZeRO-3 와 TP 는 다른 기법이다.

- ZeRO-3 는 데이터 병렬의 메모리 최적화 기법이다.
- TP 는 모델 병렬의 한 종류로, 연산 자체를 나눈다.

| 구분 | ZeRO-3 (메모리 최적화) | 텐서 병렬 TP (모델 병렬) |
| --- | --- | --- |
| 주요 목표 | 메모리 절약.<br/>데이터 병렬에서 GPU 마다 모델 전체 파라미터를 복제하는 중복을 없앤다. | 모델 분할과 연산 병렬화.<br/>GPU 한 장에 담을 수 없는 거대한 레이어(예: 20GB 짜리 weight 행렬)를 여러 GPU 로 쪼개 동시에 연산한다. |
| 동작 방식 | 1. 평소에는 각 GPU 가 전체 파라미터의 1/N 만 저장한다.<br/>2. 순전파 때 레이어를 계산하기 직전에 그 레이어의 전체 파라미터를 다른 GPU 에서 All-Gather 로 모은다.<br/>3. 모은 전체 파라미터로 표준 연산을 한다.<br/>4. 연산이 끝나면 다 쓴 파라미터를 바로 해제(discard)한다. | 1. 처음부터 큰 파라미터(weight 행렬)를 물리적으로 조각내(shard) GPU 마다 나눠 갖는다.<br/>2. 순전파 때 입력 텐서(activation)도 나누거나 복제해, 각 GPU 가 자기 파라미터 조각으로 연산한다.<br/>3. GPU 마다 계산한 부분 결과를 All-Reduce 같은 통신으로 합쳐 최종 결과를 만든다. |
| 통신 오버헤드 | 순전파·역전파 때 레이어마다 전체 파라미터를 모으고 흩뿌리는 통신이 생긴다. | 연산 중간에 부분 결과를 합치는 통신이 생긴다. |
| DP 와의 관계 | 데이터 병렬(DP)의 확장판이다. ZeRO 는 DP 를 전제로 동작한다. | DP 와 직교(orthogonal) 관계라 DP 와 함께 쓸 수 있다. |

## E.1) 비유

- **ZeRO-3 는 빌려 와서 혼자 작업하고 반납하는 방식**: 공용 창고와 개인 작업대에 빗댈 수 있다.
  - 기술자(GPU) 여럿이 거대한 엔진(모델)을 조립하는데, 각자의 작업대(VRAM)는 좁다.
  - 공구(파라미터)는 모두 공용 창고(여러 GPU 메모리에 분산 저장)에 둔다.
  - 어떤 부품(레이어)을 조립할 차례가 되면 필요한 공구(그 레이어의 전체 파라미터)를 모두 빌려 와 작업하고 바로 반납한다.
- **TP 는 한 가지 일을 여럿이 동시에 나눠 처리하는 방식**: 거대한 부품 하나를 여러 기술자가 함께 조립하는 상황에 빗댈 수 있다.
  - 부품(큰 행렬) 하나가 너무 커서 기술자(GPU) 한 명이 다룰 수 없다.
  - 부품을 네 조각으로 잘라 네 명이 한 조각씩 맡아 동시에 작업한다.
  - 작업이 끝나면 각자의 결과를 합쳐 완전한 결과를 만든다.

## E.2) ZeRO-3 와 TP 를 함께 쓰는 방식

초거대 모델 학습에서는 둘을 함께 쓴다.

1. 특정 레이어가 너무 커서 GPU 한 장의 VRAM 에 안 올라가면 TP 로 레이어 자체를 여러 GPU 에 나눈다.
2. TP 로 나눈 모델도 전체 파라미터가 많아서, 데이터 병렬 학습을 위해 여러 GPU 에 복제하면 메모리가 부족해진다.
3. 이때 ZeRO-3 를 적용해 파라미터(TP 로 나눈 것 포함)·그래디언트·옵티마이저 상태를 여러 데이터 병렬 그룹(Data Parallel Ranks)에 나눠 저장한다.

TP 는 모델의 너비를 줄이고 ZeRO-3 는 메모리 사용량을 줄이므로, 둘은 서로 보완한다.

# F) References

* [The Technology Behind BLOOM Training](https://huggingface.co/blog/bloom-megatron-deepspeed)
