---
layout: page
title: "RobustFT"
permalink: /papers/robust_ft
---

# RobustFT: Robust Supervised Fine-tuning for Large Language Models under Noisy Response

URL: https://huggingface.co/papers/2412.14922

### Abstract
대규모 언어 모델(LLM)을 특정 도메인이나 작업에 적응시키는 데 있어 지도 학습 기반의 미세 조정(SFT)은 중요한 역할을 합니다. 그러나 실험적 연구에 따르면, 수집된 데이터는 실제 응용에서 불가피하게 노이즈를 포함하게 되며, 이는 다운스트림 작업에서 모델 성능에 상당한 도전을 제기합니다. 따라서 다운스트림 작업에서 모델의 역량을 강화하기 위해 노이즈에 강한 SFT 프레임워크가 시급히 필요합니다. 이러한 과제를 해결하기 위해, 우리는 다운스트림 작업 데이터에 대한 노이즈 탐지 및 재레이블링을 수행하는 강력한 SFT 프레임워크(RobustFT)를 소개합니다. 노이즈 식별을 위해, 우리의 접근법은 추론이 강화된 모델을 사용하는 다중 전문가 협력 시스템을 활용하여 우수한 노이즈 탐지를 달성합니다. 노이즈 제거 단계에서는 가장 관련성 있고 확신 있는 지식을 통합한 후 신중한 평가를 통해 신뢰할 수 있는 주석을 생성하는 컨텍스트 강화 전략을 사용합니다. 또한, 응답 엔트로피에 기반한 효과적인 데이터 선택 메커니즘을 도입하여 미세 조정을 위해 고품질 샘플만 유지되도록 합니다. 다섯 개의 데이터셋에 걸쳐 여러 LLM에서 수행된 광범위한 실험은 노이즈가 많은 시나리오에서 RobustFT의 뛰어난 성능을 입증합니다.

## 1. Introduction
