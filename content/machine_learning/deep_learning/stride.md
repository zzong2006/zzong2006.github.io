---
title: "stride"
aliases: ["스트라이드"]
tags:
  - deep_learning
---

# A) Stride ?

[[convolution]] 이나 pooling 에서 filter 를 한 번에 몇 칸씩 옮길지를 정하는 값이다. stride 가 1 이면 한 칸씩 미끄러지며 모든 위치를 보고, 2 면 한 칸씩 건너뛰며 절반의 위치만 본다.

# B) 출력 크기에 미치는 영향

$n\times n$ 입력, $f\times f$ filter, [[Padding]] $p$, stride $s$ 일 때 출력 한 변의 크기는 다음과 같다.

$$
\left\lfloor \frac{n + 2p - f}{s} \right\rfloor + 1
$$

바닥 함수가 붙는 이유는 filter 가 입력 밖으로 삐져나가는 위치는 계산하지 않기 때문이다. 예를 들어 $7\times7$ 입력에 $3\times3$ filter, padding 0, stride 2 면 $\lfloor (7-3)/2 \rfloor + 1 = 3$ 이라 출력이 $3\times3$ 이 된다.

stride 를 $s$ 로 잡으면 출력의 한 변이 대략 $1/s$ 로 줄어들고, 넓이는 $1/s^2$ 로 줄어든다.

# C) 무엇을 얻고 무엇을 잃나

stride 를 키우는 목적은 feature map 을 줄여 뒤 층의 계산량과 메모리를 아끼는 것이다. 같은 목적으로 pooling 을 쓰기도 하는데, pooling 은 정해진 규칙(최댓값·평균)으로 줄이는 반면 stride 를 키운 convolution 은 줄이는 방식 자체를 학습한다. 그래서 최근 구조는 pooling 대신 stride 2 convolution 을 쓰는 경우가 많다.

대신 건너뛴 위치의 정보는 그 층에서 쓰이지 않는다. 위치를 세밀하게 구분해야 하는 작업(segmentation, 작은 객체 검출)에서는 stride 를 크게 잡으면 손해가 크다.

한편 출력 한 값이 보는 입력 범위(receptive field)는 stride 를 키울수록 빠르게 넓어진다. 적은 층으로 넓은 맥락을 보게 만드는 데는 유리하다.

# D) References
