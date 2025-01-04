---
layout: post
title: "Semantic Retrieval at Walmart"
last_modified_at: 2025-01-03 15:00:00 -0000
categories:
  - Retrieval
tags: walmart ann rag
---


## Proposed Method

1. a hybrid system for e-commerce search deployed at Walmart that combines traditional inverted index and embedding-based neural retrieval to better answer user tail queries.
2. a novel method of selecting negative examples for training a large neural retrieval model and an approximate metric to evaluate the performance

## Prudction search vs. Web search

Production search is way more challenging than web search. 

- Product titles (the main search-able text) are generally much shorter than web documents.
- While many web documents may contain the same information, a specific product from a seller rarely has a duplicate. 


## Traditional Solutions

- knowledge graph: need a huge amount of domain expertise, and the cost of maintaining these components is high, since the catalog and product vocabulary frequently change in e-commerce
-  BM25, an inverted index: suffers from vocabulary mismatch between the query and the product title
-  neural systems: limited by the fact that the embedding size cannot be too large due to latency concerns

## A hybrid architecture

...

## Lesson Learned

### Cosine similarity vs. Inner product

- inner product is more stable during training and does not require the temperature factor 𝜎 
- But, inner product was much harder to optimize when creating the ANN index, compared to cosine similarity.

### Text fields 

Many text fields are generally available for each product, and the quality of the text fields varies. But, we could not extract any boost in performance by using these text fields. This is probably because descriptions can contain a lot of irrelevant text that simply adds noise.

### Model Complexity

A very deep model or very large embedding size is not necessary to achieve top performance. This is probably because queries and product titles are not very complex from a semantic perspective.

## Abstract

In product search, the retrieval of candidate products before re-ranking is more critical and challenging than other search like web search, especially for tail queries, which have a complex and specific search intent. In this paper, we present a hybrid system for e-commerce search deployed at Walmart that combines traditional inverted index and embedding-based neural retrieval to better answer user tail queries. Our system significantly improved the relevance of the search engine, measured by both offline and online evaluations. The improvements were achieved through a combination of different approaches. We present a new technique to train the neural model at scale. and describe how the system was deployed in production with little impact on response time. We highlight multiple learnings and practical tricks that were used in the deployment of this system.



## References

Papers

- [1] [Semantic Retrieval at Walmart](https://arxiv.org/pdf/2412.04637)
