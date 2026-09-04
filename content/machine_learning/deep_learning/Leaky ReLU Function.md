---
title: "Leaky ReLU Function"
tags: activation_function
aliases: []
---

# A) Leaky ReLU Function ?

Leaky [[ReLU function]] 은 다음과 같이 생겼다.

![[img-246b22c4db.png|Explain Step Threshold and Leaky ReLU Activation Functions i2tutorials| 500]]

**수식**

$$
f(x)=\left\{\begin{array}{ll}\alpha \cdot x & \text { for } x \leq 0 \\ x & \text { for } x>0\end{array}=\max \{\alpha \cdot x, x\}\right.
$$

주로 $\alpha$ 값은 $0.01$ 이다.

# B) References
