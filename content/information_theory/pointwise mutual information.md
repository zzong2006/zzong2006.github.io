---
tags: ["information_theory"]
aliases: ["PMI", "NPMI"]
---

# A) Pointwise Mutual Information ?

두 이산 랜덤 변수 $X,Y$ 에 대하여 outcome $x,y$ 쌍의 PMI 는 동시에 나타나는 확률을 수량화한다. 이때 두 분포는 서로 독립적임을 가정한다.

## A.1) 수식

$$
\displaystyle\operatorname{pmi}(x;y)\equiv\log\frac{p(x,y)}{p(x)p(y)}=\log\frac{p(x\mid y)}{p(x)}=\log\frac{p(y\mid x)}{p(y)}
$$

### A.1.1) 해석

$p(x,y)$ 는 $x,y$ 가 동시에 일어날 확률이므로, 각각 일어날 확률 $p(x),p(y)$ 의 곱과 동일하다면 $\operatorname{pmi}(x;y)=1$ 로 독립일 것이다.

동시에 일어날 확률이 따로 일어날 확률보다 크다면 +, 작다면 - 값을 가지게 된다.

# B) Normalized PMI (NPMI)

PMI 를 normalized 한 값으로, [-1, +1] 사이의 값을 가진다.

## B.1) 수식

$$
\operatorname{npmi} \equiv \frac{\operatorname{pmi}}{-\log p(x, y)}=\frac{\log [p(x) p(y)]}{\log p(x, y)}-1 
$$

## B.2) 값에 따른 해석

* $-1$: 함께 발생한적이 전혀 없음
* $0$: 독립적임
* $1$: 완전히 같이 발생함 (co-occurrence)

# C) Application

## C.1) 두 어휘의 연관성 파악

PMI 를 이용한 우리말 어휘의 의미 극성 판단

* $x,y$ 가 각각 동일한 문서에서 등장할 확률: $p(x,y)$
* Web-PMI: $p(w)=\frac{1}{N}\operatorname{hits}(w)$ ($\operatorname{hits}(w)$= $w$ 가 포함된 문서의 개수)

# D) Related

[[mutual information]]

# E) References
