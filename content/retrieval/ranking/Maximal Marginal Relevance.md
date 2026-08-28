---
title: "Maximal Marginal Relevance"
tags: ["retrieval", "ranking", "diversity", "metrics"]
aliases: ["maximum marginal relevance", "MMR"]
---

# A) MMR?

MMR(Maximal Marginal Relevance) 는 text(information) retrieval 분야에서 자주 사용되는 metric 입니다. 이는 query 에 의해 생성된 documents 들이 얼마나 query 와 연관성이 있으면서, 동시에 서로 간에는 중복되지 않고 독립적인지를 측정하는 데 사용됩니다.

$$
MMR\stackrel{\text{def}}{=}\\
\operatorname{Arg}\max_{D_{i}\in R\backslash S}\left[\lambda\left(\operatorname{Sim}_{1}\left(D_{i},Q\right)-(1-\lambda)\max_{D_{j}\in S}\operatorname{Sim}_{2}\left(D_{i},D_{j}\right)\right)\right]
$$

* $Q$ 는 query 를 의미하며, $R=\operatorname{IR}(C,Q,\theta)$ 는 threshold $\theta$ 이상의 유사도를 가진 documents 의 집합입니다.
* $S$ 는 이미 선택된 documents 의 집합을 나타냅니다.
* $R \backslash S$ 는 차집합 (set difference) 을 의미합니다.

# B) Marginal Relevance

어떤 document 가 높은 marginal relevance 를 가지려면, 해당 document 가 query 와 관련성이 높으면서도 이전에 선택된 다른 documents 와의 유사성은 최소화되어야 합니다.

# C) Reference

* https://www.cs.cmu.edu/~jgc/publication/The_Use_MMR_Diversity_Based_LTMIR_1998.pdf
