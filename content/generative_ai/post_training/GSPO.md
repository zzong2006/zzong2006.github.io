---
title: "Group Sequence Policy Optimization (GSPO)"
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

수학 문제 하나에 모델이 답변 여러 개를 냈고, 그중 정답인 답변을 더 자주 내도록 모델을 고치려 한다. 채점은 답변 하나에 점수 하나로 매겨진다. **그런데 모델을 얼마나 고칠지는 토큰마다 따로 재도 될까?**

**GSPO(Group Sequence Policy Optimization)는 모델을 얼마나 고칠지 재는 단위를 토큰에서 답변 전체로 바꾼 RL 알고리즘이다.** Qwen 팀이 2025 년에 발표했고 Qwen3 의 RL 학습에 썼다 ([Zheng et al., 2025](https://arxiv.org/abs/2507.18071)).

- **GRPO 의 문제**: [[GRPO]] 는 importance ratio 를 토큰마다 따로 계산하고 clipping 도 토큰마다 따로 한다.
  - 토큰 하나짜리 표본으로 만든 ratio 라 분산이 크다.
  - 이 노이즈가 응답이 길수록 쌓이고, MoE 모델에서는 학습이 무너지기도 한다.
- **GSPO 의 해법**: 응답 전체의 likelihood ratio 를 쓴다.
  - 응답 길이로 정규화해 토큰별 ratio 의 기하평균을 만든다.
  - clipping 도 응답 단위로 한 번만 판정한다.
- **결과**: 논문 실험에서 GRPO 보다 학습 효율과 성능이 높았다.
  - MoE 모델을 Routing Replay 같은 별도 장치 없이 안정적으로 학습했다.

**GSPO 는 advantage 계산을 바꾼 것이 아니다.** advantage 는 GRPO 와 똑같이 같은 질문에 대한 답변끼리의 상대 점수다. 바뀐 것은 ratio 와 clipping 의 단위뿐이다.

| 항목 | GRPO | GSPO |
| --- | --- | --- |
| ratio 단위 | 토큰마다 하나 | 응답마다 하나 |
| clipping 단위 | 토큰마다 따로 판정 | 응답 전체를 한 번에 판정 |
| advantage | 그룹 안 상대 점수 (응답마다 하나) | 같음 |
| 길이 정규화 | 토큰별 loss 를 응답 길이로 평균 | ratio 자체를 응답 길이로 정규화 (기하평균) |
| clipping 범위 (논문 실험) | 하한 0.2 · 상한 0.27 | 하한 0.0003 · 상한 0.0004 |
| 안정성 | 긴 응답·MoE 에서 불안정, MoE 는 Routing Replay 필요 | Routing Replay 없이 안정 |

# A) Step by Step 예시: 토큰 3 개짜리 응답

## A.1) 토큰별 ratio

모델이 토큰 3 개짜리 답변을 냈고 정답이었다고 하자. 그룹 안 다른 답변보다 잘해서 advantage 가 +1 이다.

ratio 는 **지금 모델이 그 토큰을 낼 확률을, 답변을 만들 때 쓴 이전 모델의 확률로 나눈 값**이다. 1 보다 크면 지금 모델이 그 토큰을 더 밀고 있고, 1 보다 작으면 덜 밀고 있다.

| 토큰 | 이전 모델 확률 | 지금 모델 확률 | ratio |
| --- | --- | --- | --- |
| 1 | 0.20 | 0.30 | 1.5 |
| 2 | 0.50 | 0.40 | 0.8 |
| 3 | 0.60 | 0.60 | 1.0 |

이 세 숫자를 GRPO 와 GSPO 가 다르게 쓴다. 차이를 보이려고 두 방식 모두 clipping 범위를 0.8–1.2 로 같게 둔다.

## A.2) GRPO: 토큰마다 따로 판정한다

**GRPO 는 토큰마다 ratio 가 범위를 벗어났는지 본다.** 범위를 넘은 토큰은 이번 업데이트에서 빠진다.

- 토큰 1: ratio 1.5 가 상한 1.2 를 넘었다. 이 토큰은 gradient 가 0 이라 배우지 않는다.
- 토큰 2: ratio 0.8 무게로 업데이트된다.
- 토큰 3: ratio 1.0 무게로 업데이트된다.

같은 정답 답변 안에서 토큰마다 무게가 0, 0.8, 1.0 으로 제각각이다. 채점은 답변 하나에 했는데, 어떤 토큰을 얼마나 배울지는 우연히 튄 확률이 정한 셈이다.

## A.3) GSPO: 응답 하나로 묶어 판정한다

**GSPO 는 세 ratio 를 하나로 합친다.** 먼저 곱하면 답변 전체의 확률 비가 된다.

- 곱: 1.5 × 0.8 × 1.0 = 1.2
- 토큰 수 3 으로 세제곱근을 취하면 1.2 의 세제곱근 = 1.063 이다.

1.063 은 **이 답변의 토큰 하나당 확률이 평균 1.063 배가 됐다**는 뜻이다. 이것이 GSPO 의 응답 ratio 다.

1.063 은 범위 0.8–1.2 안에 있다. 그래서 세 토큰이 모두 같은 무게 1.063 으로 업데이트된다. 토큰 1 만 빠지는 일이 없다.

## A.4) 오답이면 어떻게 되나

같은 답변이 오답이라 advantage 가 −1 이면, 이번에는 이 토큰들의 확률을 내려야 한다.

- **GRPO**: advantage 가 음수일 때는 상한 쪽 clipping 이 걸리지 않는다. 토큰 1 이 1.5 무게로 가장 세게 눌리고, 무게는 1.5, 0.8, 1.0 으로 여전히 제각각이다.
- **GSPO**: 세 토큰이 모두 1.063 무게로 똑같이 눌린다.

GRPO 에서 토큰 무게는 advantage 가 양수면 0 부터 1.2 까지, 음수면 0.8 부터 상한 없이 퍼진다. 논문은 이렇게 고르지 않은 무게가 학습 내내 쌓여 불안정을 만든다고 본다.

## A.5) 실제 clipping 범위로 보면

실제 GSPO 는 clipping 범위가 1 ± 0.0004 수준으로 아주 좁다. 이 범위라면 1.063 은 상한을 넘으므로 이 답변은 통째로 clipping 된다.

예시 ratio 는 차이를 보이려고 크게 잡았다. 실제 학습에서는 토큰 수백 개의 ratio 를 평균하므로 응답 ratio 가 1 에 아주 가깝게 모인다. 범위가 왜 이렇게 좁은지는 아래 clipping 범위 절에서 다룬다.

# B) GRPO 의 토큰 단위 ratio 가 문제인 이유

## B.1) 채점 단위와 업데이트 단위가 다르다

수학·코딩처럼 정답을 검증할 수 있는 RL(RLVR, Reinforcement Learning with Verifiable Rewards)에서는 답변 하나에 보상 하나가 붙는다. 최종 답이 맞으면 1, 틀리면 0 이다.

GRPO 는 이 보상으로 advantage 를 만든 뒤, 업데이트할 때는 답변 속 토큰 수백–수천 개마다 ratio 를 따로 계산하고 clipping 도 따로 한다. 예시에서 본 것처럼 같은 답변 안 토큰들이 서로 다른 무게를 받는다.

## B.2) 토큰 하나짜리 표본이라 노이즈가 크다

ratio 를 곱하는 이유는 [[importance sampling]] 이다. 이전 모델이 만든 답변으로 지금 모델의 기댓값을 추정하려고, 두 모델의 확률 비를 가중치로 곱한다.

**이 보정은 표본을 여러 개 평균해야 제대로 작동한다.** 그런데 각 토큰 위치에서 나온 토큰은 그 자리의 확률 분포에서 딱 한 번 뽑은 표본이다.

- 표본 하나로 만든 ratio 는 두 분포의 차이를 보정하지 못한다.
- 대신 우연히 튄 값이 그대로 gradient 에 들어가 분산만 키운다.

## B.3) 긴 응답에서는 노이즈가 쌓인다

긴 추론(CoT) 답변은 토큰 수천 개가 하나의 논리로 이어진다. GRPO 에서는 그중 우연히 많이 튄 토큰만 clipping 으로 빠지고, 나머지는 각자의 ratio 무게로 반영된다.

답변이 길수록 이런 들쭉날쭉한 무게가 많이 쌓인다. 논문은 이것이 긴 응답에서 학습이 갑자기 무너지는 원인이라고 본다. 한번 무너지면 이전 checkpoint 로 되돌려 다시 학습해도 회복되지 않는 경우가 많았다.

## B.4) MoE 에서는 라우팅이 바뀌어 ratio 가 더 흔들린다

[[MoE]](Mixture of Experts) 모델은 토큰마다 일부 expert 만 골라 계산한다. 파라미터가 조금만 바뀌어도 같은 토큰이 다른 expert 로 가는 일이 생긴다.

- 논문 실험(48 층 Qwen3-30B-A3B-Base)에서는 gradient 업데이트 한 번마다 새 모델이 고른 expert 의 약 10% 가 이전 모델과 달랐다.
- expert 가 바뀌면 그 토큰의 확률이 크게 달라지고, 토큰 ratio 가 심하게 흔들린다.
- GRPO 는 별도 장치 없이는 MoE 학습이 제대로 수렴하지 않았다.

그래서 Qwen 팀은 **Routing Replay** 를 썼다. 이전 모델이 고른 expert 를 저장해 두었다가 지금 모델의 ratio 를 계산할 때 같은 expert 를 강제로 쓰는 방식이다. 학습은 안정됐지만 메모리와 통신 비용이 더 들고, 모델이 쓸 수 있는 용량도 제한된다.

GSPO 는 응답 전체의 확률만 보므로 토큰 몇 개의 확률이 흔들려도 응답 ratio 는 크게 흔들리지 않는다. Routing Replay 없이도 MoE 학습이 안정적으로 수렴했다.

# C) GSPO 식 단계별 풀이

## C.1) advantage: GRPO 와 같다

질문 $x$ 하나에 이전 모델로 답변 $G$ 개를 만든다.

- $x$ 는 질문(prompt)이다.
- $G$ 는 질문 하나에 만드는 답변 수(group size)다.
- $\pi_{\theta_{\mathrm{old}}}$ 는 답변을 만들 때 쓴 이전 모델(old policy)이다.

$$
y_1, y_2, \ldots, y_G \sim \pi_{\theta_{\mathrm{old}}}(\cdot \mid x)
$$

답변 $y_i$ 는 검증기에게 점수 $r(x, y_i)$ 를 받는다. 같은 질문의 답변 $G$ 개 점수로 평균과 표준편차를 구해 advantage $\widehat{A}_i$ 를 만든다.

$$
\widehat{A}_i = \frac{r(x, y_i) - \mathrm{mean}\left(\{r(x, y_j)\}_{j=1}^{G}\right)}{\mathrm{std}\left(\{r(x, y_j)\}_{j=1}^{G}\right)}
$$

그룹 평균보다 잘 푼 답변은 양수, 못 푼 답변은 음수를 받는다. 이 부분의 자세한 설명은 [[GRPO]] 노트에 있다.

## C.2) 토큰 ratio 에서 응답 ratio 로

**1 단계: GRPO 의 토큰 ratio.** 답변 $y_i$ 의 $t$ 번째 토큰에 대한 ratio 다.

- $y_{i,t}$ 는 답변 $y_i$ 의 $t$ 번째 토큰이다.
- $y_{i,<t}$ 는 그 앞에 이미 생성된 토큰들이다.
- $\pi_\theta$ 는 지금 업데이트하려는 모델이다.

$$
w_{i,t}(\theta) = \frac{\pi_\theta(y_{i,t} \mid x, y_{i,<t})}{\pi_{\theta_{\mathrm{old}}}(y_{i,t} \mid x, y_{i,<t})}
$$

예시의 1.5, 0.8, 1.0 이 이 값이다.

**2 단계: 답변 전체의 확률은 토큰 확률의 곱이다.** $|y_i|$ 는 답변 $y_i$ 의 토큰 수다.

$$
\pi_\theta(y_i \mid x) = \prod_{t=1}^{|y_i|} \pi_\theta(y_{i,t} \mid x, y_{i,<t})
$$

그래서 답변 전체의 확률 비는 토큰 ratio 를 전부 곱한 값이 된다. 예시에서는 1.5 × 0.8 × 1.0 = 1.2 다.

**3 단계: 토큰 수로 거듭제곱근을 취한다.** 이것이 GSPO 의 응답 ratio $s_i(\theta)$ 다.

$$
s_i(\theta) = \left( \frac{\pi_\theta(y_i \mid x)}{\pi_{\theta_{\mathrm{old}}}(y_i \mid x)} \right)^{\frac{1}{|y_i|}}
$$

예시에서는 1.2 의 세제곱근 1.063 이다. 토큰 ratio 의 기하평균(geometric mean)과 같다.

**4 단계: 로그로 쓰면 토큰 로그 ratio 의 평균이다.** 구현은 이 형태로 한다.

$$
s_i(\theta) = \exp \left( \frac{1}{|y_i|} \sum_{t=1}^{|y_i|} \log w_{i,t}(\theta) \right)
$$

예시로 검산하면 로그 ratio 는 0.405, −0.223, 0 이고 평균은 0.061 이다. exp(0.061) = 1.063 으로 같다.

## C.3) 길이로 정규화하는 이유

거듭제곱근을 빼고 곱만 쓰면 **답변이 길다는 이유만으로 ratio 가 폭발한다.** 토큰 ratio 가 모두 1.001(0.1% 증가)로 똑같다고 하자.

| 답변 길이 | 곱만 쓴 값 | 길이로 정규화한 값 |
| --- | --- | --- |
| 100 토큰 | 1.105 | 1.001 |
| 512 토큰 | 1.668 | 1.001 |
| 2,000 토큰 | 7.382 | 1.001 |
| 5,000 토큰 | 148.0 | 1.001 |

토큰 하나당 변화는 모든 경우에 0.1% 로 같다. 그런데 곱만 쓰면 5,000 토큰 답변은 ratio 가 148 이 된다. 이러면 답변 길이마다 clipping 범위를 따로 정해야 한다.

길이로 정규화하면 $s_i(\theta)$ 는 **토큰 하나당 확률이 평균 몇 배가 됐는가**를 뜻한다. 논문은 정규화가 필요한 이유를 셋으로 든다.

- 분산을 줄인다.
- 답변 길이와 관계없이 ratio 가 같은 범위에 들어온다.
- 토큰 몇 개의 확률 변화가 응답 ratio 를 크게 흔들지 못한다.

## C.4) 목적함수와 clipping

GSPO 의 목적함수는 PPO·GRPO 와 같은 clipping 구조에 $s_i(\theta)$ 를 넣은 것이다. $\varepsilon$ 은 ratio 가 1 에서 얼마나 벗어나도 되는지 정하는 clipping 범위다.

$$
\mathcal{J}_{\mathrm{GSPO}}(\theta) = \mathbb{E} \left[ \frac{1}{G} \sum_{i=1}^{G} \min \left( s_i(\theta)\widehat{A}_i, \; \mathrm{clip}(s_i(\theta), 1-\varepsilon, 1+\varepsilon)\widehat{A}_i \right) \right]
$$

- $\min$ 과 $\mathrm{clip}$ 은 ratio 가 범위를 벗어나 더 이득을 보려는 쪽으로 움직이면 그 이득을 막는다. 이 구조는 [[Proximal Policy Optimization|PPO]] 에서 왔다.
- GRPO 는 이 식의 안쪽이 토큰마다 있고, 토큰 항을 $\frac{1}{|y_i|}$ 로 평균한다.
- GSPO 는 응답마다 항이 하나다.

논문 실험은 하한과 상한을 다르게 둔다 (하한 $3 \times 10^{-4}$, 상한 $4 \times 10^{-4}$). 상한을 더 넓히는 방식은 [[DAPO]] 의 Clip-Higher 와 같은 발상이다.

## C.5) gradient: 모든 토큰이 같은 무게를 받는다

clipping 이 걸리지 않았을 때 두 방식의 gradient 를 나란히 놓으면 차이가 바로 보인다. $\nabla_\theta \log \pi_\theta(y_{i,t} \mid \cdot)$ 는 토큰 $y_{i,t}$ 의 확률을 올리는 방향이다.

GRPO 는 토큰마다 자기 ratio $w_{i,t}$ 를 무게로 곱한다.

$$
\nabla_\theta \mathcal{J}_{\mathrm{GRPO}} = \mathbb{E} \left[ \frac{1}{G} \sum_{i=1}^{G} \widehat{A}_i \cdot \frac{1}{|y_i|} \sum_{t=1}^{|y_i|} w_{i,t}(\theta) \, \nabla_\theta \log \pi_\theta(y_{i,t} \mid x, y_{i,<t}) \right]
$$

GSPO 는 응답 ratio $s_i$ 하나를 모든 토큰에 똑같이 곱한다.

$$
\nabla_\theta \mathcal{J}_{\mathrm{GSPO}} = \mathbb{E} \left[ \frac{1}{G} \sum_{i=1}^{G} s_i(\theta) \, \widehat{A}_i \cdot \frac{1}{|y_i|} \sum_{t=1}^{|y_i|} \nabla_\theta \log \pi_\theta(y_{i,t} \mid x, y_{i,<t}) \right]
$$

예시로 돌아가면 GRPO 의 무게는 토큰마다 0, 0.8, 1.0 이고 GSPO 의 무게는 셋 다 1.063 이다. 좋은 답변이면 답변 속 토큰이 한꺼번에 강화되고, 나쁜 답변이면 한꺼번에 억제된다.

# D) clipping 범위가 1,000 배 작은 이유

GRPO 에서 GSPO 로 옮길 때 가장 헷갈리는 것이 $\varepsilon$ 의 크기다. 논문 실험값은 다음과 같다.

| 알고리즘 | clipping 대상 | 하한 | 상한 |
| --- | --- | --- | --- |
| GRPO | 토큰 ratio | 0.2 | 0.27 |
| GSPO | 응답 ratio (토큰 ratio 의 기하평균) | 0.0003 | 0.0004 |

**응답 ratio 는 토큰 하나당 평균 변화라서, 아주 작은 값도 답변 전체로는 큰 변화다.** 1,000 토큰 답변의 응답 ratio 가 1.0004 라면 답변 전체 확률은 이렇게 변한다.

$$
(1.0004)^{1000} \approx 1.49
$$

토큰당 평균 0.04% 늘었을 뿐인데 답변 전체 확률은 약 49% 늘었다.

반대로 GSPO 에 GRPO 의 0.2 를 그대로 쓰면 토큰당 평균 20% 증가까지 허용하게 된다. 1,000 토큰 답변 전체로는 $1.2^{1000} \approx 10^{79}$ 배다. clipping 이 사실상 작동하지 않는다.

**그래서 GSPO 는 GRPO 보다 훨씬 많이 clipping 한다.** 논문에서 clipping 된 토큰 비율이 GRPO 보다 두 자릿수(약 100 배) 높았다.

- 그런데도 같은 학습량에서 GSPO 의 성능이 더 빨리 올랐다.
- 논문은 이것을 GRPO 의 토큰 단위 gradient 가 노이즈가 많아 표본을 비효율적으로 쓴다는 증거로 본다.

# E) 변형과 엔지니어링 이점

## E.1) GSPO-token: 토큰마다 advantage 가 다를 때

멀티턴(multi-turn) RL 처럼 토큰마다 다른 advantage $\widehat{A}_{i,t}$ 를 주고 싶을 때가 있다. 이때는 응답 ratio 를 토큰별로 펼친 GSPO-token 을 쓴다. $\mathrm{sg}[\cdot]$ 는 값은 그대로 두고 gradient 만 막는 stop-gradient 연산이다.

$$
s_{i,t}(\theta) = \mathrm{sg}\left[s_i(\theta)\right] \cdot \frac{\pi_\theta(y_{i,t} \mid x, y_{i,<t})}{\mathrm{sg}\left[\pi_\theta(y_{i,t} \mid x, y_{i,<t})\right]}
$$

- 오른쪽 분수는 분자와 분모 값이 같아 항상 1 이다. 그래서 $s_{i,t}$ 의 값은 $s_i$ 와 같고 clipping 도 응답 단위로 판정된다.
- gradient 는 분자의 $\pi_\theta(y_{i,t})$ 로만 흐르므로 토큰마다 다른 advantage 를 곱할 수 있다.
- 토큰 advantage 가 모두 같으면 GSPO 와 값·clipping·gradient 가 전부 같다.

## E.2) 추론 엔진이 낸 확률을 그대로 쓸 가능성

RL 학습은 보통 답변을 vLLM·SGLang 같은 추론 엔진으로 만들고, 학습은 Megatron 같은 학습 엔진으로 한다. 두 엔진은 수치 정밀도가 달라 같은 토큰에도 확률이 조금 다르게 나온다.

- 그래서 GRPO 계열은 이전 모델의 확률을 학습 엔진으로 다시 계산하는 것이 보통이다.
- GSPO 는 응답 단위 확률만 쓰므로 이런 작은 차이에 덜 민감하다.
- 논문은 추론 엔진이 낸 확률을 다시 계산하지 않고 바로 쓸 수 있을 가능성을 제시한다. 멀티턴 RL 이나 학습·추론 분리 구성에서 인프라가 단순해질 수 있다.

## E.3) 도입할 때 확인할 것

- **보상이 답변 단위인가**: 최종 답 채점처럼 답변 하나에 점수 하나가 붙을 때 맞는 방법이다.
- **$\varepsilon$ 을 다시 정했는가**: GRPO 의 0.2 를 그대로 쓰면 clipping 이 사실상 꺼진다. 논문은 $3$–$4 \times 10^{-4}$ 를 썼다.
- **clipping 비율이 높은 것은 정상이다**: GRPO 보다 훨씬 높게 나와도 GSPO 에서는 예상된 모습이다.
- **평균 답변 길이를 지켜본다**: 학습 중 답변 길이가 계속 줄면 아래 길이 편향을 의심한다.

# F) 한계와 후속 연구

## F.1) 길이 편향과 LUSPO

**GSPO 에서 긴 답변의 토큰은 짧은 답변의 토큰보다 무게가 작다.** gradient 식의 $\frac{1}{|y_i|}$ 때문이다.

- 100 토큰 답변의 토큰 하나는 $\frac{1}{100}$, 2,000 토큰 답변의 토큰 하나는 $\frac{1}{2000}$ 무게를 받는다.
- 정답 답변(advantage 양수)은 짧을수록 토큰당 더 세게 강화된다.
- 오답 답변(advantage 음수)은 길수록 토큰당 덜 눌린다.

후속 연구 LUSPO(Length-Unbiased Sequence Policy Optimization)는 이 편향이 학습 중 답변 길이가 줄어드는 **length collapse** 를 만든다고 본다 ([Liu et al., 2026](https://arxiv.org/abs/2602.05261)).

- 같은 편향이 GRPO 에도 있지만 실제로는 덜 두드러진다고 한다.
- 저자들은 상한만 넓히는 Clip-Higher 가 음수 답변 토큰을 더 많이 잘라내 편향을 키운다고 주장한다. 이 부분은 따로 떼어 실험하지는 않았다.

LUSPO 는 GSPO 목적함수의 응답 항마다 답변 길이 $|y_i|$ 를 곱한다. 그러면 gradient 의 $\frac{1}{|y_i|}$ 가 지워져 토큰 무게가 길이와 무관해진다.

$$
\mathcal{J}_{\mathrm{LUSPO}}(\theta) = \mathbb{E} \left[ \frac{1}{G} \sum_{i=1}^{G} \min \left( s_i(\theta)\widehat{A}_i, \; \mathrm{clip}(s_i(\theta), 1-\varepsilon, 1+\varepsilon)\widehat{A}_i \right) \cdot |y_i| \right]
$$

## F.2) 어느 단계가 잘못됐는지는 구분하지 못한다

GSPO 는 답변 전체를 한 덩어리로 다룬다. 10 단계 증명에서 9 단계까지 맞고 마지막 계산만 틀려 오답이 됐다면, 맞은 9 단계의 토큰까지 함께 억제한다.

단계별로 잘잘못을 따져야 하는 작업이라면 단계별 보상을 주는 PRM(Process Reward Model)과 GSPO-token 같은 토큰 advantage 방식이 필요하다. GRPO 도 보상이 답변 단위라 이 한계는 같다.

# G) 관련 노트

- [[Proximal Policy Optimization|PPO]]: ratio 와 clipping 구조의 원형이다. on-policy 와 importance sampling 의 관계도 여기 있다.
- [[GRPO]]: value model 없이 그룹 상대 점수로 advantage 를 만드는 방법이다. GSPO 의 advantage 계산은 이 노트를 따른다.
- [[DAPO]]: 토큰 단위는 그대로 두고 GRPO 의 실전 문제 네 가지를 고친다. GSPO 와 다른 층위를 건드리므로 함께 쓰기도 한다.
- [[importance sampling]]: ratio 를 곱하는 이유와, 표본 하나로 만든 ratio 가 왜 분산만 키우는지 다룬다.
- [[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]: RL 단계에 GSPO 를 쓴 사례다. 긴 상호작용 이력 뒤에 환경 관찰값 블록 하나를 내는 구조라, 블록 전체를 한 단위로 평가하는 GSPO 와 잘 맞는다.
- [[LLM Post-Training for Natural Korean]]: post-training 방법들 사이에서 GSPO 의 위치를 정리한다.

# H) 면접에서 이렇게 답변하자

**Q1. GSPO 와 GRPO 의 핵심 차이는 무엇인가요?**

> importance ratio 와 clipping 의 단위입니다. GRPO 는 보상은 답변 단위로 받으면서 ratio 와 clipping 은 토큰마다 따로 계산합니다. 토큰 하나짜리 표본으로 만든 ratio 는 분산이 커서 긴 답변일수록 gradient 에 노이즈가 쌓입니다. GSPO 는 답변 전체의 likelihood ratio 를 길이로 정규화해 토큰 ratio 의 기하평균을 만들고, clipping 도 답변 단위로 합니다. 그래서 한 답변 안의 토큰이 모두 같은 무게로 업데이트됩니다.

**Q2. GSPO 의 clipping 범위가 GRPO 보다 훨씬 작은 이유는 무엇인가요?**

> GSPO 의 ratio 는 토큰 하나당 평균 변화라서 작은 값도 답변 전체로는 큰 변화이기 때문입니다. 1,000 토큰 답변에서 ratio 가 1.0004 면 답변 전체 확률은 약 1.49 배가 됩니다. GRPO 의 0.2 를 그대로 쓰면 clipping 이 사실상 작동하지 않으므로, 논문은 하한 3e-4, 상한 4e-4 를 썼습니다.

**Q3. GSPO 가 MoE 학습에서 Routing Replay 를 없앨 수 있었던 이유는 무엇인가요?**

> MoE 는 파라미터가 조금만 바뀌어도 토큰이 가는 expert 가 바뀌어 토큰 확률이 크게 흔들립니다. 논문 실험에서는 업데이트 한 번에 활성 expert 의 약 10% 가 바뀌었습니다. GRPO 는 이 흔들림이 토큰 ratio 에 그대로 들어가 이전 라우팅을 강제로 재현하는 Routing Replay 가 필요했습니다. GSPO 는 답변 전체 확률만 보므로 토큰 몇 개의 흔들림에 덜 민감하고, Routing Replay 없이도 안정적으로 수렴했습니다.

**Q4. GSPO 의 한계와 후속 연구는 무엇인가요?**

> 두 가지입니다. 첫째, 답변을 한 덩어리로 보므로 어느 추론 단계가 잘못됐는지 구분하지 못합니다. 둘째, 길이로 평균하므로 긴 답변의 토큰 무게가 작아지는 길이 편향이 있고, 학습 중 답변이 짧아지는 length collapse 로 이어질 수 있습니다. 후속 연구 LUSPO 는 응답 항마다 답변 길이를 곱해 이 편향을 없앴습니다.

# References

- Zheng et al., [Group Sequence Policy Optimization](https://arxiv.org/abs/2507.18071) (Qwen Team, 2025)
- Liu et al., [Length-Unbiased Sequence Policy Optimization](https://arxiv.org/abs/2602.05261) (LUSPO, 2026)
- [[GRPO]]
- [[DAPO]]
- [[Proximal Policy Optimization|PPO]]
- [[importance sampling]]
- [[LLM Post-Training for Natural Korean]]
- [[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]
