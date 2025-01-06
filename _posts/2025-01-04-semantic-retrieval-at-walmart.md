---
layout: post
title: Semantic Retrieval at Walmart
date: 2025-01-05 17:00:00
giscus_comments: true
categories: paper-review
toc:
  beginning: true
  sidebar: left
tags: Walmart ANN RAG WIP
---

Walmart 에서 적용한 Embedding-based neural retrieval (EBR) 에 대한 논문 리뷰.

2022년, 2024년에 각각 하나씩 시리즈물 느낌으로 발표되었다.



## (1) Summary of the proposed method

1. A hybrid system for e-commerce search deployed at Walmart that combines traditional inverted index and embedding-based neural retrieval to better answer user tail queries.
2. A novel method of selecting negative examples for training a large neural retrieval model and an approximate metric to evaluate the performance


## (2) Related Works

**Production search vs. Web search**

Production search is way more challenging than web search. 

- Product titles (the main search-able text) are generally much shorter than web documents.
- While many web documents may contain the same information, a specific product from a seller rarely has a duplicate. 


**Traditional Solutions**

- knowledge graph: need a huge amount of domain expertise, and the cost of maintaining these components is high, since the catalog and product vocabulary frequently change in e-commerce
- BM25, an inverted index: suffers from vocabulary mismatch between the query and the product title
- neural systems: limited by the fact that the embedding size cannot be too large due to latency concerns


## (3) Proposed Methods 

**Reducing the size of embedding**

Reducing the size of embedding is beneficial as it allows the item embedding and the ANN index to be refreshed more frequently.

Tried 2 approaches:

1. Add a linear projection layer to reduce the embedding size to 368, 256, 128, and 64
2. Use a transformer architecture that has a smaller embedding size: MiniLM (12 layers and an embedding size of 368), XtremeDistil (6 layers and an embedding size of 368)

The **linear projection** is very effective in reducing the size of the embedding with very little performance cost.

**A hybrid architecture**

...


**ANN**

- Normalized vectors of dimension 256, the ANN services can yield 99% for recall@20 evaluated against the full nearest neighborhood search, with an average latency around 13 ms;
- For normalized vectors of dimension 768, the services can achieve a similar recall@20 but with three times the storage space;

## (6) Lesson Learned

**Cosine similarity vs. Inner product**

- The inner product is more stable during training and does not require the temperature factor 𝜎.
- But, **inner product was much harder to optimize** when creating the ANN index, compared to cosine similarity.

**Text fields**

Many text fields are generally available for each product, and the quality of the text fields varies. But, we could not extract any boost in performance by using these text fields. This is probably because descriptions can contain a lot of irrelevant text that simply adds noise.

**Model Complexity**

A very deep model or very large embedding size is not necessary to achieve top performance. This is probably because queries and product titles are not very complex from a semantic perspective.



## References

Papers

- [1] [Semantic Retrieval at Walmart](https://arxiv.org/pdf/2412.04637)
- [2] [Enhancing Relevance of Embedding-based Retrieval at Walmart](https://arxiv.org/abs/2408.04884)