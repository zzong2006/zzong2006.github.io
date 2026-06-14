---
title: "expected return"
tags: ["reinforcement_learning"]
aliases: ["discounted return"]
---

# A) Expected Return ?

누적 보상을 의미하며, [[Reinforcement Learning]] 에서 agent 의 목표는 이 값을 최대화 하는 것을 의미한다.

끝이 있는 학습 (episode 가 존재하는 학습, episodic tasks) 에서는 return $G_t$ 다음과 같이 표현될 수 있다.  

$$
G_{t}\doteq R_{t+1}+R_{t+2}+R_{t+3}+\cdots+R_{T}
$$

# B) Discounted Return

만약 끝이 없는 학습 (continuing tasks) 에서는 보상값이 무한대로 치솟을 수 있다 (e.g. [[Markov Reward Process]]). 이를 막기 위해 discounting return $G_t$ 를 사용한다.  

$$
\displaystyle G_{t}\doteq R_{t+1}+\gamma R_{t+2}+\gamma^{2}R_{t+3}+\cdots=\sum_{k=0}^{\infty}\gamma^{k}R_{t+k+1}
$$

여기서 $\gamma$ 는 감가율 [[discount factor]] 라 부름 ($0\leq\gamma\leq1$)

좀 더 general 하게 다음과 같이 쓴다.  

$$
\displaystyle G_{t}\doteq\sum_{k=t+1}^{T}\gamma^{k-t-1}R_{k}
$$

$G_t$ 와 $G_{t+1}$ 의 관계는 다음과 같다.  

$$
\begin{aligned}G_{t}&\doteq R_{t+1}+\gamma R_{t+2}+\gamma^{2}R_{t+3}+\gamma^{3}R_{t+4}+\cdots\\&=R_{t+1}+\gamma\left(R_{t+2}+\gamma R_{t+3}+\gamma^{2}R_{t+4}+\cdots\right)\\&=R_{t+1}+\gamma G_{t+1}\end{aligned}
$$

만약 보상 ($R_{k}$) 이 1 인 경우, 무한대의 시간이 흐르는 경우 $G_t$ 의 값은 어떻게 수렴하는가?  

$$
\displaystyle G_{t}=\sum_{k=0}^{\infty}\gamma^{k}=\frac{1}{1-\gamma}
$$

# C) Related

# D) References
