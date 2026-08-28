---
title: "stopword"
tags: ["NLP"]
---

# Stopword ?

분석을 하는 것에 있어서 큰 도움이 되지 않는 단어들

예) I, my, me, over, 조사, 접미사

# NLTK 에서 영어의 불용어 확인하기

```python
from nltk.corpus import stopwords  
stopwords.words('english')[:10]  
# ['i', 'me', 'my', 'myself', 'we', 
# 'our', 'ours', 'ourselves', 'you', 'your']  
```

# References

  * https://wikidocs.net/22530 (딥러닝을 이용한 자연어 처리 입문)
