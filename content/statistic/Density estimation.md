---
title: "Density estimation"
tags: ["probability_distribution", "statistic"]
---

# A) 밀도 추정(Density Estimation)

밀도 추정이란, 유한한 개수의 관측값 $\mathbf{x_1}, \cdots, \mathbf{x_N}$ 이 주어졌을 때, 확률변수 $\mathbf{x}$의 확률분포 $p(\mathbf{x})$를 모델링하는 것을 의미한다.

- [[Frequentist]] 접근법
  특정 기준(예: 최대우도추정, MLE)에 따라 **하나의 파라미터 값**을 선택한다.

- [[Bayesian]] 접근법
  파라미터에 대해 [[prior]] 분포를 설정하고, 관측된 데이터를 바탕으로 [[Bayes theorem]]을 이용해 [[posterior]] 분포를 계산한다.

---

# B) 관련 개념

- 비모수(nonparametric) 밀도 추정 방법 또한 존재한다.
- 이 경우, 모델의 형태 그 자체보다는 **모델 복잡도를 조절하는 파라미터**가 중요한 역할을 한다.

---

# C) 참고 문헌

- *Pattern Recognition and Machine Learning - Probability Distribution*
