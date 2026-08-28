---
title: "Hidden Markov Model"
tags: ["statistics", "machine_learning", "graphical_model"]
aliases: ["HMM"]
---

# A) Hidden Markov Model

Hidden Markov Model(HMM)은 관측되지 않는 latent state가 Markov chain으로 변하고, 각 state가 관측값을 생성한다고 보는 probabilistic model이다. sequence data에서 “겉으로 보이는 신호”와 “그 뒤의 숨은 상태”를 나눠 모델링할 때 사용한다.

# B) 구성

| 구성 | 의미 |
| --- | --- |
| Initial distribution | 첫 hidden state의 확률 |
| Transition probability | 이전 hidden state에서 다음 hidden state로 이동할 확률 |
| Emission probability | hidden state가 관측값을 생성할 확률 |

# C) 어디에 쓰나

음성 인식, 품사 태깅, user state modeling, 추천 session modeling 같은 sequence 문제에 쓰였다. Deep learning 이후에는 RNN/Transformer가 많은 영역을 대체했지만, HMM은 probabilistic sequence model의 기본 구조를 이해하는 데 여전히 좋다.

# References
