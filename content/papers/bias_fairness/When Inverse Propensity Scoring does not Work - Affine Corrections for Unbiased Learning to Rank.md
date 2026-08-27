---
tags: ["CIKM", "bias", "fairness", "learning_to_rank", "paper_review", "position_bias", "y2020"]
---

# A) Abstract

본 논문에서는 기존의 Counterfactual Learning to Rank(CLTR) 기법들이 신뢰(trust) 편향을 제거하지 못한다는 점을 증명합니다. 이는 신뢰 편향을 완화하기 위해 특별히 설계된 방법들도 마찬가지입니다. 더 나아가, Inverse Propensity Scoring(IPS) 기법이 실질적인 상황에서 신뢰 편향을 교정하는 것이 근본적으로 불가능함을 보였습니다.

주요 기여로서, 우리는 새로운 추정 방식을 제안합니다. 이 방식은 affine correction에 기반하며, 클릭 데이터를 재가중함과 동시에 신뢰 편향이 큰 순위에 노출된 아이템에 대한 패널티를 부여합니다.

# B) Introduction

우리는 실질적인 환경에서 어떠한 IPS 추정기라도 신뢰(trust) 편향을 교정할 수 없음을 증명하였습니다.

# C) References

* paper link: https://arxiv.org/pdf/2008.10242.pdf
