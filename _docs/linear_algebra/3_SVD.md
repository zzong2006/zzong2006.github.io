---
layout: default
title:  "SVD"
category: Linear Algebra
order: 3
---

Singular Value Decomposition은 임의의 $m \times n$ 차원의 행렬 $A$을 분해하는 방법 중 하나이다.

또한 다음과 같은 의미를 가진다.

* $V$에 있는 열벡터($\vec{x}$ 혹은 $\vec{y}$)를 행렬 $A$를 통해 선형변환 할 때, 그 크기는 $\Sigma$ (eigen values)만큼 변하지만, 여전히 직교하는 벡터들 ($AV=U$의 열 벡터)를 찾을 수 있겠는가?

$$
A=U \Sigma V^{T}
$$

$$
\begin{array}{c}
A: m \times n  \\
U: m \times r \\
\Sigma: r \times r \\
V: n \times r \\
\end{array}
$$

* 여기서 $U$와 $V$는 orthogonal matrix 이고, $\Sigma$는 diagonal matrix이다.

> orthogonal matrix는 $$U U^{T}=U^{T} U=I$$을 만족하는 matrix이다.

> diagonal matrix는 대각 선분을 제외한 나머지 원소의 값이 0인 matrix이다.

* $m \times n$ 행렬의 diagonal matrix의 경우 $m > n$ 이라면, 아래 matrix와 같다.

$$
\left(\begin{array}{cccc}
\sigma_{1} & 0 & \cdots & 0 \\
0 & \sigma_{2} & \cdots & 0 \\
0 & 0 & \cdots & \sigma_{n} \\
0 & 0 & \cdots & 0 \\
\vdots & \vdots & \vdots & \vdots \\
0 & 0 & \cdots & 0
\end{array}\right)
$$

* 위의 eigen value $\sigma$ 값은 모두 양수이므로, 크기에 따라서 sorting이 가능하다.

![img](https://i.loli.net/2020/12/02/pdrB9wECa3RugV4.png)

## SVD의 목적

특이값 분해의 공식을 다시 풀어 써보자면 다음과 같다.
$$

A = U\Sigma V^T \\
= \begin{pmatrix} |  & | & {} & | \\\\
 \vec u_1 & \vec u_2 &\cdots &\vec u_m \\\\
 |  & | & {} &| \end{pmatrix} 
 
\begin{pmatrix} 
\sigma_1 &  &  &  & 0\\\\
 & \sigma_2 &  &  & 0\\\\
 & & \ddots &     & 0\\\\
 & & & \sigma_m   & 0
\end{pmatrix}

\begin{pmatrix}  - & \vec v^T_1 & - \\\\
- & \vec v^T_2 & - \\\\
  &\vdots& \\\\
- & \vec v^T_n & -
\end{pmatrix} \\

= \sigma_1 \vec u_1 \vec v_1^T + \sigma_2 \vec u_2 \vec v_2^T +\cdots+ \sigma_m \vec u_m \vec v_m^T
$$


여기서 $\vec{u}_{1} \vec{v}_{1}^{T}$ 등 은 $m \times n$ 행렬이된다. 또, $\vec{u}$와 $\vec{v}$는 정규화된 벡터이기 때문에 $\vec{u}_{1} \vec{v}_{1}^{T}$ 내의 성분의 값은 -1에서 1사이의 값을 가진다.

따라서, $\sigma_{1} \vec{u}_{1} \vec{v}_{1}^{T}$라는 부분만을 놓고 보면, 이 행렬의 크기는 $\sigma_{1}$의 값에 의해 정해지게 된다.

즉, 우리는 SVD라는 방법을 이용해 $A$라는 임의의 행렬을 여러개의 $A$ 행렬과 동일한 크기를 갖는 여러개의 행렬로 분해해서 생각할 수 있는데, 분해된 각 행렬의 원소의 값의 크기는 $σ$의 값의 크기에 의해 결정된다.



## SVD -  Example: Users to Movies

![image-20201202162805645](https://i.loli.net/2020/12/02/vKfcB3JH9iraCjE.png)

왼쪽 $A$는 사용자 row에 따른 영화 column의 평가가 저장된 matrix다. 이를 SVD 하게 되면, 오른쪽과 같은 matrices들이 나오는데, 보다시피 $U$는 사용자에 대한 latent vector를 의미하고, $V$는 영화에 대한 latent vector, 그리고 $\Sigma$는 latent vector에 대한 정보량을 나타낸다고 볼 수 있다.



## Reference

https://angeloyeo.github.io/2019/08/01/SVD.html

