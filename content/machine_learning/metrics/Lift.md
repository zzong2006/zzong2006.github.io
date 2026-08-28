---
title: "Lift"
tags: ["metrics", "recommendation_system"]
---

# A) Lift ?

lift 규칙은 다음과 같이 정의된다.

$$
\displaystyle\operatorname{lift}(X\Rightarrow Y)=\frac{\operatorname{supp}(X\cup Y)}{\operatorname{supp}(X)\times\operatorname{supp}(Y)}
$$

[[machine_learning/metrics/Confidence]] 에서 분모에 [[support]] 값을 추가한 것과 같다.

# B) 예시

![[img-7801d84f72.png|image-20201128180606645|400]]

예를 들어, $\{milk,bread\}\Rightarrow\{butter\}$ 의 lift 값은 $\displaystyle\frac{0.2}{0.4\times0.4}=1.25$ 이다.

lift 값에 대한 해석은 $1$ 을 기준으로 달라진다.

* 만약 lift 값이 $1$ 이면, $X$ 와 $Y$ 에 관련된 이벤트가 각각 독립되었다는 것을 의미한다.
* 만약 lift 값이 $1$ 미만이면, 두 이벤트가 서로 양의 상관 관계를 가짐을 알 수 있다.
	* 즉, 한쪽 itemset 이 등장할 수록, 대응되는 itemset 이 동시에 등장할 확률이 높다.
* 만약 lift 값이 $1$ 이상이면, 두 이벤트가 서로 음의 상관 관계를 가짐을 알 수 있다.
	* 즉, 한쪽 itemset 이 등장할 수록, 대응되는 itemset 이 동시에 등장할 확률이 낮다.

# C) References
