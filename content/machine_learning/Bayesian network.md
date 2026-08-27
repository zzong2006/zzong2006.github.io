---
tags: ["PGM"]
aliases: ["directed graphical model", "BN", "베이지안 네트워크"]
---

# 1. Notes

Bayesian Neural Network 와 다른 개념이다.

# 2. Bayesian Network ?

A directed acyclic graph (DAG) $G$ whose nodes represent the random variables $X_{1}, \ldots, X_{n}$

# 3. 사용하는 이유

베이지안 네트워크는 chain rule 을 통해 joint distribution 을 표현할 수 있고, 이를 통해 compact representation 을 얻을 수 있다.

즉, 각 CPD ([[conditional probability]] distribution) 가 독립적이라는 가정하에, graph $G$ 에 대한 확률 $P$ 는 다음과 같이 factorize 될 수 있다.

$$
P\left(X_{1}, \ldots, X_{n}\right)=\prod_{i} P\left(X_{i} \mid \operatorname{Par}_{G}\left(X_{i}\right)\right)
$$

# 4. 구조

* DAG: A acyclic(비순환) and directed graph
* 각 노드들은 랜덤 변수 $X_i$ 로 이루어져 있음
* 각 노드 $X_i$ 에는 부모 노드 $\operatorname{Par}_{G}\left(X_{i}\right)$ 에 대한 CPD $P\left(X_{i} \mid \operatorname{Par}_{G}\left(X_{i}\right)\right)$ 가 존재한다.

# 5. 베이지안 네트워크

![](https://i.imgur.com/YPlb0DC.png)

![](https://i.imgur.com/Z1dc4pw.png)

# 6. Related

# 7. References
