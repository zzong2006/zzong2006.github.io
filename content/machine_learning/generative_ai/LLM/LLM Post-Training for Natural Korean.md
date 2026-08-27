---
title: "자연스러운 한국어를 위한 LLM Post-Training"
tags: ["LLM", "post_training", "alignment", "instruction_tuning", "korean"]
aliases: ["Korean Instruction Tuning", "Natural Korean Post-Training", "LLM Post-Training"]
---

# A) 자연스러운 한국어를 위한 LLM Post-Training

2026년 기준 LLM post-training의 핵심은 `DPO` 같은 알고리즘 하나를 고르는 데 있지 않다. 먼저 좋은 cold-start SFT로 행동과 말투의 기준선을 잡고, verifiable reward가 있는 영역은 [[GRPO]] 계열 RL로 다룬다. 반대로 자연스러운 한국어처럼 보상을 깔끔하게 정의하기 어려운 영역은 SFT/Preference/Distillation/Eval을 더 촘촘히 설계하는 쪽이 중요해졌다.

한국어 자연스러움이 목표라면 처음부터 `GRPO`를 붙이기보다, 한국어 원문 기반 데이터로 말투의 기준선을 먼저 만드는 편이 낫다. 그다음 번역투, AI투, 높임법 불일치는 preference data로 잡고, 필요한 경우에만 reward를 조심스럽게 섞는 쪽이 안정적이다.

# B) 2026년에는 무엇이 달라졌나

2023-2024년에는 SFT 이후 [[DPO]]를 붙이는 방식이 오픈소스 instruction tuning의 기본 조합에 가까웠다. 별도 [[reward model]]과 PPO 파이프라인 없이 preference pair만으로 모델을 맞출 수 있었기 때문이다.

하지만 2025년 DeepSeek-R1 이후 분위기가 바뀌었다. 수학, 코딩, tool use처럼 정답 검증이 가능한 문제에서는 `RLVR(Reinforcement Learning from Verifiable Rewards)`가 중요한 축이 되었고, [[GRPO]], `DAPO`, [[GSPO]], `RLOO`, `REINFORCE++` 같은 on-policy RL 계열이 주요 라이브러리에서 더 크게 다뤄지기 시작했다.

다만 이런 변화를 한국어 자연스러움에 그대로 가져오면 위험하다. 자연스러운 한국어는 정답/오답이 깔끔히 갈리는 문제가 아니다. 존댓말의 일관성, 문장 리듬, 번역투, 기술 용어의 보존, 과도한 친절함, 문체의 과장 같은 요소가 얽혀 있다. 그래서 reward를 만들더라도 모델이 점수만 맞추는 방향으로 빠지기 쉽고, reward hacking도 쉽게 생긴다.

그래서 실무에서는 이렇게 나눠 보는 편이 낫다.

1. `SFT`는 여전히 가장 중요한 출발점이다.
2. `DPO/SimPO/KTO/ORPO`는 낡았다기보다 offline preference baseline이 되었다.
3. `GRPO/DAPO/GSPO` 계열은 정답을 검증할 수 있는 task나 agentic task에서 강하다.
4. 문체 품질은 알고리즘보다 데이터, judge rubric, human eval이 더 크게 좌우한다.

# C) Post-Training을 어떻게 나눠 볼까

| 단계 | 주로 필요한 데이터 | 최적화 대상 | 2026년 위치 | 한국어 자연스러움에서의 쓰임 |
| --- | --- | --- | --- | --- |
| CPT | 한국어 원문 corpus | 언어 분포, 도메인 지식 | 여전히 중요 | 번역투를 줄이고 한국어 token 분포를 자연스럽게 만듦 |
| SFT | instruction-response | 기본 행동, 말투, 형식 | 기본값 | 해요체/합니다체/기술 설명 스타일을 먼저 고정 |
| Cold-start SFT | 소량 고품질 seed data | RL 이전의 안정적 초기 정책 | reasoning RL에서 중요 | 한국어 말투와 답변 형식을 RL 전에 예열 |
| DFT/CADFT | positive demonstration | SFT loss 안정화 | SFT 자체 개선 | noisy하거나 난도 차가 큰 instruction data에 후보 |
| DPO/SimPO/KTO/ORPO | chosen/rejected pair | 선호 방향 | 안정적 baseline | 자연스러운 한국어 vs 번역투 pair에 잘 맞음 |
| GKD | teacher/student output | teacher 지식 증류 | 작은 모델에 실용적 | 좋은 teacher의 한국어 문체를 작은 모델에 이전 |
| [[GRPO]]/DAPO/[[GSPO]] | rollout + reward | reward가 검증 가능한 행동 | RLVR 중심축 | 형식/언어 일관성 같은 보조 reward에 제한적으로 사용 |
| Agentic RL | tool/env trajectory | multi-turn task 성공 | 빠르게 커지는 영역 | 한국어 상담, 검색, 도구 호출에서는 가능하지만 설계 비용이 큼 |

# D) 헷갈리는 용어들

## D.1) Cold-Start SFT

Cold-start SFT는 RL을 시작하기 전에 모델을 소량의 고품질 예시로 먼저 예열하는 단계다. Base model에 곧바로 RL을 걸면 모델이 reward는 맞추더라도 출력 형식이 흐트러지거나, 언어가 섞이거나, 사람이 읽기 어려운 답을 만들 수 있다.

DeepSeek-R1이 좋은 예다. R1-Zero는 SFT 없이 바로 RL을 걸었고 reasoning 성능은 강하게 올라갔지만, readability와 language mixing 문제가 있었다. R1은 이를 줄이기 위해 수천 개의 long CoT cold-start data로 먼저 SFT한 뒤 RL을 진행했다.

```text
Base model
-> cold-start SFT: 형식, 가독성, 기본 풀이 스타일을 먼저 주입
-> GRPO/RL: 정답률, reasoning, reward 최적화
-> rejection sampling + SFT
-> 추가 RL
```

한국어 자연스러움에서는 이 단계가 특히 중요하다. 모델이 처음부터 자연스러운 한국어를 스스로 찾게 만들기보다, 좋은 한국어 답변의 기준선을 먼저 보여주는 편이 훨씬 안정적이다.

## D.2) DFT

DFT(Dynamic Fine-Tuning)는 SFT loss를 조정해 token-level gradient를 안정화하려는 방법이다.

일반 SFT는 reference answer의 모든 토큰을 강하게 따라가게 한다. 그런데 모델이 현재 거의 불가능하다고 판단하는 낮은 확률 토큰에서는 gradient가 과하게 커질 수 있고, 이 때문에 모델이 일반화보다 memorization 쪽으로 끌릴 수 있다는 문제의식이 있다.

DFT는 모델의 현재 token probability를 이용해 loss를 동적으로 reweighting한다. 직관적으로는 다음과 같다.

```text
SFT: 모든 정답 토큰을 그냥 따라 해
DFT: 지금 모델 상태에서 너무 안 맞는 토큰은 조금 덜 세게 밀어줌
```

이 점에서 DFT는 Focal Loss와 방향이 반대다. Focal Loss는 어려운 샘플을 더 세게 보지만, DFT는 LLM SFT에서는 너무 낮은 확률 토큰을 무리하게 밀어붙이는 것이 generalization을 해칠 수 있다고 본다.

## D.3) CADFT

CADFT(Compatibility-Aware Dynamic Fine-Tuning)는 DFT의 관점을 sample-level로 확장한 방법이다.

DFT가 토큰 단위의 불안정성을 줄인다면, CADFT는 샘플 자체가 현재 모델에게 얼마나 learnable한지를 본다. 대규모 instruction dataset에는 모델과 잘 맞는 예시도 있고, 너무 복잡하거나 현재 policy와 맞지 않는 예시도 있다. CADFT는 model likelihood 기반 compatibility score를 계산해, 현재 모델과 너무 안 맞는 demonstration은 업데이트 영향력을 줄인다.

```text
DFT: 토큰 단위로 너무 거친 gradient를 줄임
CADFT: 샘플 단위로 지금 모델에게 너무 안 맞는 예시를 덜 세게 학습함
```

논문에서는 끝까지 compatibility가 낮은 샘플을 나중에 더 learnable한 형태로 rewrite하는 전략도 제안한다. 이 역시 RL이 아니라 supervised learning 안에서 학습을 더 안정적으로 만들려는 접근이다.

## D.4) GKD

GKD(Generalized Knowledge Distillation)는 큰 teacher model의 행동을 작은 student model에 옮기는 distillation 계열이다. 단순한 sequence-level distillation은 teacher가 만든 답변을 student가 그대로 따라 하게 한다.

GKD의 중요한 차이는 student가 먼저 자기 답변을 생성하고, teacher가 그 student-generated output에 token-level feedback을 줄 수 있다는 점이다.

```text
일반 KD: teacher 답변을 student가 따라 씀
GKD: student가 직접 답해봄 -> teacher가 그 답변을 보고 분포/피드백 제공 -> student가 교정됨
```

작은 한국어 모델을 만들 때는 꽤 현실적인 선택지다. 큰 teacher가 자연스러운 한국어 기술 답변을 잘 만든다면, 그 출력과 분포를 이용해 작은 모델의 말투와 instruction-following을 끌어올릴 수 있다.

# E) DPO는 이제 옛날 방법인가

절반은 맞고 절반은 아니다.

`DPO`가 연구적으로 가장 뜨거운 키워드는 아니다. 2026년에 새로 나오는 라이브러리와 논문은 on-policy RL, RLVR, multi-turn agent, multi-reward optimization 쪽을 더 많이 다룬다. `verl` 문서도 `PPO`, [[GRPO]], `DAPO`, [[GSPO]] 같은 RL recipe를 앞쪽에 두고, `ms-swift`도 GRPO family를 강하게 지원한다.

하지만 DPO가 실무에서 쓸모를 잃은 것은 아니다. 비용이 낮고, 구현이 쉽고, reward hacking 위험이 상대적으로 작다. 특히 자연스러운 한국어처럼 reward를 완전히 규칙화하기 어려운 문제에서는, 좋은 pairwise preference data만 있다면 DPO류가 여전히 좋은 출발점이다.

다만 `DPO variant`를 고르는 일에 과하게 기대하면 안 된다. OXRL의 2026 controlled study는 post-training 알고리즘 간 차이가 model scale, training paradigm, task distribution보다 작을 수 있음을 보여준다. 즉, "DPO냐 SimPO냐"보다 "어떤 모델에 어떤 데이터로 학습하고, 어떤 평가로 확인했느냐"가 더 클 때가 많다.

# F) 자연스러운 한국어 Instruction Tuning 레시피

## F.1) 먼저 정의해야 하는 것

자연스러운 한국어는 너무 넓은 말이다. 학습에 들어가기 전에 최소한 다음 기준은 먼저 정해야 한다.

| 축 | 예시 | 왜 중요한가 |
| --- | --- | --- |
| 말투 | 해요체, 합니다체, 반말 | 하나의 답변 안에서 register가 섞이면 바로 어색해짐 |
| 도메인 | 기술 설명, 논문 리뷰, 고객 응대, 요약 | 자연스러운 문장 길이와 용어 밀도가 달라짐 |
| 용어 정책 | 영어 원어 유지, 한글 병기, 번역 | ML/infra 문서는 영어 용어를 무리하게 번역하면 오히려 어색함 |
| 장황함 | 짧은 답, 깊은 답, 튜토리얼 | AI 티의 상당 부분은 불필요한 구조화와 과잉 설명에서 나옴 |
| 피해야 할 패턴 | 번역투, 과한 접속사, 균일한 문장 리듬 | 단순 grammar score로 잡기 어려운 부분 |

## F.2) 데이터는 세 갈래로 나눈다

첫째, native Korean SFT 데이터가 필요하다. 사람이 실제로 쓴 기술 글, 질의응답, 리뷰, 설명문을 모으고, 번역투 synthetic data는 비중을 낮춘다. 이 단계의 목표는 모델이 한국어 문장의 기본 리듬을 배우는 것이다.

둘째, style-controlled instruction data를 만든다. 같은 질문이라도 "짧게", "실무자에게", "블로그 글처럼", "논문 리뷰처럼", "면접 답변처럼" 같은 조건을 달아야 한다. 그래야 모델이 평균적인 AI 말투 하나로 뭉개지지 않고 상황에 맞게 답한다.

셋째, preference pair를 만든다. chosen은 자연스러운 한국어 답변이고, rejected는 내용은 맞지만 번역투이거나 너무 장황하거나 높임법이 흔들리는 답변이다.

```json
{
  "prompt": "Siamese dual encoder에서 siamese가 무슨 뜻이야?",
  "chosen": "여기서 Siamese는 두 encoder가 같은 가중치를 공유한다는 뜻에 가깝다...",
  "rejected": "Siamese라는 용어는 쌍둥이를 의미하며, 이는 모델 아키텍처 측면에서..."
}
```

## F.3) 학습 순서

실무적으로는 다음 순서가 안전하다.

1. Base 또는 instruct model 선택
2. 필요하면 한국어 CPT 또는 domain-adaptive pretraining
3. Korean SFT로 register와 답변 형식 고정
4. DFT/CADFT를 SFT 대안으로 소규모 실험
5. DPO/SimPO/KTO로 자연스러움 preference 반영
6. GKD로 큰 teacher의 좋은 한국어 답변을 작은 모델에 증류
7. [[GRPO]]/DAPO/[[GSPO]]는 reward를 분명하게 만들 수 있는 하위 task에만 제한적으로 적용

한국어 자연스러움만 놓고 보면 SFT 이후 [[DPO]]/SimPO를 붙이고 eval로 확인하는 방식이 가장 먼저 시도할 만하다. RL은 그다음이다. 단, format following, tool calling, 한국어만 쓰기, 금칙어 회피처럼 reward를 비교적 안정적으로 만들 수 있는 부분은 RL로 따로 분리해볼 수 있다.

## F.4) Reward를 쓴다면 이렇게 쪼갠다

하나의 reward model에게 "자연스러운가?"를 한 번에 판단하게 하면 불안정하다. 차라리 reward를 여러 축으로 나누는 편이 낫다.

| Reward 축 | 자동화 가능성 | 예시 |
| --- | --- | --- |
| 언어 일관성 | 높음 | 한국어 비율, 불필요한 영어 문장 비율 |
| 형식 준수 | 높음 | 요청한 bullet 수, JSON schema, 제목 수 |
| 길이 제어 | 높음 | 과도한 장황함 penalty |
| 높임법 일관성 | 중간 | 해요체/합니다체 혼합 감지 |
| 번역투 감지 | 중간 | "이는 ... 하는 것을 의미합니다" 남발, 영어식 명사화 |
| 기술 용어 보존 | 중간 | `DPO`, `GRPO`, `reward model` 같은 용어 유지 |
| 문체 자연스러움 | 낮음 | LLM-as-judge 또는 human preference 필요 |

2026년 6월 기준으로는 multi-reward를 안정적으로 합치는 문제가 새롭게 떠오르고 있다. GD2PO 같은 최근 연구도 여러 reward가 서로 충돌할 때 advantage가 상쇄되는 문제를 다룬다. 한국어 자연스러움 역시 "간결함", "친절함", "정확성", "문체" reward가 서로 부딪히기 쉬우므로 같은 문제가 나타난다.

## F.5) 평가는 KITE와 자체 A/B가 같이 필요하다

KITE는 한국어 instruction-following benchmark로, 한국어의 문법, 높임법, 숫자 체계, 문화적 맥락 같은 요소를 평가 대상으로 삼는다. 다만 KITE만으로 "내가 원하는 한국어 기술 글의 자연스러움"을 다 볼 수는 없다.

따라서 자체 A/B eval이 필요하다.

1. 같은 prompt에 대해 baseline과 tuned model 답변을 생성한다.
2. 평가자는 모델명을 보지 않고 더 자연스러운 답을 고른다.
3. "내용 정확성", "문체", "간결함", "용어 보존", "사용자 의도 반영"을 따로 채점한다.
4. 승률만 보지 말고, 왜 졌는지 error bucket을 남긴다.

# G) 라이브러리 선택 기준

## G.1) Axolotl

Axolotl은 YAML 기반으로 SFT, LoRA/QLoRA, preference tuning, GRPO 계열을 빠르게 실험하기 좋다. 2026년 업데이트를 보면 GDPO, EAFT, MoE LoRA/quantization 같은 실전 fine-tuning 기능도 계속 들어오고 있다.

한국어 자연스러움 실험에서는 첫 번째 baseline 용도로 잘 맞는다. 데이터 포맷과 LoRA 실험을 빨리 돌릴 수 있고, `DPO/ORPO/KTO` 같은 preference tuning도 접근하기 쉽다.

## G.2) ms-swift

ms-swift는 Qwen/ModelScope 생태계와 잘 맞고, CPT/SFT/DPO/GRPO/GKD를 한 파이프라인 안에서 다루기 좋다. 문서상으로도 GRPO family를 [[GRPO]], `DAPO`, [[GSPO]], `SAPO`, `CISPO`, `CHORD`, `RLOO`, `Reinforce++`까지 넓게 지원한다.

Qwen 계열 한국어 실험, GKD, 대규모 multi-GPU/Megatron 쪽을 염두에 둔다면 먼저 볼 만하다.

## G.3) verl

verl은 연구/대규모 RL post-training에 더 가깝다. `PPO`, [[GRPO]], `DAPO`, [[GSPO]] recipe와 large-scale rollout/inference pipeline을 다루기 좋다.

한국어 문체만 다듬는 목적이라면 과할 수 있다. 하지만 tool calling, code execution, search agent처럼 rewardable environment가 있는 한국어 agent를 학습한다면 볼 만하다.

## G.4) TRL

TRL은 Hugging Face 표준에 가까운 post-training toolkit이다. `SFTTrainer`, `DPOTrainer`, `GRPOTrainer`, `RLOOTrainer`, `OnlineDPOTrainer`, `GKDTrainer` 등으로 실험을 작게 재현하고 검증하기 좋다.

특히 GKD 문서가 잘 정리되어 있어서 teacher-student distillation을 빠르게 이해하고 prototype하기에 좋다.

## G.5) OpenRLHF와 LLaMA-Factory

OpenRLHF는 Ray, vLLM, async RL, DAPO, REINFORCE++ 등 실전 RLHF/RLVR 파이프라인에 가깝다. 대규모 rollout과 agentic RL 쪽을 볼 때 먼저 확인할 만하다.

LLaMA-Factory는 Web UI/CLI 기반으로 SFT, DPO, KTO, ORPO, PPO 등을 쉽게 돌릴 수 있다. bleeding-edge RL 연구 프레임워크라기보다는 fine-tuning 작업을 빠르게 시작하는 도구에 가깝다.

# H) 작게 시작하는 실험 계획

한국어 자연스러움을 확인하려면 큰 규모의 RL부터 시작하지 말고, 다음처럼 작게 나누는 편이 안전하다.

1. Base model: Qwen/Llama/EXAONE 계열 중 하나를 고른다.
2. SFT set: 기술 설명/논문 리뷰/짧은 질의응답 5k-20k개를 준비한다.
3. Preference set: 자연스러운 답 vs 번역투 답 2k-10k pair를 만든다.
4. Baseline: SFT만 한 모델을 만든다.
5. 비교군: SFT+DFT, SFT+DPO, SFT+SimPO, SFT+GKD를 작게 비교한다.
6. Eval: KITE + 자체 blind pairwise eval + 실제 사용 prompt set으로 본다.
7. RL은 나중에: 형식 준수, 한국어 일관성, tool calling처럼 reward가 명확한 하위 문제부터 붙인다.

이 순서가 좋은 이유는 실패 원인을 분리하기 쉽기 때문이다. 처음부터 GRPO를 붙이면 모델이 한국어를 못하는 건지, reward가 나쁜 건지, sampling이 불안정한 건지, 데이터가 번역투인지 구분하기 어렵다.

# I) References

* [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948)
* [On the Generalization of SFT: A Reinforcement Learning Perspective with Reward Rectification](https://arxiv.org/abs/2508.05629)
* [Compatibility-Aware Dynamic Fine-Tuning for Large Language Models](https://arxiv.org/abs/2606.11206)
* [TRL GKD Trainer](https://huggingface.co/docs/trl/main/en/gkd_trainer)
* [DAPO: An Open-Source LLM Reinforcement Learning System at Scale](https://arxiv.org/abs/2503.14476)
* [Group Sequence Policy Optimization](https://arxiv.org/abs/2507.18071)
* [GD2PO: Mitigating Multi-Reward Conflicts via Group-Dynamic reward-Decoupled Policy Optimization](https://arxiv.org/abs/2606.16771)
* [Do Post-Training Algorithms Actually Differ?](https://arxiv.org/abs/2603.19335)
* [KITE: A Benchmark for Evaluating Korean Instruction-Following Abilities in Large Language Models](https://arxiv.org/abs/2510.15558)
* [Axolotl](https://github.com/axolotl-ai-cloud/axolotl)
* [ms-swift](https://github.com/modelscope/ms-swift)
* [verl](https://verl.readthedocs.io/en/latest/)
* [TRL](https://huggingface.co/docs/trl/index)
* [OpenRLHF](https://github.com/OpenRLHF/OpenRLHF)
* [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory)
