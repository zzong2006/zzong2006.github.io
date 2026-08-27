---
tags: ["linear_algebra"]
---

# Gauss-Jordan Elimination ?

가우스 - 조던 소거법은 두개 이상의 선형 방정식을 동시에 푸는 방법이다. 주로 [[Inverse matrix]] 를 찾기 위한 방법으로 쓰이는 듯 하다.

아래는 $A$ 에 대한 inverse matrix 를 찾는 예시를 나타낸다. $A$ 와 $I$ 의 [[augmented matrix]] 를 표현함으로써 시작한다.

$$
\left[\begin{array}{ll|ll}1 & 3 & 1 & 0 \\ 2 & 7 & 0 & 1\end{array}\right] \longrightarrow\left[\begin{array}{ll|rr}1 & 3 & 1 & 0 \\ 0 & 1 & -2 & 1\end{array}\right] \longrightarrow\left[\begin{array}{rr|rr}1 & 0 & 7 & -3 \\ 0 & 1 & -2 & 1\end{array}\right]
$$

가운데 방식까지는 가우스 소거 방식 (upper triangular form), 그 이후는 Jordan 방식이다 (matrix 의 오른쪽 위 원소들 제거).

위 방식은 [[elimination|elimination matrix]] 로 표현할 수 있다:$E[A \mid I]=[I \mid E]$

그리고 $EA = I$ 를 만족한다면, $E = A^{-1}$ 이다.

# Related

[Example Problem](https://www.youtube.com/watch?v=zWxhmBCdvFs&ab_channel=MITOpenCourseWare)

# References
