---
tags: ["optimization", "machine_learning", "deep_learning"]
aliases: ["BFGS algorithm"]
---

# A) BFGS ?

BFGS 알고리즘은 [[Newton-Raphson method]] 의 장점을 취하면서 계산 비용을 줄인 방법이다. 이런 관점에서 BFGS 는 [[conjugate gradients]] 방식과 비슷하다.

뉴턴 방법의 업데이트는 아래와 같다.  

$$
\boldsymbol{\theta}^{*}=\boldsymbol{\theta}_{0}-\boldsymbol{H}^{-1} \nabla_{\boldsymbol{\theta}} J\left(\boldsymbol{\theta}_{0}\right)
$$

여기서 $\boldsymbol{H}^{-1}$ 를 구하는 것이 계산 비용 상승의 주된 원인인데, 이를 근사하는 방향으로 계산 비용을 줄인다. 즉, [[quasi-Newton method]] 방식을 적용하여 low-rank update 를 통해 matrix $\boldsymbol{M}_{t}$ 에 대한 inverse 를 approximate 한다.

inverse [[Hessian matrix]] 근사 $\boldsymbol{M}_{t}$ 를 업데이트하면, descent 방향 $\boldsymbol{\rho}_{t}$ 는 $\boldsymbol{\rho}_{t}=\boldsymbol{M}_{t} \boldsymbol{g}_{t}$ 로 계산되고 ($\boldsymbol{g}_{t}$ 는 [[machine_learning/optimization/gradient]]), 해당 방향으로 parameter update 가 진행된다.  

$$
\boldsymbol{\theta}_{t+1}=\boldsymbol{\theta}_{t}+\epsilon^{*} \boldsymbol{\rho}_{t}
$$

* $\epsilon^{*}$ 는 step size 를 의미한다.

## A.1) Conjugate Gradients 와 비교

conjugate gradients 와 비슷하게 BFGS 방식도 second-order 정보에 기반한 방향을 따라 [[line search]] 를 진행한다.

그러나 conjugate gradients 와 다른점은 line search 과정에서 line 을 따라 놓여진 true minimum point 와 근접한 point 를 찾는 것이 optimization 성공 여부를 크게 가르진 않는다는 점이다. 결과적으로 BFGS 는 각 line search 마다 적은 시간을 소요할 수 있다.

그렇다고 conjufate gradients 보다 항상 장점만 있는것도 아닌것이, inverse Hessian matrix $M$ 을 기억하기 위해 $O\left(n^{2}\right)$ 만큼의 메모리를 사용해야 한다. [[neural network]] 의 경우 백만개의 parameters 가 있다는 점을 고려하면 이를 효율적으로 사용하는 것은 거의 불가능에 가깝다.

# B) L-BFGS

L-BFGS 는 BFGS 의 Limited Memory 버전으로 inverse Hessian 근사값의 저장을 피하여 메모리 사용량을 줄인 방식이다. L-BFGS 는 BFGS 와 동일하게 $\boldsymbol{M}$ 의 근사를 계산하지만, update 과정에서 이전 matrix $\boldsymbol{M}^{(t-1)}$ 를 저장하지 않고 단순히 identity matrix 로 가정한다. Exact line search 를 원한다면 L-BFGS 의 방향은 올바르지 않겠지만, 근사를 계산한다는 관점에서는 잘 동작한다.

# C) Related

# D) References
