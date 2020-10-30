---
layout: default
title:  "Energy-Based Learning"
category: Machine Learning
order: 19
---

통계 모델과 기계 학습의 목적은 두 변수 간 의존성을 찾아내는 것이다. 찾아낸 의존성을 이용해서 모델들은 알려지지 않은(unknown) 변수들의 질문에 관련된 대답을 할 수 있다.

에너지 기반 모델(Energy-Based Models, EBMs)은 스칼라 형태인 에너지(energy)라는 것을 이용해 이러한 의존성을 찾아낸다. 

EBM에게 학습이란, 에너지 함수(energy function)를 찾아내는 것이다.

* 이 에너지 함수라는 것은 올바른 학습 방향으로 나아갈 때만 에너지가 최소가 되고, 이외에는 에너지가 최대가 되는 함수를 뜻한다.

손실 함수(loss function)는 학습 과정에서 에너지 함수에 대한 질을 측정하는 역할을 한다.

아래의 그림은 EMBs의 예시다. 해당 모델은 관측 가능한 변수 $X$를 입력으로 받고, 에너지 함수 $E(Y, X)$를 최소화 하는 변수 $Y$ 를 출력하도록 학습한다.

<img src="https://i.loli.net/2020/10/29/QKUCxB9R37s5A6z.png" alt="image-20201029230712822" style="zoom: 80%;" />

EBM은 다양한 application으로 사용할 수 있다. 

![image-20201030011732886](https://i.loli.net/2020/10/30/rNc2PS9WsFHuwjm.png)

* (a) 얼굴 인식 (b) 얼굴 detection (c) image segmentation(이미지 단순화) 등

에너지 모델은 주어진 $X$에 대하여, 에너지 모델 함수 $E(Y,X)$가 가장 최소가 되는 최적의 $Y$, 즉, $Y^*$을 $\mathcal{Y}$에서 선택한다.

$$
Y^{*}=\operatorname{argmin}_{Y \in \mathcal{Y}} E(Y, X)
$$

*  $Y$는 집합 $\mathcal{Y}$ 에 속한 변수다. 만약, $\mathcal{Y}$가 작다면, 가능한 모든 $E(Y,X)$ 를 구하고, 그 중 가장 작은것을 선택하면 된다.
* 예를 들어, 위 그림의 경우 (a)에서 $\mathcal{Y}$은 사람 이름이 될 수 있겠다.

대부분의 경우 에너지 모델 함수를 위한 완벽한 $Y$를 찾는 것은 불가능하다. 그래서 근사 해답을 찾게 된다.

## Decision Making tasks

Decision making 문제 해결 모델은 주어진 $X$와 가장 적합한(compatible) $Y$를 찾는 것이다. 

가장 쉬운 방법은 Gibbs 분포를 이용하는 것이다.

$$
P(Y \mid X)=\frac{e^{-\beta E(Y, X)}}{\int_{y \in \mathcal{Y}} e^{-\beta E(y, X)}}
$$

* $\beta$는 임의의 양수 값을 의미하고, 분모는 partition function으로 부른다.

