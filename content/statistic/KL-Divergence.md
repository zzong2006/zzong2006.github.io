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

# A) KL-Divergence ?

KL-Divergence(Kullback-Leibler Divergence)는 서로 다른 두 분포의 차이(dissimilarity)를 측정하는 데 쓰이는 metric이다. relative entropy라고도 부른다.

두 분포, $q$(실제)와 $p$(예측)가 있을 때, KL-Divergence는 다음과 같다.

$$
\displaystyle D_{KL}(q\|p)=-\sum_{c=1}^{C}q\left(y_{c}\right)\left[\log\left(p\left(y_{c}\right)\right)-\log\left(q\left(y_{c}\right)\right)\right]=H_{p}(q)-H(q)
$$

보다시피, [[cross-entropy]] 값에 [[entropy]] 값을 뺀 것이 KL-Divergence다.
Cross-entropy 값은 entropy 값보다 항상 크므로, KL-Divergence 값은 $0$보다 항상 크다.

## A.1) KL-Divergence 의 의미

예측 분포인 $p$를 실제분포 $q$에 가깝게 하는 것이 예측 모형이 이루고자 하는 것이며, $p$가 $q$에 가까이 갈수록 KL-Divergence 값은 $0$에 가까워질 것이다.

$H(q)$는 고정이기 때문에, $H_p(q)$를 최소화하는 것이 예측 모형을 최적화하는 것이라고 할 수 있다. 따라서 cross-entropy를 최소화하는 것이 KL-Divergence를 최소화하는 것이며, 이것이 불확실성을 제어하고자 하는 예측 모형의 실질적인 목적이라고 볼 수 있다.

## A.2) KL-divergence Properties

$\displaystyle\mathcal{K}\mathcal{L}(q\|p)=\int q(x)\log\frac{q(x)}{p(x)}dx$ 이라고 가정할때 아래를 만족한다.

- $\mathcal{KL}(q\|p)\neq\mathcal{KL}(p\|q)$ 그리고 $\mathcal{K}\mathcal{L}(q\|q)=0$
- $\mathcal{K}\mathcal{L}(q\|p)\geq0$

비대칭이고 삼각부등식도 만족하지 않으므로 엄밀한 의미의 거리(metric)는 아니다. 그래서 "divergence"라고 부른다.

### A.2.1) Proof

$$
-\mathcal{K}\mathcal{L}(q\|p)=\mathbb{E}_{q}\left(-\log\frac{q}{p}\right)=\mathbb{E}_{q}\left(\log\frac{p}{q}\right)\leq\log\left(\mathbb{E}_{q}\frac{p}{q}\right)=\log\int q(x)\frac{p(x)}{q(x)}dx=0
$$

여기서 log 함수는 [[concave function]] 이므로, [[Jensen's inequality]] 에 의해 Expectation sign 이 안으로 들어갈 수 있다. 또한, $\log\int p(x)dx=1$ 이다.

# B) Forward KL vs. Reverse KL

![[kl-forward-reverse.svg]]

비대칭성 때문에 어느 방향을 최소화하느냐에 따라, 학습되는 분포 $Q$의 행동이 달라진다. 목표 분포를 $P$, 우리가 학습하는 분포를 $Q$라 하자. $P$는 봉우리(mode)가 여러 개인데 $Q$는 용량이 부족해 전부 정교하게 표현할 수 없는 상황이 문제의 핵심이다.

## B.1) Forward KL — $D_{KL}(P\|Q)$: mode-covering

$$
D_{KL}(P\|Q)=\mathbb{E}_{x\sim P}\left[\log\frac{P(x)}{Q(x)}\right]
$$

기대값을 $P$ 위에서 취한다. 즉 $P$가 확률을 주는 곳(P>0)에서 $Q(x)\approx 0$이면 $\log\frac{P}{Q}$가 폭발한다. 그래서 $Q$는 $P$의 모든 mode에 조금씩이라도 확률을 발라야 한다 → **mode-covering** (zero-avoiding). 용량이 부족하면 mode 사이의 빈 공간까지 확률이 새어 분포가 뭉개진다(mean-seeking).

MLE(최대우도추정)가 정확히 forward KL 최소화다. 데이터 분포 위에서 모델의 log-likelihood를 평가하기 때문. 유도는 [[#B.4) KL과 MLE의 관계|B.4]] 참고.

## B.2) Reverse KL — $D_{KL}(Q\|P)$: mode-seeking

$$
D_{KL}(Q\|P)=\mathbb{E}_{x\sim Q}\left[\log\frac{Q(x)}{P(x)}\right]
$$

기대값을 $Q$ 위에서 취한다. $Q$가 확률을 주는 곳에 $P(x)\approx 0$이면 벌점이 폭발하고, 반대로 $Q$가 포기한 영역은 아예 채점 대상이 아니다. 그래서 $Q$는 감당되는 가장 확실한 mode 하나에 집중한다 → **mode-seeking** (zero-forcing). "아는 것만 말해라, 대신 틀린 말은 하지 마라."

Variational Inference(VB)가 reverse KL을 쓴다. $Q$에서 샘플링해 계산할 수 있어 intractable한 $P$를 다룰 때 유리하기 때문.

## B.3) JSD — 둘 사이의 절충

Jensen-Shannon Divergence는 두 방향을 대칭으로 섞은 것이다.

$$
JSD(P\|Q)=\tfrac{1}{2}D_{KL}(P\|M)+\tfrac{1}{2}D_{KL}(Q\|M),\quad M=\tfrac{1}{2}(P+Q)
$$

forward만큼 전부 커버하라고 강요하지도, reverse만큼 한 mode로 쏠리지도 않는 중간 성격이다. 항상 유한하고 대칭이라 GAN의 원조 objective로도 쓰였다.

## B.4) KL과 MLE의 관계

MLE는 데이터의 log-likelihood를 최대화하는 파라미터를 찾는다.

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

마지막 근사는 기대값을 데이터 샘플 평균으로 대체한 것(대수의 법칙)이다. 즉 **MLE = 경험 분포에 대한 forward KL 최소화 = [[cross-entropy]] 최소화**로, 셋은 같은 문제다. 분류 학습에서 cross-entropy loss를 쓰는 이유, 그리고 A.1에서 "cross-entropy 최소화가 곧 KL 최소화"라 한 것이 정확히 이 관계다.

따름정리처럼 얻는 직관 두 가지:

- MLE로 학습한 생성 모델은 forward KL의 mode-covering 성질을 물려받는다. 용량이 부족하면 mode 사이에 확률을 흘려 흐릿한(blurry) 샘플을 만든다 — VAE 샘플이 뿌연 이유 중 하나.
- 반대로 MLE는 데이터가 있는 곳을 절대 버리지 못하므로, 데이터 커버리지가 중요한 언어 모델 사전학습(next-token prediction도 cross-entropy = forward KL)과 잘 맞는다.

# C) LLM 학습에서의 KL

- **지식 증류**: supervised KD는 forward KL로 교사 분포를 흉내 낸다. [[GKD]]는 작은 학생이 교사의 모든 mode를 커버하다 분포가 뭉개지는 문제를 지적하며, 학생 생성문 위에서 reverse KL이나 JSD를 쓰는 선택지를 연다. 작은 모델일수록 mode-seeking이 유리한 경우가 많다.
- **RLHF의 KL penalty**: [[RLHF]]에서 policy가 reference 모델에서 너무 멀어지지 않게 거는 페널티 $D_{KL}(\pi\|\pi_{ref})$는 reverse KL이다. 그래서 RLHF 모델이 다양성을 잃고 특정 스타일로 쏠리는 mode collapse가 생기는 것도 같은 원리다.
- **[[KL annealing]]**: VAE 학습에서 KL 항의 가중치를 서서히 올려 posterior collapse를 막는 테크닉.

# D) Related

[[Kolmogorov-Smirnov|KS]] 방식은 두 [[Cumulative Distribution Function|CDF]] 의 차이를 계산한다.

# E) References

- https://timvieira.github.io/blog/post/2014/10/06/kl-divergence-as-an-objective-function/
- https://blog.evjang.com/2016/08/variational-bayes.html — Forward/Reverse KL 시각화
- Agarwal et al., 2023, GKD — 증류에서의 divergence 선택
