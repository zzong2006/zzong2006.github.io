---
tags: ["reinforcement_learning"]
---

# A) First-visit MC ?

first-visit MC 방법은 처음 [[visit]] 하는 $s$ 에 대해서 returns 의 평균값을 취해 $v_\pi(s)$ 를 계산한다.

![[img-40464e34ee.png|image-20201022142040163]]

first-visit 의 경우에는 각 return 값은 유한한 variance $\sigma^2$ 를 가지는 $v_\pi(s)$ 의 추정값에 대해 [[i.i.d.]] 하다.

# B) References
