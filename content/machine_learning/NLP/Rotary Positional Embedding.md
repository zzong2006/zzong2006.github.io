---
title: "Rotary Positional Embedding"
tags:
  - NLP
  - LLM
aliases: ["RoPE"]
---

# A) Rotary Positional Embedding ?

Rotary Positional Embedding (RoPE) 는 절대적 방식과 상대적 방식을 통합한 새로운 [[Positional Encoding]] 방식입니다.

RoPE scaling can be used to increase the sequence length of the model during the inference time without necessarily fine-tuning it.

# B) 직관

간단히 말해, 두 벡터 간의 내적은 각 벡터의 크기와 그들 사이의 각도에 의해 결정됩니다. 이를 바탕으로 RoPE (Rotary Positional Embedding) 의 직관은 **토큰 임베딩을 복소수로 표현하고, 해당 토큰들의 위치를 순수한 회전으로 나타낼 수 있다는 것**입니다.

만약 query 와 key 를 동일한 양만큼 이동시키면, 절대적인 위치는 변하지만 상대적인 위치는 변하지 않게 됩니다. 이 경우 두 표현 모두 동일하게 추가적인 회전을 겪게 되며, 결과적으로 두 벡터 사이의 각도는 변하지 않으므로 내적 값 역시 변하지 않습니다. 이러한 회전의 특성을 활용함으로써 self-attention 에서 사용되는 내적 연산은 우리가 원하는 속성, 즉 **절대적인 위치 정보는 버리고 상대적인 위치 정보는 유지하는** 특성을 가지게 됩니다.

이 성질을 원소 하나로 단순화해 확인할 수 있다 (EleutherAI 블로그의 예). query 벡터의 $j$ 번째 원소 $q_j$ 와 key 벡터의 $j$ 번째 원소 $k_j$ 를 복소평면의 점으로 보고, 위치 $m$ 의 토큰은 각도 $m\varepsilon$ 만큼 돌린다.

$$
\begin{aligned}
\operatorname{RoPE}(x, m) & =x e^{m i \varepsilon} \\
\left\langle\operatorname{RoPE}\left(q_j, m\right), \operatorname{RoPE}\left(k_j, n\right)\right\rangle & =\left\langle q_j e^{m i \varepsilon}, k_j e^{n i \varepsilon}\right\rangle \\
& =q_j k_j e^{m i \varepsilon} \overline{e^{n i \varepsilon}} \\
& =q_j k_j e^{(m-n) i \varepsilon} \\
& =\operatorname{RoPE}\left(q_j k_j, m-n\right)
\end{aligned}
$$

| 기호 | 뜻 |
| --- | --- |
| $q_j, k_j$ | query·key 벡터의 $j$ 번째 원소. 이 예에서는 실수로 둔다 |
| $m, n$ | query 토큰과 key 토큰의 위치 |
| $\varepsilon$ | 한 칸당 회전 각도. 최대 시퀀스 길이를 $N$ 이라 할 때 $0 < \varepsilon \le \frac{\pi}{2N}$ 로 고른다 |
| $e^{m i \varepsilon}$ | 복소평면에서 각도 $m\varepsilon$ 만큼의 회전. $i$ 는 허수 단위다 |
| $\langle a, b \rangle$ | 복소수의 내적. $a \overline{b}$, 즉 두 번째 값의 켤레복소수를 곱한다 |
| $\overline{e^{n i \varepsilon}}$ | $e^{n i \varepsilon}$ 의 켤레복소수 $e^{-n i \varepsilon}$. 반대 방향으로 같은 각도만큼의 회전이다 |

세 번째 줄에서 key 쪽 회전 $e^{n i \varepsilon}$ 은 내적의 정의 때문에 켤레 $e^{-n i \varepsilon}$ 로 들어간다. 그래서 두 회전이 합쳐지면 지수가 $m - n$ 만 남고, 결과는 두 토큰의 절대 위치가 아니라 거리 $m - n$ 에만 의존한다. 실제 RoPE 는 벡터의 원소를 두 개씩 짝지어 짝마다 다른 각도로 돌린다. 그 일반형은 RoFormer 논문 3.2.2절에 있다.

# C) References

* [Rotary Positional Embeddings: Combining Absolute and Relative - YouTube](https://www.youtube.com/watch?v=o29P0Kpobz0)
* [\[2104.09864\] RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
* [Rotary Embeddings: A Relative Revolution | EleutherAI Blog](https://blog.eleuther.ai/rotary-embeddings/)
