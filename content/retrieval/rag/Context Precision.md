---
title: "Context Precision"
tags:
  - retrieval
  - RAG
  - evaluation
  - metrics
aliases: [Context precision]
---

# A) Context Precision

Context Precision은 [[RAGAS]]에서 retriever가 가져온 context 중 실제 답변에 도움이 되는 context가 상위 rank에 잘 배치되어 있는지를 보는 지표다. 단순히 관련 context를 하나라도 찾았는지보다, 관련 context가 앞쪽에 있는지를 더 중요하게 본다.

# B) 직관

RAG에서는 LLM이 앞쪽 context를 더 강하게 참고하거나, context window 때문에 뒤쪽 정보를 충분히 쓰지 못할 수 있다. 그래서 [[Retrieval-Augmented Generation]] 평가에서는 recall만 보지 말고 Context Precision처럼 ranking quality를 함께 봐야 한다.

# C) References

- [RAGAS](https://docs.ragas.io/)
