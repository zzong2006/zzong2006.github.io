---
tags: ["recommendation_system", "bias", "evaluation"]
aliases: ["exposure bias"]
---

# A) Exposure Bias ?

Exposure bias 는 사용자가 모든 item 을 본 것이 아니라, 노출된 item 에 대해서만 feedback 을 남긴다는 데서 생기는 bias 다. 특히 implicit feedback 에서는 관측되지 않은 item 을 negative 로 단순 처리하면 실제로 싫어한 것인지, 그냥 노출되지 않은 것인지 구분하기 어렵다.

# B) 왜 중요한가

추천 모델은 노출된 item 중심의 데이터로 학습한다. 기존 시스템이 인기 item 을 더 많이 노출했다면, 모델은 다시 인기 item 을 더 선호하도록 학습되어 feedback loop 가 강화될 수 있다.

# C) 대응 방향

Propensity score, randomized exposure, counterfactual evaluation, debiased learning-to-rank 같은 방법을 고려한다. 실무에서는 offline metric 과 online A/B test 간 괴리가 exposure bias 때문에 생기는지 자주 확인해야 한다.

# D) Related

* [[inverse propensity score]]
* [[popularity bias]]
* [[position bias]]

