---
tags: ["machine_learning", "classification", "probabilistic_model"]
aliases: ["Naive Bayes Classifier"]
---

# A) Naive Bayes

Naive Bayes는 feature들이 class 조건부로 서로 독립이라고 가정하는 probabilistic classifier다. 이 가정은 현실에서는 강하지만, text classification처럼 sparse한 feature가 많은 문제에서는 단순한 baseline으로 꽤 강하게 동작한다.

# B) 핵심 식

class $y$와 feature vector $x=(x_1,\dots,x_d)$가 있을 때:

$$
P(y \mid x) \propto P(y)\prod_i P(x_i \mid y)
$$

여기서 “naive”는 각 feature $x_i$가 class $y$가 주어졌을 때 독립이라고 보는 부분이다.

# C) 언제 유용한가

학습과 추론이 빠르고, 데이터가 많지 않아도 baseline을 만들기 쉽다. 다만 feature 간 상관관계가 중요한 문제에서는 [[logistic regression]]이나 tree-based model보다 표현력이 부족할 수 있다.

# References
