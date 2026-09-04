---
title: "Frobenius norm"
aliases: ["F-norm", "프로베니우스 노름"]
tags:
  - math
  - linear_algebra
---

# A) Frobenius Norm

## A.1) 정의

[[matrix]]의 [[norm]] 계산 방식으로, 모든 원소의 제곱합의 제곱근이다.

$$
\|A\|_{\mathrm{F}}=\sqrt{\sum_{i=1}^{m}\sum_{j=1}^{n}|a_{ij}|^{2}}=\sqrt{\operatorname{trace}(A^{*}A)}=\sqrt{\sum_{i=1}^{\min(m,n)}\sigma_i^2}
$$

## A.2) 계산 방법

| 방법 | 수식 | 설명 |
|------|------|------|
| 원소별 | $\sqrt{\sum_{i,j}\lvert a_{ij} \rvert^2}$ | 모든 원소 제곱합의 제곱근 |
| Trace | $\sqrt{\text{tr}(A^*A)}$ | $A^*A$의 대각합의 제곱근 |
| Singular value | $\sqrt{\sum_i \sigma_i^2}$ | 특이값 제곱합의 제곱근 |

## A.3) 예시

$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}
$$

$$
\|A\|_F = \sqrt{1^2 + 2^2 + 3^2 + 4^2} = \sqrt{30} \approx 5.48
$$

## A.4) 특징

- 벡터의 L2 norm을 행렬로 일반화한 것
- Submultiplicative: $\|AB\|_F \leq \|A\|_F \|B\|_F$
- Unitarily invariant: $\|UAV\|_F = \|A\|_F$ (U, V가 유니터리 행렬일 때)

## A.5) 활용

- 행렬 근사 오차 측정 (e.g., [[machine_learning/Singular Value Decomposition|SVD]] truncation)
- [[Regularization]]: $\|W\|_F^2$ (weight decay)
- 행렬 간 유사도 비교

## A.6) 참고

- [[norm]]
- [[matrix]]
- [[machine_learning/Singular Value Decomposition|SVD]]
