---
title: "backsubstitution"
tags:
  - linear_algebra
aliases: [Back Substitution]
---

# A) Back Substitution

Back substitution은 upper triangular system $Ux=b$를 마지막 변수부터 거꾸로 풀어가는 방법이다. [[linear_algebra/Gaussian elimination|Gaussian elimination]]이나 [[linear_algebra/QR decomposition|QR decomposition]] 이후 linear system을 실제로 푸는 단계에서 자주 나온다.

# B) 동작 흐름

맨 아래 행은 보통 하나의 미지수만 포함한다. 그 값을 먼저 구하고, 위 행으로 올라가면서 이미 구한 값을 대입해 남은 미지수를 차례로 계산한다.

# C) 주의할 점

대각 성분이 0에 가깝거나 matrix condition이 나쁘면 수치적으로 불안정해질 수 있다. 그래서 실제 계산에서는 pivoting, decomposition 선택, floating point error를 함께 고려한다.

# References
