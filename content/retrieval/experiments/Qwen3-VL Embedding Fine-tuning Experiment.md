---
title: "Qwen3-VL Embedding Fine-tuning Experiment"
tags: ["retrieval", "embedding", "dense_retrieval", "experiment", "Qwen3"]
---


# A) Qwen3-VL Embedding Fine-tuning Experiment

배경

  Qwen3-VL-Embedding (2B/8B)을 TalkDeal 쇼핑 데이터셋에 contrastive fine-tuning해서 STS 정확도를 올리려 했다. Pretrained 상태 STS는 2B 기준 77.37%.

  ---

  실험 결과 총정리
  ┌───────┬──────┬──────────────────────────┬──────────┬───────────┬───────────────────┐
  │ 실험 │ 모델 │ 방법 │ Peak STS │ Peak Step │ 이후 패턴 │
  ├───────┼──────┼──────────────────────────┼──────────┼───────────┼───────────────────┤
  │ v1 │ 2B │ full ft, lr=3e-6 │ 88.21% │ 200 │ 단조 하락 │
  ├───────┼──────┼──────────────────────────┼──────────┼───────────┼───────────────────┤
  │ v1.1 │ 2B │ full ft, lr=1e-6, wd=0.1 │ 88.13% │ 200 │ 단조 하락 │
  ├───────┼──────┼──────────────────────────┼──────────┼───────────┼───────────────────┤
  │ v1.2 │ 2B │ LoRA r=32, lr=2e-5 │ 87.78% │ 300 │ V자 회복 │
  ├───────┼──────┼──────────────────────────┼──────────┼───────────┼───────────────────┤
  │ 8B v1 │ 8B │ full ft, lr=3e-6 │ 90.63% │ 100 │ 하락 후 소폭 반등 │
  └───────┴──────┴──────────────────────────┴──────────┴───────────┴───────────────────┘
  ---
  관찰 1: Full ft는 빠르게 피크 찍고 단조 하락

  2B full ft (v1, v1.1) 모두 step 200에서 88%를 찍고 끝이었다. lr을 1/3로 줄이든, weight_decay를 10배로 올리든, batch를 2배로 키우든 결과는 거의 동일. 하이퍼파라미터 튜닝으로는 한계를 못 넘는다.

  8B도 마찬가지. 모델을 키우니 peak 자체는 90.63%로 올랐지만, step 100이라는 극초반에 찍고 300까지 84%로 급락. 이후 소폭 반등해서 400에 86% 수준.

  해석: Full ft는 memorization이 너무 빠르다. Pretrained representation을 빠르게 덮어쓰면서 in-domain에는 맞추지만, STS 같은 general retrieval 능력은 잃어버린다.

  ---

  관찰 2: LoRA는 다른 패턴을 보인다

  2B LoRA (v1.2)는 흥미로운 궤적을 그렸다:

  step 300: 87.78% ← peak
  step 1100: 82.64% ← 바닥 (dip)
  step 2900: 86.10% ← 회복 중 (여기서 학습 종료)

  Full ft의 단조 하락과 달리 V자 회복이 나타났다. 바닥을 찍고 서서히 올라오고 있었는데 학습이 끊겼다. 이 추세면 step 4000쯤에 peak을 다시 넘길 가능성도 있었다.

  ---

  왜 이런 패턴이 나올까

  이건 deep learning에서 잘 알려진 double descent / grokking 현상과 맞닿아 있다.

  학습 중에 두 가지 회로가 경쟁한다:
  - Memorization 회로: 빠르게 학습됨. training loss는 줄이지만 일반화가 안 됨
  - Generalization 회로: 느리게 학습됨. weight decay 같은 inductive bias가 밀어줘야 살아남음

  Full ft는 파라미터 전체가 움직이니까 memorization이 압도적으로 빠르다. Generalization 회로가 자리잡기 전에 이미 representation이 망가진다.

  LoRA는 파라미터 변화량 자체가 제한적(전체의 1.6%)이라 memorization이 느리다. 덕분에 generalization 회로가 경쟁에서 살아남을 여지가 생기고, 충분히 학습하면 회복이 나타난다.

  ---

  근본적 문제: Instruct vs Embedding 출발점

  같은 codebase로 ColQwen3 (Instruct 기반)을 학습하면 STS가 잘 오른다. 차이는 출발점:

  - ColQwen3: Instruct 모델에서 시작 → embedding을 처음부터 학습 → 올라갈 일만 남음
  - Qwen3-VL-Embedding: 이미 embedding 특화 모델 → contrastive ft가 기존 표현을 깨뜨림 → catastrophic forgetting

  Pretrained embedding 모델은 이미 좋은 representation을 갖고 있어서, 거기에 contrastive loss를 때리면 개선보다 파괴가 먼저 일어난다.

  ---

  코드는 문제 없었다

  공식 Qwen3VLEmbedder와 우리 파이프라인의 embedding parity 검증 결과, 3개 케이스(텍스트, 텍스트+task, 이미지+텍스트) 모두 cosine similarity = 1.0. instruction 끝 구두점 자동추가만 빠져있었고, 그것도 수정 완료.

  ---

  남은 가능성

  1. LoRA를 더 오래 돌리기 - V자 회복이 peak을 넘는지 확인
  2. 8B + LoRA - 8B의 높은 peak(90.63%) + LoRA의 회복 패턴 조합
  3. Model Merging (REFINE) - 학습 중 주기적으로 pretrained weights와 interpolation
  4. Soft label / Distillation - hard contrastive 대신 cross-encoder teacher로 부드러운 학습 신호
