---
title: "Confidence"
tags: ["metrics", "recommendation_system", "association_rule"]
aliases: ["confidence"]
---

# A) Confidence

Confidence는 association rule이 얼마나 자주 참이 되는지 보는 지표다. 규칙 $X \Rightarrow Y$가 있을 때, $X$를 포함한 transaction 중에서 $Y$도 함께 포함하는 비율을 뜻한다.

$$
\operatorname{conf}(X \Rightarrow Y)=\frac{\operatorname{supp}(X\cup Y)}{\operatorname{supp}(X)}
$$

여기서 $\operatorname{supp}(X)$는 itemset $X$가 전체 transaction에서 등장하는 비율이다.

# B) 예시

$\{butter, bread\} \Rightarrow \{milk\}$의 confidence가 `1.0`이라면, butter와 bread를 함께 산 transaction은 모두 milk도 함께 샀다는 뜻이다.

Confidence가 높다고 항상 좋은 추천 규칙이라는 뜻은 아니다. $Y$ 자체가 너무 흔한 item이면 confidence가 높게 나올 수 있으므로, [[machine_learning/metrics/Lift|Lift]]나 support와 함께 보는 편이 안전하다.

# References
