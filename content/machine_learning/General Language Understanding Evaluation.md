---
tags: ["NLP"]
aliases: ["GLUE"]
---

# General Language Understanding Evaluation ?

NLP 모델에 대한 일반적인 언어의 “이해”를 측정하기 위한 평가 방식으로, 9 개의 Tasks 들에 대한 점수의 평균을 구하는 것으로 모델을 평가한다.

아래는 GLUE 점수를 구하는 것을 시각화한 것이다.

![|500](https://i.imgur.com/wGD0xd2.png)

# 왜 GLUE 가 만들어 졌는가?

과거에는 NLP 모델이 하나의 특정 task 에만 잘 동작하도록 디자인되었다. 그리고 학습도 [[end-to-end]] 방식으로 진행되었다. 그래서 일반적으로 대부분의 작업을 골고루 잘하기는 어려웠다.

하나의 작업에 특화된 모델을 만들었으니 당연히 평가도 그 작업에 대한 평가만 진행하면 되었다.

> Is the NER model good at NER?

그런데 사람들이 [[transfer learning]] 을 nlp 분야에서 성공시키고 새로운 평가 방식이 필요해졌다.

> How do researchers evaluate the quality of these transfer learning models against one another?

# References

* [GLUE Explained: Understanding BERT Through Benchmarks · Chris McCormick](https://mccormickml.com/2019/11/05/GLUE/)
