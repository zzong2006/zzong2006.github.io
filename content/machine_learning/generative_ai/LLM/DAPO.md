---
title: Decoupled Clip and Dynamic sAmpling Policy Optimization
tags:
  - LLM
  - reinforcement_learning
  - post_training
  - RLVR
  - policy_optimization
  - ByteDance
aliases:
  - DAPO
  - Decoupled Clip and Dynamic sAmpling Policy Optimization
---

# A) 한줄 요약

DAPO(Decoupled Clip and Dynamic sAmpling Policy Optimization)는 [[GRPO]]를 그대로 돌렸을 때 실제로 터지는 문제 네 가지를 각각 고친 RL 레시피다.

[[GSPO]]가 ratio와 clipping의 **단위**를 바꾼 것과 달리, DAPO는 단위는 token 그대로 두고 학습을 망가뜨리는 지점들을 하나씩 손본다. 새 이론이라기보다 대규모 RL을 실제로 돌려본 뒤 정리한 공학적 처방에 가깝다.

ByteDance Seed 팀이 Qwen2.5-32B를 base로 AIME 2024에서 50점을 냈다. 비교 대상인 DeepSeek-R1-Zero-Qwen-32B가 47점인데, DAPO는 그 절반의 training step으로 도달했다. 논문의 목적 자체가 재현성이라, 학습 코드를 `verl` 위에 공개하고 데이터셋(DAPO-Math-17K)도 함께 열었다.

# B) naive GRPO를 그대로 돌리면 무엇이 터지나

논문은 Qwen2.5-32B에 GRPO를 그대로 적용했을 때 AIME 2024에서 30점에 머물렀다고 보고한다. 목표인 50점과의 격차가 20점이고, 그 격차를 만든 원인이 네 가지다.

1. **entropy collapse** — 학습이 진행되면서 policy가 급격히 결정론적으로 변한다. 같은 답만 뽑으니 exploration이 죽는다.
2. **gradient가 0인 prompt** — group 전체가 다 맞거나 다 틀리면 advantage가 0이 되어 그 prompt는 학습에 기여하지 못한다.
3. **긴 답변의 token이 과소평가된다** — GRPO의 loss 평균 방식 때문에 긴 reasoning 답변일수록 token 하나의 영향력이 작아진다.
4. **잘린 답변이 reward를 오염시킨다** — max length에 걸려 truncate된 답변은 내용과 무관하게 오답 처리된다.

다음 절의 네 기법이 이 넷에 하나씩 대응한다.

# C) 네 가지 기법

## C.1) Clip-Higher: clipping 상한과 하한을 분리한다

PPO/GRPO의 clipping은 위아래로 같은 $\varepsilon$을 쓴다. 허용 구간이 $[1-\varepsilon, 1+\varepsilon]$이다. 문제는 이 상한이 **곱셈**으로 걸린다는 점이다.

ratio가 $1+\varepsilon$을 넘지 못한다는 것은, 어떤 token의 확률이 old policy 대비 최대 $1+\varepsilon$배까지만 오를 수 있다는 뜻이다. 그런데 같은 배수 제한이 확률 크기에 따라 전혀 다르게 작동한다.

| token의 old 확률 | $\varepsilon = 0.2$ 일 때 상한 | 실제 의미 |
| --- | --- | --- |
| 0.01 (exploration token) | 0.012 | 올릴 수 있는 폭이 0.002뿐이다 |
| 0.9 (exploitation token) | 1.08 | 확률은 1을 넘을 수 없으니 제한이 사실상 없다 |

이미 확률이 높은 token은 clipping이 막지 않고, 확률이 낮은 token만 강하게 눌린다. 그래서 학습이 진행될수록 원래 높던 token만 더 높아지고 policy의 entropy가 빠르게 줄어든다. 이것이 entropy collapse다.

DAPO는 상한과 하한을 떼어낸다.

$$
\mathrm{clip}\left(r_{i,t}(\theta),\; 1-\varepsilon_{\mathrm{low}},\; 1+\varepsilon_{\mathrm{high}}\right)
$$

논문은 $\varepsilon_{\mathrm{low}} = 0.2$, $\varepsilon_{\mathrm{high}} = 0.28$을 쓴다. 하한은 그대로 두어 안정성을 지키고, 상한만 넓혀 확률이 낮은 token에 올라갈 여지를 준다. 위 표의 0.01 token이라면 상한이 0.012에서 0.0128로, 올릴 수 있는 폭이 0.002에서 0.0028로 40% 늘어난다.

이름의 "Decoupled Clip"이 이것이다.

## C.2) Dynamic Sampling: 학습에 기여하지 못하는 prompt를 버린다

DAPO의 reward는 rule-based binary다. 정답이면 $+1$, 아니면 $-1$. advantage는 group 안에서 정규화한다.

$$
\widehat{A}_{i,t}
=
\frac{
  R_i - \mathrm{mean}(\{R_i\}_{i=1}^{G})
}{
  \mathrm{std}(\{R_i\}_{i=1}^{G})
}
$$

여기서 한 prompt에 대해 뽑은 $G$개 답변이 **전부 정답**이면 모든 $R_i$가 같으므로 분자가 0이고 표준편차도 0이다. 전부 오답이어도 마찬가지다. 그 prompt는 gradient를 하나도 만들지 못한다.

문제는 이것이 학습이 잘 될수록 심해진다는 점이다. 모델이 좋아지면 쉬운 prompt는 점점 다 맞게 되고, 그만큼 batch 안에서 실제로 일하는 prompt 수가 줄어든다. batch size는 그대로인데 유효 표본만 줄어드니 gradient의 분산이 커진다.

DAPO는 필요한 양보다 넉넉히 뽑아둔 뒤, 정답 개수가 0도 $G$도 아닌 prompt만 남긴다.

$$
0 <
\left\lvert
\{\, o_i \mid \mathrm{is\_equivalent}(a, o_i) \,\}
\right\rvert
< G
$$

batch가 찰 때까지 샘플링을 반복하므로 rollout 비용은 늘어난다. 대신 batch 안의 모든 prompt가 gradient를 만든다. ablation에서 가장 큰 점수 상승을 만든 것이 이 기법이다.

## C.3) Token-Level Policy Gradient Loss: 긴 답변의 token을 제값으로 센다

GRPO는 loss를 두 번 평균한다. 답변 안에서 token으로 한 번, 그다음 답변끼리 한 번이다.

$$
\frac{1}{G}
\sum_{i=1}^{G}
\frac{1}{\lvert o_i \rvert}
\sum_{t=1}^{\lvert o_i \rvert}
(\cdots)
$$

안쪽의 $1/\lvert o_i \rvert$ 때문에 답변 하나의 총 기여가 길이와 무관하게 같아진다. 100 token 답변과 5000 token 답변이 똑같은 무게를 갖는다는 뜻이고, 뒤집으면 긴 답변의 token 하나는 짧은 답변의 token 하나보다 50배 작은 영향력을 갖는다.

long CoT 학습에서 이것이 불리하다. 정작 봐야 할 긴 추론 과정이 학습 신호에서 희석되고, 긴 답변에서 나타나는 반복이나 횡설수설도 제대로 억제되지 않는다.

DAPO는 group 전체의 token 수로 한 번만 나눈다.

$$
\frac{1}{\sum_{i=1}^{G} \lvert o_i \rvert}
\sum_{i=1}^{G}
\sum_{t=1}^{\lvert o_i \rvert}
(\cdots)
$$

이제 어느 답변에 속했든 token 하나의 무게가 같다. 답변이 길수록 그 답변의 총 기여가 커진다.

이 지점은 [[GSPO]]와 정반대 방향이라는 점에서 재미있다. GSPO는 답변 하나를 하나의 단위로 묶어 token 개수를 아예 보지 않는 쪽으로 갔고, DAPO는 token을 균등하게 세는 쪽으로 갔다. 그리고 GSPO의 후속인 LUSPO가 다시 loss에 $\lvert y_i \rvert$를 곱해 긴 답변의 기여를 되살리는데, 도달하는 곳은 DAPO의 token-level 평균과 같다.

## C.4) Overlong Reward Shaping: 잘린 답변의 reward를 손본다

max length에 걸려 중간에 끊긴 답변은 정답 문자열을 완성하지 못했으니 오답으로 채점된다. 하지만 그 답변의 추론이 실제로 틀렸는지는 알 수 없다. 길이 제한에 걸렸을 뿐이다. 이런 답변에 $-1$을 주면 reward에 noise가 섞인다.

논문은 두 가지를 쓴다.

1. **Overlong Filtering** — truncate된 sample의 loss를 아예 마스킹한다. 판단할 수 없는 것은 학습에 쓰지 않는다.
2. **Soft Overlong Punishment** — 길이에 따라 벌점을 부드럽게 준다. $L_{\max} = 16384$, $L_{\mathrm{cache}} = 4096$으로 두고, 답변 길이가 $L_{\max} - L_{\mathrm{cache}} = 12288$을 넘어가면 벌점이 0에서 시작해 $L_{\max}$에서 $-1$까지 선형으로 커진다.

둘째 방식은 "길어지는 것 자체가 조금씩 손해" 라는 신호를 주되, 12288 token 아래에서는 아무 벌점도 주지 않는다. 길이를 억지로 줄이지 않으면서 무한정 늘어나는 것만 막는 설계다.

# D) Objective

네 기법을 합치면 다음이 된다.

$$
\mathcal{J}_{\mathrm{DAPO}}(\theta)
=
\mathbb{E}
\left[
\frac{1}{\sum_{i=1}^{G} \lvert o_i \rvert}
\sum_{i=1}^{G}
\sum_{t=1}^{\lvert o_i \rvert}
\min\left(
  r_{i,t}(\theta)\widehat{A}_{i,t},
  \;
  \mathrm{clip}\left(r_{i,t}(\theta),\, 1-\varepsilon_{\mathrm{low}},\, 1+\varepsilon_{\mathrm{high}}\right)\widehat{A}_{i,t}
\right)
\right]
$$

$$
\text{s.t.}\quad
0 <
\left\lvert
\{\, o_i \mid \mathrm{is\_equivalent}(a, o_i) \,\}
\right\rvert
< G
$$

기호는 다음처럼 읽으면 된다.

| 기호 | 뜻 |
| --- | --- |
| $q$ | 문제(prompt) |
| $a$ | ground truth 정답 |
| $G$ | 한 prompt에 대해 뽑는 답변 개수 |
| $o_i$ | $i$번째 답변 |
| $\lvert o_i \rvert$ | $i$번째 답변의 token 수 |
| $r_{i,t}(\theta)$ | token 단위 importance ratio |
| $\widehat{A}_{i,t}$ | group 상대 advantage |
| $\varepsilon_{\mathrm{low}}$, $\varepsilon_{\mathrm{high}}$ | 분리된 clipping 하한과 상한 |
| $L_{\max}$, $L_{\mathrm{cache}}$ | 최대 길이와 벌점이 시작되는 여유 구간 |

## D.1) KL penalty를 뺐다

PPO 계열은 보통 current policy가 초기 모델에서 너무 멀어지지 않도록 KL divergence 항을 넣는다. DAPO는 이 항을 없앤다.

이유는 long CoT reasoning 학습의 성격에 있다. 이 학습의 목적 자체가 모델을 초기 상태에서 크게 벗어나게 만드는 것이다. 논문의 표현으로는, 모델 분포가 초기 모델에서 상당히 멀어지므로 그 제약이 필요하지 않다. RLHF에서 KL 항이 하던 "너무 이상해지지 않게 붙잡는" 역할이 여기서는 오히려 방해가 된다.

부수적으로 reference model의 log probability를 계산할 필요가 없어져 학습 비용도 준다.

# E) 결과와 ablation

Qwen2.5-32B base, AIME 2024 기준이다.

| 방법 | AIME 2024 | 직전 대비 |
| --- | --- | --- |
| naive GRPO | 30 | |
| + Overlong Filtering | 36 | +6 |
| + Clip-Higher | 38 | +2 |
| + Soft Overlong Punishment | 41 | +3 |
| + Token-level Loss | 42 | +1 |
| + Dynamic Sampling | 50 | +8 |

이 표는 기법을 하나씩 **누적**해서 얹은 결과다. 따라서 각 행의 증가폭은 그 기법 단독의 값이 아니라 "앞의 것들이 이미 적용된 상태에서 추가로 얻은 값"이다. 순서를 바꾸면 배분도 달라진다.

그래도 읽어낼 것이 있다. 30점에서 50점까지의 상승 중 Dynamic Sampling(+8)과 Overlong Filtering(+6)이 절반 이상을 차지한다. 둘 다 목적함수를 바꾼 것이 아니라 **학습에 쓰는 데이터를 손본** 기법이다. 반면 objective 자체를 건드린 Token-level Loss는 +1에 그쳤다.

최종 50점은 비교 대상인 DeepSeek-R1-Zero-Qwen-32B의 47점을 넘어서면서, 그 절반의 training step만 썼다.

학습 데이터는 DAPO-Math-17K로, 17,000개 prompt 각각에 정수 정답이 붙어 있다. 원래 문제의 답이 $(a+\sqrt{b})/c$ 같은 형태면 $a+b+c$ 를 답으로 삼는 식으로 바꿔서, 문자열 비교만으로 채점할 수 있게 만들었다. 학습된 reward model을 쓰지 않으니 reward hacking 여지가 줄어든다.

# F) GRPO, GSPO와의 관계

셋 다 value model 없이 group 상대 advantage를 쓰는 같은 계열이다. 갈라지는 지점은 무엇을 고쳤는가다.

| 방법 | 무엇을 바꿨나 | ratio 단위 |
| --- | --- | --- |
| [[GRPO]] | value model을 group 상대 reward로 대체 | token |
| DAPO | 학습을 망가뜨리는 네 지점을 각각 처방 | token |
| [[GSPO]] | ratio와 clipping을 답변 단위로 올림 | response sequence |

DAPO와 GSPO는 경쟁 관계라기보다 다른 층위를 건드린다. GSPO가 지적한 것은 "채점 단위와 업데이트 단위가 어긋난다" 는 구조 문제이고, DAPO가 지적한 것은 "그 구조를 유지한 채로도 고쳐야 할 것이 많다" 는 운영 문제다.

실제로 둘을 함께 쓰기도 한다. [[GSPO]] 노트에서 다루는 length bias 논의가 그 예다. sequence-level clipping에 DAPO의 Clip-Higher를 얹으면 positive/negative sample의 token 기여가 불균형해질 수 있다는 지적이 후속 연구에서 나온다.

# G) 실무 체크리스트

1. reward가 rule-based로 검증 가능한가? DAPO의 설계는 binary verifier를 전제한다.
2. $\varepsilon_{\mathrm{low}}$와 $\varepsilon_{\mathrm{high}}$를 분리해 뒀는가? 한 값으로 두면 Clip-Higher가 적용되지 않는다.
3. policy entropy를 로깅하는가? entropy collapse는 점수가 떨어지기 전에 entropy에서 먼저 보인다.
4. batch 안에서 advantage가 0인 prompt 비율을 재고 있는가? 이 값이 커지면 Dynamic Sampling이 필요한 시점이다.
5. Dynamic Sampling의 rollout 비용 증가를 감당할 수 있는가? batch를 채울 때까지 다시 뽑아야 한다.
6. loss를 sample 단위로 평균하고 있지는 않은가? token 단위 평균으로 바꿔야 긴 답변이 제값을 받는다.
7. truncate된 답변을 오답으로 세고 있지는 않은가?
8. $L_{\max}$와 $L_{\mathrm{cache}}$가 실제 답변 길이 분포에 맞는가?
9. KL 항을 뺐다면, 모델이 초기 분포에서 멀어지는 것을 다른 지표로 감시하는가?

# H) 면접에서 이렇게 말하면 된다

**Q1. DAPO가 GRPO에서 무엇을 바꿨나요?**

> 목적함수의 구조는 GRPO 계열 그대로 두고, 대규모로 돌렸을 때 실제로 터지는 네 지점을 고쳤습니다. clipping 상한과 하한을 분리해 entropy collapse를 막고, group이 전부 정답이거나 전부 오답이라 gradient가 0인 prompt를 걸러내고, loss 평균을 sample 단위에서 token 단위로 바꿔 긴 답변이 제값을 받게 하고, 길이 제한에 걸려 잘린 답변의 reward를 따로 처리했습니다. 여기에 KL penalty를 제거했습니다.

**Q2. Clip-Higher가 왜 필요한가요?**

> clipping 상한이 곱셈으로 걸리기 때문입니다. ratio 상한이 1.2라면 확률 0.01짜리 token은 0.012까지밖에 못 오르는데, 확률 0.9짜리 token은 상한이 1.08이라 사실상 제한이 없습니다. 확률이 낮은 exploration token만 억눌리니 학습이 갈수록 결정론적으로 변합니다. 그래서 하한은 0.2로 두고 상한만 0.28로 넓혀 낮은 확률 token에 여지를 줍니다.

**Q3. Dynamic Sampling이 ablation에서 가장 큰 폭을 만든 이유는 무엇인가요?**

> binary reward에 group 정규화를 쓰면, group이 전부 정답이거나 전부 오답인 prompt는 advantage가 0이라 gradient를 만들지 못합니다. 그리고 모델이 좋아질수록 쉬운 문제는 다 맞게 되므로 이런 prompt 비율이 계속 늘어납니다. batch size는 그대로인데 실제로 일하는 표본만 줄어드는 셈이라 gradient 분산이 커집니다. Dynamic Sampling은 넉넉히 뽑은 뒤 정답 개수가 0도 G도 아닌 prompt만 남겨 batch를 채웁니다. rollout 비용은 늘지만 batch 전체가 학습에 기여합니다.

**Q4. DAPO와 GSPO 중 무엇을 쓰겠습니까?**

> 층위가 달라서 배타적인 선택은 아닙니다. GSPO는 reward가 답변 단위인데 ratio와 clipping은 token 단위라는 구조적 불일치를 고친 것이고, DAPO는 그 구조를 유지한 채 entropy collapse나 무효 prompt 같은 운영 문제를 고친 것입니다. MoE 모델이거나 답변이 아주 길어 token-level ratio가 불안정하다면 GSPO 쪽 문제가 먼저 나타나고, 그렇지 않다면 DAPO의 처방들이 더 직접적인 효과를 냅니다. 실제로 두 계열을 섞어 쓰는 연구도 나와 있습니다.

# References

- Yu et al., [DAPO: An Open-Source LLM Reinforcement Learning System at Scale](https://arxiv.org/abs/2503.14476)
- Yu et al., [DAPO HTML](https://ar5iv.labs.arxiv.org/html/2503.14476)
- [[GRPO]]
- [[GSPO]]
- [[Proximal Policy Optimization]]
- [[LLM Post-Training for Natural Korean]]
