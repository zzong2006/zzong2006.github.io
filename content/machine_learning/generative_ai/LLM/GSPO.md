---
title: Group Sequence Policy Optimization
tags:
  - LLM
  - reinforcement_learning
  - post_training
  - RLVR
  - policy_optimization
  - Qwen
aliases:
  - GSPO
  - Group Sequence Policy Optimization
---

# A) 한줄 요약

GSPO(Group Sequence Policy Optimization)는 LLM RL에서 답변 전체를 하나의 sequence로 보고 policy를 업데이트하는 방법이다.

[[GRPO]]는 value model 없이 group reward로 advantage를 만들지만, policy update에서는 token마다 importance ratio를 계산한다. GSPO는 이 부분을 바꾼다. reward가 답변 전체에 붙는다면, ratio와 clipping도 답변 전체 단위로 맞추자는 접근이다.

한 줄로 줄이면 이렇게 볼 수 있다.

> GRPO가 "좋은 답변 안의 token들을 어떻게 밀 것인가"를 본다면, GSPO는 "좋은 답변 sequence 전체가 old policy 대비 얼마나 달라졌는가"를 본다.

GSPO 논문은 이 방식이 [[GRPO]]보다 training stability, efficiency, performance에서 낫고, 특히 [[MoE]] 모델의 RL training을 안정화한다고 보고한다. [[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]의 RL stage에서도 `GSPO`가 사용된다.

# B) 왜 GSPO가 나왔나

LLM RLVR에서는 보통 답변 전체에 reward가 붙는다.

```text
prompt x
-> response y
-> verifier/reward r(x, y)
```

수학 문제라면 최종 답이 맞았는지, coding task라면 test를 통과했는지가 reward가 된다. reward는 token 하나하나보다 response 전체를 평가한다.

그런데 GRPO는 response-level reward로 advantage를 만든 뒤, policy update에서는 token-level ratio를 쓴다.

```text
reward / advantage: response level
importance ratio / clipping: token level
```

이 mismatch가 GSPO의 출발점이다.

token-level importance ratio는 "old policy가 이미 뽑은 token을 current policy가 지금은 얼마나 더, 또는 덜 뽑으려 하는가"를 보는 비율이다. 예를 들어 old policy가 어떤 자리에서 `4` token을 낼 확률을 `0.20`으로 봤고, current policy가 `0.30`으로 본다면 ratio는 `1.5`다. 현재 모델이 그 token을 이전보다 더 밀고 있다는 뜻이다.

이 ratio는 update lever에 가깝다. 답변 전체가 좋은 reward를 받으면 그 답변 안의 token 확률을 올리는 방향으로, 나쁜 reward를 받으면 낮추는 방향으로 작동한다.

문제는 advantage는 답변 하나에 하나인데, ratio와 clipping은 token마다 따로 걸린다는 점이다. 긴 reasoning 답변에서는 token별 작은 차이가 많이 쌓이고, clipping까지 거치면서 gradient noise가 커질 수 있다. [[MoE]] 모델에서는 token마다 활성화되는 expert가 달라질 수 있어 token-level likelihood ratio가 더 흔들릴 수 있다.

# C) 핵심 아이디어

GSPO의 핵심은 단순하다.

> reward가 sequence 단위라면, importance ratio와 clipping도 sequence 단위로 맞춘다.

하나의 prompt $x$에 대해 old policy에서 $G$개의 답변을 샘플링한다.

$$
y_1, y_2, \ldots, y_G
\sim
\pi_{\theta_{\mathrm{old}}}(\cdot \mid x)
$$

각 답변 $y_i$는 verifier로 reward를 받는다.

$$
r(x, y_i)
$$

그다음 group 안에서 상대 advantage를 계산한다.

$$
\widehat{A}_i =
\frac{
  r(x, y_i) - \mathrm{mean}(\{r(x, y_j)\}_{j=1}^{G})
}{
  \mathrm{std}(\{r(x, y_j)\}_{j=1}^{G})
}
$$

여기까지는 GRPO와 비슷하다. 차이는 policy ratio다.

GRPO는 token마다 ratio를 둔다.

$$
w_{i,t}(\theta) =
\frac{
  \pi_\theta(y_{i,t} \mid x, y_{i,<t})
}{
  \pi_{\theta_{\mathrm{old}}}(y_{i,t} \mid x, y_{i,<t})
}
$$

notation은 다음처럼 읽으면 된다.

| 기호 | 뜻 |
| --- | --- |
| $x$ | prompt 또는 query |
| $y_i$ | $i$번째 response |
| $y_{i,t}$ | $i$번째 response의 $t$번째 token |
| $y_{i,<t}$ | $t$번째 token 앞에 이미 생성된 prefix |
| $\pi_\theta$ | 지금 업데이트하려는 current policy |
| $\pi_{\theta_{\mathrm{old}}}$ | rollout을 만들 때 쓴 old policy |
| $w_{i,t}(\theta)$ | current policy가 같은 token을 old policy보다 얼마나 더, 또는 덜 내려고 하는지 |

GSPO는 이 token-level ratio를 답변 전체의 sequence-level ratio로 바꾼다.

$$
s_i(\theta)
= \left(
\frac{\pi_\theta(y_i \mid x)}
{\pi_{\theta_{\mathrm{old}}}(y_i \mid x)}
\right)^{\frac{1}{|y_i|}}
=
\exp \left(
\frac{1}{|y_i|}
\sum_{t=1}^{|y_i|}
\log
\frac{
  \pi_\theta(y_{i,t} \mid x, y_{i,<t})
}{
  \pi_{\theta_{\mathrm{old}}}(y_{i,t} \mid x, y_{i,<t})
}
\right)
$$

여기서 $\pi_\theta(y_i \mid x)$는 response 전체를 한 번에 내는 확률처럼 보이지만, 실제로는 token 확률의 곱이다.

$$
\pi_\theta(y_i \mid x)
=
\prod_{t=1}^{\lvert y_i \rvert}
\pi_\theta(y_{i,t} \mid x, y_{i,<t})
$$

긴 답변은 token 확률을 많이 곱하므로 likelihood가 자연스럽게 작아진다. 그래서 GSPO는 전체 sequence ratio를 그대로 쓰지 않고, token 수 $\lvert y_i \rvert$로 나눈 평균 log ratio를 만든 뒤 다시 $\exp$를 씌운다.

직관적으로는 "답변 전체가 old policy 대비 평균적으로 얼마나 더 그럴듯해졌는가"를 보는 값이다. 주의할 점은, 길이로 정규화되는 대상이 reward가 아니라 policy ratio라는 점이다. reward와 advantage는 여전히 response 단위로 계산된다.

# D) Objective와 차이

GSPO의 clipped objective는 다음과 같다.

$$
\mathcal{J}_{\mathrm{GSPO}}(\theta)
=
\mathbb{E}
\left[
\frac{1}{G}
\sum_{i=1}^{G}
\min \left(
  s_i(\theta)\widehat{A}_i,
  \mathrm{clip}(s_i(\theta), 1-\varepsilon, 1+\varepsilon)\widehat{A}_i
\right)
\right]
$$

수식은 PPO/GRPO와 비슷하지만, clipping 대상이 다르다.

| 방법 | ratio 단위 | reward/advantage 단위 | 핵심 차이 |
| --- | --- | --- | --- |
| PPO | token/action | token/action 또는 value 기반 | value model이 필요함 |
| [[GRPO]] | token | response group | value model은 없지만 token-level ratio를 씀 |
| GSPO | response sequence | response group | reward와 optimization 단위를 sequence로 맞춤 |

GSPO는 좋은 advantage를 받은 답변의 sequence likelihood를 높이고, 낮은 advantage를 받은 답변의 sequence likelihood를 낮춘다. 이때 특정 token 하나가 아니라 답변 전체의 평균 log ratio를 보고 clip한다.

# E) GRPO와 무엇이 달라지나

## E.1) Token마다 다른 가중치를 줄인다

GRPO에서는 같은 답변 안의 token이라도 token-level ratio가 다르다. 그래서 같은 response-level advantage를 공유하더라도, 실제 gradient에서는 token마다 다른 weight가 걸린다.

GSPO는 답변 하나에 sequence-level ratio 하나를 둔다. 좋은 답변이면 답변 전체를 밀고, 나쁜 답변이면 답변 전체를 덜어낸다. reward가 전체 답변에 붙는 RLVR task에서는 이쪽이 더 직접적이다.

## E.2) 긴 답변에서 noise 누적을 줄인다

긴 reasoning 답변에서는 token이 많다. token-level ratio가 조금씩 흔들려도 많이 쌓이면 update가 불안정해질 수 있다.

GSPO는 response-level ratio 하나로 clipping을 하므로, token-level fluctuation이 gradient에 직접 쌓이는 경로를 줄인다. 논문은 이 차이가 long response RL에서 stability를 높인다고 본다.

## E.3) MoE training에서 routing replay 의존을 줄인다

MoE 모델은 token마다 활성화 expert가 달라질 수 있다. GRPO에서 token-level likelihood ratio를 안정적으로 계산하려면, old policy에서 어떤 expert가 활성화됐는지 replay하는 식의 workaround가 필요할 수 있다.

GSPO는 sequence likelihood를 기준으로 보기 때문에 token-level expert routing 변화에 덜 민감하다. Qwen Team은 이 덕분에 MoE RL training에서 Routing Replay 같은 복잡한 안정화 장치를 줄일 수 있었다고 설명한다.

# F) 한계와 후속 흐름

GSPO는 GRPO의 token-level ratio 문제를 줄이지만, 모든 문제를 끝내지는 않는다.

첫 번째 한계는 length bias다. GSPO는 sequence ratio를 길이로 정규화하지만, reward를 길이로 정규화하는 것은 아니다. 또 objective 안에서는 response 하나가 하나의 loss 항처럼 평균되므로, 긴 답변의 token 하나하나가 loss에 기여하는 비중은 짧은 답변보다 작아질 수 있다.

후속 연구인 LUSPO는 이 지점을 GSPO의 length bias로 본다. 특히 sequence-level clipping은 token-level clipping보다 더 많은 token을 한꺼번에 clip할 수 있고, practical setting의 Clip-Higher와 결합되면 positive/negative sample의 token 기여가 불균형해질 수 있다고 지적한다. 그 결과 GSPO가 response length collapse, 즉 답변이 점점 짧아지는 방향으로 치우칠 수 있다는 것이다.

LUSPO의 보정은 reward를 길이로 나누는 쪽이 아니다. 오히려 GSPO loss에 response 길이 $\lvert y_i \rvert$를 곱해서, 긴 sequence의 token 기여가 과소평가되지 않도록 맞춘다.

$$
\mathcal{J}_{\mathrm{LUSPO}}(\theta)
=
\mathbb{E}
\left[
\frac{1}{G}
\sum_{i=1}^{G}
\min \left(
  s_i(\theta)\widehat{A}_i,
  \mathrm{clip}(s_i(\theta), 1-\varepsilon, 1+\varepsilon)\widehat{A}_i
\right)
\cdot \lvert y_i \rvert
\right]
$$

두 번째 한계는 credit assignment다. 다만 이 말은 "GRPO는 각 reasoning step의 좋고 나쁨을 정확히 안다"는 뜻이 아니다. GRPO도 보통 reward와 advantage는 답변 전체에 붙이고, 같은 advantage를 답변 안의 token들이 공유한다.

차이는 정도에 있다. GRPO는 token마다 ratio와 clipping이 달라서 token별 gradient 크기가 달라질 수 있다. GSPO는 sequence 전체를 더 강하게 묶는다. 따라서 step-level credit assignment가 중요한 task라면 process reward, step-level verifier, token-wise advantage 같은 별도 신호가 필요하다.

# G) Qwen-AgentWorld에서 왜 쓰였나

[[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]의 RL stage는 일반 answer RL보다 prompt-output asymmetry가 크다.

```text
prompt: 수만 token의 interaction history
output: 다음 environment observation 하나
```

모델은 긴 history를 읽고, 방금 agent action 뒤에 나올 observation을 예측해야 한다. reward는 이 observation 전체의 format, factuality, consistency, realism, quality에 붙는다.

예를 들어 observation이 다음처럼 생겼다고 하자.

```json
{
  "screen": "checkout page",
  "status": "payment failed",
  "message": "card expired"
}
```

이때 reward가 보는 것은 `screen`이라는 token 하나가 따로 좋았는지가 아니다. JSON 형식이 맞는지, 현재 agent action 뒤에 나올 만한 상태인지, 앞선 interaction history와 모순되지 않는지, observation 전체가 실제 환경처럼 보이는지를 함께 본다. 즉 평가 단위가 token 하나가 아니라 observation 한 덩어리다.

그래서 이 구조에서는 token마다 ratio를 따로 흔드는 것보다, observation sequence 전체의 확률을 한 단위로 보고 업데이트하는 편이 자연스럽다. GSPO는 좋은 observation이면 그 sequence 전체의 likelihood를 올리고, 나쁜 observation이면 전체 likelihood를 낮춘다. 긴 context, long trajectory, MoE serving 비용까지 겹치기 때문에 Qwen-AgentWorld에서는 training stability와 infrastructure 단순화가 모두 중요하고, 그 점에서 GSPO가 잘 맞는다.

# H) 실무 체크리스트

GSPO를 실제 실험에 넣는다면 아래 항목을 같이 봐야 한다.

1. reward가 정말 response-level인가?
2. group size $G$가 reward normalization에 충분한가?
3. clipping range가 GRPO와 같은 scale이라고 착각하지 않았는가?
4. response length가 훈련 중 줄거나 늘어나는지 추적하는가?
5. positive/negative sample의 length 분포가 reward와 엉키지 않는가?
6. MoE 모델이라면 expert routing instability가 줄었는가?
7. sequence-level update가 필요한 만큼의 fine-grained credit assignment를 잃고 있지는 않은가?

# I) 면접에서 이렇게 말하면 된다

**Q1. GSPO를 GRPO와 비교해서 설명해주세요.**

> GSPO는 GRPO의 group-relative advantage는 유지하되, policy ratio와 clipping을 token 단위가 아니라 sequence 단위로 옮긴 방법입니다. GRPO는 response 전체 reward를 쓰면서 token-level importance ratio를 적용하는데, 이 mismatch가 long response나 MoE 모델에서 instability를 만들 수 있습니다. GSPO는 response likelihood ratio를 길이 정규화해서 사용하고, 답변 전체를 하나의 update 단위로 다룹니다.

**Q2. GSPO가 MoE training에서 유리한 이유는 무엇인가요?**

> MoE 모델은 update 전후로 같은 token이 다른 expert를 탈 수 있어서 token-level likelihood ratio가 흔들립니다. GRPO에서는 이 ratio가 update에 직접 들어가므로 routing replay 같은 안정화 장치가 필요할 수 있습니다. GSPO는 sequence likelihood를 기준으로 보기 때문에 token-level routing 변동에 덜 민감하고, Qwen Team은 이 덕분에 MoE RL training을 더 안정적으로 만들 수 있었다고 보고합니다.

**Q3. GSPO의 한계는 무엇인가요?**

> sequence 단위로 안정성을 얻는 대신, 답변 내부의 어느 token이나 reasoning step이 실제로 좋았는지 세밀하게 구분하기 어렵습니다. 또 후속 연구는 GSPO에 length bias가 생길 수 있다고 지적합니다. 그래서 GSPO를 쓸 때는 reward와 benchmark score뿐 아니라 response length, clipped token 비율, positive/negative sample의 길이 분포까지 함께 봐야 합니다.

# References

- Zheng et al., [Group Sequence Policy Optimization](https://arxiv.org/abs/2507.18071)
- Zheng et al., [Group Sequence Policy Optimization HTML](https://ar5iv.labs.arxiv.org/html/2507.18071v2)
- Liu et al., [Length-Unbiased Sequence Policy Optimization](https://arxiv.org/abs/2602.05261)
- [[GRPO]]
- [[DPO]]
- [[LLM Post-Training for Natural Korean]]
- [[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]
