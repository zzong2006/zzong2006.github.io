---
title: "odds ratio"
tags: ["statistic"]
aliases: ["odds"]
---

# A) Odds Ratio ?

실패 (negative) 확률과 성공 (positive) 확률의 비를 오즈비 (odds ratio) 라고 부른다. 여기서 오즈는 확률을 표현하기 위한 또 다른 도구 (?) 다.  

이벤트 $A$ 에 대한 odds $\mathcal{O}(A)$ 는 다음과 같다.  

$$
\mathcal{O}(A)=P(A)/P\left(A^{c}\right)=P(A)/(1-P(A))
$$

예를 들어, 주사위를 굴려서 4 가 나올 이벤트를 오즈로 표현하면, $\mathcal{O}(A)=\frac{1/6}{5/6}=\frac{1}{5}$ 가 된다. 이를 1:5 (또는 5:1 “odds against”) 로 표현한다.

확률에서 odds 를 계산하는 법도 있지만, odds 에서 확률을 계산하는 법은 다음과 같다. Event $B$ 에 대한 오즈가 $a:b$ 인 경우를 생각해보자.

* $P(B)/(1-P(B))=a/b$ 이므로, $P(B)\cdot b=a-P(B)\cdot a$ 이다.
* 즉, $\displaystyle P(B)=\frac{a}{a+b}$ 이다.  

$$
\log(1-P) = -LOG(1 + E^{LOG(ODDS)})
$$

# B) References
