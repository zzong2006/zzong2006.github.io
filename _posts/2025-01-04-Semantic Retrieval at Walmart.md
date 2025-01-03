---
title: "Semantic Retrieval at Walmart"
last_modified_at: 2025-01-03 15:00:00 -0000
categories:
  - Semantic Retrieval
tags:
  - Walmart
  - ANN
  - RAG
---


In product search, the retrieval of candidate products before re-ranking is more critical and challenging than other search like web search, especially for tail queries, which have a complex and specific search intent. In this paper, we present a hybrid system for e-commerce search deployed at Walmart that combines traditional inverted index and embedding-based neural retrieval to better answer user tail queries. Our system significantly improved the relevance of the search engine, measured by both offline and online evaluations. The improvements were achieved through a combination of different approaches. We present a new technique to train the neural model at scale. and describe how the system was deployed in production with little impact on response time. We highlight multiple learnings and practical tricks that were used in the deployment of this system.



## References

Papers

- [1] [Semantic Retrieval at Walmart](https://arxiv.org/pdf/2412.04637)
