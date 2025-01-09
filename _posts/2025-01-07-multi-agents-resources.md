---
layout: post
title: Multi-Agent 관련 리소스 모음
date: 2025-01-07 16:00:00
giscus_comments: true
categories: survey
toc:
  beginning: true
  sidebar: left
tags: LLM agent
---

## Some comments

**from reddit**

> Multi-agent is not better than just single agent with tools. It's much worse usually, I don't know why people are so excited about multi-agent. I think the tools paradigm is much better, where the tool might happen to be really an agent. But nominally better to build a tool that does more to offload what agent has to think about. Dynamic creation of tools (program synthesis) is future.

> It's better to allow the LLM freedom to code but give access to reliable tools. It's ok if one uses function calling to access a finite set of tools (say ~30 or so, depending upon the model) as long as it has access to code and can call those same functions via code. But a pure function calling is very limiting to a general agent.


## References

- [huggingface/smolagents](https://github.com/huggingface/smolagents): huggingface 에서 제공하는 agent 라이브러리
- [GAIA (github)](https://github.com/aymeric-roucher/GAIA): Multi-Agent 벤치마크 (2023, Meta)
- [Orchestrating Agents](https://cookbook.openai.com/examples/orchestrating_agents): OpenAI 에서 제공하는 agent 예제
- [Executable Code Actions Elicit Better LLM Agents (arxiv, 2024)](https://arxiv.org/abs/2402.01030)
- [AutoGen (github)](https://github.com/microsoft/autogen): Agent library from Microsoft
- [Building Effective Agents (anthropic blog)](https://www.anthropic.com/research/building-effective-agents)