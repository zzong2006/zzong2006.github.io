---
title: "Quadratic Programming"
aliases: ["QP", "이차계획법"]
tags:
  - optimization
---

# A) Quadratic Programming ?

목적 함수가 이차식이고 제약이 모두 선형인 최적화 문제다.

$$
\min_{\boldsymbol{x}} \ \frac{1}{2}\boldsymbol{x}^\top Q \boldsymbol{x} + \boldsymbol{c}^\top \boldsymbol{x}
\quad \text{s.t.} \quad A\boldsymbol{x} \le \boldsymbol{b},\ \ E\boldsymbol{x} = \boldsymbol{d}
$$

| 기호 | 의미 |
| --- | --- |
| $\boldsymbol{x}$ | 찾으려는 변수 벡터 |
| $Q$ | 이차항의 계수 행렬. 대칭이라고 가정한다 |
| $\boldsymbol{c}$ | 일차항 계수 |
| $A, \boldsymbol{b}$ | 부등식 제약 |
| $E, \boldsymbol{d}$ | 등식 제약 |

목적 함수의 이차항이 없으면($Q = 0$) [[linear program]] 이 된다.

# B) $Q$ 가 결정하는 난이도

$Q$ 가 [[positive definite]] 이거나 준정부호이면 목적 함수가 [[convex function|볼록]] 하다. 이 경우 국소 최솟값이 곧 전역 최솟값이라 다항 시간에 풀 수 있고, 해도 하나로 정해진다.

$Q$ 가 그렇지 않으면 봉우리와 골짜기가 여럿 생겨 전역 최솟값을 찾는 문제가 NP-hard 가 된다. 실무에서 "QP 를 푼다" 고 할 때는 대개 볼록한 쪽을 가리킨다.

# C) 어디에 나오나

**[[support vector machine]]** — 마진을 최대화하는 문제가 정확히 볼록 QP 다. 목적 함수는 $\lVert \boldsymbol{w} \rVert^2$ 로 이차식이고, "모든 데이터가 마진 바깥에 있어야 한다" 는 조건은 각 데이터마다 하나의 선형 부등식이다. 이 문제를 라그랑주 쌍대로 옮기면 kernel trick 을 쓸 수 있는 형태가 나온다.

**[[ridge regression]]** — 제약 없는 QP 다. 목적 함수가 잔차 제곱합에 계수 제곱합을 더한 이차식이라, 미분해서 0 으로 두면 닫힌 형태의 해가 나온다.

**포트폴리오 최적화** — 위험(분산)을 최소화하면서 기대 수익과 비중 합에 제약을 거는 문제가 QP 의 원형에 가깝다.

# D) 푸는 방법

제약이 등식뿐이면 라그랑주 승수를 도입해 선형 연립방정식으로 바뀐다. 부등식 제약이 있으면 어느 제약이 등호로 걸리는지(active set)를 알아내야 하는데, 이를 반복적으로 추정하는 active set method 나, 부등식을 벌점으로 바꿔 내부에서 접근하는 interior point method 를 쓴다.

# E) References
