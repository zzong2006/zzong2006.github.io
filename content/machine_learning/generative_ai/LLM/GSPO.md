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

GSPO(Group Sequence Policy Optimization)는 LLM RL에서 답변 하나를 통째로 한 단위로 보고 policy를 업데이트하는 방법이다.

[[GRPO]]는 value model 없이 group reward로 advantage를 만들지만, policy를 업데이트할 때는 token마다 importance ratio를 따로 계산한다. GSPO가 바꾸는 곳이 여기다. 채점이 답변 하나를 단위로 이뤄지니, 업데이트에 쓰는 확률 비율(importance ratio)과 그 비율을 잘라내는 clipping도 같은 단위로 두자는 것이다.

한 줄로 줄이면 이렇게 볼 수 있다.

> GRPO가 "좋은 답변 안의 token들을 어떻게 밀 것인가"를 본다면, GSPO는 "좋은 답변 하나가 old policy 대비 얼마나 달라졌는가"를 본다.

Qwen Team은 Qwen3-30B-A3B-Base로 이 방식을 검증했고, [[GRPO]] 대비 training stability와 efficiency가 낫고 AIME'24, LiveCodeBench, CodeForces 점수도 높다고 보고한다. 특히 [[MoE]] 모델의 RL training을 안정화한다. [[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]의 RL stage에서도 `GSPO`가 사용된다.

# B) ratio를 token마다 계산하면 무엇이 어긋나는가

## B.1) 채점 단위와 업데이트 단위가 다르다

LLM RLVR에서는 보통 답변 하나에 reward 하나가 매겨진다.

```text
prompt x
-> response y
-> verifier/reward r(x, y)
```

수학 문제라면 최종 답이 맞았는지, coding task라면 test를 통과했는지가 reward가 된다. 채점 대상은 token 하나하나가 아니라 답변 전체다.

그런데 GRPO는 이렇게 얻은 response-level reward로 advantage를 만든 뒤, policy update에서는 token-level ratio를 쓴다. 두 방법이 무엇을 한 덩어리로 보는지 나란히 두면 차이가 드러난다.

```text
                   ┌──────────── 답변 y (token 512개) ────────────┐
채점 (verifier)    │           r(x, y) = 1  ->  A = +0.8          │
                   └────────── 답변 하나에 값 하나 ───────────────┘

GRPO 의 update     [t1][t2][t3][t4] ...................... [t512]
                    ratio 512개, clip 512번   <- 채점 단위와 어긋난다

GSPO 의 update     [──────────────── y ────────────────]
                    ratio 1개, clip 1번       <- 채점 단위와 같다
```

verifier는 답변 하나를 놓고 값 하나를 낸다. 위 그림의 첫 줄이 그것이다.

GRPO는 그 값 하나를 512개 token이 나눠 갖게 한 뒤, token마다 별도의 ratio를 계산하고 별도로 clip 여부를 판정한다. 채점은 한 번인데 판정은 512번이다.

GSPO는 판정도 한 번으로 맞춘다. 답변 전체에 ratio 하나를 두고 clip도 한 번만 건다. 이 어긋남을 없애는 것이 GSPO의 출발점이다.

## B.2) token-level ratio가 하는 일

token-level importance ratio는 "old policy가 이미 뽑은 token을 current policy가 지금은 얼마나 더, 또는 덜 뽑으려 하는가"를 보는 비율이다. 예를 들어 old policy가 어떤 자리에서 `4` token을 낼 확률을 `0.20`으로 봤고, current policy가 `0.30`으로 본다면 ratio는 `1.5`다. 현재 모델이 그 token을 이전보다 더 밀고 있다는 뜻이다.

이 ratio는 update lever에 가깝다. 답변 전체가 좋은 reward를 받으면 그 답변 안의 token 확률을 올리는 방향으로, 나쁜 reward를 받으면 낮추는 방향으로 작동한다.

## B.3) sample 하나로 만든 ratio는 보정 역할을 못 한다

[[importance sampling]]은 샘플을 뽑기 쉬운 분포 $q$에서 뽑은 sample에 $p(x)/q(x)$ 비율을 곱해, 정작 알고 싶은 분포 $p$의 기댓값을 계산하는 기법이다. 그 비율이 바로 likelihood ratio다. RL에서 이 보정이 필요한 이유는 rollout은 old policy로 뽑았지만 업데이트는 current policy 기준이어야 하기 때문이다.

문제는 보정이 성립하는 조건이다. 비율을 곱해서 분포를 옮기는 계산은 같은 분포에서 뽑은 sample $N$개를 평균할 때 원래 기댓값에 수렴한다. GRPO의 token-level ratio는 각 위치에서 sample 하나, 즉 실제로 생성된 token 하나만 갖고 비율을 만든다. 그래서 GSPO 논문은 이 ratio가 분포 차이를 보정하는 역할을 하지 못하고 대신 분산이 큰 noise를 [[Policy Gradient|policy gradient]]에 집어넣는다고 지적한다.

noise 하나하나는 작지만, 긴 reasoning 답변에서는 token 위치마다 쌓인다. clipping은 이를 더 키운다. token별로 ratio를 자르면 어떤 token은 gradient가 통째로 사라지고 어떤 token은 남으므로, 같은 답변 안에서도 업데이트 크기가 고르지 않게 된다.

[[MoE]] 모델에서는 token마다 활성화되는 expert가 달라질 수 있어 token-level likelihood ratio가 더 흔들린다.

# C) 핵심 아이디어: 단위를 sequence로 옮긴다

GSPO는 앞에서 본 채점 단위와 업데이트 단위의 어긋남을 ratio 쪽을 고쳐서 맞춘다. reward를 token 단위로 쪼개는 대신, ratio와 clipping을 답변 단위로 올린다.

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

notation은 다음처럼 읽으면 된다.

| 기호 | 뜻 |
| --- | --- |
| $x$ | prompt 또는 query |
| $G$ | 한 prompt에 대해 뽑는 답변 개수 (group size) |
| $y_i$ | $i$번째 response |
| $\lvert y_i \rvert$ | $i$번째 response의 token 수 |
| $y_{i,t}$ | $i$번째 response의 $t$번째 token |
| $y_{i,<t}$ | $t$번째 token 앞에 이미 생성된 prefix |
| $\pi_\theta$ | 지금 업데이트하려는 current policy |
| $\pi_{\theta_{\mathrm{old}}}$ | rollout을 만들 때 쓴 old policy |
| $\widehat{A}_i$ | $i$번째 response의 group 상대 advantage |
| $w_{i,t}(\theta)$ | GRPO의 token-level ratio |
| $s_i(\theta)$ | GSPO의 sequence-level ratio |
| $\varepsilon$ | clipping 범위 |

여기까지는 GRPO와 같다. 차이는 policy ratio다. GRPO는 token마다 ratio를 둔다.

$$
w_{i,t}(\theta) =
\frac{
  \pi_\theta(y_{i,t} \mid x, y_{i,<t})
}{
  \pi_{\theta_{\mathrm{old}}}(y_{i,t} \mid x, y_{i,<t})
}
$$

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

## C.1) 왜 길이로 정규화하는가

$s_i(\theta)$에는 $1/\lvert y_i \rvert$ 지수가 붙어 있다. 왜 두 확률의 비를 그냥 쓰지 않는지 보려면, 정규화하지 않은 sequence ratio가 실제로 어떤 값인지부터 봐야 한다.

답변 확률이 token 확률의 곱이므로, 두 policy의 비도 token별 ratio의 곱이 된다.

$$
\frac{\pi_\theta(y_i \mid x)}{\pi_{\theta_{\mathrm{old}}}(y_i \mid x)}
=
\prod_{t=1}^{\lvert y_i \rvert}
w_{i,t}(\theta)
$$

곱이라는 것이 문제다. token 하나하나의 ratio는 1에 가깝지만, 1에서 조금 벗어난 값을 수백 번 곱하면 그 작은 차이가 복리처럼 불어난다.

token ratio가 전부 1.001인 답변을 길이만 바꿔가며 계산하면 이렇게 된다.

| 답변 길이 | 곱 (정규화 안 함) | $\lvert y_i \rvert$ 제곱근 |
| --- | --- | --- |
| 100 token | 1.105 | 1.0010 |
| 512 token | 1.668 | 1.0010 |
| 5000 token | 148.0 | 1.0010 |

token 하나당 0.1%씩 벗어난 것은 세 경우가 똑같다. 그런데 곱은 1.1에서 148까지 벌어진다. 모델이 더 크게 변해서가 아니라 답변이 길어서 커진 값이다.

이러면 clipping 범위를 정할 수가 없다. 짧은 답변에 맞춰 범위를 잡으면 긴 답변은 전부 잘려나가고, 긴 답변에 맞추면 짧은 답변에는 아무 제약도 걸리지 않는다.

$\lvert y_i \rvert$ 제곱근을 씌우면 그 문제가 사라진다. 오른쪽 열은 길이와 무관하게 1.0010이다. 이 값이 답하는 질문이 "답변 전체가 몇 배 그럴듯해졌는가"에서 **"token 하나당 평균 몇 배 그럴듯해졌는가"** 로 바뀌었기 때문이다. 길이가 답에서 빠졌으므로 길이가 다른 답변들에 같은 $\varepsilon$을 쓸 수 있다.

같은 이유로 분산도 준다. 정규화하지 않으면 token 하나의 확률이 두 배가 될 때 sequence ratio도 그대로 두 배가 된다. 기하평균에서는 그 token이 $1/\lvert y_i \rvert$의 비중만 갖는다. 논문이 length normalization의 목적을 분산을 줄이고 $s_i(\theta)$를 일정한 수치 범위 안에 두는 것으로 설명하는 이유가 이것이다.

정규화되는 대상은 reward가 아니라 policy ratio다. reward와 advantage는 여전히 response 단위로 계산된다. 결과적으로 $s_i(\theta)$는 답변 전체가 old policy 대비 평균적으로 얼마나 더 그럴듯해졌는지를 나타내는 값이 된다.

# D) Objective

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

수식 모양은 [[Proximal Policy Optimization|PPO]]와 [[GRPO]]를 닮았지만, clipping 대상이 다르다. PPO는 [[advantage function|advantage]]를 value model로 추정하고, GRPO와 GSPO는 group 안의 상대 reward로 대신한다.

| 방법 | ratio 단위 | reward/advantage 단위 | 핵심 차이 |
| --- | --- | --- | --- |
| PPO | token/action | token/action 또는 value 기반 | value model이 필요함 |
| [[GRPO]] | token | response group | value model은 없지만 token-level ratio를 씀 |
| GSPO | response sequence | response group | reward와 optimization 단위를 sequence로 맞춤 |

GSPO는 좋은 advantage를 받은 답변의 sequence likelihood를 높이고, 낮은 advantage를 받은 답변의 sequence likelihood를 낮춘다. 이때 특정 token 하나가 아니라 답변 전체의 평균 log ratio를 보고 clip한다.

## D.1) clipping 범위는 GRPO와 자리수가 다르다

앞에서 본 기하평균의 성질이 여기서 다시 걸린다. 기하평균은 token 하나의 큰 변화를 $1/\lvert y_i \rvert$의 비중으로 눌러버리므로, $s_i(\theta)$는 token-level ratio보다 훨씬 좁게 1 근처에 모인다. 그래서 GRPO에서 쓰던 $\varepsilon$을 그대로 가져오면 clipping이 사실상 걸리지 않는다.

논문 실험의 설정을 비교하면 규모 차이가 드러난다.

| 방법 | clipping 범위 $\varepsilon$ |
| --- | --- |
| GRPO | 0.2, 0.27 |
| GSPO | 3e-4, 4e-4 |

세 자리수 차이다. 답변 하나를 놓고 두 설정을 나란히 적용해 보면 무슨 일이 벌어지는지 보인다.

```text
어떤 답변의 token ratio 8개

  1.0008  0.9994  1.0021  1.0002  0.9987  1.0015  0.9996  1.0009
  가장 많이 벗어난 것도 1에서 0.21%

  s_i = 이 8개의 기하평균 = 1.000399
  벗어난 정도가 0.040% 로 줄었다

GRPO   ε = 0.2     허용 구간 [0.8000, 1.2000]
                   8개 token 이 모두 구간 안  ->  아무것도 clip 되지 않는다

GSPO   ε = 3e-4    허용 구간 [0.9997, 1.0003]
                   s_i = 1.000399 는 구간 밖  ->  답변 전체가 clip 된다
```

기하평균은 편차를 눌러준다. token 하나가 0.21% 벗어나도 8개를 평균한 $s_i$는 0.040%까지 줄었다. token이 512개라면 더 줄어든다. 그래서 $s_i$를 판정하는 $\varepsilon$은 token ratio를 판정하던 값과 같은 자리수일 수 없다. GSPO를 도입할 때 하이퍼파라미터를 그대로 옮기면 안 되는 지점이 여기다.

같은 예시가 clip 비율 차이도 설명한다. 이 답변에서 GRPO는 token을 하나도 버리지 않는데 GSPO는 8개를 전부 버린다. GSPO가 GRPO보다 훨씬 많은 token을 clip한다는 관찰이 이렇게 만들어진다.

## D.2) GSPO-token: token마다 advantage를 달리 줘야 할 때

multi-turn RL처럼 답변 안 구간마다 advantage를 달리 주고 싶은 경우가 있다. 이때 쓰는 변형이 GSPO-token이다.

$$
s_{i,t}(\theta)
=
\mathrm{sg}\!\left[s_i(\theta)\right]
\cdot
\frac{
  \pi_\theta(y_{i,t} \mid x, y_{i,<t})
}{
  \mathrm{sg}\!\left[\pi_\theta(y_{i,t} \mid x, y_{i,<t})\right]
}
$$

$\mathrm{sg}[\cdot]$는 stop-gradient로, 값은 그대로 쓰되 gradient는 흐르지 않게 하는 연산이다. 뒤쪽 분수는 분자와 분모가 같은 값이라 수치상 항상 1이므로, $s_{i,t}(\theta)$의 값 자체는 $s_i(\theta)$와 같다. 달라지는 것은 gradient가 흐르는 경로다. clipping은 sequence-level 값 하나로 판정되지만 gradient는 각 token 확률에서 나오므로, token마다 다른 advantage를 곱할 수 있다.

모든 token에 같은 advantage를 주면 GSPO와 gradient가 동일하다. 즉 GSPO-token은 GSPO를 대체하는 것이 아니라, token별 advantage가 필요할 때만 꺼내 쓰는 확장이다.

# E) GRPO 대비 실제로 달라지는 것

## E.1) token마다 다른 가중치를 줄인다

GRPO에서는 같은 답변 안의 token이라도 token-level ratio가 다르다. 그래서 같은 response-level advantage를 공유하더라도, 실제 gradient에서는 token마다 다른 weight가 걸린다.

GSPO는 답변 하나에 sequence-level ratio 하나를 둔다. 좋은 답변이면 답변 전체를 밀고, 나쁜 답변이면 답변 전체를 덜어낸다. reward가 답변 전체에 매겨지는 RLVR task에서는 이쪽이 더 직접적이다.

## E.2) 긴 답변에서 noise 누적을 줄인다

긴 reasoning 답변에는 token이 많다. token-level ratio가 조금씩 흔들려도 많이 쌓이면 update가 불안정해진다.

GSPO는 response-level ratio 하나로 clipping을 하므로, token-level fluctuation이 gradient에 직접 쌓이는 경로를 줄인다. 논문은 이 차이가 long response RL에서 stability를 높인다고 본다.

## E.3) 더 많이 clip하는데도 학습 효율이 높다

논문의 관찰 하나가 이 설명을 뒷받침한다. clipping이 걸린 token의 비율을 보면 GSPO와 GRPO 사이에 두 자리수 차이가 난다. 앞의 clipping 범위 예시가 그 이유였다. GSPO는 답변 하나를 통째로 판정하므로, 한 번 걸릴 때 그 답변의 token이 한꺼번에 빠진다.

그런데도 GSPO의 training efficiency가 GRPO보다 높다. 학습에 쓰는 token을 훨씬 적게 가져가면서 더 빨리 좋아진다는 뜻이다. 논문은 이것을 GRPO의 token-level gradient estimate가 애초에 noise가 많아 효율이 낮다는 증거로 읽는다.

## E.4) MoE training에서 Routing Replay 의존을 줄인다

MoE 모델은 token마다 활성화 expert가 달라진다. GRPO에서 token-level likelihood ratio를 안정적으로 계산하려면, old policy에서 어떤 expert가 활성화됐는지 캐시해두고 current policy에서 같은 routing을 재현하는 Routing Replay 같은 workaround가 필요했다.

GSPO는 sequence likelihood만 보기 때문에 개별 token의 expert routing 변화에 둔감하다. 모델이 language modeling 능력을 유지하는 동안에는 sequence likelihood가 크게 튀지 않는다는 것이 논문의 설명이다. Qwen Team은 이 덕분에 MoE RL training에서 Routing Replay를 걷어낼 수 있었다고 보고한다.

## E.5) inference engine이 낸 확률을 그대로 쓸 수 있다

RL training에서 rollout은 [[vllm|vLLM]] 같은 inference engine이 만들고, 업데이트는 training engine이 한다. 같은 weight라도 두 엔진의 커널과 연산 순서가 달라 token 확률이 미세하게 어긋난다. GRPO는 token-level ratio를 쓰므로 이 차이가 ratio에 그대로 들어가고, 그래서 보통 training engine으로 확률을 다시 계산한다.

GSPO는 sequence likelihood 하나만 보므로 이 precision 차이에 훨씬 관대하고, rollout 때 inference engine이 반환한 확률을 그대로 optimization에 쓸 수 있다. 재계산 비용이 사라지면서 partial rollout, multi-turn RL, training/inference 분리 배치가 모두 단순해진다.

# F) 한계와 후속 흐름

GSPO는 GRPO의 token-level ratio 문제를 줄이지만, 모든 문제를 끝내지는 않는다.

## F.1) length bias

GSPO는 sequence ratio를 길이로 정규화하지만, reward를 길이로 정규화하지는 않는다. 또 objective 안에서 response 하나가 하나의 loss 항처럼 평균되므로, 긴 답변의 token 하나하나가 loss에 기여하는 비중은 짧은 답변보다 작아진다.

후속 연구인 LUSPO(Length-Unbiased Sequence Policy Optimization)는 이 지점을 GSPO의 length bias로 본다. sequence-level clipping은 token-level clipping보다 더 많은 token을 한꺼번에 clip하고, 실제 학습에서 함께 쓰이는 Clip-Higher와 결합되면 positive/negative sample의 token 기여가 불균형해진다는 것이다. Clip-Higher는 clipping의 상한과 하한을 분리해 entropy collapse를 막는 [[DAPO]]의 기법이다. 그 결과 GSPO가 response length collapse, 즉 답변이 점점 짧아지는 방향으로 치우칠 수 있다고 지적한다.

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

## F.2) credit assignment

두 번째 한계는 답변 안에서 어느 부분이 좋았는지 가려내기 어렵다는 점이다. 다만 이것이 "GRPO는 각 reasoning step의 좋고 나쁨을 정확히 안다"는 뜻은 아니다. GRPO도 reward와 advantage는 답변 전체에 붙이고, 같은 advantage를 답변 안의 token들이 공유한다.

차이는 정도에 있다. GRPO는 token마다 ratio와 clipping이 달라서 token별 gradient 크기가 달라진다. GSPO는 sequence 전체를 더 강하게 묶는다. step-level credit assignment가 중요한 task라면 process reward, step-level verifier, token-wise advantage 같은 별도 신호가 필요하다. 앞서 본 GSPO-token은 token별 advantage를 넣을 자리를 열어주지만, 그 advantage를 어디서 얻을지는 여전히 별도 문제다.

# G) Qwen-AgentWorld에서 왜 쓰였나

[[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]의 RL stage는 일반 answer RL보다 prompt와 output의 길이 차이가 크다.

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

이때 reward가 보는 것은 `screen`이라는 token 하나가 따로 좋았는지가 아니다. JSON 형식이 맞는지, 현재 agent action 뒤에 나올 만한 상태인지, 앞선 interaction history와 모순되지 않는지, observation 전체가 실제 환경처럼 보이는지를 함께 본다. 평가 단위가 token 하나가 아니라 observation 한 덩어리다.

그래서 이 구조에서는 token마다 ratio를 따로 흔드는 것보다, observation sequence 전체의 확률을 한 단위로 보고 업데이트하는 편이 자연스럽다. GSPO는 좋은 observation이면 그 sequence 전체의 likelihood를 올리고, 나쁜 observation이면 전체 likelihood를 낮춘다. 긴 context, long trajectory, MoE serving 비용까지 겹치므로 training stability와 infrastructure 단순화가 모두 중요하고, 그 점에서 GSPO가 잘 맞는다.

# H) 실무 체크리스트

GSPO를 실제 실험에 넣는다면 아래 항목을 같이 봐야 한다.

1. reward가 정말 response-level인가?
2. group size $G$가 reward normalization에 충분한가?
3. clipping 범위를 GSPO 규모로 다시 잡았는가? 논문 설정으로 보면 GRPO의 `0.2`대와 GSPO의 `3e-4`대는 세 자리수 차이다.
4. clip이 걸린 token 비율을 로깅하고 있는가? GSPO에서는 이 값이 GRPO보다 크게 나오는 것이 정상이다.
5. response length가 훈련 중 줄거나 늘어나는지 추적하는가?
6. positive/negative sample의 length 분포가 reward와 엉키지 않는가?
7. MoE 모델이라면 expert routing instability가 줄었는가?
8. inference engine 확률을 그대로 쓸 것인가, training engine으로 재계산할 것인가?
9. sequence-level update가 필요한 만큼의 fine-grained credit assignment를 잃고 있지는 않은가?

# I) 면접에서 이렇게 말하면 된다

**Q1. GSPO를 GRPO와 비교해서 설명해주세요.**

> GSPO는 GRPO의 group-relative advantage는 유지하되, policy ratio와 clipping을 token 단위가 아니라 sequence 단위로 옮긴 방법입니다. GRPO는 response 전체 reward를 쓰면서 token-level importance ratio를 적용하는데, 각 token 위치에서 sample 하나로 만든 ratio는 분포 보정 역할을 못 하고 분산만 키웁니다. 이 noise가 긴 답변에서 누적되고 clipping으로 증폭되면서 long response나 MoE 모델에서 instability가 생깁니다. GSPO는 response likelihood ratio를 길이로 정규화해서 쓰고, 답변 전체를 하나의 update 단위로 다룹니다.

**Q2. GSPO가 MoE training에서 유리한 이유는 무엇인가요?**

> MoE 모델은 update 전후로 같은 token이 다른 expert를 탈 수 있어서 token-level likelihood ratio가 흔들립니다. GRPO에서는 이 ratio가 update에 직접 들어가므로 Routing Replay처럼 old policy의 routing을 재현하는 장치가 필요했습니다. GSPO는 sequence likelihood를 기준으로 보기 때문에 token-level routing 변동에 둔감하고, Qwen Team은 이 덕분에 MoE RL training에서 그 장치를 걷어낼 수 있었다고 보고합니다.

**Q3. GSPO를 도입할 때 실무에서 가장 먼저 챙길 것은 무엇인가요?**

> clipping 범위입니다. sequence ratio는 token ratio의 기하평균이라 1 근처에 훨씬 좁게 모이므로, GRPO의 `0.2`대 값을 그대로 쓰면 clipping이 거의 걸리지 않습니다. 논문 실험은 `3e-4`대를 씁니다. 함께 볼 것은 clip된 token 비율인데, GSPO는 GRPO보다 두 자리수 많은 token을 clip하면서도 training efficiency가 더 높게 나옵니다. 이 값이 GRPO 수준으로 낮게 나온다면 clipping 범위 설정을 다시 봐야 한다는 신호입니다.

**Q4. GSPO의 한계는 무엇인가요?**

> sequence 단위로 안정성을 얻는 대신, 답변 내부의 어느 token이나 reasoning step이 실제로 좋았는지 세밀하게 구분하기 어렵습니다. token별 advantage가 필요하면 GSPO-token 변형으로 자리는 열 수 있지만, 그 advantage를 만들 process reward나 step-level verifier는 따로 필요합니다. 또 후속 연구는 GSPO에 length bias가 생겨 답변이 점점 짧아질 수 있다고 지적합니다. 그래서 GSPO를 쓸 때는 reward와 benchmark score뿐 아니라 response length, clip된 token 비율, positive/negative sample의 길이 분포까지 함께 봐야 합니다.

# References

- Zheng et al., [Group Sequence Policy Optimization](https://arxiv.org/abs/2507.18071)
- Zheng et al., [Group Sequence Policy Optimization HTML](https://ar5iv.labs.arxiv.org/html/2507.18071v2)
- Liu et al., [Length-Unbiased Sequence Policy Optimization](https://arxiv.org/abs/2602.05261)
- [[GRPO]]
- [[DPO]]
- [[LLM Post-Training for Natural Korean]]
- [[papers/language_model/Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]]
