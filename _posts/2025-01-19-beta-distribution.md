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

![beta distribution](https://i.sstatic.net/RJDrz.png){: width="50%"}

베타 분포 밀도 그래프에서 x축은 선수의 타율을 나타낸다. 따라서 이 그래프에서 y축이 확률(또는 더 정확히는 probability density)일 뿐만 아니라 x축도 확률이다 (타율은 결국 안타의 확률이다).

참고로 베타 분포의 평균은 $\alpha / (\alpha + \beta)$ 이다.

베타 분포가 유용한 이유는 새로운 피드백에 대한 반영이 간단하다는 점이다. 예를 들어, 위의 선수가 300 번 나가서 100번 안타를 쳤다고 가정해보자. 이러한 정보를 반영하기 위해서 아래와 같은 수식을 활용할 수 있다.

$$
\mbox{Beta}(\alpha_0+\mbox{hits}, \beta_0+\mbox{misses})
$$

여기서 $\alpha_0$ 와 $\beta_0$ 는 초기 베타 분포의 파라미터이다. 위 안타 사례에 의하면 alpha 쪽은 100, beta 쪽은 200 (300 - 100) 을 증가시키면 된다.

![beta distribution](https://i.sstatic.net/oBgYH.png){: width="50%"}

선수의 타율에 대해 더 잘 알게 되었으므로, 이제 곡선이 더 얇아지고 오른쪽으로 이동했다(더 높은 타율).

## compared to the binomial distribution

binomial distribution, with $s$ success and $f$ failures out of a total of $(s+f)$ trials.

$$
P(s, f \vert \theta) = \binom{s + f}{s} \theta^s (1 - \theta)^f \tag{2}
$$

Thomson Sampling models uncertainty by building a probability distribution from historical rewards and then samples from the distribution when choosing actions. In the simple case where rewards are binary, a Beta distribution is used. The Beta distribution takes two parameters, α and β, and the mean value of the distribution is α/α + β which can be thought of as successes / successes + failures. To select an action, we sample from each arm’s Beta distribution and choose the arm with the highest sampled values.

## Usage of the Beta Distribution

An example of Thompson Sampling is Doordash’s bandits for cuisine recommendations. User preferences for a cuisine is modeled via Beta(α=number of orders of the cuisine, β=number of orders of other cuisines). When selecting a set of cuisine filters to show on the explore page, the value for each cuisine is sampled from the cuisine’s Beta distribution. These values are then sorted in descending order to select the top cuisines to display.

Doordash shared how they warm-start their cuisine bandits via higher-level regional data. For each cuisine, they learn a bandit policy at multiple levels (i.e., regional, subregional, user). The top-level bandit is initialized at Beta(α=1, β=1). Then, for each lower-level bandit, they update α by adding the average number of orders for the cuisine (at that level) and update β by adding the average number of orders for other cuisines (at that level). Finally, for the user-level bandit, α and β are updated with the user’s order data. As a result, a new user’s cuisine bandit is warm-started with higher-level marketplace data before each new order updates the bandit with their personal preferences.

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