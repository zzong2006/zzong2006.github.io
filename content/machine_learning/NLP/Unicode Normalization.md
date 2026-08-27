---
tags: ["NLP"]
aliases: ["유니코드 정규화"]
---

# Unicode Normalization ?

Compatibility Equivalence 와 canonical equivalence 라는 두 이슈를 해결하기 위한 솔루션을 의미한다.

## Compatibility Equivalence

같은 의미를 가지지만 실제 유니코드값이 다른 경우가 존재한다. 예를 들어, individuality 는 🅘🅝🅓🅘🅥🅘🅓🅤🅐🅛🅘🅣🅨 와 같은 특수문자로 표현할 수 있는데, 이는 당연히 다른 유니코드를 가진다. 다른 예로는 한자 쇠금 (金) 이라고 해도 ‘ 금 ’ 을 입력하고 변환한 金과 ‘ 김 ’ 을 입력하고 변환한 金의 유니코드가 다르다.

## Canonical Equivalence

문자가 나뉘어져 있지만 합치면 의미를 가지는 경우가 있다. 예를 들어, `가` 는 `ㄱ ㅏ` 라는 문자를 합친 (conjoined) 결과와 동일하다.

# Solution (python)

python 에서는 `unicodedata` 라는 라이브러리를 통해 유니코드 정규화를 진행할 수 있다.

```python
unicodedata.normalize("NFKC", "Ⓣⓗⓐⓝⓚⓢ ⓕⓞⓡ ⓡⓔⓐⓓⓘⓝⓖ 감사합ㄴㅣ다")
# 'thanks for reading 감사합니다'
```

개인적으로 한가지 아쉬운 점은 한글의 경우 아래 모음은 처리하지 못한다는 것이다. 예를 들어 `김` 의 경우 `ㄱㅣㅁ` 으로 작성해도 `기ㅁ` 으로 정규화된다.

`NFKC` 는 정규화 옵션인데, `KC` 를 이용한 `Normalized Form` 이라는 뜻이다. compatibility equivalence 를 먼저 처리하고, 이때 나누어진 문자를 합쳐서 canonical equivalence 를 해결한다.  
예시) `ℌ ̧` → `H ̧` → `Ḩ`

# References

* [What on Earth is Unicode Normalization? | Towards Data Science](https://towardsdatascience.com/what-on-earth-is-unicode-normalization-56c005c55ad0)
