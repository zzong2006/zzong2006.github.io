---
title: "Multilayer Perceptron"
aliases: ["MLP", "MLPs", "multilayer perceptrons", "다층 퍼셉트론", "FFDNN"]
tags:
  - deep_learning
  - machine_learning
---

# A) Multilayer Perceptron ?

[[perceptron]] 으로 이루어진 층 (layer) 여러 개를 순차적으로 붙여놓은 구조다. 입력층, 하나 이상의 hidden layer, 출력층으로 이루어지고, 신호가 입력에서 출력 방향으로만 흐르기 때문에 feed-forward neural network 또는 FFDNN (feed-forward deep neural network) 라고도 부른다. [[neural network]] 라고 할 때 기본형으로 떠올리는 것이 이 구조다.

각 층은 앞 층의 출력에 weight matrix 를 곱하고 bias 를 더한 뒤 [[activation function]] 을 통과시킨다. 층이 $L$ 개라면 다음을 반복한다.

$$
h^{(l)} = \sigma\left(W^{(l)} h^{(l-1)} + b^{(l)}\right)
$$

여기서 $h^{(0)}=x$ 가 입력, $\sigma$ 가 activation function, $W^{(l)}$ 과 $b^{(l)}$ 이 $l$ 번째 층의 학습 대상 파라미터다.

# B) 왜 층을 쌓는가

단일 perceptron 은 입력 공간을 직선 하나로 가르는 것밖에 못 한다. XOR 처럼 직선 하나로 나눌 수 없는 문제는 풀지 못한다.

층을 쌓고 그 사이에 비선형 activation function 을 넣으면 이 제약이 사라진다. hidden layer 가 입력을 다른 공간으로 옮겨놓고, 그 공간에서 출력층이 선형 분리를 하는 셈이다. activation function 이 없다면 층을 몇 개 쌓아도 행렬 곱의 합성이라 결국 하나의 선형 변환으로 접히기 때문에, 비선형성이 층을 쌓는 조건이다.

학습은 [[backpropagation]] 으로 각 층의 gradient 를 구해 [[gradient descent]] 계열 optimizer 로 파라미터를 갱신한다.

# C) 다른 구조와의 관계

MLP 는 입력의 모든 원소를 다음 층의 모든 유닛에 연결하기 때문에 fully-connected layer 라고도 불린다. 입력에 공간적·시간적 구조가 있으면 이 방식은 비효율적이다. 이미지는 [[Convolution Neural Network|CNN]] 이 국소 패턴을 공유 weight 로 처리하고, 순차 데이터는 [[Recurrent Neural Network|RNN]] 이나 [[transformer]] 가 담당한다.

그렇다고 MLP 가 밀려난 것은 아니다. transformer 의 각 블록에도 attention 뒤에 feed-forward 층이 붙어 있고, 그것이 곧 MLP 다.

# References

* [Neural Networks and Deep Learning, Chapter 1](http://neuralnetworksanddeeplearning.com/chap1.html)
