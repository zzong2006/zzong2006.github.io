---
title: "self-attention"
tags: ["NLP"]
aliases: ["self attention", "셀프 어텐션"]
---

# A) Self-attention 이란 ?

셀프 어텐션은 [[transformer]] 에서 나오는 [[attention function|attention]] 기법으로, attention 의 입력으로 들어가는 세개의 값 Q, K, V 이 모두 동일하다.

Q, K, V 은 입력 문장에 대한 모든 단어의 벡터들로 구성되는데, weight matrix 를 통해 계산된다. 해당 벡터의 차원 수는 transformer 논문 ([[Attention Is All You Need]]) 에서 언급되는데, 인코더의 초기 입력 차원인 $d_{\text {model }}$ `d` 에 head 값 `num_heads` 를 나눈 값이다 (`d / num_heads`).

![|500](https://i.imgur.com/GyzSC1W.png)

# B) 예시

![|340](https://i.imgur.com/r2CvmXa.png)

예시 문장을 번역하면 ‘ 그 동물은 길을 건너지 않았다. 왜냐하면 그것은 너무 피곤하였기 때문이다.’ 라는 의미가 됩니다. 그런데 여기서 그것 (it) 에 해당하는 것은 과연 길 (street) 일까요? 동물 (animal) 일까?
셀프 어텐션은 입력 문장 내의 단어들끼리 유사도를 구하므로서 그것 (it) 이 동물 (animal) 과 연관되었을 확률이 높다는 것을 찾아낸다.

# C) References

* https://wikidocs.net/31379
