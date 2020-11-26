---
layout: default
title:  "TF-IDF"
category: Deep Learning
order: 4.3
---

> Term Frequency - Inverse Document Frequency

여러 문서로 이루어진 문서군 $D$ 이 있을 때 **어떤 단어 $t$가 특정 문서 $d$내에서 얼마나 중요한 것인지를 나타내는 통계적 수치**이다.

TF 와 IDF를 곱한 값으로 계산된다.

## Term frequency (TF)

특정한 단어가 문서 내에 얼마나 자주 등장하는지를 나타내는 값. 

TF를 구하는 방법에는 여러가지가 존재한다.

### log-scale Frequency

$$
t f(t, d)=\log (f(t, d)+1)
$$

- $f(t, d)$ 는 단어 $t$ 가 문서 $d$에 나타난 빈도수를 나타냄
  - 값이 너무 크지 않도록 log 그리고 log (0)를 방지하기 위해 1을 더함

이 값이 높을수록 문서에서 중요하다고 생각할 수 있다. 

## Inversed Document Frequency (IDF)

아무리 특정 문서에 자주 등장한다고 하여도, 그 문서에만 집중적으로 등장하지 않고, 다른 여러 문서에도 자주 등장한다면 그 단어는 분명 중요한 단어는 아닐 것이다. (예: 관사 the, a 등)

이를 방지하기 위해 IDF의 개념이 등장한다. IDF 값은 낮을수록 문서군 전체에 많이 등장하여 중요도가 낮다는 의미를 가지고, 높을 수록 특정 문서에만 집중적으로 등장한다는 의미를 가진다.

$$
i d f(t, D)=\log \frac{|D|}{|\{d \in D: t \in d\}|+1}
$$

* $D$ 는 전체 문서 집합
* $$|\{d \in D: t \in d\}|$$  는 $t$ 가 나오는 문서 $d$ 의 총 개수


