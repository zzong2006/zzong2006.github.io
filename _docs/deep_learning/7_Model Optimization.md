---
layout: default
title:  "Model Optimization"
category: Deep Learning
order: 7
---

모델을 최적화하기 위해서 고려해야할 몇가지 사항들이 존재한다. 

데이터셋의 분배, 그리고 모델의 bias와 variance에 대한 대처 등..

## Train/Dev/Test sets 

모델을 학습시킬 때, 일반적으로 training, dev(cross validation), test set으로 데이터를 나눠서 학습하게 된다.

예전에는 이 세 sets의 비율을 60/20/20% 정도로 나누는게 일반적이었지만, 요즘에는 추세가 바뀌어서 **98/1/1%**의 비율로 학습시킨다(심하면 99.5/0.4/0.1% 정도).

* 그 이유는 training examples을 제외한 나머지는 모델을 테스트하는 정도만 있으면 충분하다고 여기기 때문이다.
* 하지만, 위의 극단적 비율은 빅데이터의 경우(백만 이상)이고, 데이터의 개수가 적으면 이전의 비율도 괜찮다.

## Mismatched train/test distribution

학습 데이터와 dev/test sets이 다른 데이터 분포를 가지도록 학습하는 경향이 증가하고 있다.

* 예) 학습 데이터: 웹페이지에서 얻어온 사진 (나름 깔끔함) / Dev/Test 데이터: 사용자들이 직접 찍은 사진 (blur, 흔들림 등등)
* 중요한 점은 dev와 test는 동일한 분포에서 테스트를 진행해야 된다는 점이다.
  * 왜냐면 학습된 모델을 dev를 통해 평가하므로, 최종 모델이 test에 좋은 성능을 내기 위해서는 분포가 동일한게 좋다.

## Basic recipe for machine learning

Bias와 Variance를 통해 모델을 최적화 하는 방법은 다음과 같다.

1. 우선 모델의 bias가 높은지 확인하자. 너무 높다면 다음과 같은 전략을 시도해볼 수 있다.
   * Bigger Network
   * Train Longer
   * NN architecture search (또 다른 신경망 구조를 탐색 및 시도)
2. bias가 충분히 낮게 잡혔다면, 이제는 variance가 높은지 확인하자. 너무 높다면 다음과 같은 전략을 시도해볼 수 있다.
   * More Data
   * Regularization / Dropout / Data Augment / Early Stopping
   * NN architecture search 
3. 만약 variance를 낮추다가 다시 bias가 높아지면, (1)로 돌아간다. bias와 variance가 둘 다 낮다면, 최적화를 마친다.

예전에는 Bias와 Variance가 trade-off 관계라 여겼다, 하지만 요즘에는 대규모 신경망과 대용량 데이터가 가능한 시대기 때문에, 가능하면 둘 다 잡을 수 있다.



## Normalization

데이터를 normalize하는 것은 학습의 속도를 빠르게 한다. 

대표적인 normalize 방법은 데이터 차원 간 평균을 0으로 만들고, 분산을 1로 만드는 것이다.