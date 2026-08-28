---
title: "knowledge distillation"
tags: ["machine_learning"]
---

# 1. Knowledge Distillation ?

큰 교사 모델이 가진 지식을 작은 학생 모델로 옮겨 경량화하는 방식이다. 정답 label만 쓰는 대신, 교사가 각 클래스에 매긴 확률분포(soft target)까지 학생이 맞추게 한다. "정답은 고양이"보다 "고양이 0.7, 스라소니 0.25, 자동차 0.001"이 클래스 간 유사도까지 담고 있어서 정보량이 훨씬 크다.

![|700](https://i.imgur.com/C2w3Xqr.png)

# 2. 언어모델에서의 갈래

Autoregressive LM에서는 학생이 자기 출력을 다시 입력으로 먹기 때문에 "어떤 문장 위에서 교사를 흉내 낼 것인가"가 추가 변수로 붙는다. 교사가 만든 고정 데이터 위에서 배우면 off-policy, 학생이 직접 생성한 문장 위에서 배우면 on-policy이며, 둘의 차이와 실무 비용은 [[on-policy distillation]] 에 정리해뒀다. 데이터 비율과 발산 함수를 손잡이로 놓고 두 극단을 하나로 묶은 알고리즘이 [[GKD]] 다.

# 3. References

* Hinton et al., 2015, "Distilling the Knowledge in a Neural Network"
