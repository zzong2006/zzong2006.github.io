---
tags: ["tokenization"]
aliases: ["unigram"]
---

# A) Unigram Language Model ?

merge 를 기반으로 수행하는 [[Byte-Pair Encoding Tokenization|BPE]] 또는 [[WordPiece]] 방식과 다르게, 유니그램은 가능한 기본 단어들을 모두 깔아놓고 loss 에 가장 영향이 적은 심볼들을 제거한다. 한번에 대략 10~20% 정도의 심볼을 제거하는데, 사용자가 설정한 단어집 크기에 도달할때까지 제거를 수행한다.

이렇다보니 새로운 텍스트에 대해서 토크나이징 하는 방식이 여러개 존재한다. 예를 들면, 유니그램 모델이 학습한 이후 아래와 같은 단어집을 가지고 있다고 가정하자.

```
["b", "g", "h", "n", "p", "s", "u", "ug", "un", "hug"],
```

`"hugs"` could be tokenized both as `["hug", "s"]`, `["h", "ug", "s"]` or `["h", "u", "g", "s"]` . So which one to choose?

유니그램은 각 토큰에 대한 확률값을 가지고 있기때문에, 실제로 토크나이징 할때 가장 높은 확률을 가진 토큰화 결과를 출력한다. (그런데 여기서 높은 확률은 무엇인지..?)

일반적으로 [[SentencePiece]] 라이브러리에서 사용된다.

# B) References
