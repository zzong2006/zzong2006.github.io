---
tags: ["embedding", "dense_retrieval", "NLP", "BERT"]
---

# Sentence Transformers ?

# Code Reivew

## Encoding

문장이 배치로 주어지면, 문장 길이가 가장 짧은 순서대로 문장을 정렬해서 배치로 가져온다.

```python
length_sorted_idx = np.argsort([-self._text_length(sen) for sen in sentences])
sentences_sorted = [sentences[idx] for idx in length_sorted_idx]
```

# References
