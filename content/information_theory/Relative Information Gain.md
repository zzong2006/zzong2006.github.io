---
tags: ["metrics"]
aliases: ["RIG"]
---

# A) Relative Information Gain ?

시간 $t$ 에 대한 RIG 값은 다음과 같다.

$$
R I G\left(w_{t}\right)=1-\frac{\log \operatorname{Loss}\left(w_{t}\right)}{p_t \log (p_t)-(1-p_t) \log (1-p_t)}
$$

여기서 log loss 는 아래와 같다 (binary [[cross-entropy]]).

$$
\log \operatorname{Loss}\left(w_{t}\right)=-y_{t} \log \left(p_{t}\right)-\left(1-y_{t}\right) \log \left(1-p_{t}\right)
$$

The key desired property of off-line measures like RIG is its correlation with key online business metrics.

using RIG in ofﬂine experiments correlates highly with RPM gains in online settings.
