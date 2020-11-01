---
layout: default
title:  "Vector basic"
category: Linear Algebra
order: 1
---

#### Vector Space (벡터 공간)

선형 결합(linear combination)으로 만들어지는 공간

* 선형 결합: 벡터들에게 어떠한 상수를 곱한 다음 그 결과들을 더하는 연산
  * $\mathbf{c} = \alpha_1\mathbf{a} + \alpha_2 \mathbf{b}$

#### Basis Vector (기저 벡터)

벡터 공간을 만드는 벡터를 뜻함

* 만약 기저 벡터가 서로 수직이라면, 이러한 기저 벡터를 **orthonormal**(정규직교) basis vector라고 부름
* 이때, 기저 벡터는 단위 벡터(unit vector)여야만 정규직교 벡터라 부르고, 그렇지 않다면 **orthogonal**(직교) vector라고 부른다.
  * 단위 벡터란 크기가 1인 벡터를 의미함

아래 그림은 정규직교 기저 벡터 $\boldsymbol{k}$, $\boldsymbol{i}$, $\boldsymbol{j}$ 를 나타냄

<img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/3D_Vector.svg" alt="Standard basis - Wikipedia" style="zoom:67%;" />

#### Orthogonal Matrix (직교 행렬)

직교 행렬은 행렬의 row와 column (vector)들이 자기 자신을 제외한 나머지 모든 row 와 column (vector)들과 직교이면서 동시에 단위 벡터인 행렬을 의미

* Orthonormal vector들을 행렬에 넣은 것과 같음

![image-20201101171700300](https://i.loli.net/2020/11/01/rxJiG9jyUqdse76.png)

직교 행렬 $Q$는 다음을 만족한다: $Q^TQ=I$ ($I$는 identity matrix)

![image-20201101171642395](https://i.loli.net/2020/11/01/OSHjktIB4neDa2s.png)

* $I$의 원소 $I_{i, j}$ 에서 $i=j$인 경우는 서로 같은 vector간 곱이므로, 단위 행렬의 크기를 계산한 것과 같다. 즉, $1$이 계산되고, 나머지 $i \neq j$의 경우는 $0$이 나옴(서로 직교)

#### Linear independent (선형 독립)

한 기저 벡터를 나머지 기저 벡터의 선형 결합으로 만들 수 없다면, 각 벡터는 선형 독립 한다고 한다.

#### Rank (행렬의 계수)

$n$ 개의 행으로 이루어진 행렬 $\mathbf{A}$은 $n$개의 벡터로 이루어져 있다고 생각할 수 있다.

$\mathbf{A}$가 선형 독립인 $n$ 개의 행으로 구성되어 있다면, $\mathbf{A}$의 계수, 즉, rank는 $n$ 이라고 한다.

* 즉, 행렬의 어떤 벡터를 그 벡터를 제외한 나머지 $k(\lt n)$개의 벡터로 표현할 수 있다면, 그 행렬의 계수는 $k$이다. 그렇지 못한다면, 그 계수는 $n$이다.
* 아래의 식은 rank가 3인 $\mathbf{A}$ 의 예이다.

$$
\mathbf{A} = \left[\begin{array}{lll}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{array}\right]
$$

계수를 알면 벡터 공간을 알 수 있다. 

* 1이면 벡터공간이 1차원이고(직선), 2이면 2차원(평면)이다.

##### Full Rank (최대 계수)

행렬 계수 = 행(벡터)의 차원 이면, 행렬이 full rank를 가졌다고 한다.

### Inverse Matrix (역행렬)

$n\times n$ 행렬 $A$, $B$에 대하여, 다음 세 조건이 조건이 성립할 경우, $B$를 $A$의 역행렬이라고 하며, $B$를 $\displaystyle A^{-1}$와 같이 표기한다. 

1. ${\displaystyle AB=I_{n}}$
2. ${\displaystyle BA=I_{n}}$
3. ${\displaystyle AB=BA=I_{n}}$

#### Singular matrix (특이 행렬)

만약, 역행렬을 가지고 있지 않은 행렬이 존재한다면, 그 행렬을 singular matrix라고 부른다.

#### 역행렬과 관련된 중요한 성질들

어떤 역행렬 $A$에 대한 다음 성질들은 서로 필요충분조건이다. 즉, 어떤 성질 (1)을 만족하는 행렬이 존재하면, 그 행렬은 성질, (2), (3), (4) … 를 모두 만족한다.

1. $A$는 역행렬을 가진다. 즉, 특이 행렬이 아니다

2. 최대 계수를 가진다.

3. 모든 행이 선형독립이다. 

4. 모든 열이 선형독립이다.

5. $A$의 행렬식(determinant)은 0이 아니다.

6. $A^T A$는 positive definite (정부호) 대칭 행렬이다.

   * 대칭 행렬은 아래의 조건을 만족하는 행렬 $\mathrm{B}$이다.

   * $$
     \mathrm{B}=\left[\begin{array}{ll}
     a & b & c \\
     b & d & e \\
     c & e & f
     \end{array}\right], \mathrm{B}^{\top}=\left[\begin{array}{lll}
     a & b & c \\
     b & d & e \\
     c & e & f
     \end{array}\right] \Rightarrow \mathrm{B}=\mathrm{B}^{\top}
     $$

7. $A$의 eigenvalue는 모두 0이 아니다.

### Cosine Rule

* ![img](https://i.loli.net/2020/09/30/JGqEmVB6uFZW5Ah.gif) 

* "orthogonal" or "perpendicular"
* projection vector
* scalar projection



## Reference

* https://twlab.tistory.com/37