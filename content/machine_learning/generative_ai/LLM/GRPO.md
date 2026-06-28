---
title: Group Relative Policy Optimization
tags:
  - reinforcement_learning
  - LLM
aliases:
  - GRPO
  - Group Relative Policy Optimization
---

# A) 한줄 요약

GRPO(Group Relative Policy Optimization)는 LLM의 추론 능력을 강화하기 위해 쓰는 policy optimization 방법이다.

핵심은 PPO처럼 별도의 value model을 두지 않고, 같은 prompt에서 나온 여러 답변을 서로 비교해 advantage를 만든다는 점이다. 한 prompt에 대해 답변을 여러 개 뽑고, 그중 group 평균보다 좋은 답변은 더 나오게 만들고, 평균보다 나쁜 답변은 덜 나오게 만든다.

수학, 코딩, tool use처럼 verifier가 답변 전체를 비교적 명확하게 채점할 수 있는 RLVR 환경에서 특히 잘 맞는다. 2026년 post-training 흐름에서는 GRPO 자체뿐 아니라 `DAPO`, [[GSPO]], `RLOO`, `REINFORCE++` 같은 변형도 함께 봐야 한다. 자연스러운 한국어 instruction tuning 관점의 위치는 [[LLM Post-Training for Natural Korean]]에 따로 정리해둔다.

# B) 왜 PPO 대신 GRPO를 쓰나

PPO는 policy model과 value model을 함께 쓴다.

```text
policy model: 다음 token이나 action을 고른다
value model: 지금 상태에서 보통 어느 정도 reward가 나올지 예측한다
```

value model이 있으면 advantage를 안정적으로 추정할 수 있다. 하지만 LLM post-training에서는 이 모델을 따로 학습하고 저장해야 하므로 메모리와 학습 비용이 커진다.

GRPO는 이 부분을 단순화한다. "이 답변이 절대적으로 몇 점짜리인가"를 value model로 예측하는 대신, 같은 prompt에서 나온 답변들끼리 상대평가한다.

예를 들어 한 수학 문제에 대해 모델이 답변 4개를 냈다고 하자.

| 답변 | Reward |
| --- | --- |
| A | 1 |
| B | 0 |
| C | 1 |
| D | 0 |

group 평균 reward는 `0.5`다. A와 C는 평균보다 좋으므로 positive advantage를 받고, B와 D는 평균보다 나쁘므로 negative advantage를 받는다. value model 없이도 "이 prompt에서 어떤 답변이 상대적으로 나았는가"를 만들 수 있다.

![](https://i.imgur.com/jiyj3x2.png)

# C) 동작 흐름

GRPO의 흐름은 네 단계로 보면 된다.

1. 하나의 prompt $x$에 대해 old policy에서 여러 답변을 샘플링한다.
2. 각 답변 $y_i$를 reward model이나 verifier로 채점한다.
3. 같은 group 안에서 평균보다 얼마나 좋은지 계산해 advantage를 만든다.
4. positive advantage를 받은 답변의 확률은 높이고, negative advantage를 받은 답변의 확률은 낮춘다.

하나의 prompt $x$에 대해 $G$개의 답변을 샘플링하면 다음처럼 쓸 수 있다.

$$
y_1, y_2, \ldots, y_G \sim \pi_{\theta_{\mathrm{old}}}(\cdot \mid x)
$$

각 답변은 reward를 받는다.

$$
R_i = R(x, y_i)
$$

그다음 group 안에서 상대 advantage를 계산한다.

$$
\widehat{A}_i =
\frac{
  R_i - \mathrm{mean}(\{R_j\}_{j=1}^{G})
}{
  \mathrm{std}(\{R_j\}_{j=1}^{G})
}
$$

직관적으로는 "같은 문제를 푼 다른 답변들과 비교했을 때, 이 답변이 얼마나 더 나았는가"를 보는 값이다. 표준편차로 나누는 부분을 생략해 단순히 $R_i - \mathrm{mean}(R)$로 설명하기도 하지만, 실제 구현에서는 group 안의 reward scale을 맞추기 위해 normalize하는 형태가 자주 쓰인다.

# D) Policy Update에서 실제로 바뀌는 것

GRPO는 response-level advantage를 만든 뒤, policy update에서는 token-level importance ratio를 자주 쓴다.

답변 $y_i$의 $t$번째 token에 대해 ratio는 다음과 같다.

$$
r_{i,t}(\theta)
=
\frac{
  \pi_\theta(y_{i,t} \mid x, y_{i,<t})
}{
  \pi_{\theta_{\mathrm{old}}}(y_{i,t} \mid x, y_{i,<t})
}
$$

notation은 이렇게 읽으면 된다.

| 기호 | 뜻 |
| --- | --- |
| $x$ | prompt |
| $y_i$ | $i$번째 response |
| $y_{i,t}$ | $i$번째 response의 $t$번째 token |
| $y_{i,<t}$ | $t$번째 token 앞에 이미 생성된 prefix |
| $\pi_\theta$ | 지금 업데이트하려는 current policy |
| $\pi_{\theta_{\mathrm{old}}}$ | rollout을 만들 때 쓴 old policy |
| $r_{i,t}(\theta)$ | old policy 대비 current policy가 같은 token을 얼마나 더, 또는 덜 내려고 하는지 |

예를 들어 old policy가 어떤 자리에서 `4` token을 낼 확률을 `0.20`으로 봤고, current policy가 `0.30`으로 본다면 ratio는 `1.5`다. 현재 모델이 그 token을 이전보다 더 밀고 있다는 뜻이다. 반대로 current policy 확률이 `0.10`이면 ratio는 `0.5`다.

이 ratio는 advantage와 곱해져 update의 방향과 크기를 정한다.

```text
advantage > 0  -> 해당 답변의 token 확률을 올리는 방향
advantage < 0  -> 해당 답변의 token 확률을 내리는 방향
```

여기서 중요한 점이 있다. GRPO가 token마다 ratio를 계산한다고 해서 token마다 reward를 따로 주는 것은 아니다. reward와 advantage는 보통 답변 전체에 붙는다. 같은 답변 안의 token들은 같은 response-level advantage를 공유한다.

따라서 GRPO의 token-level ratio는 token-level update 장치이지, token-level credit assignment는 아니다. 각 token의 gradient와 clipping 여부는 달라질 수 있지만, "이 reasoning step은 좋고 저 reasoning step은 나쁘다"를 reward가 직접 구분해주는 구조는 아니다. 그런 세밀한 구분이 필요하면 process reward, step-level verifier, token-wise advantage 같은 별도 신호가 필요하다.

# E) PPO와 GRPO의 차이

| 항목 | PPO | GRPO |
| --- | --- | --- |
| Advantage 기준 | value model이 예측한 값 | 같은 prompt에서 나온 답변 group의 평균 |
| 필요한 모델 | policy model + value model | policy model 중심 |
| 메모리 비용 | value model 때문에 큼 | 상대적으로 작음 |
| 잘 맞는 reward | token/action 단위 reward나 value 추정이 필요한 경우 | 답변 전체를 verifier로 채점할 수 있는 경우 |
| 대표 상황 | 일반 RL, RLHF | 수학, 코딩, RLVR |

PPO는 "이 상태에서 보통 어느 정도 reward가 나와야 하는가"를 value model로 추정한다. GRPO는 "같은 prompt에서 나온 답변들 중 이 답변이 평균보다 나은가"를 본다.

그래서 GRPO는 value model 비용을 줄이면서도, 정답/오답이 비교적 명확한 reasoning task에서 policy를 강화할 수 있다.

# F) GSPO와 이어지는 지점

GRPO의 장점은 단순함이다. value model을 없애고 group-relative advantage만으로 학습할 수 있다.

하지만 구조적인 불일치가 하나 남는다.

```text
reward / advantage: response level
importance ratio / clipping: token level
```

즉 답변 전체에 대한 reward를 받은 뒤, 실제 update에서는 token마다 ratio와 clipping을 따로 적용한다. 긴 reasoning 답변에서는 token-level ratio가 많이 쌓이고, token마다 clipping 여부도 달라질 수 있다.

[[GSPO]]는 이 지점을 바꾼다. reward가 response 단위라면 policy ratio와 clipping도 response sequence 단위로 맞추자는 접근이다.

# G) 장점과 주의점

GRPO의 장점은 명확하다.

1. value model이 필요 없어 메모리와 학습 비용을 줄일 수 있다.
2. 같은 prompt 안의 답변들을 비교하므로 reward scale 변화에 비교적 강하다.
3. 수학, 코딩처럼 verifier가 명확한 task에서 적용하기 쉽다.
4. PPO보다 LLM RLVR 파이프라인을 단순하게 만들 수 있다.

다만 한계도 같이 봐야 한다.

1. reward가 답변 전체에 붙기 때문에 reasoning step별 credit assignment는 약하다.
2. group size가 너무 작으면 평균과 표준편차가 불안정해진다.
3. reward model이나 verifier가 틀리면 group-relative advantage도 같이 흔들린다.
4. token-level ratio와 response-level reward 사이의 mismatch가 긴 답변이나 MoE training에서 문제가 될 수 있다.

# H) 면접에서 이렇게 말하면 된다

**Q1. GRPO를 한 문장으로 설명해주세요.**

> GRPO는 value model 없이, 같은 prompt에서 나온 여러 답변의 group 평균 reward를 기준으로 advantage를 만들고 policy를 업데이트하는 LLM RL 알고리즘입니다.

**Q2. PPO와 가장 큰 차이는 무엇인가요?**

> PPO는 value model로 advantage를 추정하지만, GRPO는 같은 prompt에서 샘플링한 답변들의 평균 reward를 baseline으로 씁니다. 그래서 value model 비용을 줄일 수 있습니다.

**Q3. GRPO가 token-level reward를 주는 방법인가요?**

> 아닙니다. GRPO는 보통 답변 전체 reward로 response-level advantage를 만들고, update할 때 token-level policy ratio를 씁니다. token마다 ratio는 다르지만 reward 자체가 token마다 따로 붙는 것은 아닙니다.

**Q4. GSPO는 왜 나왔나요?**

> GRPO는 reward와 advantage는 response 단위로 만들면서, ratio와 clipping은 token 단위로 적용합니다. GSPO는 이 mismatch를 줄이기 위해 ratio와 clipping도 sequence 단위로 맞춘 방법입니다.

# References

- [[GSPO]]
- [[LLM Post-Training for Natural Korean]]
