---
layout: post
title: LLM 이용해서 임베딩 모델의 품질 높이기
date: 2025-01-24 01:00:00
giscus_comments: true
categories: paper-review
toc:
  beginning: true
  sidebar: true
tags: RAG Retrieval Embedding
---


Main Contribution

- leverage proprietary LLMs to generate diverse synthetic data for hundreds of thousands of text embedding tasks across 93 languages
- fine-tune open-source decoder-only LLMs on the synthetic data using standard contrastive loss.

E5 and BGE employ a more complex multi-stage training paradigm that first pre-trains on billions of weakly-supervised text pairs, and then fine-tunes on several high-quality labeled datasets.

Existing multi-stage approaches suffer from several drawbacks.

1. They rely on manually collected datasets that are often constrained by the diversity of tasks and the coverage of languages.

## Proposed Method

we use a two-step prompting strategy that first prompts the LLMs to brainstorm a pool of candidate tasks, and then prompts the LLMs to generate data conditioned on a given task from the pool.

To cover various application scenarios, we design **multiple prompt templates** for each task type and combine the generated data from different templates to boost diversity.

Mistral-7B, when finetuned solely on synthetic data, attains competitive performance on the BEIR (Thakur et al., 2021) and MTEB(Muennighoff et al., 2023) benchmarks.

Depending on the length of the query and document, we further divide asymmetric tasks into four subgroups: short-long match, long-short match, short-short match, and long-long match.

For instance, short-long match tasks involve a short query and a long document, which is a typical scenario in commercial search engines.

For each subgroup, we design a two-step prompt  template that first prompts LLMs brainstorm a list of tasks, and then generates a concrete example conditioned on the task definition.

### Training

쿼리와 문서의 끝에 `[EOS]` 토큰을 추가한 후, 이를 LLM에 입력하여 마지막 레이어의 `[EOS]` 벡터를 가져와 쿼리 및 문서 임베딩을 얻는다.

Standard InfoNCE loss over the in-batch negatives and hard negatives

(+) adopt the temperature-scaled cosine similarity function

- $τ$ is a temperature hyper-parameter, which is fixed to $0.02$ in our experiments.


## Reference

- [improving-text-embeddings-with-large-language-models (arxiv)](https://arxiv.org/pdf/2401.00368)