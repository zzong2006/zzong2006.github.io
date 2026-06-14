---
tags: ["optimization"]
---

# A) Bound Optimization ?

tight lowerbound $LL(\boldsymbol{\theta})$ ,

$$
Q\left(\boldsymbol{\theta},\boldsymbol{\theta}^{t}\right)\leq LL(\boldsymbol{\theta})
$$

* $\boldsymbol{\theta}^{t+1}=\underset{\boldsymbol{\theta}}{\operatorname{argmax}}Q\left(\boldsymbol{\theta},\boldsymbol{\theta}^{t}\right)$
* $LL\left(\boldsymbol{\theta}^{t+1}\right)\geq Q\left(\boldsymbol{\theta}^{t+1},\boldsymbol{\theta}^{t}\right)\geq Q\left(\boldsymbol{\theta}^{t},\boldsymbol{\theta}^{t}\right)=LL\left(\boldsymbol{\theta}^{t}\right)$
* If Q is a quadratic lower bound, the overall method is similar to Newton’s method, which repeatedly fits and then optimizes a quadratic approximation.
* The difference is that optimizing Q is guaranteed to lead to an improvement in the objective, even if it is not convex, whereas
[[Newton-Raphson method]] may overshoot or lead to a decrease in the objective

# B) Related

# C) References
