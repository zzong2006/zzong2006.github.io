---
title: "Positional Encoding"
tags: ["NLP"]
aliases: ["PE"]
---

# A) Positional Encoding ?

포지션 정보를 토큰 벡터에 추가하는 방식을 의미한다. 기존의 [[attention function|attention]] 방식은 모든 토클에 대해서 병렬적으로 수행될 수 있지만, 각 토큰의 시퀀스 내 순서를 고려하지 않는다. 하지만, [[transformer]] 의 경우 입력값으로 쓰이는 vector 에 position vector 를 더해줌으로써 토큰의 시퀀스 순서를 고려할 수 있도록 한다.

# B) Absolute Positional Embedding

여기서 position vector 는 다음과 같이 계산될 수 있다.

$$
\begin{equation}
\begin{gathered}
P E_{(p o s, 2 i)}=\sin \left(\frac{p o s}{1000^{\frac{2 i}{d}}}\right) \\
P E_{(p o s, 2 i+1)}=\cos \left(\frac{p o s}{1000^{\frac{2 i}{d}}}\right)
\end{gathered}
\end{equation}$$
여기서 $i$ 는 position vector내 element 순서를 의미하고, $d$ 는 position vector의 크기를 의미한다. $i$는 0부터 시작하는데, $P E_{(p o s, 2 i)}$ 나 $P E_{(p o s, 2 i + 1)}$는 각 position vector의 element 값을 의미한다.

이렇게 구성하는 이유는 토큰 마다 사용되는 position vector가 unique 하게 유지하려는 목적이 있기 때문이다.

## B.1) 예시
![|400](https://i.imgur.com/dlRIkaR.png)

# C) Relative Positional Embedding

T5 같은 모델이 각 토큰 별 상대적 거리에 대한 weight (as bias) 를 matrix 로 표현하여 positional embedding 으로 활용한다.

## C.1) 단점
괜찮은 전략이지만 다음과 같은 문제가 있다.

1. [[KV Cache]] 의 사용 어려움: 매번 계산할때마다 토큰 임베딩이 바뀌기 때문에 캐시 전략을 활용하기 어렵다
2. 계산 어려움: Computation 에 burden 이 있다.

# D) [[Rotary Positional Embedding|RoPE]]

Positional + Relative
# E) References
* [Transformer Architecture: The Positional Encoding](https://kazemnejad.com/blog/transformer_architecture_positional_encoding/)
