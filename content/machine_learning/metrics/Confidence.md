---
title: "Confidence"
---


# A) Confidence ?

Confidence 는 그 규칙이 참 (true) 로 여겨지는 빈도를 나타내는 지표다.

* $X\Rightarrow Y$ 에 대한 Confidence 값은 itemset $X$ 를 포함하면서, 동시에 itemset $Y$ 를 포함하는 transactions 의 비율에 비례한다.
* $\displaystyle\operatorname{conf}(X\Rightarrow Y)=\frac{\operatorname{supp}(X\cup Y)}{\operatorname{supp}(X)}$
	* $X\cup Y$ 는 itemset 간 합집합을 의미한다.
* 예시
	* ![image-20201128180606645](https://i.loli.net/2020/11/28/axr1LiHj569Ugcp.png)
	* 예를 들어, $\{butter,bread\}\Rightarrow\{\mathrm{milk}\}$ 에 대한 confidence 값은 1.0 (=0.2/0.2) 이다.
	* 즉, butter 와 bread 를 사는 고객은 반드시 100% 확률로 milk 를 같이 산다는 의미다.

# B) Related

# C) References
