---
tags:
  - LLM
aliases: []
---

# A) DPO를 한 문장으로 잡기

DPO(Direct Preference Optimization)는 `chosen/rejected` 답변 쌍을 이용해 LLM을 선호도에 맞게 미세조정하는 방법이다. 핵심은 [[RLHF]]에서 따로 학습하던 [[reward model]]과 PPO 단계를, 하나의 preference loss로 접어버리는 데 있다.

한 줄로 줄이면 이렇게 말할 수 있다.

> DPO는 reference model 대비 `chosen` 답변의 log probability는 더 올리고, `rejected` 답변의 log probability는 상대적으로 낮추도록 학습하는 offline preference tuning 방법이다.

여기서 중요한 점은 "좋은 답변의 확률을 무조건 크게 만든다"가 아니다. DPO는 **기존 SFT 모델이 보던 확률 분포를 기준점으로 삼고**, 그 기준점에서 `chosen` 쪽으로는 더 밀고 `rejected` 쪽으로는 덜 밀리게 만든다.

2026년 기준으로 DPO는 최신 유행의 중심이라기보다, 비용이 낮고 안정적인 **offline preference tuning baseline**에 가깝다. 자연스러운 한국어 문체처럼 reward를 명확한 규칙으로 만들기 어려운 문제에서는 여전히 쓸모가 크다. 반대로 수학, 코딩, tool use처럼 검증 가능한 보상이 있는 영역은 [[GRPO]] 계열과 `DAPO`, `GSPO` 같은 on-policy RL 흐름을 함께 봐야 한다. 전체 지형은 [[LLM Post-Training for Natural Korean]]에 정리해둔다.

# B) DPO가 왜 필요한가

LLM alignment의 전통적인 출발점은 [[RLHF]]다. RLHF는 사람이 선호하는 답변을 모델이 더 자주 내도록 만드는 강력한 방법이지만, 파이프라인이 무겁다.

일반적인 RLHF 흐름은 다음과 같다.

1. [[supervised fine-tuning|SFT]]로 모델이 기본적인 instruction-following 형식을 배우게 한다.
2. 같은 prompt에 대한 여러 답변을 사람이 비교하고, 어떤 답변이 더 좋은지 preference data를 만든다.
3. 그 preference data로 별도의 reward model을 학습한다.
4. reward model을 점수판처럼 사용해 PPO 같은 강화학습으로 policy model을 업데이트한다.

이 구조는 직관적이지만 운영하기 어렵다. reward model을 따로 만들어야 하고, PPO 학습도 튜닝이 까다롭다. reward가 조금만 이상해도 모델이 점수만 잘 받는 방향으로 비틀릴 수 있다.

DPO는 여기서 질문을 바꾼다.

> reward model이 결국 "두 답변 중 어느 쪽이 더 좋은가"를 구분하려는 것이라면, 굳이 reward model을 따로 만들지 말고 그 비교 목표를 language model loss 안에 직접 넣으면 되지 않을까?

이 발상이 DPO의 출발점이다.

# C) Preference 데이터는 어떻게 생겼나

DPO에 필요한 데이터는 복잡하지 않다. 하나의 prompt와, 그 prompt에 대한 두 개의 답변이 있으면 된다.

```text
x   = "배송이 늦어졌을 때 고객에게 어떻게 답해야 하나요?"
y_w = "불편을 드려 죄송하다고 먼저 말하고, 현재 배송 상태와 예상 일정을 확인해 안내합니다."
y_l = "배송은 택배사 문제라서 기다리라고 답합니다."
```

여기서 `y_w`는 winner, 즉 사람이 더 선호한 답변이다. 보통 `chosen`이라고도 부른다. `y_l`은 loser, 즉 덜 선호된 답변이고 `rejected`라고 부른다.

주의할 점은 `chosen = 사실`, `rejected = 거짓`이 아니라는 것이다. 둘 다 사실일 수 있다. 다만 rubric 기준에서 한쪽이 더 친절하거나, 더 안전하거나, 더 정확하거나, 더 자연스러울 뿐이다.

예를 들어 자연스러운 한국어 post-training에서는 다음처럼 pair를 만들 수 있다.

```text
chosen:
  "이 설정은 모델의 답변 스타일을 바꾸는 데 쓰인다. 다만 데이터 품질이 낮으면 문체만 그럴듯해지고 내용은 흔들릴 수 있다."

rejected:
  "이 설정은 모델 답변 스타일 변경에 활용될 수 있으며, 데이터 품질이 낮은 경우 내용적 안정성 저하가 발생할 수 있습니다."
```

두 답변이 말하는 사실은 거의 같다. 하지만 첫 번째가 더 자연스럽고 읽기 쉽다면, DPO는 그 차이를 preference signal로 사용할 수 있다.

# D) 핵심 직관은 log probability 비교다

LLM은 답변 전체에 확률을 매긴다. 실제 계산에서는 답변을 token 단위로 나누고, 각 token의 log probability를 더한다.

$$
\log \pi_\theta(y \mid x)
= \sum_{t=1}^{T} \log \pi_\theta(y_t \mid x, y_{<t})
$$

여기서:

- $x$: prompt
- $y$: 답변 전체
- $\pi_\theta$: 지금 학습 중인 policy model
- $y_t$: 답변의 $t$번째 token

DPO는 현재 모델의 log probability만 보지 않는다. **reference model과 비교해서 얼마나 달라졌는지**를 본다.

$$
s_\theta(x, y)
= \beta \left(
\log \pi_\theta(y \mid x)
- \log \pi_{\text{ref}}(y \mid x)
\right)
$$

이 $s_\theta(x, y)$를 DPO에서는 암시적 보상, 즉 implicit reward처럼 볼 수 있다.

- $\pi_\theta$: 학습 중인 모델
- $\pi_{\text{ref}}$: 보통 SFT 직후의 frozen reference model
- $\beta$: preference 차이를 얼마나 강하게 반영할지 조절하는 값

직관적으로는 이렇다.

- 현재 모델이 reference model보다 어떤 답변을 더 그럴듯하게 보면, 그 답변의 implicit reward는 커진다.
- 현재 모델이 reference model보다 어떤 답변을 덜 그럴듯하게 보면, 그 답변의 implicit reward는 작아진다.
- 그래서 DPO는 "답변 자체의 절대 확률"보다 "reference 대비 어느 답변을 더 밀어 올렸는가"를 본다.

이 기준점이 중요하다. reference model이 없으면 모델은 `chosen`만 과하게 따라가다가 기존 언어 능력이나 포맷 안정성을 잃기 쉽다. reference model은 일종의 출발선이자 브레이크 역할을 한다.

# E) DPO loss는 무엇을 벌주는가

DPO의 목표는 간단하다.

$$
s_\theta(x, y_w) > s_\theta(x, y_l)
$$

즉, reference model 대비 `chosen` 답변을 더 많이 밀어 올리고, `rejected` 답변은 덜 밀어 올리거나 낮추고 싶다.

이를 loss로 쓰면 다음과 같다.

$$
\mathcal{L}_{\text{DPO}}
= -\log \sigma \left(
s_\theta(x, y_w) - s_\theta(x, y_l)
\right)
$$

풀어 쓰면 더 직접적으로 보인다.

$$
\mathcal{L}_{\text{DPO}}
= -\log \sigma \left(
\beta \left[
\log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)}
-
\log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)}
\right]
\right)
$$

이 loss가 하는 일은 다음과 같다.

1. `chosen`의 reference 대비 log ratio를 키운다.
2. `rejected`의 reference 대비 log ratio는 상대적으로 낮춘다.
3. 두 값의 차이가 충분히 커지면 loss가 작아진다.
4. 두 값의 차이가 작거나 거꾸로 되면 loss가 커진다.

분류 문제처럼 보면 더 쉽다. 모델은 매번 "`y_w`가 `y_l`보다 선호된 답변이다"라는 이진 비교 문제를 푼다. 다만 일반 분류기 대신, language model의 sequence log probability를 이용해 그 비교를 수행한다는 점이 다르다.

# F) 학습 중 실제로 일어나는 일

DPO 학습 루프는 보통 이렇게 흘러간다.

1. SFT가 끝난 모델을 하나 복사해 reference model로 고정한다.
2. 같은 초기 모델에서 policy model을 시작하되, 이 모델만 업데이트한다.
3. 각 preference pair에 대해 policy model과 reference model의 log probability를 모두 계산한다.
4. `chosen`이 reference 대비 충분히 더 좋아지지 않았으면 loss가 커진다.
5. optimizer는 그 loss를 줄이는 방향으로 policy model을 업데이트한다.

이때 reference model은 학습되지 않는다. 계속 고정되어 있어야 "원래 모델과 비교했을 때 지금 모델이 얼마나 움직였는가"를 측정할 수 있다.

그래서 DPO를 실제로 이해할 때는 다음 문장이 가장 중요하다.

> DPO는 `chosen`을 무작정 외우게 하는 방법이 아니라, reference model에서 너무 멀어지지 않는 범위 안에서 `chosen`과 `rejected`의 상대적 선호 순서를 바꾸는 방법이다.

# G) 장점과 한계

| 구분 | 직관적 설명 | 실무에서 볼 점 |
| --- | --- | --- |
| 단순성 | reward model과 PPO 없이 preference pair만으로 학습한다. | 실험을 빨리 시작하기 좋다. |
| 안정성 | on-policy rollout 없이 offline dataset으로 학습한다. | PPO보다 운영 부담이 작지만, 데이터 분포 밖으로 탐험하지는 못한다. |
| 데이터 의존성 | loss가 pair의 품질을 그대로 믿는다. | pair가 애매하면 모델도 애매한 방향으로 간다. |
| Reference 제약 | SFT 모델에서 너무 멀어지지 않게 잡아준다. | reference model 선택과 $\beta$ 설정이 중요하다. |
| 한계 | 이미 있는 pair 안에서 선호 순서를 학습한다. | 수학/코딩/tool use처럼 검증 가능한 reward가 있으면 [[GRPO]] 같은 RL 계열도 비교해야 한다. |

DPO에서 가장 흔한 실패는 알고리즘 문제가 아니라 데이터 문제다. `chosen`과 `rejected`의 차이가 너무 많은 축에 걸쳐 있으면 모델이 무엇을 배워야 하는지 헷갈린다.

예를 들어 `chosen`은 짧고 자연스러운데 `rejected`는 길고 딱딱하다면, 모델은 "자연스러운 문체"를 배우는 대신 "짧게 말하면 이긴다"는 잘못된 신호를 배울 수 있다. 그래서 pair를 만들 때는 가능하면 비교하고 싶은 속성을 분명히 잡아야 한다.

# H) SFT, RLHF, GRPO와 어떻게 구분할까

| 방법 | 주된 신호 | 무엇을 배우나 | 쓰기 좋은 경우 |
| --- | --- | --- | --- |
| [[supervised fine-tuning]] | 정답 예시 | 기본 형식, 말투, task 수행 방식 | 모델이 아직 원하는 답변 형식을 모를 때 |
| DPO | `chosen/rejected` pair | 두 답변 중 무엇을 더 선호해야 하는지 | 선호 기준은 있지만 reward function을 만들기 어려울 때 |
| [[RLHF]] | reward model + rollout | reward를 높이는 행동 | 정교한 reward model과 RL 운영 비용을 감당할 수 있을 때 |
| [[GRPO]] 계열 | rollout + 검증 가능한 reward | 정답 검증이 가능한 문제에서 성능을 끌어올림 | 수학, 코딩, tool use, agentic task처럼 채점 기준이 비교적 명확할 때 |

정리하면, DPO는 SFT 다음에 붙이기 좋은 가벼운 preference tuning 방법이다. 모델에게 "이런 답변을 더 좋아해"라고 방향을 잡아주는 데 강하다. 하지만 모델이 새로운 해결 전략을 rollout으로 탐색해야 하거나, 검증 가능한 reward를 반복적으로 최적화해야 하는 문제라면 on-policy RL 계열이 더 적합할 수 있다.

# I) 실무 체크리스트

DPO를 프로젝트에 적용할 때는 알고리즘보다 데이터 설계와 평가를 먼저 봐야 한다.

1. `chosen/rejected`의 차이가 명확한가?
2. pair가 길이, 포맷, 말투 같은 부수적 단서에 오염되어 있지 않은가?
3. reference model은 어떤 checkpoint를 쓸 것인가?
4. $\beta$를 너무 크게 잡아 모델이 과하게 움직이지 않는가?
5. holdout pair에서 win rate가 오르는가?
6. 실제 사용자 평가나 domain judge 평가에서도 좋아졌는가?

특히 한국어 문체 개선처럼 reward를 수식으로 만들기 어려운 작업에서는 DPO가 꽤 자연스러운 선택지다. 다만 "자연스러운 답변 vs 번역투 답변" pair를 만들 때, 내용 정확도와 문체 품질을 섞어버리면 안 된다. 문체를 학습시키고 싶다면 내용은 최대한 같게 두고 표현만 다르게 만든 pair가 좋다.

# J) 면접에서 이렇게 말하면 된다

**Q1. DPO를 RLHF와 비교해서 설명해주세요.**

> DPO는 RLHF를 더 단순하게 만든 preference tuning 방법입니다. RLHF는 보통 SFT, reward model 학습, PPO 강화학습의 3단계를 거칩니다. 반면 DPO는 사람이 고른 `chosen/rejected` 답변 쌍을 사용해, 별도의 reward model 없이 language model을 직접 최적화합니다. 수식적으로는 현재 policy model과 reference model의 log probability ratio를 implicit reward처럼 보고, `chosen`의 점수가 `rejected`보다 커지도록 학습합니다.

**Q2. DPO의 핵심 아이디어는 무엇인가요?**

> 핵심은 reward model이 하던 비교를 모델의 log probability 비교로 바꾸는 것입니다. 어떤 답변을 현재 모델이 reference model보다 더 그럴듯하게 보면 그 답변의 implicit reward가 올라갑니다. DPO는 이 값을 이용해 `chosen` 답변은 reference 대비 더 밀어 올리고, `rejected` 답변은 상대적으로 낮추도록 학습합니다.

**Q3. DPO를 실제 프로젝트에 적용한다면 무엇을 가장 중요하게 보나요?**

> preference data의 품질을 가장 먼저 봅니다. DPO는 pair를 그대로 믿고 학습하기 때문에, `chosen`과 `rejected`의 차이가 명확해야 합니다. 예를 들어 문체를 개선하려는 실험이라면 두 답변의 사실 내용은 최대한 같게 두고, 자연스러움이나 친절함 같은 비교 축만 다르게 만드는 편이 좋습니다. 그다음에는 reference model 선택, $\beta$ 설정, holdout pair와 실제 사용자 평가를 함께 확인해야 합니다.

**Q4. DPO가 RLHF를 완전히 대체할 수 있나요?**

> 완전히 대체한다기보다는, 비용이 낮고 안정적인 offline preference baseline으로 보는 편이 맞습니다. reward model과 PPO 없이도 선호도 반영을 꽤 잘할 수 있지만, 주어진 preference dataset 안에서 학습한다는 한계가 있습니다. 수학, 코딩, tool use처럼 검증 가능한 reward가 있는 문제에서는 GRPO나 다른 on-policy RL 방법이 더 적합할 수 있습니다.

# References

- Rafailov et al., [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290)
- [[RLHF]]
- [[reward model]]
- [[supervised fine-tuning]]
- [[GRPO]]
- [[LLM Post-Training for Natural Korean]]
