---
tags: ["linear_algebra"]
---

# 1. LU Decomposition ?

matrix $A$ 를 lower triangular matrix $L$ 과 upper triangular matrix $U$ 로 분해하는 방법

$$
A = LU
$$

생각해보면 [[elimination|elimination matrix]] $E$ 를 곱해서 $U$ 를 계산하는 경우에, $E$ 에 대한 [[Inverse matrix]] 로 $L$ 을 계산한다고 생각할 수 있다.

$$
A=E_{21}^{-1} E_{31}^{-1} E_{32}^{-1} U= LU
$$

## 1.1. 예시

$$
\left[\begin{array}{ll}2 & 1 \\ 8 & 7\end{array}\right]=\left[\begin{array}{ll}1 & 0 \\ 4 & 1\end{array}\right] \left[\begin{array}{ll}2 & 1 \\ 0 & 3\end{array}\right]
$$

# 2. Vs. Elimination Matrix

왜 $E A=U$ 보다 $A = LU$ form 을 선호할까? 그 이유는 - 행 교환이 없는 경우에 - elimination matrix 에 포함된 multiplier 가 $L$ 에 바로 복사되기 때문이다.

# 3. Properties

* [[singular]] matrix 도 LU decomposition 을 수행할 수 있다. 그래서 $U$ 의 [[pivot]] 이 0 이 되도 괜찮다.

## 3.1. 예시

(1) Elimination Matrix

$E_{32}E_{21} = E$

$$
\left[\begin{array}{rrr}1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & -5 & 1\end{array}\right]\left[\begin{array}{rrr}1 & 0 & 0 \\ -2 & 1 & 0 \\ 0 & 0 & 1\end{array}\right]=\left[\begin{array}{rrr}1 & 0 & 0 \\ -2 & 1 & 0 \\ 10 & -5 & 1\end{array}\right]
$$

마지막 행렬의 왼쪽 아래에 $10$ 값이 남아있다. 왜냐하면 첫번째 행에 2 를 곱하고 두번째 행을 뺀 결과에 다시 5 를 곱하여 세번째 행을 빼기 때문이다.

(2) LU Matrix

$L=E^{-1}=E_{21}^{-1} E_{32}^{-1}$

$$
\left[\begin{array}{lll}1 & 0 & 0 \\ 2 & 1 & 0 \\ 0 & 0 & 1\end{array}\right]\left[\begin{array}{lll}1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 5 & 1\end{array}\right]=\left[\begin{array}{lll}1 & 0 & 0 \\ 2 & 1 & 0 \\ 0 & 5 & 1\end{array}\right]
$$

$E$ 에서 그랬던 것과 반대로 $L$ 의 경우 행 뺄셈에 의해 영향을 받지 않는다.

# 4. Related

# 5. References
