---
title: "Moore-Penrose Pseudoinverse"
aliases: []
tags:
  - linear_algebra
---

Moore-Penrose 의사역행렬, 즉 $\boldsymbol{A}$의 pseudoinverse는 다음과 같이 정의됩니다.

$\boldsymbol{A}^{+} = \displaystyle\lim_{\alpha\searrow 0} \left(\boldsymbol{A}^{\top}\boldsymbol{A} + \alpha\boldsymbol{I}\right)^{-1}\boldsymbol{A}^{\top}$

하지만 실제로 위의 정의는 계산에 직접적으로 활용되지 않습니다. 대신 보통 아래와 같은 공식을 사용합니다.

$\boldsymbol{A}^{+} = \boldsymbol{V} \boldsymbol{D}^{+} \boldsymbol{U}^{\top}$

여기서 $\boldsymbol{U},\,\boldsymbol{D},\,\boldsymbol{V}$는 $A$의 [[singular]] value decomposition에서 얻어진 행렬들입니다. 대각행렬 $\boldsymbol{D}$의 pseudoinverse인 $\boldsymbol{D}^{+}$는, $\boldsymbol{D}$의 0이 아닌 원소에 대해 역수를 취하고, 그 결과로 얻어진 행렬을 전치(transpose)하여 만듭니다.
