---
tags: ["ensemble"]
aliases: ["Adaptive Boosting"]
---

# A) AdaBoost ?

AdaBoot 는 1996 년에 처음 제안된 [[boosting]] 알고리즘이다. 이 알고리즘은 [[classification]] 문제를 해결하는데 초점이 맞춰졌으며, 여러 weak 분류기를 strong 분류기 하나로 변환하는 작업에 목적을 둔다.

AdaBoost 는 [[Gradient Boosting Machine|GBM]] 의 조상격 알고리즘이다. 실제로는 AdaBoost 은 GBM 의 variation 에 불과하다.

# B) 알고리즘

AdaBoost 는 [[greedy algorithm|greedy]] 한 접근 방식을 사용한다.

## B.1) Visualization (example)

간단한 분류 문제를 생각해보자. 분류 문제를 해결하기 위해 (stump 라 불리는) 깊이가 1 인 tree 를 이용한다고 가정하자.

아래와 같이 stump 들은 올바르게 데이터를 분류할 수 없다. 분류가 잘못된 데이터 포인트들은 가중치를 높게 받는다.

![|300](https://i.imgur.com/mWUbsew.png)

hws 각 stump 들의 weighted vote 를 기반으로 올바른 분류를 수행할 수 있다.

![|300](https://i.imgur.com/GV2VxgT.png)

# C) 평가

AdaBoost 는 잘 동작하지만 왜 잘 동작하는지 설명하기는 어렵다. 일부는 silver bullet 으로 이해하지만, 단순히 [[overfitting]] 되었다는 평가도 많다.

특히 데이터의 [[outlier]] 가 많은 경우에 overfitting 문제에 더 취약하다. 이런 약점에 대응하기 위해 AdaBoost 대신 GBM 을 사용할 수 있다.

# D) Related

# E) References

* https://mlcourse.ai/book/topic10/topic10_gradient_boosting.html#topic10
