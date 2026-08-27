---
tags: ["SIGIR", "paper_review", "y2008"]
---

search query retrieval 를 주제로 하여 negative feedback signal 을 학습할 수 있는 알고리즘의 overview 조사

non-clicks documents 를 negative relevance feedback 으로 산정

(document, query) 쌍이 주어졌을 때, relevance score 는 다음과 같이 계산됨

$$
\displaystyle S(\vec{Q},\vec{D})=\vec{Q}\vec{D}-\gamma\times\frac{1}{|N|}\sum_{D_{n}\in N}\vec{D}_{n}\vec{D}
$$

$\vec{Q},\vec{D}$ 는 각각 query 와 document vectors 이고 $N$ 은 query 와 관련있는 negative documents 개수, 그리고 $\gamma$ 는 negative feedback weight
