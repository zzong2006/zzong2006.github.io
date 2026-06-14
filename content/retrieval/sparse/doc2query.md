---
tags: ["retrieval", "IR", "sparse_retrieval", "nlp", "paper_review", "y2019"]
---

# A) doc2query ?

![550](https://i.imgur.com/juywFdO.png#outline)

문서가 주어졌을 때 질의를 생성하도록 학습된 [[seq2seq]] [[transformer]] 모델로 미리 정의된 합성 질의들을 각 문서마다 생성한다. 이후에 [[BM25]] 로 확장된 문서의 retrieval 작업을 수행한다.

# B) References

* [Document Expansion by Query Prediction](https://arxiv.org/abs/1904.08375)
