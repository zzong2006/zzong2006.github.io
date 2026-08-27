---
tags: ["NLP"]
---

# A) Tokenization 요약

huggingface: [토크나이저 요약](https://huggingface.co/docs/transformers/tokenizer_summary)

사전 학습된 모델은 훈련 데이터와 동일한 규칙으로 토큰화된 입력을 제공해야만 제대로 작동합니다.

큰 어휘 크기는 모델의 입력 및 출력 계층에 거대한 임베딩 매트릭스를 요구하며, 이는 메모리와 시간 복잡도를 증가시킵니다.

## A.1) 문자 단위 토큰화

문자 단위 토큰화는 매우 간단하고 메모리와 시간 복잡도를 크게 줄일 수 있지만, 모델이 의미 있는 입력 표현을 학습하기 어렵게 만듭니다.

Transformers 모델은 단어 수준과 문자 수준 토큰화의 혼합인 서브워드 토큰화를 사용합니다.

## A.2) 서브워드 (subword) 토큰화

서브워드 토큰화 방식은 단어 단위가 아닌 문자 단위의 토크나이징 방식입니다.

가장 많이 등장하는 단어는 vocab 에 포함시키고, 잘 등장하지 않는 단어들은 자주 등장하는 부분 단어 (subword) 로 나누는 방식입니다.  
예를 들어, refactoring 같은 단어는 re, factor, ing 와 같은 subword 로 나눌 수 있습니다.

[[Byte-Pair Encoding Tokenization|BPE]], [[SentencePiece]] 등

# B) Special Tokens

[[Tokenizers(huggingface)]] 에서는 token 들을 종류별로 나눈다.

1. bos_token: 문장의 시작을 알리는 토큰
2. eos_token: 문장의 끝을 알리는 토큰
3. unk_token: [[out-of-vocabulary]] 토큰을 나타내는 특수 토큰
4. sep_token: 같은 입력 내 서로 다른 두 문장의 분리를 나타내는 토큰
5. pad_token: batch 목적으로 array 들의 구분을 나타내는 토큰
6. cls_token: 입력 (input) 의 클래스를 나타내는 토큰
7. mask_token: [[Bidirectional Encoder Representations from Transformers|BERT]] 와 같은 [[masked language modeling]] 에서 사용하는 masked token

# C) References
