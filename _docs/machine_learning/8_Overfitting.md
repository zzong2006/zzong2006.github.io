---
layout: default
title:  "Overfitting"
category: Machine Learning
order: 7
---

## Overfitting

* 알고리즘이 high variance인 경우에는 큰 dataset이 도움이 된다.  
* 그러나 high bias인 경우에는 데이터를 추가하는 것이 아무 도움을 주지 않는다.

## Bias and Variance

![img](https://t1.daumcdn.net/cfile/tistory/261FE83B562DFB681E)

#### Bias

* **Bias**는 데이터 내에 있는 모든 정보를 고려하지 않음으로 인해, 지속적으로 잘못된 것들을 학습하는 경향을 말한다. High Bias는 underfitting 이라고도 한다.
* 어떤 모델을 학습시켰을 경우, 그 모델이 예측한 값과 실제 정답이 얼마나 멀리있는지를 나타내는가 생각해보면 된다. 너무 멀리있으면(오답이 크면) high bias, 가까이 있으면(예측이 정확하면) low bias 이다.

#### Variance

* **Variance**는 데이터 내에 있는 에러나 노이즈까지 잘 잡아내는 highly flexible models 에 데이터를 fitting시킴으로써, 실제 현상과 관계 없는 random한 것들까지 학습하는 알고리즘의 경향을 의미한다. High Variance는 overfitting 이라고도 한다.
* 여러 모델로 학습을 반복한다고 했을 때, 학습된 각 모델별로 예측한 값들의 차이를 variance라고 생각할 수 있다. 만약, 모델 마다 예측한 값들이 서로 크게 다르다면, 특정 데이터에 대해서만 반복적으로 학습된 것이다(overfitting, high variance). 그러나, 모델 마다 예측한 값이 크게 다르지 않다면, 전반적인 데이터에 대한 학습이 잘 되었다고 생각할 수 있다(low variance).





### 2차원 데이터를 이용한 Bias와 Variance의 설명

![image-20201028202552847](https://i.loli.net/2020/10/28/Eldq6j7gMTG4rKs.png)

고차원 데이터의 경우 어떻게 model의 variance와 bias를 판별할 수 있을까?



### 다차원 데이터의 경우 Bias와 Variance

고양이 사진을 구분하는 문제가 있다고 가정하자. 사람은 쉽게 구별할 수 있으므로 base error 가 거의 0%라 가정하겠다.

이때, train set error(TE)와 dev set error(DE)를 보고 bias와 variance를 구별할 수 있다.

1. TE: 1%, DE: 11% 의 경우: High Variance다. 왜냐하면 학습의 경우는 base error와 가깝지만, DE에서 높은 값이 나와 TE와 편차가 심하기 때문이다.
2. TE: 15%, DE: 16% 의 경우: High Bias다. 왜냐하면 TE가 base error보다 훨씬 높은 에러율을 보였기 때문이다. 하지만 DE와 TE의 편차가 심하지 않으므로, high variance는 아니다. 
3. TE: 15%, DE: 30% 의 경우: High Bias & High Variance다. TE가 base error보다 훨씬 높고, TE와 DE의 편차가 심하다.
4. TE: 1%, DE: 2% 의 경우: Low Bias & Low Variance다. TE가 base error와 유사하고, TE와 DE의 편차가 심하지 않다.

만약, 사람도 쉽게 구분하지 못하는 문제가 존재한다면(희미한 고양이 사진 구분), base error는 높아질 것이고, 그에 따른 model의 평가도 달라질 것이다.

## Reference

* [티스토리 블로그 bywords]( https://bywords.tistory.com/entry/)

