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

[[GRPO]]는 value model 없이 group reward로 advantage를 만들지만, importance ratio는 token마다 계산한다. GSPO는 이 부분을 바꾼다. reward가 답변 전체에 붙는다면, off-policy correction과 clipping도 답변 전체 단위로 하는 편이 더 자연스럽다는 문제의식이다.

한 줄로 줄이면 이렇게 볼 수 있다.

> GRPO가 "좋은 답변의 각 token을 어떻게 밀 것인가"를 본다면, GSPO는 "좋은 답변 sequence 전체가 이전 policy 대비 얼마나 달라졌는가"를 본다.

GSPO 논문은 GSPO가 [[GRPO]]보다 training stability, efficiency, performance에서 낫고, 특히 [[MoE]] 모델의 RL training을 안정화한다고 보고한다. [[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]의 RL stage에서도 `GSPO`가 사용된다.

# B) 왜 GSPO가 나왔나

LLM RLVR에서는 보통 답변 전체에 reward가 붙는다.

```text
prompt x
-> response y
-> verifier/reward r(x, y)
```

예를 들어 수학 문제라면 최종 답이 맞았는지, coding task라면 test를 통과했는지가 reward가 된다. reward는 token 하나하나보다 response 전체를 평가한다.

그런데 GRPO는 group reward로 response-level advantage를 만든 뒤, policy update에서는 token-level importance ratio를 쓴다.

```text
response-level reward
token-level importance ratio
```

이 불일치가 GSPO 논문의 출발점이다. token-level ratio는 각 token position에서 old policy와 current policy의 확률 차이를 본다. 긴 답변에서는 이 작은 차이가 많이 쌓이고, clipping까지 거치면서 gradient noise가 커질 수 있다.

MoE 모델에서는 문제가 더 심해진다. 같은 token이라도 gradient update 전후로 활성화되는 expert가 달라질 수 있다. 그러면 token-level likelihood ratio가 더 흔들린다. GSPO 논문은 이 현상이 GRPO 기반 MoE RL training의 불안정성과 collapse로 이어질 수 있다고 본다.

# C) 핵심 아이디어

GSPO의 핵심은 단순하다.

> reward가 sequence 단위라면, importance ratio와 clipping도 sequence 단위로 맞춘다.

하나의 query $x$에 대해 old policy에서 $G$개의 답변을 샘플링한다.

```text
y_1, y_2, ..., y_G ~ pi_old(. | x)
```

각 답변은 verifier로 reward를 받는다.

```text
r(x, y_i)
```

그다음 group 안에서 상대 advantage를 계산한다.

$$
\widehat{A}_i =
\frac{
  r(x, y_i) - \mathrm{mean}(\{r(x, y_i)\}_{i=1}^{G})
}{
  \mathrm{std}(\{r(x, y_i)\}_{i=1}^{G})
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

GSPO는 response 전체의 likelihood ratio를 쓴다. 다만 response 길이가 다르면 값의 scale이 크게 흔들리므로, 길이로 정규화한 geometric mean 형태를 사용한다.

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

직관적으로는 "답변 전체가 old policy 대비 평균적으로 얼마나 더 그럴듯해졌는가"를 보는 값이다.

# D) GSPO Objective

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

수식은 PPO/GRPO와 비슷해 보이지만, clipping 대상이 다르다.

| 방법 | ratio 단위 | reward/advantage 단위 | 핵심 차이 |
| --- | --- | --- | --- |
| PPO | token/action | token/action 또는 value 기반 | value model이 필요함 |
| [[GRPO]] | token | response group | value model은 없지만 token-level ratio를 씀 |
| GSPO | response sequence | response group | reward와 optimization 단위를 sequence로 맞춤 |

GSPO는 좋은 advantage를 받은 답변의 sequence likelihood를 높이고, 낮은 advantage를 받은 답변의 sequence likelihood를 낮춘다. 이때 특정 token 하나가 아니라 답변 전체의 평균 log ratio를 보고 clip한다.

# E) GRPO와 무엇이 달라지나

## E.1) Token마다 다른 가중치를 없앤다

GRPO에서는 같은 답변 안의 token이라도 token-level ratio가 다르다. 그래서 같은 response-level advantage를 공유하더라도, 실제 gradient에서는 token마다 다른 weight가 걸린다.

GSPO는 한 답변 안의 token들이 같은 sequence-level weight를 받는다. 좋은 답변이면 답변 전체를 밀고, 나쁜 답변이면 답변 전체를 덜어낸다. reward가 전체 답변에 붙는 RLVR task에서는 이쪽이 더 직접적이다.

## E.2) 긴 답변에서 noise 누적을 줄인다

긴 reasoning 답변에서는 token이 많다. token-level ratio가 조금씩 흔들려도 누적되면 update가 불안정해진다.

GSPO는 response-level ratio 하나로 clipping을 하므로, token-level fluctuation이 gradient에 직접 쌓이는 경로를 줄인다. 논문은 이 차이가 long response RL에서 stability를 높인다고 본다.

## E.3) MoE training에서 routing replay 의존을 줄인다

MoE 모델은 token마다 활성화 expert가 달라질 수 있다. GRPO에서 token-level likelihood ratio를 안정적으로 계산하려면, old policy에서 어떤 expert가 활성화됐는지 replay하는 식의 workaround가 필요할 수 있다.

GSPO는 sequence likelihood를 기준으로 보기 때문에 token-level expert routing 변화에 덜 민감하다. Qwen Team은 이 덕분에 MoE RL training에서 Routing Replay 같은 복잡한 안정화 장치를 줄일 수 있었다고 설명한다.

# F) 언제 GSPO를 볼 만한가

GSPO는 다음 상황에서 특히 볼 만하다.

1. `RLVR`처럼 response 전체에 reward가 붙는 task
2. 수학, 코딩, tool use처럼 verifier가 비교적 명확한 task
3. 긴 reasoning response를 많이 생성하는 RL
4. Qwen 계열처럼 [[MoE]] 구조를 쓰는 대형 모델의 post-training
5. rollout과 training engine이 분리된 대규모 RL infrastructure

반대로 token-level credit assignment가 중요한 task라면 GSPO만으로 충분하지 않을 수 있다. 논문도 `GSPO-token` 변형을 언급한다. 이 변형은 전체 sequence-level ratio의 안정성은 유지하면서 token-wise advantage를 조정할 수 있게 만든다.

# G) 한계와 후속 흐름

GSPO는 GRPO의 token-level ratio 문제를 줄이지만, 모든 문제를 끝내지는 않는다.

가장 먼저 볼 한계는 length bias다. 후속 연구인 LUSPO는 GSPO objective가 response length에 대해 bias를 만들 수 있고, 특히 sequence-level clipping이 response length collapse를 유발할 수 있다고 지적한다. 그래서 GSPO를 쓸 때는 reward curve만 보지 말고 response length, correct/incorrect sample의 길이 분포, clipped token 비율도 함께 봐야 한다.

또 다른 한계는 credit assignment다. sequence 전체에 같은 weight를 주면 안정성은 좋아지지만, 답변 안에서 어느 reasoning step이 좋았고 나빴는지를 세밀하게 구분하기 어렵다. ESPO, DHPO 같은 후속 연구가 token-level과 sequence-level 사이의 trade-off를 다시 조정하려는 이유도 여기에 있다.

# H) Qwen-AgentWorld에서 왜 쓰였나

[[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]의 RL stage는 일반 answer RL보다 prompt-output asymmetry가 크다.

```text
prompt: 수만 token의 interaction history
output: 다음 environment observation 하나
```

모델은 긴 history를 읽고, 방금 agent action 뒤에 나올 observation을 예측해야 한다. reward는 이 observation 전체의 format, factuality, consistency, realism, quality에 붙는다.

이런 구조에서는 token 하나하나의 ratio보다, 생성된 observation sequence 전체가 old policy 대비 얼마나 안정적으로 움직였는지가 더 중요하다. 그래서 Qwen-AgentWorld가 GSPO를 채택한 것은 자연스럽다. 긴 context, long trajectory, MoE serving 비용까지 겹치기 때문에, training stability와 infrastructure 단순화가 모두 중요하기 때문이다.

# I) 실무 체크리스트

GSPO를 실제 실험에 넣는다면 아래 항목을 같이 봐야 한다.

1. reward가 정말 response-level인가?
2. group size $G$가 reward normalization에 충분한가?
3. clipping range가 GRPO와 같은 scale이라고 착각하지 않았는가?
4. response length가 훈련 중 줄거나 늘어나는지 추적하는가?
5. positive/negative sample의 length 분포가 reward와 엉키지 않는가?
6. MoE 모델이라면 expert routing instability가 줄었는가?
7. sequence-level update가 필요한 만큼의 fine-grained credit assignment를 잃고 있지는 않은가?

# J) 면접에서 이렇게 말하면 된다

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
