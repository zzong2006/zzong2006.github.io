---
title: "AlexNet"
tags:
  - CNN
  - image
  - deep_learning
aliases: []
---

# A) AlexNet ?

2012년 ImageNet 대회에서 2위를 큰 차이로 앞지르며 우승한 [[Convolution Neural Network]] 다. Krizhevsky, Sutskever, Hinton 이 만들었고, 이 결과가 딥러닝이 컴퓨터 비전의 주류로 넘어가는 계기가 됐다.

top-5 오류율이 26% 대에서 15% 대로 떨어졌는데, 그 전까지 대회에서 한 해에 몇 퍼센트씩 개선되던 것과 견주면 이례적인 폭이었다.

# B) 구조

[[convolution]] 층 5개와 fully connected 층 3개로 이루어져 있다. 첫 층은 $11\times11$ 필터에 [[stride]] 4 로 시작해 입력을 빠르게 줄이고, 뒤로 갈수록 필터를 작게($5\times5$, $3\times3$) 쓴다.

지금 기준으로는 얕지만, 당시 흔하던 신경망보다 훨씬 깊었다.

# C) 무엇을 새로 넣었나

**ReLU** — 그때까지 표준이던 sigmoid, tanh 대신 $\max(0, x)$ 를 썼다. 양수 구간에서 미분이 1 이라 gradient 가 층을 지나며 줄어들지 않고, 계산도 싸다. 논문은 같은 오류율에 도달하는 속도가 몇 배 빨랐다고 보고했다.

**GPU 2장에 나눠 학습** — 당시 GPU 메모리가 3GB 라 모델이 한 장에 안 들어갔다. 채널을 절반씩 두 GPU 에 나누고 특정 층에서만 서로 교환하는 방식으로 학습했다. 지금의 model parallelism 과 같은 발상이다.

**dropout** — fully connected 층에서 학습마다 뉴런 일부를 무작위로 꺼서 과적합을 줄였다.

**data augmentation** — 이미지를 자르고 좌우로 뒤집고 색을 흔들어 학습 데이터를 늘렸다.

# D) 남긴 것

개별 기법 상당수는 이전에도 있었지만, 큰 데이터셋과 GPU 학습에 이것들을 한꺼번에 얹어 결과로 보였다는 점이 컸다. 이후 VGG, GoogLeNet, ResNet 으로 이어지며 층은 더 깊어지고 필터는 더 작아지는 방향으로 정리됐다.

# E) References

* [ImageNet Classification with Deep Convolutional Neural Networks (NeurIPS 2012)](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks)
