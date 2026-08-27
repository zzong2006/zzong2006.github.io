---
tags: ["reinforcement_learning"]
---

# A) Dynamics ?

[[Markov Decision Process|MDP]] 에서 정의하는 dynamics 는 다음과 같다.  

“$t$ timestamp 에서 action $a$ 를 통해 state $s$ 에서 state $s'$ 으로 옮겨서 reward $r$ 을 받을 확률”

$$
p\left(s^{\prime}, r \mid s, a\right) \doteq \operatorname{Pr}\left\{S_{t}=s^{\prime}, R_{t}=r \mid S_{t-1}=s, A_{t-1}=a\right\}
$$

위 수식에서 $\doteq$ 는 definition 이라는 뜻이다.

## A.1) 특징

가능한 모든 $p$ 를 더하면 1 이 된다.

$$
\sum_{s^{\prime} \in \mathcal{S}} \sum_{r \in \mathcal{R}} p\left(s^{\prime}, r \mid s, a\right)=1, \text { for all } s \in \mathcal{S}, a \in \mathcal{A}(s)
$$

# B) References
