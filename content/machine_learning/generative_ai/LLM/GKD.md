---
title: Generalized Knowledge Distillation
tags:
  - LLM
  - distillation
aliases:
  - GKD
  - Generalized Knowledge Distillation
  - on-policy distillation
---

# A) 한줄 요약

GKD(Generalized Knowledge Distillation, Google DeepMind 2023)는 autoregressive LM을 위한 [[knowledge distillation|지식 증류]] 기법으로, 고정된 데이터셋이 아니라 학생이 직접 생성한 문장 위에서 교사의 토큰별 분포를 배우게 한다(on-policy). Gemma, Qwen 같은 요즘 경량 모델이 큰 모델에서 이런 방식으로 증류된다.

# B) Supervised KD의 문제: train-inference 불일치

기존 supervised KD에서는 고정된 데이터셋 문장(정답 텍스트 또는 교사가 미리 생성한 텍스트) 위에서 교사의 토큰별 확률분포를 학생이 흉내 내도록 학습한다.

문제는 학습 내내 학생이 남이 쓴 완벽한 문장 위에서만 다음 토큰을 연습한다는 것. 실전(추론)에서는 자기가 생성한 문장 위에서 이어가야 하는데, 앞에서 이상한 토큰을 하나 뱉으면 그 이후는 학습 때 본 적 없는 분포가 되고 실수가 복리로 쌓인다(exposure bias). 운전 교본만 읽고 도로에 나온 상황.

# C) GKD의 on-policy 피드백

여기서 "피드백"은 사람이나 judge의 평가가 아니라 교사의 토큰별 확률분포를 뜻한다.

1. 학생이 프롬프트에 대한 응답을 직접 생성한다 (on-policy: 현재 학생 policy가 만든 데이터)
2. 그 생성문을 교사에 넣어 각 위치에서 교사의 분포를 뽑는다
3. 학생 분포를 교사 분포에 맞추도록 업데이트한다

학습 신호(교사 분포 흉내)는 supervised KD와 같고, 연습 장소가 학생 자신의 생성문이라는 점만 다르다. 학생이 실수한 그 지점에서 "교사라면 이렇게 이어갔다"를 교정받는다. 도로연수에서 조수석 강사가 매 순간 교정해주는 것.

"Generalized"인 이유는 이 두 극단을 하나의 틀로 묶고 손잡이 두 개를 줬기 때문:

- **데이터 비율 λ**: 고정 데이터(0) ↔ 학생 생성문(1). supervised KD는 λ=0인 특수 케이스
- **발산 함수**: forward KL ↔ JSD ↔ reverse KL

# D) Forward KL vs Reverse KL

[[KL-Divergence|KL]]은 비대칭이라 어느 방향을 최소화하느냐에 따라 학생의 행동이 달라진다. 방향별 성질의 일반론은 [[KL-Divergence]] 노트에 정리해뒀다. 교사 P가 다음 토큰으로 "빠르게" 40% / "신속히" 35% / "즉시" 20%를 허용하는데, 학생 Q는 작아서 셋을 다 정교하게 표현할 용량이 없다고 하자.

**Forward KL — KL(P‖Q)**: 교사가 확률을 주는 곳(P>0)에 학생이 안 주면(Q≈0) 벌점이 폭발한다. 학생은 교사의 모든 선택지에 조금씩 확률을 발라야 함 → mode-covering. 용량이 부족하면 분포가 뭉개지고 어정쩡한 토큰에 확률이 샌다.

**Reverse KL — KL(Q‖P)**: 학생이 확률을 주는 곳(Q>0)에 교사가 안 주면(P≈0) 벌점이 폭발한다. 포기한 모드는 채점 대상이 아님 → 가장 확실한 모드에 집중하는 mode-seeking. "아는 것만 말해라, 대신 틀린 말은 하지 마라."

작은 학생에게는 reverse KL이 유리한 경우가 많다. 다양성이 줄어도 뽑는 것마다 교사가 인정하는 좋은 토큰인 쪽이, autoregressive 생성에서 실수가 뒤로 번지는 것보다 낫기 때문. JSD는 둘 사이의 대칭 발산으로 절충안이다.

같은 구도가 [[RLHF]]에도 나오는데, RL의 KL penalty가 reverse KL이라서 RLHF 모델이 특정 스타일로 쏠리는(mode collapse) 것도 같은 원리다.

# E) 한계와 실전 파이프라인

증류는 교사의 분포를 베끼는 것이라 교사 성능이 사실상 상한선이다. GKD가 고치는 건 베끼는 효율이지 원본의 품질이 아니다. 교사도 못하는 태스크라면:

- 정답을 기계적으로 채점할 수 있으면(수학·코드) [[GRPO]] 계열 RL이 낫다. 신호가 정답 자체에서 나오므로 교사 상한을 넘을 수 있음
- 채점도 어려우면 골드 데이터 SFT, 또는 교사를 먼저 그 도메인에 파인튜닝한 뒤 증류

실무 표준은 "RL은 큰 모델에서, 작은 모델은 증류로"라는 분업이다:

```text
큰 모델 GRPO + judge reward → (교사 검증) → 같은 패밀리 소형 모델로 GKD → 필요시 학생 DPO 폴리시
```

- RL은 큰 모델에서 잘 된다. GRPO는 그룹 내에 좋은 응답이 샘플링돼야 신호가 생기는데 작은 모델은 그 확률이 낮음. DeepSeek-R1 → R1-Distill-Qwen이 이 구조
- judge 비용은 교사 학습 때 한 번만 낸다
- 교사가 judge를 hacking한 상태면(길이 뻥튀기, 아부 문체) 그 버릇까지 학생에 복사되므로 증류 전에 교사를 별도 검증할 것
- 토큰 단위 분포 증류는 교사·학생이 같은 토크나이저(같은 패밀리)여야 깔끔하다. 다르면 교사 출력 텍스트로 SFT하는 sequence-level KD로 대체 (R1-Distill이 실제 이 방식)
- RL로 얻은 미묘한 행동은 증류에서 잘 안 옮겨진다. 부족하면 학생에 [[DPO]] 한 라운드를 얹어 보정

# F) References

- Agarwal et al., 2023, "On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes" (GKD)
- DeepSeek-AI, 2025, "DeepSeek-R1" — 증류 vs 소형 모델 직접 RL 비교
