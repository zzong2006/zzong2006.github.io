---
title: "Pareto efficiency"
tags:
  - recommendation_system
  - optimization
  - multi_objective
aliases: ["Pareto Frontier", "Pareto Efficient"]
---

# A) Pareto Efficiency ?

다목적 최적화 과정에서 사용되는 개념.

여러개의 [[cost function|objective function]]s $f_{1}, \ldots, f_{K}$ 을 최소화하는 시스템을 가정했을 때, 한 솔루션 $s_{i}=\left(f_{1}^{i}, \ldots, f_{K}^{i}\right)$ 이 다른 어떤 솔루션 $s_{j}=\left(f_{1}^{j}, \ldots, f_{K}^{j}\right)$ 에 의해 dominated 되지 않을때, $s_i$ 를 Pareto efficient 하다고 한다.

여기서 dominates 란, 한 솔루션이 모든 objective function 에서 우위 (최소) 를 만족하는 경우를 의미한다: $f_{1}^{i} \leq f_{1}^{j}, f_{2}^{i} \leq f_{2}^{j}, \ldots, f_{K}^{i} \leq f_{K}^{j}$ .

Pareto efficient soltuon 들은 고유하지 않다 (not unique). 그리고 이러한 solution 들의 모음을 Pareto Frontier 라고 부른다.

# B) References
