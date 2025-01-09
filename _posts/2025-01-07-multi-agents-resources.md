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



## Multi-Agent 관련 리소스

### Agent 방향에 대한 의견들 (**from [reddit comment](https://www.reddit.com/r/LocalLLaMA/comments/1hqt79i/top_agent_only_27_away_from_degreeholding_humans/)**)

- No easy way to really control termination. Letting the LLM decide to terminate with a string is a poor design. In my case, my termination is just that the **LLM generates no more executable code blocks**.

- No easy way to control executable vs. non-executable code blocks. In my case, I just extended the class to have an `executable` attribute with another `# execution: true`

- Control hallucinations: Crucial element (even for top LLMs like sonnet-3.5-new) is to find ways to catch hallucinations before they get bad. A key to success was to not let the **LLM do more than 1 executable code per turn**, else it tends to make up stuff.

- Good prompt engineering: Being able to be clear about what the system prompt contains, and how each tool has good suggestions about what to do next with the output it generated.

- Multi-agent is not better than just single agent with tools. It's much worse usually, I don't know why people are so excited about multi-agent. I think the tools paradigm is much better, where the tool might happen to be really an agent. But nominally better to build a tool that does more to offload what agent has to think about. Dynamic creation of tools (program synthesis) is future.

- It's better to allow the LLM freedom to code but give access to reliable tools. It's ok if one uses function calling to access a finite set of tools (say ~30 or so, depending upon the model) as long as it has access to code and can call those same functions via code. But a pure function calling is very limiting to a general agent.

## Rag-Agent

Agentic RAG: RAG 에이전트는 **검색 도구(Retriever Tool)**를 사용하는 에이전트

- 스스로 검색 쿼리를 작성: 더 관련성 높은 문서를 찾기 위해 질문을 재구성.
- 결과를 평가하고 재검색: 결과가 부족하면 재검색.

## References

- [huggingface/smolagents](https://github.com/huggingface/smolagents): huggingface 에서 제공하는 agent 라이브러리
- [GAIA (github)](https://github.com/aymeric-roucher/GAIA): Multi-Agent 벤치마크 (2023, Meta)
- [Orchestrating Agents](https://cookbook.openai.com/examples/orchestrating_agents): OpenAI 에서 제공하는 agent 예제
- [Executable Code Actions Elicit Better LLM Agents (arxiv, 2024)](https://arxiv.org/abs/2402.01030)
- [AutoGen (github)](https://github.com/microsoft/autogen): Agent library from Microsoft
- [Building Effective Agents (anthropic blog)](https://www.anthropic.com/research/building-effective-agents)