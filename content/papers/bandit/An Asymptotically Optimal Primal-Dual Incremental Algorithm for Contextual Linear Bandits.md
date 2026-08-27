---
tags: ["MAB", "NIPS", "bandit", "contextual_bandit", "linear_regression", "paper_review", "y2020"]
---

# Links

* [Paper link](https://scontent-ssn1-1.xx.fbcdn.net/v/t39.8562-6/130005945_1021949234985519_5618088221930816693_n.pdf?_nc_cat=101&ccb=1-5&_nc_sid=ae5e01&_nc_ohc=2ZJCB5X1bYAAX_GCBqa&_nc_ht=scontent-ssn1-1.xx&oh=00_AT_h0ovp9RCBjHVjrsdd-67AtyyD9cSjbumRh4CAHB-fZw&oe=61EF60C9)

# Abstract

* optimism principle 에 기반한 알고리즘은 문제에 대한 구조를 exploit 하는데 실패하여 점근적으로 suboptimal 결과를 보임
* context 분포와 exploration policy 가 나눠지도록 (decoupled) regret lower bound 를 reformulate 하여, unbalance 한 context distribution 에서도 robust 하게끔 알고리즘을 구성
* 그리고, incremental primal-dual 접근 방식을 사용하여 lower bound 의 Lagrangian relaxation 을 해결함 (solve)
* 최종적으로 강제적인 exploration 을 제거하고, 최소한의 exploration 을 encourage 하는 confidence intervals 을 build (for better adapting to the problem structure)
	* 이를 asymptotic optimality 라고 부르고 있음

# References
