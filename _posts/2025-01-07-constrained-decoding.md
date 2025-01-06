---
layout: post
title: LLM 이 json 응답을 잘 하도록 하는법
date: 2025-01-07 10:00:00
giscus_comments: true
categories: inference
toc:
  beginning: true
  sidebar: left
tags: LLM 
---

## Constrained decoding

![constrained decoding](https://blog.mlc.ai/img/xgrammar/constrained-decoding.png){: width="80%"}

Constrained decoding is a common technique to enforce the output format of an LLM. As shown in the figure above, an LLM engine maintains an internal state of the desired structure and the history of generated tokens. When generating a new token, the engine identifies tokens that may violate the required structure and masks them off in the logits. The masking causes the sampling process to avoid invalid tokens and only generate valid ones. In this example, only tokens `true` and `false` are allowed in the first decoding step, and only `,` and `,\n` are allowed in the second decoding step.

## Context-free grammars (CFGs)

Although JSON schema is a popular method for structure specification, it cannot define code syntax or recursive structures (such as nested brackets of any depth). Context-free grammars (CFGs) provide a more powerful and general representation that can describe many complex structures. 



## References

- [Achieving Efficient, Flexible, and Portable Structured Generation with XGrammar](https://blog.mlc.ai/2024/11/22/achieving-efficient-flexible-portable-structured-generation-with-xgrammar)