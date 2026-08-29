---
title: "pointwise mutual information"
aliases: ["PMI", "NPMI"]
tags:
  - information_theory
---

# A) Pointwise Mutual Information ?

두 이산 랜덤 변수 $X,Y$에 대하여 outcome pair $(x,y)$의 PMI는 두 값이 **독립일 때 기대되는 빈도보다 얼마나 더 자주 또는 덜 자주 함께 나타나는지** 를 측정한다.

## A.1) 수식

$$
\displaystyle\operatorname{pmi}(x;y)\equiv\log\frac{p(x,y)}{p(x)p(y)}=\log\frac{p(x\mid y)}{p(x)}=\log\frac{p(y\mid x)}{p(y)}
$$

### A.1.1) 해석

$p(x,y)$는 $x,y$가 동시에 일어날 확률이다. 이 값이 각각 일어날 확률의 곱 $p(x)p(y)$와 같다면 두 값은 독립이고, 이때 $\operatorname{pmi}(x;y)=0$이다.

동시에 일어날 확률이 독립일 때의 기대값보다 크면 PMI는 양수, 작으면 음수가 된다.

# B) Normalized PMI (NPMI)

PMI를 normalized 한 값으로, `[-1, +1]` 사이의 값을 가진다.

## B.1) 수식

$$
\operatorname{npmi} \equiv \frac{\operatorname{pmi}}{-\log p(x, y)}=\frac{\log [p(x) p(y)]}{\log p(x, y)}-1 
$$

## B.2) 값에 따른 해석

* $-1$: 함께 발생한 적이 전혀 없음
* $0$: 독립적임
* $1$: 항상 같이 발생함

# C) Application

## C.1) 두 어휘의 연관성 파악

PMI 를 이용한 우리말 어휘의 의미 극성 판단

* $x,y$ 가 각각 동일한 문서에서 등장할 확률: $p(x,y)$
* Web-PMI: $p(w)=\frac{1}{N}\operatorname{hits}(w)$ ($\operatorname{hits}(w)$= $w$ 가 포함된 문서의 개수)

# D) Related

[[mutual information]]

# E) References
