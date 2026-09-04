---
title: "convolution"
aliases: ["합성곱"]
tags:
  - deep_learning
---

# A) Convolution ?

작은 크기의 filter (kernel) 를 입력 위에서 한 칸씩 옮겨가며, 겹치는 부분끼리 곱해서 더하는 연산이다. 그 결과로 나오는 값들을 모은 것이 feature map 이다.

이미지에 쓰는 2차원 convolution 을 예로 들면, $3\times3$ filter 는 매 위치에서 픽셀 9개와 filter 값 9개를 각각 곱해 합친 값 하나를 내놓는다. filter 를 이미지 전체에 훑어 지나가면 feature map 한 장이 만들어진다.

$$
(I * K)(i,j) = \sum_{m}\sum_{n} I(i+m,\ j+n)\, K(m,n)
$$

| 기호 | 의미 |
| --- | --- |
| $I$ | 입력. 이미지라면 픽셀 값의 2차원 배열 |
| $K$ | filter. 학습되는 가중치가 여기에 들어 있다 |
| $m, n$ | filter 안에서의 위치 |
| $(I * K)(i,j)$ | 출력 feature map 의 $(i,j)$ 값 |

# B) 왜 fully connected 대신 쓰나

**가중치를 재사용한다.** 같은 filter 를 모든 위치에 적용하므로, 이미지 크기와 무관하게 파라미터 수가 filter 크기로 정해진다. $224\times224$ 이미지를 fully connected 로 받으면 첫 층에만 수천만 개의 가중치가 필요하지만, $3\times3$ filter 는 9개다.

**위치가 달라져도 같은 무늬를 찾는다.** 왼쪽 위에서 모서리를 찾도록 학습된 filter 는 오른쪽 아래에서도 같은 모서리를 찾는다. 이 성질을 translation equivariance 라고 한다.

**가까운 픽셀끼리 먼저 본다.** 한 출력값이 보는 입력 범위(receptive field)가 filter 크기로 좁게 시작하고, 층을 쌓을수록 넓어진다. 그래서 앞쪽 층은 모서리나 색 변화 같은 국소적인 무늬를, 뒤쪽 층은 더 큰 형태를 담당하게 된다.

# C) 출력 크기를 정하는 값들

- [[Padding]] $p$: 가장자리에 값을 덧대어, 출력이 줄어드는 것과 가장자리 픽셀이 적게 쓰이는 것을 막는다
- [[stride]] $s$: filter 를 몇 칸씩 옮길지. 크게 잡으면 출력이 작아진다

$n\times n$ 입력에 $f\times f$ filter 를 쓸 때 출력 한 변의 크기는 다음과 같다.

$$
\left\lfloor \frac{n + 2p - f}{s} \right\rfloor + 1
$$

이 연산을 층으로 쌓아 만든 신경망이 [[Convolution Neural Network]] 다.

# D) 신호처리의 convolution 과의 차이

수학에서 정의하는 convolution 은 filter 를 뒤집어서(flip) 곱한다. 딥러닝 프레임워크가 실제로 계산하는 것은 뒤집지 않는 cross-correlation 인데, filter 값 자체를 학습하므로 뒤집힌 형태를 학습하면 그만이라 결과에 차이가 없다. 관례상 그냥 convolution 이라고 부른다.

# E) References
