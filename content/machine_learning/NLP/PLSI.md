---
tags: ["machine_learning", "NLP", "topic_modeling"]
aliases: ["pLSA", "Probabilistic Latent Semantic Indexing"]
---

# A) PLSI ?

PLSI(Probabilistic Latent Semantic Indexing)는 document 와 word 의 co-occurrence 를 latent topic 으로 설명하는 topic modeling 방법이다. [[Latent Semantic Analysis|LSA]] 를 probabilistic model 로 해석한 흐름에 가깝다.

# B) LDA 와의 차이

[[LDA]] 는 document-topic distribution 에 prior 를 둔 generative model 이고, PLSI 는 document 별 topic mixture 를 parameter 로 직접 학습한다. 그래서 PLSI 는 training document 에 강하게 묶이고, unseen document 처리에서는 추가 추론이 필요하다.

# C) Related

* [[topic modeling]]
* [[LDA]]
* [[papers/collaborative_filtering/Probabilistic latent Semantic Indexing]]

