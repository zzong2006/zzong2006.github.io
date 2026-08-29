---
title: "Gini index"
aliases: ["지니 계수"]
tags:
  - recommendation_system
  - information_theory
---

# A) In Recommender System

얼마나 비균등하게 각기 다른 아이템들이 사용자들에게 선택받고 있는가를 추정

$$
\displaystyle G=\frac{1}{n-1}\sum_{j=1}^{n}(2j-n-1)p\left(i_{j}\right)
$$

* $i$ 는 아이템, $p(i)$ 는 사용자에게 선택된 비율 (해당 item click / 전체 item click)
* $i_{1},\cdots i_{n}$ 는 increasing $p(i)$ 로 정렬된 상태

모든 아이템이 균등하게 선택된다면, 위 gini 계수 값은 $0$ 이 되고, 한 아이템만 선택된다면 그 값은 $1$ 이 된다.

하지만 위 측정 방식은 popularity bias 를 정확하게 반영하기 어려운 문제가 있다. 왜냐하면 반드시 모든 아이템이 균등한 click 을 받을 이유가 없다. 만약 어떤 아이템의 퀄리티가 너무 떨어지거나 모든 사용자들에게 인기가 없을만한 이유가 있다면, 이러한 아이템은 굳이 다른 아이템들과 균등한 click 을 받을 필요가 없을 것이다.

# B) Formalizing Popularity Bias

_from [[Popularity Bias in Dynamic Recommendation]]_

[[Popularity-Opportunity Bias in Collaborative Filtering]] 에서 소개된 Popularity Opportunity Bias (POB) 를 적용하여 popularity bias 를 수식화 할 수 있다.

해당 수식은 인기 아이템과 비 인기 아이템이 동일한 [[Recall|true positive rate]](CTR) 를 가지는지의 여부를 고려한다.

$$
\operatorname{Gini}=\frac{\sum_{i \in \mathcal{I}}(2 i-M-1) T P R_{i}}{M \sum_{i \in \mathcal{I}} T P R_{i}}
$$

* $T P R_{i}=C_{i} / A_{i}$ ($C_i$ 는 $i$ 가 받은 클릭 횟수, $A_i$ 는 audience size)
* audience size 는 명확한 정의가 없어서, 그냥 vimp 가 적절할 듯 싶다. 그럼 TPR 은 그냥 CTR 인데.. ?
* item 은 audience 수가 오름차순 (non-descending) 순서로 1 부터 $M$ 까지 인덱싱 됨 ($A_{i} \leq A_{(i+1)}$)

$-1 \leq \operatorname{Gini} \leq 1$ 값으로 popularity bias 정도를 측정한다. Gini 계수의 절대값이 작으면 작을수록 bias 가 작은 것이다. 그리고 0 보다 크다면, TPR 이 아이템 audience(vimp) 크기와 양의 상관 관계를 가지며, 0 보다 작다면 음의 상관 관계를 가진다는 의미가 된다.

# C) 다양성 측정을 위한 지니 계수 사용

Gini 계수는 전체 아이템이 얼마나 균등한 클릭을 받는지 확인하는 지표이기 때문에, 아이템 다양성 측정 관점에서 지니 계수를 사용하는 것은 옳지 않다고 생각함.

그리고 지니 계수는 item pool 갯수에 민감한 면을 보인다. 아이템 풀이 많으면 많을수록 다양한 추천이 가능하기 때문에 추천의 다양성 자체는 상승하지만, 균등한 추천이 불가능하므로 지니계수가 높아지게 되는 이슈가 있다 (적은 풀을 사용하는 추천이 유리함).업

# D) Related

[[Shannon Entropy]]

# E) Reference

* Recommender system handbook 8.3.3.1
