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

2026년 10월 2일 확인한 TypeSafe 공식 자료에는 RLCD의 목적은 나오지만, 재현할 수 있는 loss 수식·reward 정의·업데이트 알고리즘은 제시되어 있지 않다. 반면 Laya, Kev, NanoJev 같은 독립적인 오픈 모델은 학습 방식도 공개한다. **원본 Jev에서 알려진 것과 오픈 모델이 선택한 구현을 구분** 하면, 같은 판단 인터페이스를 지도학습과 RL로 각각 어떻게 만드는지 비교할 수 있다. 아래의 log loss와 Brier loss도 Jev의 확인된 수식이 아니라 이 비교를 위한 출발점이다.

# B) 입력과 출력

입력은 판단에 필요한 상황인 `state`와 질문들이다. 예를 들어 고객 문의를 state로 넣고, 문의 유형이나 환불 요청 여부를 물을 수 있다. 질문마다 반환 형식을 지정한다. [Primitives 문서](https://docs.typesafe.ai/primitives)

| 형식 | 질문 예시 | 결과의 의미 |
| --- | --- | --- |
| Choice | 문의 유형이 환불·배송·기타 중 무엇인가 | 선택한 항목과 전체 선택지의 확률 분포 |
| Score | 고객이 어느 정도로 불만을 표현하는가 | 정의한 수준에 따른 점수와 수준별 확률 분포 |
| Noul | 고객이 환불을 요청했는가 | yes일 확률인 0–1 값 |

## B.1) 고객 문의 하나에 세 가지 질문하기

고객이 “같은 주문이 두 번 결제됐네요. 번거롭지만 중복 결제한 금액을 환불해 주세요”라고 문의했다고 하자. 이 문장이 `state`이고, 무엇을 판단할지는 `questions`에 따로 적는다. 아래는 요청에서 `state`와 `questions`만 발췌한 예시다.

```json
{
  "state": {
    "customer_message": "같은 주문이 두 번 결제됐네요. 번거롭지만 중복 결제한 금액을 환불해 주세요."
  },
  "questions": {
    "request_type": {
      "type": "choice",
      "instructions": "customer_message의 주된 문의 유형은 무엇인가?",
      "criteria": {
        "refund": "결제한 돈을 돌려달라는 요청",
        "delivery": "배송 상태나 일정에 관한 문의",
        "other": "위 유형에 해당하지 않는 문의"
      }
    },
    "frustration": {
      "type": "score",
      "instructions": "customer_message에서 고객이 불만을 어느 정도 표현하는가?",
      "criteria": [
        "불만 표현 없이 사실이나 요청만 전달한다",
        "불편함을 표현하지만 정중하게 요청한다",
        "강한 분노나 비난을 표현한다"
      ]
    },
    "refund_requested": {
      "type": "noul",
      "instructions": "customer_message에서 고객이 환불을 요청하는가?"
    }
  }
}
```

`request_type` 같은 키는 질문과 응답을 연결하는 ID다. 모델이 이 이름만 보고 질문을 이해하는 것은 아니므로, 실제 판단할 내용은 `instructions`에 적는다. 세 질문은 같은 state를 각각 평가한다. Choice의 답을 읽고 Noul의 답을 만드는 순차 처리로 이해하면 안 된다.

## B.2) 반환된 값을 읽는 방법

다음은 **설명용 가상 출력** 이다. 실제 API를 호출한 결과가 아니며, 응답 중 `answers`의 주요 필드만 남겼다. Choice·Score의 `confidence`와 Score의 `legend` 등은 생략했다.

```json
{
  "answers": {
    "request_type": {
      "type": "choice",
      "choice": "refund",
      "probabilities": {"refund": 0.94, "delivery": 0.01, "other": 0.05}
    },
    "frustration": {
      "type": "score",
      "score": 1.0,
      "probabilities": {"0": 0.10, "1": 0.80, "2": 0.10}
    },
    "refund_requested": {
      "type": "noul",
      "noul": 0.98
    }
  }
}
```

Choice는 `refund`를 골랐고, 주된 문의가 환불 유형일 확률을 0.94로 평가했다. Noul의 0.98은 ‘환불을 요청했는가’라는 별도 질문에 대한 yes 확률이다. **문의의 주된 유형과 특정 요청의 존재 여부는 다른 판단** 이므로 두 숫자가 같을 필요는 없다.

Score의 수준 번호는 `criteria` 배열의 순서에 따라 0부터 붙는다. 이 예시에서는 ‘정중하지만 불편함을 표현함’인 수준 1에 확률 0.80을 부여했다. 반환 점수는 수준 번호의 확률 가중 평균이므로 `0 × 0.10 + 1 × 0.80 + 2 × 0.10 = 1.0`이다. 여기서 **1.0은 정답 확률 100%가 아니라 불만 수준의 위치** 다. [Score 문서](https://docs.typesafe.ai/primitives/score)

소프트웨어는 `choice`가 `refund`이면 환불 담당으로 문의를 보내는 식으로 이 값을 사용할 수 있다. 고객이 환불을 요청했다는 판단만으로 실제 환불 자격이나 승인 여부까지 확인된 것은 아니다. 그런 판단에는 주문·결제 내역과 환불 규정을 추가로 제공해야 한다.

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

따라서 원본 Jev의 RLCD를 ‘GRPO에 Brier reward를 붙인 방법’처럼 설명할 근거는 없다. RL이라는 이름만으로 reward model의 유무나 샘플링 단위를 정할 수도 없다. 뒤에서 살펴볼 Laya의 RLCD 구현과 NanoJev의 RLCD-inspired 실험은 각 프로젝트가 설계한 방법이며, TypeSafe의 학습법을 복원했다는 증거는 아니다.

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

같은 환불 요청 판별 문제에서, 정답 label과 예측 확률을 직접 비교한다고 해 보자. 이진 분류의 log loss와 [[machine_learning/loss/Brier loss|Brier loss]]는 다음과 같다. Brier loss는 예측 확률과 0 또는 1 정답 사이의 제곱오차, 즉 확률에 적용한 MSE로 이해하면 된다. **두 수식 모두 설명용이며, Jev의 공개된 loss가 아니다.**

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

원본 Jev에 대해서는 이 목표의 차이까지 설명할 수 있다. 오픈 모델에서는 한 걸음 더 나아가, 실제로 공개된 학습 절차를 비교할 수 있다.

# G) 오픈 모델에서 확인되는 구현

아래는 2026년 10월 2일 확인한 공개 자료 기준이다. API 형식이 비슷하더라도 모델 구조, 학습 데이터, loss는 서로 다르다. 특히 **가중치 공개, 학습 코드 공개, 원본 Jev의 학습법 공개는 각각 다른 범위** 다.

| 프로젝트 | 기반 모델과 공개 범위 | 공개된 학습 방식 |
| --- | --- | --- |
| [Laya](https://huggingface.co/convaiinnovations/laya) | ModernBERT 기반 421M, 다국어 mmBERT 기반 322M. 가중치와 fine-tuning notebook, Apache-2.0 | Proper scoring rule reward와 REINFORCE 계열 업데이트 |
| [Kev](https://github.com/jaredpalmer/kev#training) | Qwen 기반 모델군. 가중치와 학습 코드, Apache-2.0 | 정답 선택지에 대한 cross-entropy. 0.8B·4B·9B는 LoRA와 pointer head 학습 |
| [NanoJev](https://github.com/TianyuCodings/NanoJev) | Qwen3-0.6B 기반. 모델·데이터·학습 pipeline, MIT | 배포된 게임 모델은 cross-entropy SFT. 별도의 RLCD-inspired 확률 학습 실험 공개 |
| [OpenJev](https://huggingface.co/openjev/openjev) | 27B 가중치, CC BY-NC 4.0. 비상업용으로 공개 | 정답 선택과 선택지 순서 변경에 대한 일관성을 학습했다고 설명. 상세 loss는 모델 카드만으로 확인하기 어려움 |

## G.1) Kev: cross-entropy로 만드는 판단 모델

Kev는 질문과 선택지를 읽은 hidden state에서 선택지별 점수를 계산하는 pointer head를 쓴다. Softmax로 분포를 만들고, 정답 선택지의 확률이 커지도록 cross-entropy를 최소화한다. 소형 모델에서는 기반 가중치를 고정하고 LoRA adapter와 head를 함께 학습하며, 27B는 전체 가중치를 fine-tuning하는 별도 경로를 쓴다. Jev 출력으로 학습하지 않았다고 명시한다. [구조와 학습 설명](https://github.com/jaredpalmer/kev#how-it-works)

이는 앞의 확률 분류 loss를 실제 판단 모델에 적용한 사례다. 새로운 질문마다 선택지를 입력으로 주므로, 고정된 클래스 목록만 지원하는 classifier와는 사용 방식이 다르다. 다만 선택지를 동적으로 받는다는 사실 자체가 RL을 요구하지는 않는다. Fine-tuning 안내에는 별도로 남겨 둔 데이터에서 temperature를 맞추는 과정도 포함되어 있다. [Kev fine-tuning](https://github.com/jaredpalmer/kev#fine-tune-on-your-own-data)

## G.2) Laya: 여러 예측을 시험하고 확률을 채점하는 학습

Laya의 학습은 세 단계로 나누면 이해하기 쉽다. **예측을 조금씩 바꿔 본다 → 각 예측 확률에 점수를 준다 → 점수가 좋은 방향으로 모델을 바꾼다.** 첫 단계가 logit noise, 두 번째가 proper scoring rule, 세 번째가 policy-gradient 업데이트에 해당한다. 이는 Laya가 공개한 구현이며 원본 Jev의 학습법을 설명하는 것은 아니다.

### G.2.1) Logit noise와 label smoothing의 차이

Logit은 softmax로 확률을 만들기 전의 선택지별 점수다. 환불 요청 여부를 판별할 때 `[yes, no]`의 logit이 `[2, 0]`이면 확률은 약 `[0.881, 0.119]`가 된다. 여기서 noise를 넣는다는 것은 **정답은 그대로 두고 모델 쪽 점수를 조금씩 바꿔 여러 예측을 시험한다**는 뜻이다.

아래는 학습에서 뽑힐 수 있는 noise를 단순화한 설명용 예시다. 실제 난수 추출 결과나 모델의 측정값은 아니다.

| 경우 | 더한 noise | 바뀐 logit | yes 확률 |
| --- | --- | --- | --- |
| 원래 예측 | 없음 | `[2, 0]` | 0.881 |
| 시험 A | `[-0.5, +0.5]` | `[1.5, 0.5]` | 0.731 |
| 시험 B | `[+0.5, -0.5]` | `[2.5, -0.5]` | 0.953 |

시험 A는 덜 확신하고, 시험 B는 더 확신한다. **Noise를 넣는다고 항상 확률이 평평해지지는 않는다.** 평균 0인 Gaussian noise는 양수와 음수 방향으로 흔들되 특정 방향의 변화만 지속해서 더하지 않는다는 뜻이다. 공개 코드는 각 질문의 유효 선택지에 더한 noise의 평균도 빼 준다. 모든 logit에 같은 값을 더하면 softmax가 바뀌지 않으므로, 선택지 사이의 상대적인 차이를 흔드는 것이다. [Laya fine-tuning 코드](https://github.com/NandhaKishorM/laya/blob/main/notebooks/laya_finetune_typed_decisions_2xT4_kaggle.ipynb)

[[machine_learning/label smoothing|Label smoothing]]은 바꾸는 대상부터 다르다. 실제 정답이 yes일 때 학습용 정답표 `[1, 0]`을 예를 들어 `[0.95, 0.05]`로 바꾼다. 이를 통해 one-hot 정답을 끝까지 확신하도록 학습하는 압력을 줄인다. 위 noise 예시는 정답표를 바꾸지 않는다.

| 방법 | 바꾸는 대상 | 여기서의 역할 |
| --- | --- | --- |
| Label smoothing | 학습용 target 분포 | 정답에 확률 1을 주도록 강제하는 압력을 줄임 |
| Laya의 logit noise | 모델이 출력한 선택지 점수 | 현재 예측 주변의 다른 확률 분포를 시험함 |

Noise 자체가 정답 확률을 알려 주거나 calibration을 보장하지는 않는다. 바꿔 본 예측 중 무엇이 더 좋은지 정할 채점법이 필요하다.

### G.2.2) Proper scoring rule: 확률을 솔직하게 말할수록 유리한 채점법

Scoring rule은 **예측한 확률과 실제 결과를 받아 점수를 주는 규칙**이다. 그중 proper하다는 것은 실제 확률을 그대로 보고할 때 기대 점수가 최대라는 뜻이다. 다른 확률보다 유일하게 더 좋은 경우를 strictly proper라고 한다. Loss처럼 작을수록 좋은 형태로 쓰면 기대 loss가 최소라는 뜻이 된다. [Proper scoring rule의 정의](https://sites.stat.washington.edu/people/raftery/Research/PDF/Gneiting2007jasa.pdf)

같은 조건의 고객 문의에서 환불 요청이 실제로 80% 발생한다고 하자. 확률을 잘 채점하는 규칙이라면 50%나 99%라고 말하기보다 **80%라고 말할 때 장기적인 평균 점수가 가장 좋아야 한다.** 매 사례마다 80%라는 정답표를 제공해야 한다는 뜻은 아니다. 개별 사례의 yes/no 정답을 모아 평균 loss를 줄여도 이런 성질을 얻을 수 있다.

앞 절의 binary cross-entropy가 바로 이런 loss다. 실제 비율이 80%일 때 평균 loss를 계산하면 다음과 같다. 자연로그를 사용한 설명용 계산이다.

| 모델이 보고한 yes 확률 | 기대 cross-entropy, 낮을수록 좋음 |
| --- | --- |
| 0.50 | 0.6931 |
| 0.80 | 0.5004 |
| 0.99 | 0.9291 |

99%라고 말한 모델은 yes인 사례에서는 높은 점수를 받지만, no인 20%에서 크게 손해를 본다. 그래서 평균적으로는 80%를 보고하는 편이 낫다. 반면 0.5를 기준으로 정답 여부만 채점하면 0.80과 0.99의 차이를 구별하지 못한다. **Proper는 단순히 ‘정확한 분류’가 아니라 ‘확률을 부풀리거나 낮춰 말해서 이득을 얻을 수 없는 채점 방식’의 성질**이다.

Laya 코드에는 세 가지 점수가 들어간다. 이름보다 각각의 역할을 구분하면 된다.

| 점수 | 어떻게 채점하는가 |
| --- | --- |
| Log score | 정답에 준 확률의 로그. Cross-entropy에 음수를 붙인 reward로 이해할 수 있음 |
| Spherical score | 정답에 준 확률을 전체 확률 벡터의 길이로 나눔. 확률 분포를 채점하는 또 다른 proper rule |
| Ranked probability score | 낮음·보통·높음처럼 순서가 있을 때 누적확률의 오차를 계산. Reward에서는 이 오차를 뺌 |

세 점수를 처음부터 모두 외울 필요는 없다. 핵심은 **정답 label뿐 아니라 그 정답에 얼마만큼 확신했는지를 채점한다**는 것이다. Spherical score와 순서형 점수의 구현은 [proper_reward 함수](https://github.com/NandhaKishorM/laya/blob/main/laya/common.py)에서 확인할 수 있다. 이 구현은 수치 안정성을 위해 log score에 하한을 두므로, 이상적인 scoring rule의 엄밀한 성질과 실제 코드의 모든 경계 동작까지 같다고 보지는 않는다.

### G.2.3) 점수가 좋은 시험 결과를 학습에 반영

한 질문에 noise를 다르게 넣어 여러 예측 분포를 만들고 각각 채점한다. 그 묶음의 평균보다 점수가 높으면 양의 advantage, 낮으면 음의 advantage를 준다. 여기서 baseline은 비교 기준인 그룹 평균이고, advantage는 그 기준보다 얼마나 잘했는지다. REINFORCE는 이를 이용해 좋은 점수를 받은 noisy logit이 더 잘 나오도록 원래 logit을 만드는 모델을 조정한다. 선택지 label 하나를 뽑는 것과 noisy logit 벡터를 뽑는 것은 구분해야 한다.

2026년 10월 2일 확인한 공개 fine-tuning notebook은 **이 policy-gradient loss와 원래 logit의 cross-entropy loss를 함께 사용**한다. 따라서 이 경로를 순수한 REINFORCE 학습이라고만 설명하면 불완전하다. 저자의 ‘GRPO-style’ 표현 역시 그룹 평균을 비교 기준으로 쓴다는 뜻으로 읽어야 하며, clipping이나 KL penalty까지 DeepSeek GRPO와 같다는 근거는 아니다. [학습 notebook](https://github.com/NandhaKishorM/laya/blob/main/notebooks/laya_finetune_typed_decisions_2xT4_kaggle.ipynb)

학습 뒤에는 별도의 데이터로 temperature도 맞춘다. 좋은 확률을 유도하는 objective를 골랐다는 사실만으로 실제 배포 모델의 calibration이 보장되지는 않는다. 데이터와 모델의 한계, 분포 변화는 여전히 남는다.

## G.3) NanoJev: 같은 확률 목표를 직접 loss와 policy gradient로 비교

NanoJev의 배포 게임 모델 `unified-games-v1`은 질문 전체의 선택지 분포에 cross-entropy를 적용한 SFT 모델이다. 별도의 [RLCD-inspired 실험](https://github.com/TianyuCodings/NanoJev/blob/main/docs/RLCD_EXPERIMENT.md)은 직접 cross-entropy, 직접 Brier loss, 샘플 기반 policy gradient를 비교한다. 배포 모델의 학습법과 이 연구 실험을 혼동하면 안 된다.

실험에서는 예측 분포에서 label을 여러 번 독립적으로 뽑는다. 관측 정답과 일치하면 보상하고, 샘플끼리 지나치게 같은 label에 몰리면 페널티를 준다. 아래는 문서의 reward를 옮긴 것이다. 앞 절의 이진 확률과 달리 여기서 $\mathbf p,\mathbf q$는 전체 선택지에 대한 **확률 벡터** 다.

$$
R=\frac{2}{M}\sum_{i=1}^{M}\mathbf 1[A_i=Y]
-\frac{1}{M(M-1)}\sum_k c_k(c_k-1)
$$

$$
\mathbb E[R\mid x]
=2\mathbf p^\top\mathbf q-\|\mathbf p\|_2^2
=\|\mathbf q\|_2^2-\|\mathbf p-\mathbf q\|_2^2
$$

| 기호 | 의미 |
| --- | --- |
| $x$ | 상황과 질문을 포함한 입력 |
| $\mathbf p,\mathbf q$ | 입력 $x$에서 모델의 예측 분포와 실제 정답 분포 |
| $Y$ | 실제 정답 분포에서 관측한 label |
| $M$ | 독립적인 복원추출 횟수, 2 이상 |
| $A_i$ | 예측 분포에서 뽑은 $i$번째 label |
| $c_k$ | label $k$가 뽑힌 횟수 |
| $\mathbf 1[\cdot]$ | 조건이 참이면 1, 아니면 0 |
| $R$ | 샘플 묶음의 reward |
| $\mathbb E[\cdot\mid x]$ | 입력 $x$를 고정한 조건부 기대값 |
| $\|\cdot\|_2$ | 벡터의 Euclidean norm |

마지막 식에서 실제 분포의 norm은 고정되어 있으므로, 기대 보상을 높이면 두 분포의 제곱오차가 줄어든다. **정답 일치 보상만 주면 가장 유력한 label에 몰릴 수 있어**, 샘플 간 일치 페널티가 필요하다.

이 관계에는 조건이 있다. 입력이 주어졌을 때 관측 정답과 예측 샘플이 독립이어야 하고, 페널티에서 자기 자신과의 쌍은 제외해야 한다. 샘플은 결과를 바꾸는 실제 행동이 아니라 같은 사건의 가능한 label이다. 적절한 baseline을 쓰는 policy gradient는 기대 Brier 목표의 stochastic gradient estimator가 된다. [수식과 조건](https://github.com/TianyuCodings/NanoJev/blob/main/docs/RLCD_EXPERIMENT.md#objective-and-necessary-conditions)

작성자도 직접 loss보다 이 방식이 일반적으로 우월하다는 증거는 없다고 밝힌다. 선택지가 적고 직접 Brier gradient를 계산할 수 있다면, sampling은 추가 분산을 만든다. 이 사례는 새로운 확률 목표를 제시했다기보다 **같은 목표를 다른 gradient 추정 방식으로 학습할 수 있음**을 보여준다.

## G.4) OpenJev: 가중치 공개와 학습 재현성의 차이

OpenJev는 선택지마다 문자를 배정하고 첫 출력 위치에서 그 문자들의 logit을 읽는다. 이후 calibration을 적용해 확률로 바꾼다. 모델 카드는 정답 선택과 선택지 순서를 바꿔도 판단을 유지하는 방향으로 tuning했다고 설명하지만, 그것만으로 전체 loss나 RL 사용 여부를 특정할 수는 없다. **실행 가능한 가중치가 공개되어 있어도 학습 전 과정을 재현할 수 있다는 뜻은 아니다.** 가중치는 비상업용 CC BY-NC 4.0이며, helper와 serving 코드는 Apache-2.0이다. [OpenJev 모델 카드](https://huggingface.co/openjev/openjev#how-it-works-in-one-paragraph)

# H) 평가자로 사용할 때의 의미

[[machine_learning/generative_ai/evaluation/MT-bench|MT-Bench]] 같은 평가에서는 judge가 답변 품질을 판정한다. Jev를 평가에 활용한다면, 예를 들어 응답과 근거 문서를 state로 주고 ‘주장이 근거에 의해 뒷받침되는가’를 Noul로 물을 수 있다. 이는 사용 예시이며 MT-Bench의 기존 judge와 동등한 평가 성능을 보장하는 구성은 아니다.

실제 도입에서는 정답 label과의 일치도, 확률 calibration, 판단을 보류했을 때의 오류율을 함께 측정해야 한다. ‘calibrated’라는 학습 목표만으로 모든 도메인에서 동일한 threshold를 쓸 수는 없다.

오픈 모델과 비교할 때도 zero-shot 결과와 해당 과제에 fine-tuning한 결과, 보정 전 확률과 temperature 보정 후 확률을 나누어 봐야 한다. 가령 Laya는 typed-decisions에서 높은 점수가 해당 benchmark의 학습 split으로 fine-tuning한 checkpoint의 결과임을 명시한다. 이를 Jev에 대한 전반적인 우위로 확대해서 읽으면 안 된다. [Laya의 평가 범위와 한계](https://huggingface.co/convaiinnovations/laya#honest-limits)

2026년 9월 29일 공개된 독립 평가 preprint는 `jev-1.13.0`의 Choice 확률이 잘 보정되어 있다고 보고하면서도, binary probability에는 고정 0.5 threshold가 잘 맞지 않는 과제가 있다고 지적했다. UNFAIR-ToS에서는 학습 데이터로 threshold를 조정하자 micro-F1이 0.50에서 0.75로 올랐다. 이는 특정 버전·데이터셋의 결과이며, RLCD의 학습 수식을 밝힌 연구는 아니다. [Evaluating and Benchmarking the System One Model Jev](https://arxiv.org/abs/2609.37647)
