---
tags: ["e-commerce", "multi_objective", "multiple_feedback", "paper_review", "recommendation_system"]
---

[[Pareto efficiency|Pareto Efficient]] 추천을 위한 framework 를 제안했다.

two-step Pareto efficient 최적화 알고리즘 제안. solution A 가 Pareto efficiency 하다는 것은 다른 solution B 보다 모든 면이 outperform(not be dominated) 하다는 의미다.

Pareto Frontier 생성과 공정한 추천 선택에 적용이 가능함.

e-commerce 에서 CTR 과 GMV 가 중요하다.

# A) Pareto Optimization

Pareto optimization 은 두 가지로 카테고리가 나뉜다: 1) 휴리스틱 search 그리고 2) scalarization. (1) 휴리스틱 검색 방법에는 유명한 진화 알고리즘이 있다. 하지만 Pareto efficiency 를 보장하진 못한다. (2) scalarization 은 multiple objectives 를 하나의 weighted sum 으로 만든다. 하지만 scalarization 가중치는 수동으로 결정되며 이것도 Pareto efficiency 를 보장하진 못한다.

요즘에는 Karush-Kuhn-Tucker(KKT) 조건을 사용하여 scalarization 을 사용하고 있다. 이 논문도 KKT 조건에 기반하여 scalarization 가중치를 생성하는 프레임워크를 제안한다.
