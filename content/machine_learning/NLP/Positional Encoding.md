---
title: "Positional Encoding"
tags:
  - NLP
aliases: ["PE"]
---

# A) Positional Encoding ?

[[attention function|attention]] 은 토큰 사이의 유사도만 보고 값을 섞는다. 입력 토큰의 순서를 바꿔도 각 토큰이 받는 결과는 그대로 따라 움직일 뿐, 값 자체가 달라지지 않는다. 즉 attention 만으로는 "나는 밥을 먹었다" 와 "밥은 나를 먹었다" 를 구분할 근거가 없다.

Positional encoding 은 이 빠진 정보를 채워 넣는 장치다. 토큰의 시퀀스 내 위치를 벡터로 만들어 토큰 임베딩에 더하거나(absolute), attention 점수를 계산할 때 두 토큰의 거리 정보를 끼워 넣는다(relative). [[transformer]] 는 RNN 처럼 순차적으로 읽지 않고 모든 토큰을 한 번에 병렬 처리하기 때문에, 순서 정보를 이렇게 따로 주입해야 한다.

# B) Absolute Positional Encoding

가장 먼저 쓰인 방식은 위치마다 고정된 벡터를 만들어 입력 임베딩에 더하는 것이다. 원 [[transformer]] 논문은 학습 없이 sin/cos 로 이 벡터를 계산한다.

$$
\begin{aligned}
PE_{(pos,\ 2i)} &= \sin\left(\frac{pos}{10000^{2i/d}}\right) \\
PE_{(pos,\ 2i+1)} &= \cos\left(\frac{pos}{10000^{2i/d}}\right)
\end{aligned}
$$

| 기호 | 의미 |
| --- | --- |
| $pos$ | 시퀀스에서 토큰의 위치 (0부터 시작) |
| $d$ | 임베딩 차원 수. position vector 의 길이도 같다 |
| $i$ | 차원 쌍의 인덱스. $0 \le i < d/2$ |
| $PE_{(pos,\ 2i)}$ | 위치 $pos$ 의 position vector 중 $2i$ 번째 원소 값 |

한 position vector 안에서 짝수 번째 원소는 sin, 홀수 번째 원소는 cos 가 채운다. $i$ 가 커질수록 분모 $10000^{2i/d}$ 가 커지므로 파장이 길어진다. 앞쪽 차원은 인접한 위치끼리도 값이 확 달라지는 고주파, 뒤쪽 차원은 수백 토큰이 지나야 한 바퀴 도는 저주파를 담당한다.

이렇게 주파수를 겹쳐 쌓는 이유는 두 가지다.

1. **위치마다 벡터가 겹치지 않는다.** 주기가 서로 다른 sin/cos 를 $d/2$ 쌍 쌓으면, 조합이 반복되기까지의 길이가 실질적인 시퀀스 길이보다 훨씬 길어진다.
2. **상대적 거리를 선형 변환으로 표현할 수 있다.** 삼각함수 덧셈정리에 따라 $PE_{pos+k}$ 는 $PE_{pos}$ 에 $k$ 에만 의존하는 행렬을 곱한 형태로 쓸 수 있다. 모델이 "$k$ 칸 떨어진 관계" 를 하나의 규칙으로 배울 수 있다는 뜻이다.

학습 파라미터가 없으므로 학습 때 본 적 없는 길이에도 값을 계산할 수 있다. 다만 계산이 된다는 것과 그 위치에서 성능이 유지된다는 것은 별개라서, 실제로는 학습 길이를 크게 벗어나면 품질이 떨어진다.

BERT, GPT-2 계열은 sin/cos 대신 위치별 임베딩 벡터를 그냥 학습한다. 구현은 단순하지만 최대 길이가 임베딩 테이블 크기에 고정되어, 그보다 긴 입력에는 아예 쓸 벡터가 없다.

## B.1) 예시

![|400](https://i.imgur.com/dlRIkaR.png)

가로축이 임베딩 차원, 세로축이 위치다. 왼쪽(낮은 차원)일수록 세로로 촘촘한 줄무늬가 보이고 오른쪽으로 갈수록 무늬가 완만해지는데, 이것이 위에서 말한 고주파–저주파 배치다.

# C) Relative Positional Embedding

절대 위치를 더하는 대신, 두 토큰이 **얼마나 떨어져 있는지** 를 attention 계산에 직접 넣는 방식이다. T5 는 query 위치 $i$ 와 key 위치 $j$ 의 차이 $i-j$ 를 몇 개의 구간(bucket)으로 나누고, 구간마다 학습된 스칼라 $b_{i-j}$ 를 attention logit 에 더한다.

$$
\text{logit}_{ij} = \frac{q_i^\top k_j}{\sqrt{d_k}} + b_{i-j}
$$

먼 거리일수록 넓은 구간으로 묶기 때문에 학습 길이를 넘어서도 값을 정할 수 있고, 절대 위치를 쓰지 않으므로 문장이 통째로 앞뒤로 밀려도 결과가 같다.

## C.1) 단점

1. **거리 정보를 어디에 넣느냐에 따라 [[KV Cache]] 가 깨진다.** T5 처럼 logit 에 스칼라를 더하는 방식은 key/value 자체를 건드리지 않으므로 캐시를 그대로 쓸 수 있다. 반면 Shaw et al. (2018) 처럼 상대 거리 벡터를 key/value 에 더하는 방식은, 같은 토큰이라도 현재 query 위치에 따라 key 값이 달라져서 이전 스텝에 저장해 둔 key 를 재사용할 수 없다.
2. **연산과 메모리 부담이 있다.** 시퀀스 길이 $L$ 에 대해 헤드마다 $L \times L$ 크기의 bias 행렬을 만들어 더해야 한다. attention 행렬을 메모리에 올리지 않고 블록 단위로 처리하는 FlashAttention 류의 커널과도 잘 맞지 않아, 별도 구현이 필요하다.

# D) [[Rotary Positional Embedding|RoPE]]

RoPE 는 위 두 방식의 장점을 합친다. 위치 $m$ 에 따라 query/key 벡터를 각도 $m\varepsilon$ 만큼 회전시키는데, 회전된 두 벡터의 내적은 회전각의 차이 $m-n$ 에만 의존한다. 적용 자체는 토큰마다 독립적인 절대 위치 연산이라 [[KV Cache]] 가 그대로 동작하고, 결과적으로 attention 이 보는 것은 상대 거리다.

지금 나오는 대부분의 LLM (LLaMA, Qwen, Mistral 계열) 이 이 방식을 쓴다.

# E) References

* [Transformer Architecture: The Positional Encoding](https://kazemnejad.com/blog/transformer_architecture_positional_encoding/)
* [\[1803.02155\] Self-Attention with Relative Position Representations](https://arxiv.org/abs/1803.02155)
* [\[1910.10683\] Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5)](https://arxiv.org/abs/1910.10683)
