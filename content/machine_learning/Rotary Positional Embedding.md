---
tags: ["NLP", "LLM"]
aliases: ["RoPE"]
---

# A) Rotary Positional Embedding ?

Rotary Positional Embedding (RoPE) 는 절대적 방식과 상대적 방식을 통합한 새로운 [[Positional Encoding]] 방식입니다.

RoPE scaling can be used to increase the sequence length of the model during the inference time without necessarily fine-tuning it.

# B) 직관

간단히 말해, 두 벡터 간의 내적은 각 벡터의 크기와 그들 사이의 각도에 의해 결정됩니다. 이를 바탕으로 RoPE (Rotary Positional Embedding) 의 직관은 **토큰 임베딩을 복소수로 표현하고, 해당 토큰들의 위치를 순수한 회전으로 나타낼 수 있다는 것**입니다.

만약 query 와 key 를 동일한 양만큼 이동시키면, 절대적인 위치는 변하지만 상대적인 위치는 변하지 않게 됩니다. 이 경우 두 표현 모두 동일하게 추가적인 회전을 겪게 되며, 결과적으로 두 벡터 사이의 각도는 변하지 않으므로 내적 값 역시 변하지 않습니다. 이러한 회전의 특성을 활용함으로써 self-attention 에서 사용되는 내적 연산은 우리가 원하는 속성, 즉 **절대적인 위치 정보는 버리고 상대적인 위치 정보는 유지하는** 특성을 가지게 됩니다.

The following is an example illustrating the core idea of RoPE-a more rigorous derivation is presented in a subsequent section. Some arbitrary $0<\varepsilon \leq \frac{\pi}{2 N}$ is chosen, where $N$ is the maximum sequence length. When viewed elementwise on $\mathbf{q}$ and $\mathbf{k}$, with $j$ as the element index, RoPE can be viewed as follows:

$$
\begin{aligned}
\operatorname{RoPE}(x, m) & =x e^{m i \varepsilon} \\
\left\langle\operatorname{RoPE}\left(q_j, m\right), \operatorname{RoPE}\left(k_j, n\right)\right\rangle & =\left\langle q_j e^{m i \varepsilon}, k_j e^{n i \varepsilon}\right\rangle \\
& =q_j k_j e^{m i \varepsilon} \frac{e^{n i \varepsilon}}{} \\
& =q_j k_j e^{(m-n) i \varepsilon} \\
& =\operatorname{RoPE}\left(q_j k_j, m-n\right)
\end{aligned}
$$

# C) References

* [Rotary Positional Embeddings: Combining Absolute and Relative - YouTube](https://www.youtube.com/watch?v=o29P0Kpobz0)
* [\[2104.09864\] RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
* [Rotary Embeddings: A Relative Revolution | EleutherAI Blog](https://blog.eleuther.ai/rotary-embeddings/)
