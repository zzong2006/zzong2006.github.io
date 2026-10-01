---
title: "Jev와 RLCD"
tags:
  - LLM
  - reinforcement_learning
  - calibration
aliases:
  - Jev
  - RLCD
---

# A) 판단과 확률을 반환하는 Jev

Jev는 TypeSafe AI가 2026년 9월 공개한 **구조화된 판단 모델** 이다. 자유로운 답변 문장 대신, 입력 상황과 질문에 대해 선택지·점수·확률을 반환한다. TypeSafe는 이런 모델을 System One이라고 부르며, 학습 방식은 **RLCD(Reinforcement Learning for Calibrated Decisions)** 라고 소개한다. [공식 발표](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

RLCD의 공개된 목표는 판단의 정확도뿐 아니라 [[machine_learning/probability calibration|확률의 calibration]]까지 맞추는 것이다. 반면 일반적인 [[machine_learning/contrastive learning|contrastive learning]]은 positive와 negative를 구별하는 표현을 학습한다. 두 방법의 차이를 이해하려면 먼저 **무엇을 예측하는지**, 그다음 **어떤 loss와 절차로 학습하는지**를 나누어 봐야 한다.

2026년 10월 2일 확인한 공식 소개와 문서에는 RLCD의 목적은 나오지만, 재현할 수 있는 loss 수식·reward 정의·업데이트 알고리즘은 제시되어 있지 않다. 아래의 log loss와 Brier loss는 calibration을 설명하기 위한 일반적인 예시이며, Jev가 실제로 사용한다고 확인된 수식은 아니다.

# B) 입력과 출력

입력은 판단에 필요한 상황인 `state`와 질문들이다. 예를 들어 고객 문의를 state로 넣고, 문의 유형이나 환불 요청 여부를 물을 수 있다. 질문마다 반환 형식을 지정한다. [Primitives 문서](https://docs.typesafe.ai/primitives)

| 형식 | 질문 예시 | 결과의 의미 |
| --- | --- | --- |
| Choice | 문의 유형이 환불·배송·기타 중 무엇인가 | 선택한 항목과 전체 선택지의 확률 분포 |
| Score | 명시한 기준에서 답변 품질이 어느 수준인가 | 정의한 수준에 따른 점수와 수준별 확률 분포 |
| Noul | 고객이 환불을 요청했는가 | yes일 확률인 0–1 값 |

Choice와 Score에는 `confidence`도 붙는다. 이는 반환된 확률 분포의 집중도를 요약한 통계량이다. 곧바로 ‘선택한 답의 정답 확률’과 같은 숫자라고 해석하면 안 된다. Noul에는 별도 confidence가 없으며, 0.5는 yes와 no에 같은 확률을 부여했다는 뜻이다. [Confidence 문서](https://docs.typesafe.ai/confidence)

출력 형식을 제한하면 문자열 파싱이나 형식 오류를 줄일 수 있다. 그러나 정해진 선택지 안에서도 판단은 틀릴 수 있다. **타입이 맞는 출력과 사실에 맞는 판단은 별개** 다.

# C) RLCD에서 공개된 학습 목표

공식 AI primer는 사전학습된 language model의 post-training 경로로 RLHF, RLVR, RLCD를 비교한다. RLHF는 사람의 선호, RLVR는 검증 가능한 보상, RLCD는 판단과 calibrated probability를 강조한다. 이는 TypeSafe가 설명하는 목표의 구분이며, 각 계열의 모든 구현을 배타적으로 분류하는 기준은 아니다. [AI primer](https://docs.typesafe.ai/introduction/machine-learning-primer)

Calibration은 여러 예측을 모아서 판단한다. 예를 들어 ‘환불 요청일 확률이 0.8’이라고 예측한 사례들 중 실제 환불 요청이 약 80%라면 해당 구간의 확률이 잘 맞는 것이다. 개별 사례 하나가 ‘80%만큼 정답’이라는 뜻은 아니다.

| 확인할 항목 | 공식 자료에서 확인되는 범위 |
| --- | --- |
| 학습 방식의 명칭 | Reinforcement Learning for Calibrated Decisions |
| 지향하는 출력 | 구조화된 판단과 calibrated probability |
| 정확한 reward와 loss | 확인한 공식 자료에 수식이 없음 |
| PPO·GRPO 등의 사용 여부 | 확인되지 않음 |
| rollout, advantage, KL penalty 구성 | 확인되지 않음 |
| 학습 데이터·기반 모델·세부 구조 | 재현 가능한 학습 설정이 제시되어 있지 않음 |

따라서 RLCD를 ‘GRPO에 Brier reward를 붙인 방법’처럼 설명할 근거는 없다. RL이라는 이름만으로 reward model의 유무나 샘플링 단위를 정할 수도 없다.

이름도 주의해야 한다. 2023년 논문 *Reinforcement Learning from Contrastive Distillation* 역시 RLCD라는 약자를 쓴다. 이 논문은 서로 대조되는 프롬프트로 선호 쌍을 만들고 preference model을 학습한 뒤 RL에 활용한다. **Jev의 Calibrated Decisions와 다른 방법** 이다. [Yang et al., 2023](https://arxiv.org/abs/2307.12950)

# D) Contrastive loss가 학습하는 것

Contrastive learning의 대표적인 [[retrieval/concepts/InfoNCE|InfoNCE]]는 후보들 중 positive를 구별하도록 학습한다. 여기서는 anchor 하나에 positive 하나와 여러 negative가 있는 형태로 쓰면 다음과 같다. [CPC 논문](https://arxiv.org/abs/1807.03748)

$$
\mathcal L_{\mathrm{NCE}}
=-\log\frac{\exp(s(z,z^+)/\tau)}
{\exp(s(z,z^+)/\tau)+\sum_{j=1}^{K}\exp(s(z,z_j^-)/\tau)}
$$

| 기호 | 의미 |
| --- | --- |
| $\mathcal L_{\mathrm{NCE}}$ | anchor 하나의 contrastive loss |
| $z$ | anchor의 embedding |
| $z^+$ | positive의 embedding |
| $z_j^-$ | $j$번째 negative의 embedding |
| $K$ | negative 개수 |
| $s$ | cosine similarity 같은 유사도 함수 |
| $\tau$ | softmax의 집중도를 조절하는 양수 temperature |

학습에서는 positive의 유사도를 negative보다 높이는 방향으로 encoder를 업데이트한다. 예를 들어 같은 이미지의 두 augmentation을 positive로, 다른 이미지들을 negative로 두는 식이다. SimCLR는 이런 학습 절차의 대표 사례다. [SimCLR](https://arxiv.org/abs/2002.05709)

분수는 softmax 확률처럼 보이지만, 우선은 **지금 구성한 후보 집합에서 positive를 고르는 값** 이다. Negative의 수와 난도, sampling 분포, temperature가 바뀌면 값도 달라진다. 따라서 0.8이 나왔다고 바로 ‘실제 업무에서 이 판단이 맞을 확률 80%’로 읽을 수는 없다.

Contrastive learning으로 얻은 표현에 classifier를 붙이고 확률을 보정하는 것은 가능하다. 차이는 확률을 만들 수 있느냐가 아니라, 현재의 학습 목표가 어떤 사건에 대한 확률을 맞추고 있느냐에 있다.

# E) 확률을 맞추는 loss의 예

같은 환불 요청 판별 문제에서, 정답 label과 예측 확률을 직접 비교한다고 해 보자. 이진 분류의 log loss와 Brier loss는 다음과 같다. **두 수식 모두 설명용이며, Jev의 공개된 loss가 아니다.**

$$
\mathcal L_{\log}(p,y)=-y\log p-(1-y)\log(1-p)
$$

$$
\mathcal L_{\mathrm{Brier}}(p,y)=(p-y)^2
$$

| 기호 | 의미 |
| --- | --- |
| $y\in\{0,1\}$ | 실제 환불 요청 여부 |
| $p\in(0,1)$ | 모델이 예측한 환불 요청 확률 |
| $\mathcal L_{\log}$ | binary cross-entropy와 같은 log loss |
| $\mathcal L_{\mathrm{Brier}}$ | binary Brier loss; 두 클래스 오차를 합하는 정의와는 상수 배 차이가 있음 |
| $q$ | 같은 조건에서 환불 요청이 발생하는 실제 확률 |
| $\mathbb E$ | 해당 정답 분포에 대한 평균 |

두 loss는 기대값을 최소화할 때 실제 확률을 보고하도록 유도하는 strictly proper scoring rule이다. Brier loss는 이를 직접 전개해서 볼 수 있다.

$$
\mathbb E[\mathcal L_{\mathrm{Brier}}]
=q(1-p)^2+(1-q)p^2
\;=\;(p-q)^2+q(1-q)
$$

실제 확률 $q$가 고정되면 마지막 항도 고정된다. 따라서 기대 loss는 $p=q$에서 최소다. 다만 유한한 데이터, 모델의 표현력, 최적화 오차, 분포 변화가 있는 실제 학습에서 완벽한 calibration이 보장된다는 뜻은 아니다. 현대 신경망의 확률이 과신될 수 있고 별도의 보정이 유용하다는 점은 calibration 연구에서도 확인된다. [Guo et al., 2017](https://arxiv.org/abs/1706.04599)

설명용으로 실제 환불 요청 비율이 80%인 동일 조건의 사례들을 생각해 보자.

| 예측 확률 | 0.5 기준 분류 | 기대 Brier loss |
| --- | --- | --- |
| 0.80 | 환불 요청 | 0.1600 |
| 0.99 | 환불 요청 | 0.1961 |

두 모델은 같은 label을 고르므로 이 조건에서 분류 정확도는 같다. 하지만 두 번째 모델은 지나치게 확신하기 때문에 더 큰 확률 loss를 받는다. 이 차이가 calibration을 별도로 보는 이유다.

InfoNCE도 log-softmax를 쓰므로 cross-entropy와 수식 형태가 닮았다. **같은 로그를 쓴다는 사실보다, 정답 label과 분모의 후보가 무엇을 뜻하는지가 중요** 하다. InfoNCE에서는 positive 후보 식별이 목표이고, 위의 분류 loss에서는 정의한 사건의 조건부 확률을 맞추는 것이 목표다.

# F) Loss와 학습 절차는 나누어 봐야 한다

일반적인 contrastive training에서는 batch의 positive·negative 관계를 정하고, embedding 유사도로 loss를 계산한 뒤 역전파한다. 정답 label이 있는 확률 분류기도 예측 확률에 log loss나 Brier loss를 적용해 직접 역전파할 수 있다. **Calibration을 목표로 한다고 RL이 반드시 필요한 것은 아니다.**

RL에서는 모델의 행동이나 샘플 결과를 보상으로 평가해 기대 보상을 높인다. 하지만 어떤 출력을 행동으로 삼는지, 보상을 어떻게 계산하는지, gradient를 어떻게 추정하는지에 따라 실제 학습 절차는 달라진다. 단순히 loss에 음수를 붙여 reward라고 부르는 것만으로 policy-gradient 학습이 되는 것은 아니다.

| 비교 항목 | 대표적인 contrastive training | 정답 label을 이용한 확률 분류 | Jev의 RLCD |
| --- | --- | --- | --- |
| 직접적인 학습 신호 | positive·negative 관계 | 사건의 정답 label | 구체적인 생성·수집 방식 미공개 |
| 맞추려는 대상 | 후보 간 상대적 유사도 | 사건의 조건부 확률 | 판단과 calibrated probability |
| loss의 예 | InfoNCE | log loss, Brier loss | 정확한 식 미공개 |
| 업데이트 절차 | loss를 encoder에 역전파 | loss를 classifier에 역전파 | RL이라고 소개되었으나 세부 알고리즘 미공개 |

공개 자료로 설명할 수 있는 것은 이 목표의 차이까지다. Jev가 contrastive objective를 일부 함께 쓰는지, calibration을 어떤 reward로 구현하는지까지는 판단할 수 없다.

# G) 평가자로 사용할 때의 의미

[[machine_learning/generative_ai/evaluation/MT-bench|MT-Bench]] 같은 평가에서는 judge가 답변 품질을 판정한다. Jev를 평가에 활용한다면, 예를 들어 응답과 근거 문서를 state로 주고 ‘주장이 근거에 의해 뒷받침되는가’를 Noul로 물을 수 있다. 이는 사용 예시이며 MT-Bench의 기존 judge와 동등한 평가 성능을 보장하는 구성은 아니다.

실제 도입에서는 정답 label과의 일치도, 확률 calibration, 판단을 보류했을 때의 오류율을 함께 측정해야 한다. ‘calibrated’라는 학습 목표만으로 모든 도메인에서 동일한 threshold를 쓸 수는 없다.

2026년 9월 29일 공개된 독립 평가 preprint는 `jev-1.13.0`의 Choice 확률이 잘 보정되어 있다고 보고하면서도, binary probability에는 고정 0.5 threshold가 잘 맞지 않는 과제가 있다고 지적했다. UNFAIR-ToS에서는 학습 데이터로 threshold를 조정하자 micro-F1이 0.50에서 0.75로 올랐다. 이는 특정 버전·데이터셋의 결과이며, RLCD의 학습 수식을 밝힌 연구는 아니다. [Evaluating and Benchmarking the System One Model Jev](https://arxiv.org/abs/2609.37647)
