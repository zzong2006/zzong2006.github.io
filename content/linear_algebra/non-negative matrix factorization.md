---
tags: ["linear_algebra"]
---

# A) Non-negative Matrix Factorization (NMF)

## A.1) 참고

- [Wikipedia - Non-negative matrix factorization](https://en.wikipedia.org/wiki/Non-negative_matrix_factorization)

## A.2) 정의

Non-negative matrix factorization(NMF)는 [[Linear Algebra]]와 다변량 분석(multivariate analysis)에 속하는 알고리즘 중 하나이다.
이 기법은 주어진 행렬 $\mathbf{V}$를 두 개의 행렬 $\mathbf{W}$와 $\mathbf{H}$로 분해(factorize)하는 방식으로 이루어진다.
여기서 중요한 점은 세 행렬 $\mathbf{V}, \mathbf{W}, \mathbf{H}$의 모든 원소가 **비음수(non-negative)** 값을 가진다는 것이다.

## A.3) 특징

NMF는 아이템이 가진 특성(feature)의 중요도와 사용자의 특정 특성에 대한 선호도를 잘 설명할 수 있다는 장점이 있다. 그러나 실제 응용 상황에서는 일반적인 행렬 분해(Matrix Factorization, MF)에 비해 성능 면에서 다소 부족한 결과를 보이는 경우가 많다.
