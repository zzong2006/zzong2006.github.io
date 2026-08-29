---
title: "Pyro"
tags:
  - python
  - statistic
  - library
  - PyTorch
  - bayesian_inference
aliases: []
---

# A) Pyro ?

Pyro 는 Python 과 PyTorch 위에 구축된 확률적 프로그래밍 언어입니다.

Pyro 프로그램은 기본적으로 Python 프로그램이며, 주요 추론 기술로 [[Stochastic Variational Inference]] 를 사용합니다. 이 기술은 추상적인 확률 계산을 구체적인 최적화 문제로 변환하여 PyTorch 에서 stochastic gradient descent 로 해결합니다. 이를 통해 이전에는 다루기 어려웠던 모델과 데이터셋 크기에 확률적 방법을 적용할 수 있게 됩니다.

# B) References

* https://pyro.ai/examples/intro_long.html#Introduction-to-Pyro
