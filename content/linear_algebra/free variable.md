---
tags: ["linear_algebra", "programming"]
---

# In Linear Algebra

[[system of linear equations]] 의 solution $x$ 에서 [[basic variable]] 가 아닌 나머지 variable ($x$ 의 원소)

$Ax = 0$ 의 solution $x$ 에 대한 free variable 의 총 개수는 $A$ 의 column 수 ($x$ 의 차원) 에서 [[the rank of a matrix|rank]] 를 뺀 값이 된다.

## 예시

$\left[\begin{array}{llll}1 & 2 & 2 & 2 \\ 0 & 0 & 2 & 4 \\ 0 & 0 & 0 & 0\end{array}\right]=U$ 이고, $U x=0$ 에 대하여, $x_2$ 와 $x_4$ 는 free variable 이라 부른다 ($U$ 의 두번째와 네번째 column 이 [[free column]] 이므로).

# In Programming

코드 블록 안에서 사용되었지만, 그 코드 블럭 안에서 정의되지 않은 변수를 뜻한다. 즉, 자신의 영역 밖에서 호출된 함수의 변수들 또는 레퍼런스 (reference) 들을 의미한다.인
