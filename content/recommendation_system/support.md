---
title: "support"
tags: ["recommendation_system"]
---

# A) Support ?

support 값은 그 itemset 이 얼마나 데이터베이스에 자주 등장하는지 나타내는 지표다.

itemset $X$ 에 대한 $T$ 의 support 는 $X$ 를 포함한 transactions $t$ 의 비율에 비례한다.

$$
\displaystyle\operatorname{supp}(X)=\frac{|\{t\in T;X\subseteq t\}|}{|T|}
$$

# B) 예시

![image-20201128180606645](https://i.loli.net/2020/11/28/axr1LiHj569Ugcp.png)

itemset $X=\{beer,diapers\}$ 의 support 값은 0.2 (=1/5) 이다. 왜냐하면 오직 5 개의 transactions 중 $t_3$ 만 해당 itemset 을 포함하기 때문이다.

# C) Related

# D) References
