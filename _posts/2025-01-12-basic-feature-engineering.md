---
layout: post
title: ML Recap - Basic Feature Engineering 
date: 2025-01-12 23:00:00
giscus_comments: true
categories: ml-fundamentals
toc:
  beginning: true
tags: machine-learning feature-engineering pre-processing
---

numerical & categorical 데이터에 대해서 간단한 전처리 기술을 복습해보자.

## One-hot encoding

Categorical 데이터를 Numerical 데이터로 변환하는 방법이다. 즉, class 를 표현하기 위한 sparse binary vector 를 생성하는 것이다.

### Pros and Cons

- Pros: 단순하고 직관적이다.
- Cons: class 수가 많을경우 차원이 커져서 overfitting 이 발생할 수 있다. 그렇다고 너무 class 수를 제한하면 이 역시 underfitting 이 발생할 수 있다.

### multicollinearity 방지 기법: dropping first class

만약 선형 회귀 모델에 one-hot encoding 을 적용했을때, 다중공선성 이슈를 완화하기 위해 첫번째 카테고리를 제거하는 방법이 있다.

예시를 통해 직관적으로 생각해보자. A, B, C 라는 세 개의 카테고리가 있을때 이를 one-hot encoding 하면 다음과 같은 행렬이 생성된다.

```plaintext
A, B, C
[0, 1, 0]
[1, 0, 0]
[0, 0, 1]
```

여기서 A와 B 가 0일때 C 는 확정적으로 1이다. 즉, A 와 B 의 값에 따라 C 의 값이 정해지는 것이므로 상관관계가 있다고 볼 수 있다. 

이때, 첫번째 카테고리를 제거하면 다음과 같은 행렬이 생성된다.

```plaintext
B, C
[1, 0]
[0, 1]
[0, 0]
```

여기서 [0, 0] 은 당연히 A에 해당된다고 유추가 가능하다. 

Correlation 이슈를 해결하기 위한 또 다른 방법은 PCA (Principal Component Analysis) 를 통해서 차원을 축소하는 방법이 있다.

## Other Encoding methods

### (1) Ordinal encoding

범주형 데이터를 순서를 고려한 숫자로 변환하는 방법이다.

예를 들어, 색상을 빨강, 노랑, 파랑으로 표현하면 1, 2, 3 으로 변환하는 것이다. 또는 어떤 구간을 나눠서 각 구간에 해당되는 클래스를 숫자로 변환하는 것도 가능하다.

직관적인 방법이지만, 서로 관련없는 클래스도 하나의 숫자로 변환하는 것이 문제가 될 수 있어서 underfitting 이 발생할 수 있다.

### (2) Target encoding

범주형 데이터를 대상 변수의 평균값으로 변환하는 방법이다. 범주형 데이터의 cardinality 가 높아서 one-hot encoding 을 적용하기 어려울 때 이 방법이 효과적이다. 주로 zip code 나 region 과 같은 feature 에 적용된다.

예를 들어, 온라인 쇼핑몰에서 고객의 거주 지역에 따른 구매 금액을 예측하려고 한다고 가정해보자.

| 거주 지역 | 구매 금액(타겟) |
|-----------|----------------|
| A         | 100            |
| B         | 150            |
| A         | 200            |
| C         | 300            |
| B         | 100            |
| C         | 400            |

각 거주 지역에 대한 구매 금액의 평균을 계산하여 target encoding 을 수행할 수 있다.

| 거주 지역 | 구매 금액 평균(인코딩 값) |
|-----------|--------------------------|
| A         | (100 + 200) / 2 = 150   |
| B         | (150 + 100) / 2 = 125   |
| C         | (300 + 400) / 2 = 350   |

이런 방식은 orinal encoding 보다는 평균과 같은 통계적인 방식을 접목하므로, 좀 더 smooth 한 결과로 생각할 수 있다.

## References

- [categorical-features (sklearn)](https://scikit-learn.org/stable/modules/preprocessing.html#preprocessing-categorical-features)
