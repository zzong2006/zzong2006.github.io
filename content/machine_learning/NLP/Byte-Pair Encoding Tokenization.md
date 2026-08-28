---
title: "Byte-Pair Encoding Tokenization"
tags: ["tokenization"]
aliases: ["BPE"]
---

# A) Byte-Pair Encoding Tokenization ?

단어집에 가장 작은 단위의 문자를 넣고, 사용자가 설정한 크기가 될때까지 가장 빈도수가 높은 문자를 조합하여 단어집에 계속 넣는다.

즉, vocabulary size 를 [[hyperparameter]] 로 입력받는다.

# B) Step by step Method

1. 문장을 단어로 나눈다. 이때 어떤 토크나이저를 사용하든 상관 없다.
2. 나눠진 단어들을 문자 단위 (가장 작은 단위) 로 나눈다. 예를 들면, car 는 c, a, r 로 나눠진다.
3. 그리고 단어집에 모두 넣고, 각 단위들을 조합해서 가장 많이 등장하는 조합어를 단어집에 넣는다. 예를 들어, c, a, r 에서 ca 가 가장 많이 나온다고하면, c, a, r, ca 로 총 4 개 크기의 단어집이 구성된다.
4. 이 작업을 특정 크기가 될때까지 반복한다.
5. 이후 [[out-of-vocabulary]] 단어가 등장하는 경우에도, 가장 작은 단위로 나눠서 빈도수가 높은 단어는 매칭을 시키고 나머지는 unknown `[UNK]` 토큰을 붙여준다. 예를 들어, card 를 토크나이징하면, ca, r, `[UNK]` 이라는 토큰으로 나눠지는 것이다.

# C) Related

[[WordPiece]] 토크나이저 역시 subword 토크나이징 방식이다.

openAI 에서 지원하는 토크나이저 tiktoken. 허깅페이스 토크나이저보다 최대 6 배 빠르다고 한다: [GitHub - openai/tiktoken](https://github.com/openai/tiktoken)

# D) References
