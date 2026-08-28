---
title: "UCB"
tags: ["MAB", "reinforcement_learning"]
---

# A) UCB란?

UCB(Upper Confidence Bound) 알고리즘은 각 팔(arm)의 현재까지의 평균 보상(mean reward)을 추적하면서, 동시에 각 arm 에 대한 상위 신뢰 구간(upper confidence bound, UCB)을 계산합니다.

여기서 상위 신뢰 구간은 해당 arm 의 잠재력 평가에 대한 불확실성을 나타냅니다.

$$
A_{t} \triangleq \arg \max _{a}\left[Q_{t}(a)+c \sqrt{\frac{\ln t}{N_{t}(a)}}\right]
$$

이때, 어떤 팔의 상위 신뢰 구간이 매우 높다면, 이는 해당 팔의 잠재력에 대해 우리가 *매우* 확신이 없다는 뜻입니다. 따라서 UCB 알고리즘은 높은 탐험(exploration) 기회를 제공하는 이러한 팔을 선택하게 됩니다.

하지만 UCB 알고리즘은 사용자의 과거 활동이나 인구 통계 정보와 같은 사용자 및 콘텐츠 특성(context)을 고려하지 않습니다.

# B) 관련 내용

[[A Contextual-Bandit Approach to Personalized News Article Recommendation|LinUCB]]

# C) 참고 문헌
