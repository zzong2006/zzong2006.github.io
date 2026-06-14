---
tags: ["linear_algebra"]
---

# A) Augmented Matrix ?

augmented matrix 는 [[system of linear equations]] 를 compact 하게 표현할 수 있다. 즉, $\boldsymbol{A} \boldsymbol{x}=\boldsymbol{b}$ 를 $[\boldsymbol{A} \mid \boldsymbol{b}]$ 로 표현한다. 이렇게 함으로써 $\boldsymbol{x}$ 를 explicit 하게 표현하지 않을 수 있다.

# B) 예시

$$
\begin{aligned}
&-2 x_{1}+4 x_{2}-2 x_{3}-x_{4}+4 x_{5}=-3\\
&4 x_{1}-8 x_{2}+3 x_{3}-3 x_{4}+x_{5}=2\\
&x_{1}-2 x_{2}+x_{3}-x_{4}+x_{5}=0\\
&x_{1}-2 x_{2}-3 x_{4}+4 x_{5}=a
\end{aligned}
$$

에 대한 augmented matrix 는 다음과 같다.

$$
\left[\begin{array}{rrrrr|r}
-2 & 4 & -2 & -1 & 4 & -3 \\
4 & -8 & 3 & -3 & 1 & 2 \\
1 & -2 & 1 & -1 & 1 & 0 \\
1 & -2 & 0 & -3 & 4 & a
\end{array}\right]
$$

# C) Applications

[[Gaussian elimination]] 에서 자주 사용된다.
