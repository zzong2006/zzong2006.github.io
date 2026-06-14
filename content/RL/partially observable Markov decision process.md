---
tags: ["reinforcement_learning"]
aliases: ["POMDP"]
---

# Partially Observable Markov Decision Process ?

PO[[Markov Decision Process|MDP]] 는 tuple $\langle S, A, O, P, R, Z, \gamma\rangle$ 에 의해 표현될 수 있다.

여기서 $O$ 는 관찰 가능한 것들의 집합이고, $Z$ 는 observation function 을 의미한다: $Z\left(o, s^{\prime}, a\right)=P\left(O_{t+1}=o \mid S_{t+1}=s^{\prime}, A_{t}=a\right)$

왜 POMDP 가 필요한 것인가? 실제로 MDP 처럼 우리 생활에서 state 를 전부 관찰할 수 있는것은 아니기 때문이다. 예를 들어 자동차를 운전하는 경우, 운전자 시야가 보이지 않는 곳은 state 를 관찰할 수 없다.

실제 일부 관측 가능한 환경에서는 바로 이전의 observation 만 이용하는 것이 아니라, 최근 $k$ steps 에 대한 observations 을 이용하여 policy 를 구성한다. 그래서 일반적으로 유명한 RL 방식은 [[Long Short-Term Memory]] 을 자주 활용하는 경우가 많다.

# Related

# References
