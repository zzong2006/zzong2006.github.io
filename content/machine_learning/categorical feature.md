---
title: "categorical feature"
tags:
  - classification
  - feature_engineering
aliases: [category feature, 범주형 변수]
---

# A) Categorical Feature ?

값이 순서 없는 몇 개의 범주 중 하나인 feature 다. 색상(`red`/`blue`), 지역 코드, 사용자 등급 같은 것이 여기 들어간다. 값 사이에 크기 비교가 성립하지 않으므로 숫자로 그냥 바꿔 넣으면 모델이 없는 순서를 학습한다. 그래서 [[Label Encoding]] 이나 one-hot 처럼 표현 방식을 먼저 정해야 한다.

# B) 전처리

`sklearn.compose.ColumnTransformer` 를 쓰면 열마다 다른 변환을 지정할 수 있다. 한 열은 `OneHotEncoder` 로 펼치고 나머지는 `passthrough` 로 그대로 통과시키는 식이다.

범주 수가 많으면 one-hot 은 차원이 폭발하므로 [[hashing trick]] 이나 embedding 으로 넘어간다. TensorFlow 계열에서는 feature column 이 이 선택(one-hot / hashing / embedding)을 한 인터페이스로 묶어 제공했다.

# C) References

* [Google Developers Blog: Introducing TensorFlow Feature Columns](https://developers.googleblog.com/2017/11/introducing-tensorflow-feature-columns.html)
