---
title: KL-Divergence
tags:
  - statistic
  - probability_distribution
  - metrics
  - machine_learning
  - information_theory
aliases:
  - Kullback-Leibler Divergence
  - KLD
  - relative entropy
---

# A) 한줄 요약

KL-Divergence(Kullback-Leibler Divergence)는 두 확률분포가 얼마나 다른지를 재는 값이다. 직관으로는 **"진짜 분포가 $P$인데 내가 $Q$라고 믿고 행동하면, 평균적으로 얼마나 손해를 보나"**를 잰다. 정보이론 관점에서 그 손해는 "낭비되는 비트 수"이고, 통계 관점에서는 "잘못된 모델이 데이터를 얼마나 덜 그럴듯하게 보나"다.

핵심 성질 세 가지만 기억하면 된다:

- 두 분포가 같으면 0, 다르면 항상 양수다
- **비대칭이다** — $D_{KL}(P\|Q) \neq D_{KL}(Q\|P)$. 그래서 거리(distance)가 아니라 divergence라 부른다
- 이 비대칭이 장식이 아니라 실전에서 중요하다. 어느 방향을 최소화하느냐에 따라 학습되는 모델의 성격이 완전히 달라진다 ([[#C) Forward KL vs. Reverse KL|C섹션]])

머신러닝에서 KL이 어디에나 나오는 이유는 하나다 — **모델 학습이 곧 "모델 분포를 데이터 분포에 가깝게 만드는 일"**이고, 그 "가깝게"를 재는 기본 자가 KL이기 때문이다. MLE, cross-entropy loss, 지식 증류, RLHF의 KL penalty가 전부 이 한 줄의 변주다.

# B) 정의와 성질

두 분포, $q$(실제)와 $p$(예측)가 있을 때 KL-Divergence는 다음과 같다. relative entropy라고도 부른다.

$$
\displaystyle D_{KL}(q\|p)=-\sum_{c=1}^{C}q\left(y_{c}\right)\left[\log\left(p\left(y_{c}\right)\right)-\log\left(q\left(y_{c}\right)\right)\right]=H_{p}(q)-H(q)
$$

보다시피, [[cross-entropy]] 값에 [[entropy]] 값을 뺀 것이 KL-Divergence다. Cross-entropy 값은 entropy 값보다 항상 크므로, KL-Divergence 값은 $0$보다 항상 크다.

A섹션의 직관("믿음이 틀린 만큼의 손해")이 이 식에 그대로 들어 있다. $H(q)$는 진짜 분포를 알 때 드는 최소 비용(entropy)이고, $H_p(q)$는 $p$라고 믿고 코딩할 때 실제로 드는 비용이니, 그 차이가 곧 낭비다.

## B.1) 예측 모형의 목적과 KL

예측 분포인 $p$를 실제분포 $q$에 가깝게 하는 것이 예측 모형이 이루고자 하는 것이며, $p$가 $q$에 가까이 갈수록 KL-Divergence 값은 $0$에 가까워질 것이다.

$H(q)$는 고정이기 때문에, $H_p(q)$를 최소화하는 것이 예측 모형을 최적화하는 것이라고 할 수 있다. 따라서 cross-entropy를 최소화하는 것이 KL-Divergence를 최소화하는 것이며, 이것이 불확실성을 제어하고자 하는 예측 모형의 실질적인 목적이라고 볼 수 있다.

## B.2) Properties

$\displaystyle\mathcal{K}\mathcal{L}(q\|p)=\int q(x)\log\frac{q(x)}{p(x)}dx$ 이라고 가정할때 아래를 만족한다.

- $\mathcal{KL}(q\|p)\neq\mathcal{KL}(p\|q)$ 그리고 $\mathcal{K}\mathcal{L}(q\|q)=0$
- $\mathcal{K}\mathcal{L}(q\|p)\geq0$

비대칭이고 삼각부등식도 만족하지 않으므로 엄밀한 의미의 거리(metric)는 아니다.

### B.2.1) Proof (non-negativity)

$$
-\mathcal{K}\mathcal{L}(q\|p)=\mathbb{E}_{q}\left(-\log\frac{q}{p}\right)=\mathbb{E}_{q}\left(\log\frac{p}{q}\right)\leq\log\left(\mathbb{E}_{q}\frac{p}{q}\right)=\log\int q(x)\frac{p(x)}{q(x)}dx=0
$$

여기서 log 함수는 [[concave function]] 이므로, [[Jensen's inequality]] 에 의해 Expectation sign 이 안으로 들어갈 수 있다. 또한, $\log\int p(x)dx=1$ 이다.

# C) Forward KL vs. Reverse KL

![[kl-forward-reverse.svg]]

A섹션에서 말한 "비대칭이 실전에서 중요하다"가 여기다. 목표 분포를 $P$, 우리가 학습하는 분포를 $Q$라 하자. $P$는 봉우리(mode)가 여러 개인데 $Q$는 용량이 부족해 전부 정교하게 표현할 수 없는 상황이 문제의 핵심이다. 어느 방향을 최소화하느냐에 따라 $Q$의 행동이 달라진다.

## C.1) Forward KL — $D_{KL}(P\|Q)$: mode-covering

$$
D_{KL}(P\|Q)=\mathbb{E}_{x\sim P}\left[\log\frac{P(x)}{Q(x)}\right]
$$

수식을 뜯어보면, 벌점 $\log\frac{P(x)}{Q(x)}$를 **$P$에서 뽑은 샘플로 평균**낸다. 즉 실제로 일어날 법한 $x$에 대해서만 채점한다. 그런데 그런 $x$에 $Q$가 확률을 거의 안 줬다면($Q(x)\approx 0$) 분모가 0에 가까워져 벌점이 무한대로 치솟는다. "실제로 일어나는 일인데 모델은 불가능하다고 말하는" 상황에 최대 벌점이 붙는 셈이다.

이 벌점을 피하려면 $Q$는 $P$가 나타나는 모든 영역(mode)에 조금씩이라도 확률을 깔아 둬야 한다 → **mode-covering** (zero-avoiding). 대신 용량이 부족하면 여러 mode를 한 분포로 억지로 덮느라 mode 사이의 빈 공간까지 확률이 새고, 그림처럼 분포가 넓게 뭉개진다(mean-seeking).

MLE(최대우도추정)가 정확히 forward KL 최소화다. 데이터 분포 위에서 모델의 log-likelihood를 평가하기 때문. 유도는 [[#D) KL과 MLE의 관계|D섹션]] 참고.

## C.2) Reverse KL — $D_{KL}(Q\|P)$: mode-seeking

$$
D_{KL}(Q\|P)=\mathbb{E}_{x\sim Q}\left[\log\frac{Q(x)}{P(x)}\right]
$$

이번에는 같은 벌점을 **$Q$에서 뽑은 샘플로 평균**낸다. 채점 대상이 "$Q$가 실제로 생성하는 $x$"로 바뀐 것이다. $Q$가 생성한 $x$가 $P$ 입장에서 말이 안 되는 것이라면($P(x)\approx 0$) 벌점이 무한대로 치솟는다. 반대로 $Q$가 아예 확률을 주지 않는 영역은 애초에 채점 대상에서 빠진다 — 안 다루는 mode는 벌점도 없다.

그래서 $Q$의 최적 전략은 감당 안 되는 mode는 통째로 포기하고, 가장 확실한 mode 하나에 집중하는 것이 된다 → **mode-seeking** (zero-forcing). "아는 것만 말해라, 대신 틀린 말은 하지 마라."

Variational Inference(VB)가 reverse KL을 쓴다. $Q$에서 샘플링해 계산할 수 있어 intractable한 $P$를 다룰 때 유리하기 때문.

## C.3) JSD — 둘 사이의 절충

Jensen-Shannon Divergence는 두 방향을 대칭으로 섞은 것이다.

$$
JSD(P\|Q)=\tfrac{1}{2}D_{KL}(P\|M)+\tfrac{1}{2}D_{KL}(Q\|M),\quad M=\tfrac{1}{2}(P+Q)
$$

forward만큼 전부 커버하라고 강요하지도, reverse만큼 한 mode로 쏠리지도 않는 중간 성격이다. 항상 유한하고 대칭이라 GAN의 원조 objective로도 쓰였다.

# D) KL과 MLE의 관계

[[Maximum Likelihood Estimation|MLE]]는 데이터의 [[negative log likelihood|log-likelihood]]를 최대화하는 파라미터를 찾는다.

$$
\hat{\theta}_{MLE}=\arg\max_{\theta}\frac{1}{N}\sum_{i=1}^{N}\log Q_{\theta}(x_i)
$$

이것이 forward KL 최소화와 같다는 걸 보이자. 데이터의 실제 분포를 $P$라 하고, forward KL을 전개하면:

$$
D_{KL}(P\|Q_{\theta})=\mathbb{E}_{x\sim P}[\log P(x)]-\mathbb{E}_{x\sim P}[\log Q_{\theta}(x)]=-H(P)-\mathbb{E}_{x\sim P}[\log Q_{\theta}(x)]
$$

첫 항 $-H(P)$는 데이터의 entropy라 $\theta$와 무관한 상수다. 따라서:

$$
\arg\min_{\theta}D_{KL}(P\|Q_{\theta})=\arg\max_{\theta}\mathbb{E}_{x\sim P}[\log Q_{\theta}(x)]\approx\arg\max_{\theta}\frac{1}{N}\sum_{i=1}^{N}\log Q_{\theta}(x_i)
$$

마지막 근사는 기대값을 데이터 샘플 평균으로 대체한 것(대수의 법칙)이다. 즉 **MLE = 경험 분포에 대한 forward KL 최소화 = [[cross-entropy]] 최소화**로, 셋은 같은 문제다. 분류 학습에서 cross-entropy loss를 쓰는 이유, 그리고 B.1에서 "cross-entropy 최소화가 곧 KL 최소화"라 한 것이 정확히 이 관계다.

따름정리처럼 얻는 직관 두 가지:

- MLE로 학습한 생성 모델은 forward KL의 mode-covering 성질을 물려받는다. 용량이 부족하면 mode 사이에 확률을 흘려 흐릿한(blurry) 샘플을 만든다 — VAE 샘플이 뿌연 이유 중 하나.
- 반대로 MLE는 데이터가 있는 곳을 절대 버리지 못하므로, 데이터 커버리지가 중요한 언어 모델 사전학습(next-token prediction도 cross-entropy = forward KL)과 잘 맞는다.

# E) LLM 학습에서의 KL

- **지식 증류**: supervised KD는 forward KL로 교사 분포를 흉내 낸다. [[GKD]]는 작은 학생이 교사의 모든 mode를 커버하다 분포가 뭉개지는 문제를 지적하며, 학생 생성문 위에서 reverse KL이나 JSD를 쓰는 선택지를 연다. 작은 모델일수록 mode-seeking이 유리한 경우가 많다.
- **RLHF의 KL penalty**: [[RLHF]]에서 policy가 reference 모델에서 너무 멀어지지 않게 거는 페널티 $D_{KL}(\pi\|\pi_{ref})$는 reverse KL이다. 그래서 RLHF 모델이 다양성을 잃고 특정 스타일로 쏠리는 mode collapse가 생기는 것도 같은 원리다.
- **[[KL annealing]]**: VAE 학습에서 KL 항의 가중치를 서서히 올려 posterior collapse를 막는 테크닉.

# F) Related

[[Kolmogorov-Smirnov|KS]] 방식은 두 [[Cumulative Distribution Function|CDF]] 의 차이를 계산한다.

# G) References

- https://timvieira.github.io/blog/post/2014/10/06/kl-divergence-as-an-objective-function/
- https://blog.evjang.com/2016/08/variational-bayes.html — Forward/Reverse KL 시각화
- Agarwal et al., 2023, GKD — 증류에서의 divergence 선택
