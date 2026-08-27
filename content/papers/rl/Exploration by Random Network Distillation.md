---
tags: ["paper_review", "reinforcement_learning"]
---

# A) Exploration by Random Network Distillation ?

[[Reinforcement Learning|RL]] methods work by maximizing the expected return of a policy. In reality it is often impractical to engineer dense reward functions for every task one wants an RL agent to solve.

# B) Methods

## B.1) Exploration Bonus

(time $t$ 의 transition 에서 발생하는) 기존 보상 방식을 변경

$$
r_{t}=e_{t}+i_{t}
$$

* $i_{t}$: exploration bonus
* $e_{t}$: 환경 보상

## B.2) Count-based Exploration Methods

A tabular setting with a finite number of states

$i_{t}=1/\sqrt{n_{t}(\boldsymbol{s})}$ 또는 $i_{t}=1/n_{t}(\boldsymbol{s})$ 와 같은 방식으로 보너스를 정의

* $n_{t}(\boldsymbol{s})$ 는 state $\boldsymbol{s}$ 에 대한 방문 횟수

## B.3) Non-tabular Setting

density model 을 exploration bonus 로 생각

# C) Random Network Distillation

두 가지 신경망이 존재

* target network: fixed and randomly initialized
  observation 을 받아서 embedding 을 출력; $f:\mathcal{O}\rightarrow\mathbb{R}^{k}$

**predictor network**: trained on data collected by the agent
  target 과 유사

$$
\hat{f}:\mathcal{O}\rightarrow\mathbb{R}^{k}
$$

# D) References

* [paper link](https://arxiv.org/pdf/1810.12894.pdf)
