---
layout: post
title: ML Recap - Beta Distribution 
date: 2025-01-19 23:00:00
giscus_comments: true
categories: ml-fundamentals
toc:
  beginning: true
tags: machine-learning probability WIP
---

확률 내용이긴 하지만, ML 에서도 자주 사용되는 beta distribution 에 대해서 정리해보자.

---

베타 분포는 확률의 분포를 나타내는 것으로 이해할 수 있다. 즉, 우리가 어떤 확률이 무엇인지 모를 때 그 확률의 모든 가능한 값을 나타낸다.

> The Beta distribution is best for representing **a probabilistic distribution of probabilities**: the case where we don't know what a probability is in advance, but we have some reasonable guesses.

예를 들어 어떤 야구 선수의 타율에 대해서 베타 분포를 사용할 수 있다. 평균 타율이 0.26 정도이고, 0.21 과 0.35 사이에 타율이 분포(prior)하고 있는 야구선수에 대해서 Beta 분포로 표현하자면 $\alpha = 81, \beta = 219$ 로 아래와 같이 모델링할 수 있다.

![Image](https://i.imgur.com/9V5Lg8o.png){: width="50%"}

베타 분포 밀도 그래프에서 x축은 선수의 타율을 나타낸다. 따라서 이 그래프에서 y축이 확률(또는 더 정확히는 probability density)일 뿐만 아니라 x축도 확률이다 (타율은 결국 안타의 확률이다).

참고로 베타 분포의 평균은 $\alpha / (\alpha + \beta)$ 이다.

베타 분포가 유용한 이유는 새로운 피드백에 대한 반영이 간단하다는 점이다. 예를 들어, 위의 선수가 300 번 나가서 100번 안타를 쳤다고 가정해보자. 이러한 정보를 반영하기 위해서 아래와 같은 수식을 활용할 수 있다.

$$
\text{Beta}(\alpha_0+\text{hits}, \beta_0+\text{misses})
$$

여기서 $\alpha_0$ 와 $\beta_0$ 는 초기 베타 분포의 파라미터이다. 위 안타 사례에 의하면 alpha 쪽은 100, beta 쪽은 200 (300 - 100) 을 증가시키면 된다.

![Image](https://i.imgur.com/DJdG0wJ.png){: width="50%"}

선수의 타율에 대해 더 잘 알게 되었으므로, 이제 곡선이 더 얇아지고 오른쪽으로 이동했다(더 높은 타율).

## compared to the binomial distribution

binomial distribution, with $s$ success and $f$ failures out of a total of $(s+f)$ trials.

$$
P(s, f \vert \theta) = \binom{s + f}{s} \theta^s (1 - \theta)^f \tag{2}
$$

Thompson Sampling은 불확실성을 모델링하기 위해 과거 보상 데이터를 기반으로 확률 분포를 생성하고, 행동을 선택할 때 이 분포에서 샘플링하는 방법입니다. 보상이 이진(binary)인 간단한 경우에는 Beta 분포가 사용됩니다. Beta 분포는 두 개의 파라미터 α와 β를 가지며, 분포의 평균값은 α/α + β로 계산됩니다. 이는 성공 횟수 / (성공 횟수 + 실패 횟수)로 이해할 수 있습니다. 행동을 선택하기 위해 각 팔(arm)의 Beta 분포에서 샘플링을 수행하고, 가장 높은 샘플 값을 가진 팔을 선택합니다.

## Beta 분포의 활용

Thompson Sampling의 예로 Doordash의 요리 추천을 위한 밴딧(bandit) 시스템을 들 수 있습니다. 사용자의 특정 요리에 대한 선호도는 Beta(α=해당 요리 주문 횟수, β=다른 요리 주문 횟수)로 모델링됩니다. 탐색 페이지에서 보여줄 요리 필터를 선택할 때, 각 요리의 값은 해당 요리의 Beta 분포에서 샘플링됩니다. 그런 다음 이 값들을 내림차순으로 정렬하여 상위 요리들을 선택해 표시합니다.

Doordash는 상위 레벨의 지역 데이터를 활용하여 요리 밴딧을 초기화(warm-start)하는 방법을 공유했습니다. 각 요리에 대해 여러 레벨(예: 지역, 하위 지역, 사용자)에서 밴딧 정책을 학습합니다. 최상위 레벨 밴딧은 Beta(α=1, β=1)로 초기화됩니다. 그런 다음, 하위 레벨 밴딧마다 α는 해당 레벨에서 요리의 평균 주문 횟수를 더해 업데이트하고, β는 해당 레벨에서 다른 요리의 평균 주문 횟수를 더해 업데이트합니다. 마지막으로 사용자 레벨 밴딧에서는 α와 β가 사용자의 주문 데이터를 통해 업데이트됩니다. 결과적으로, 새로운 사용자의 요리 밴딧은 상위 레벨의 마켓플레이스 데이터를 기반으로 초기화되며, 이후 각 새로운 주문이 사용자의 개인 선호도를 반영하여 밴딧을 업데이트합니다.

Reference: [Carousel Personalization in Music Streaming Apps with Contextual Bandits](https://arxiv.org/abs/2009.06546)

---

when feedback is delayed, Thompson Sampling outperforms UCB. Delayed feedback, where user-item interactions are not processed immediately, is common for most real-world systems due to resource and run-time constraints. In this situation, because UCB selects arms deterministically, it chooses the same action until new feedback is incorporated. In contrast, because Thompson Sampling chooses actions stochastically by sampling from the posterior distribution, it randomizes over actions even without updated rewards. Yahoo’s evaluation of Thompson Sampling and Deezer’s music bandit observed that this led to wider exploration and thus better outcomes.

The initialization strategy is important.

- Naive initialization:  the prior was Beta(1, 1).
- Pessimistic initialization: the prior was Beta(1, 99)

That pessimistic initialization performed better due to the lower prior probabilities which were more reflective of real-world reward.

## References

- [Beta distribution (wikipedia)](https://en.wikipedia.org/wiki/Beta_distribution)
- [Bandits](https://applyingml.com/resources/bandits/)
- [What is the intuition behind beta distribution?](https://stats.stackexchange.com/questions/47771/what-is-the-intuition-behind-beta-distribution/47782#47782)