---
tags: ["NLP"]
---

# A) GloVe ?

global vectors for word representation

$$
\operatorname{minimize}\sum_{i=1}^{V}\sum_{j=1}^{V}f\left(X_{ij}\right)\left(\theta_{i}^{T}e_{j}+b_{i}+b_{j}^{\prime}-\log X_{ij}\right)^{2}
$$

* $X_{ij}$: the number of times $j$ (target) appears in the context of $i$ (context).
* $f(X_{ij})$: weight function

# B) Related

# C) References

* [09-05) 글로브(GloVe) - 딥 러닝을 이용한 자연어 처리 입문](https://wikidocs.net/22885)
	* 설명이 썩 맘에드는 편은 아니다. 식 유도가 친절한 편이다.
* [GloVe: Global Vectors for Word Representation](https://nlp.stanford.edu/projects/glove/)
