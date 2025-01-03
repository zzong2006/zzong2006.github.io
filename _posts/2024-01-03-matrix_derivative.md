---
title: "행렬 미분 기초 (with Trace)"
last_modified_at: 2025-01-03 12:00:00 -0000
categories:
  - Derivative
tags:
  - Matrix
  - Calculus
---


행렬의 대각 성분의 합인 Trace ($ \text{Tr} $) 가 포함된 행렬 미분 규칙에 대해 정리해보려 한다. 

---

## 규칙 1: $ \frac{\partial}{\partial W_d} \text{Tr}(A W_d) = A^\top $

여기서 $ A $는 $ m \times n $ 행렬이고 $ W_d $는 $ n \times m $ 행렬이라고 가정한다.

행렬 미분의 결과는 미분한 행렬의 크기를 따라야 하므로, 이를 맞추기 위해서 transpose 를 취한다고 생각하면 편하다.

(참고) Trace 는 정사각행렬에 대해서만 정의된다.

### 예시

간단한 예시를 들어보자.

$$
A = 
\begin{bmatrix}
1 & 2 \\
3 & 4 \\
\end{bmatrix}, \quad
W_d = 
\begin{bmatrix}
x & y \\
z & w \\
\end{bmatrix}
$$

$ \text{Tr}(A W_d) $는 다음과 같이 계산된다.

$$
\text{Tr}(A W_d) = \text{Tr}\left(
\begin{bmatrix}
1 & 2 \\
3 & 4 \\
\end{bmatrix}
\begin{bmatrix}
x & y \\
z & w \\
\end{bmatrix}
\right) \\[10pt]
= \text{Tr}\left(
\begin{bmatrix}
1x + 2z & 1y + 2w \\
3x + 4z & 3y + 4w \\
\end{bmatrix}
\right) \\[10pt]
= (1x + 2z) + (3y + 4w)
$$

이제 $ W_d $ 의 각 원소에 대해 편미분을 계산해보자.

- $ \frac{\partial}{\partial x} \text{Tr}(A W_d) = 1 $
- $ \frac{\partial}{\partial y} \text{Tr}(A W_d) = 3 $
- $ \frac{\partial}{\partial z} \text{Tr}(A W_d) = 2 $
- $ \frac{\partial}{\partial w} \text{Tr}(A W_d) = 4 $

Trace 연산은 스칼라 값으로 계산되지만, 이를 행렬 $ W_d $ 의 원소 각각에 대해 편미분하면, 원소별 변화율을 포함한 결과가 행렬 형태로 나타난다. 그 결과, 아래와 같이 transpose 된 A가 나온다.

$$
\frac{\partial}{\partial W_d} \text{Tr}(A W_d) = A^\top =
\begin{bmatrix}
1 & 3 \\
2 & 4 \\
\end{bmatrix}
$$
