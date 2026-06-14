---
tags: ["metrics"]
aliases: ["NDCG"]
---

# A) NDCG ?

NDCG 는 DCG 를 정규화한 결과를 의미한다.

우선 DCG 는 다음과 같이 계산된다.

$$
\displaystyle DCG_{p}=\sum_{i=1}^{p}\frac{rel_{i}}{\log_{2}(i+1)}
$$

 $i$ 는 아이템의 순위를 나타내고, $rel_i$ 는 $i$ 번째 순위에 위치한 아이템의 상관 정도 (relevance) 를 의미한다. 즉, 상위권에 대한 추천 결과가 높은 상관성을 보일 경우, 높은 DCG 값을 나타낸다.

만약 DCG 에서 관련성의 비중을 높이고 싶다면 다음 식을 이용한다.

$$
\displaystyle DCG_{p}=\sum_{i=1}^{p}\frac{2^{rel_{i}}-1}{\log_{2}(i+1)}
$$

NDCG 는 다음과 같이 계산된다.

$$
\begin{array}{c}nDCG_{p}=\displaystyle{\frac{DCG_{p}}{IDCG_{p}}}\\\\IDCG_{p}=\displaystyle{\sum_{i=1}^{p}\frac{rel_{i}^{opt}}{\log_{2}(i+1)}}\end{array}
$$

예시는 위키를 확인할 것. 아주 잘 정리되어있다. [Discounted cumulative gain](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
