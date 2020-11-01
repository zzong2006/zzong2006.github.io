---
layout: default
title:  "Matrix Calculus"
category: Linear Algebra
order: 2
---

## Types of matrix derivative

|        |                                          |                                                   |                                          |
| :----: | :--------------------------------------: | :-----------------------------------------------: | :--------------------------------------: |
| Types  |                  Scalar                  |                      Vector                       |                  Matrix                  |
| Scalar |     $\frac{\partial y}{\partial x}$      |     $\frac{\partial \mathbf{y}}{\partial x}$      | $\frac{\partial \mathbf{Y}}{\partial x}$ |
| Vector | $\frac{\partial y}{\partial \mathbf{x}}$ | $\frac{\partial \mathbf{y}}{\partial \mathbf{x}}$ |                                          |
| Matrix | $\frac{\partial y}{\partial \mathbf{X}}$ |                                                   |                                          |

* 여기서 scalar 는 하나의 row와 column이 있는 single matrix를 의미
* vector는 열 벡터(column vector)를 의미
* Matrix를 Vector로 또는 그 반대로 미분하는 경우는 없다.

## Derivatives with vectors

### Vector-by-scalar

벡터 $\mathbf{y}=[\begin{array}{llll}y_{1} & y_{2} & \cdots & y_{m}\end{array}]^{\top}$ 를 scalar $x$로 미분한 경우

$$
\frac{\partial \mathbf{y}}{\partial x}=\left[\begin{array}{c}
\frac{\partial y_{1}}{\partial x} \\
\frac{\partial y_{2}}{\partial x} \\
\vdots \\
\frac{\partial y_{m}}{\partial x}
\end{array}\right]
$$

### Scalar-by-vector

scalar $y$를 벡터 $\mathbf{x}=[\begin{array}{llll}x_{1} & x_{2} & \cdots & x_{n}\end{array}]^{\top}$ 로 미분한 경우

$$
\frac{\partial y}{\partial \mathbf{x}}=\left[\begin{array}{llll}
\frac{\partial y}{\partial x_{1}} & \frac{\partial y}{\partial x_{2}} & \cdots & \frac{\partial y}{\partial x_{n}}
\end{array}\right]
$$

### Vector-by-vector

벡터 $$
\mathbf{y}=\left[\begin{array}{llll}
y_{1} & y_{2} & \cdots & y_{m}
\end{array}\right]^{\top}
$$ 를 벡터 $$
\mathbf{x}=\left[\begin{array}{llll}
x_{1} & x_{2} & \cdots & x_{n}
\end{array}\right]^{\top}
$$ 로 미분한 경우

$$
\frac{\partial \mathbf{y}}{\partial \mathbf{x}}=\left[\begin{array}{cccc}
\frac{\partial y_{1}}{\partial x_{1}} & \frac{\partial y_{1}}{\partial x_{2}} & \cdots & \frac{\partial y_{1}}{\partial x_{n}} \\
\frac{\partial y_{2}}{\partial x_{1}} & \frac{\partial y_{2}}{\partial x_{2}} & \cdots & \frac{\partial y_{2}}{\partial x_{n}} \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial y_{m}}{\partial x_{1}} & \frac{\partial y_{m}}{\partial x_{2}} & \cdots & \frac{\partial y_{m}}{\partial x_{n}}
\end{array}\right] .
$$

## Derivatives with matrices

### Matrix-by-scalar

matrix $\mathrm{Y}$ 를 scalar $x$로 미분하는 경우

$$
\frac{\partial \mathbf{Y}}{\partial x}=\left[\begin{array}{cccc}
\frac{\partial y_{11}}{\partial x} & \frac{\partial y_{12}}{\partial x} & \cdots & \frac{\partial y_{1 n}}{\partial x} \\
\frac{\partial y_{21}}{\partial x} & \frac{\partial y_{22}}{\partial x} & \cdots & \frac{\partial y_{2 n}}{\partial x} \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial y_{m 1}}{\partial x} & \frac{\partial y_{m 2}}{\partial x} & \cdots & \frac{\partial y_{m n}}{\partial x}
\end{array}\right]
$$

### Scalar-by-matrix

 scalar $y$를 $p \times q$ 크기의 $\mathrm{X}$ 로 미분하는 경우 (위와 반대)

$$
\frac{\partial y}{\partial \mathbf{X}}=\left[\begin{array}{cccc}
\frac{\partial y}{\partial x_{11}} & \frac{\partial y}{\partial x_{21}} & \cdots & \frac{\partial y}{\partial x_{p 1}} \\
\frac{\partial y}{\partial x_{12}} & \frac{\partial y}{\partial x_{22}} & \cdots & \frac{\partial y}{\partial x_{p 2}} \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial y}{\partial x_{1 q}} & \frac{\partial y}{\partial x_{2 q}} & \cdots & \frac{\partial y}{\partial x_{p q}}
\end{array}\right] .
$$

* matrix-by-scalar 결과를 뒤집은 것과 별 차이가 없다.

## Layout conventions

미분 결과를 표현하는 방법에는 두 가지가 존재하는데, 하나는 Numerator layout 그리고 다른 하나는 Denominator layout이 있다.

둘 다 옳은 방법이지만, 대중적으로 사용하는 방법은 numerator layout이라고 한다.

둘의 간단한 차이를 보이는 예시는 다음과 같다.

### Numerator-layout notation

$$
\frac{\partial \mathbf{y}}{\partial \mathbf{x}}=\left[\begin{array}{cccc}
\frac{\partial y_{1}}{\partial x_{1}} & \frac{\partial y_{1}}{\partial x_{2}} & \cdots & \frac{\partial y_{1}}{\partial x_{n}} \\
\frac{\partial y_{2}}{\partial x_{1}} & \frac{\partial y_{2}}{\partial x_{2}} & \cdots & \frac{\partial y_{2}}{\partial x_{n}} \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial y_{m}}{\partial x_{1}} & \frac{\partial y_{m}}{\partial x_{2}} & \cdots & \frac{\partial y_{m}}{\partial x_{n}}
\end{array}\right]
$$

### Denominator-layout notation

$$
\frac{\partial \mathbf{y}}{\partial \mathbf{x}}=\left[\begin{array}{cccc}
\frac{\partial y_{1}}{\partial x_{1}} & \frac{\partial y_{2}}{\partial x_{1}} & \cdots & \frac{\partial y_{m}}{\partial x_{1}} \\
\frac{\partial y_{1}}{\partial x_{2}} & \frac{\partial y_{2}}{\partial x_{2}} & \cdots & \frac{\partial y_{m}}{\partial x_{2}} \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial y_{1}}{\partial x_{n}} & \frac{\partial y_{2}}{\partial x_{n}} & \cdots & \frac{\partial y_{m}}{\partial x_{n}}
\end{array}\right]
$$

#### Difference?

$y$는 $m\times 1$의 column vector 그리고 $x$는 $n \times 1$의 column vector

Numerator의 경우 결과는 $m \times n$ matrix

Denominator의 경우 결과는 $n \times m$ matrix

## Identities

Matrix와 vector가 섞여있는 경우, matrix 곱은 교환법칙이 성립하지 않기 때문에, 미분을 계산하는 것은 매우 헷갈린다.

이를 위해서 이미 특정 조합들에 대해 미분 계산 결과가 존재한다. 이를 참고하자.

공부하면서 필요한 수식들은 추가적으로 채워 넣도록 하겠음



### Vector-by-vector identities

|            Condition             |                          Expression                          | Numerator layout, i.e. by $y$ and $\mathbf{x^T}$ |
| :------------------------------: | :----------------------------------------------------------: | :----------------------------------------------: |
| **a** is not a function of **x** |      $\frac{\partial \mathbf{a}}{\partial \mathbf{x}}=$      |                   $\mathbf{0}$                   |
|                                  |      $\frac{\partial \mathbf{x}}{\partial \mathbf{x}}=$      |                  $\text { I }$                   |
| **A** is not a function of **x** | $\frac{\partial \mathbf{x}^{\top} \mathbf{A}}{\partial \mathbf{x}}=$ |               $\mathbf{A}^{\top}$                |
| **A** is not a function of **x** | $\frac{\partial \mathbf{A} \mathbf{x}}{\partial \mathbf{x}}=$ |                   $\mathbf{A}$                   |
|                                  |                                                              |                                                  |



### Scalar-by-vector identities

|            Condition             |                          Expression                          | Numerator layout,i.e. by$\mathbf{x}^{\top}$; result is row vector |
| :------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| **A** is not a function of **x** | $\frac{\partial \mathbf{x}^{\top} \mathbf{A} \mathbf{x}}{\partial \mathbf{x}}=$ | $\mathbf{x}^{\top}\left(\mathbf{A}+\mathbf{A}^{\top}\right)$ |
|                                  | $\frac{\partial(\mathbf{x} \cdot \mathbf{x})}{\partial \mathbf{x}}=\frac{\partial \mathbf{x}^{\top} \mathbf{x}}{\partial \mathbf{x}}=\frac{\partial\|\mathbf{x}\|^{2}}{\partial \mathbf{x}}=$ |                    $2 \mathbf{x}^{\top}$                     |
| **a** is not a function of **x** | $\frac{\partial\|\mathbf{x}-\mathbf{a}\|}{\partial \mathbf{x}}=$ |           $\frac{(\mathbf{x}-\mathbf{a})^{\top}}{\|\mathbf{x}-\mathbf{a}\|}$           |

