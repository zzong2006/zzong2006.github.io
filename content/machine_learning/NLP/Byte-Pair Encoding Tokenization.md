---
title: "Byte-Pair Encoding Tokenization (BPE)"
tags: tokenization 
aliases: ["BPE", "byte-level BPE", "BBPE"]
---

**BPE 는 가장 자주 붙어 나오는 두 조각을 하나로 합치는 일을 반복해 어휘를 만든다.** 어휘 크기는 사람이 정하는 [[hyperparameter]] 이고, 그 크기가 될 때까지 합친다.

여섯 단어짜리 데이터로 직접 합쳐 보는 손계산 예시와, 요즘 LLM 이 쓰는 byte-level BPE 와의 비교는 [[tokenization]] 노트에 있다.

# A) 어휘를 만드는 순서

1. 문장을 단어로 나눈다. 공백 기준이든 정규식이든 상관없다.
2. 각 단어를 가장 작은 단위로 쪼갠다. 예를 들어 `car` 는 `c` `a` `r` 이 된다. 이 단위들이 처음 어휘다.
3. 나란히 붙은 두 조각을 전부 세고, 가장 많이 나온 쌍을 하나로 합쳐 어휘에 넣는다. 예를 들어 `c a` 가 가장 많으면 `ca` 가 추가돼 어휘가 `c` `a` `r` `ca` 넷이 된다.
4. 합친 조각도 하나로 보고 3 을 반복한다. 어휘가 정한 크기가 되면 멈춘다.

새 문장을 토큰화할 때는 학습 때 배운 합치기 규칙을 **배운 순서대로** 적용한다.

# B) 처음 보는 입력 처리

**처음 보는 단어는 아는 조각으로 쪼개진다.** 단어 단위 사전과 달리 단어 전체가 `[UNK]` 가 되지 않는다.

- 위 어휘로 `card` 를 토큰화하면 `ca` `r` 까지는 아는 조각이다.
- `d` 는 처음 어휘에 없던 글자다.

**처음 보는 글자는 `[UNK]` 가 된다.**

- 그래서 `card` 는 `ca` `r` `[UNK]` 이 된다.
- 출발 단위가 문자면 어떤 조합으로도 처음 어휘에 없던 글자를 만들 수 없다.
- 이 문제를 없앤 것이 아래 byte-level BPE 다.

# C) Byte-level BPE

출발 단위를 문자 대신 UTF-8 바이트로 바꾼 BPE 다. GPT-2 가 처음 썼고, 지금은 GPT 계열·Llama 3·Qwen·DeepSeek-V3 같은 대부분의 LLM 이 쓴다.

- 바이트는 256 가지뿐이라 처음 어휘가 256 개로 끝난다.
- 어떤 글자든 바이트로는 적을 수 있으므로 `[UNK]` 가 나오지 않는다.
- 한글은 한 글자가 3 바이트다. 자주 나온 글자는 바이트 3 개가 병합돼 토큰 하나가 되고, 드문 글자는 바이트 조각으로 남는다.

# D) Related

- [[WordPiece]] 와 [[unigram lanugage model|Unigram]] 도 subword 토크나이저다. 어떤 조각을 어휘에 넣을지 고르는 기준이 다르다.
- OpenAI 의 BPE 토크나이저 구현인 [tiktoken](https://github.com/openai/tiktoken) 은 README 기준으로 비슷한 오픈소스 토크나이저(Hugging Face `GPT2TokenizerFast`)보다 3~6 배 빠르다.

# References

- [Neural Machine Translation of Rare Words with Subword Units (Sennrich et al., 2016)](https://arxiv.org/abs/1508.07909) — 단어를 subword 로 나누는 데 BPE 를 처음 쓴 논문
- [Language Models are Unsupervised Multitask Learners (GPT-2, Radford et al., 2019)](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) — byte-level BPE
