---
tags: ["activation_function", "classification", "machine_learning"]
aliases: ["softmax"]
---

# A) Softmax Function ?

class $K>2$ 의 경우에서 generalized linear model ([reference](http://norman3.github.io/prml/docs/chapter04/2))

$$
\displaystyle p\left(C_{k}\mid\mathbf{x}\right)=\frac{p\left(\mathbf{x}\mid C_{k}\right)p\left(C_{k}\right)}{\sum_{j}p\left(\mathbf{x}\mid C_{j}\right)p\left(C_{j}\right)}=\frac{\exp\left(a_{k}\right)}{\sum_{j}\exp\left(a_{j}\right)}
$$

* $p\left(C_{k}\mid\mathbf{x}\right)$: $\mathbf{x}$ 가 클래스 $C_k$ 에 속할 확률을 모델링
* $a_{k}=\ln\left(p\left(\mathbf{x}\mid C_{k}\right)p\left(C_{k}\right)\right)$
* [[Bayes theorem]] 에 의해서 유도됨

# B) Log-sum-exp Trick (**lse** function)

$$
\displaystyle\operatorname{lse}(\boldsymbol{a})\triangleq\log\sum_{c=1}^{C}\exp\left(a_{c}\right)=m+\log\sum_{c=1}^{C}\exp\left(a_{c}-m\right)
$$

일반적으로 $m=\max_{c}a_{c}$

# C) Related

# D) References
