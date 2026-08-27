---
tags: ["calculus"]
aliases: ["chain rule"]
---

# Chain Rule (calculus) ?

## Scalar case

$y=g(x)$ 그리고 $z=f(g(x))=f(y)$ 인 경우 chain rule 은 다음과 같다.

$$
\displaystyle\frac{dz}{dx}=\frac{dz}{dy}\frac{dy}{dx} 
$$

## Vector case

크기가 $n$ 인 vector $\mathbf{x}$ 가 있고, $\mathbf{g}, \mathbf{f}$ 는 각각 입력과 출력이 $n \times k$ , $k \times m$ 이라고 하자.

$$
\frac{\partial}{\partial \mathbf{x}} \mathbf{f}(\mathbf{g}(\mathbf{x}))=\frac{\partial \mathbf{f}}{\partial \mathbf{g}} \frac{\partial \mathbf{g}}{\partial \mathbf{x}}
$$

위 식은 [[Jacobian matrix]] 로 표현이 가능하다. 해당 행렬은 $f_i$ 를 $g_i$ 에 대하여 가능한 모든 조합과 $g_i$ 를 $x_i$ 에 대하여 가능한 모든 조합을 포함하고 있다.

$$
\frac{\partial}{\partial \mathbf{x}} \mathbf{f}(\mathbf{g}(\mathbf{x}))=\left[\begin{array}{llll}\frac{\partial f_{1}}{\partial g_{1}} & \frac{\partial f_{1}}{\partial g_{2}} & \cdots & \frac{\partial f_{1}}{\partial g_{k}} \\ \frac{\partial f_{2}}{\partial g_{1}} & \frac{\partial f_{2}}{\partial g_{2}} & \cdots & \frac{\partial f_{2}}{\partial g_{k}} \\ \frac{\partial f_{m}}{\partial g_{1}} & \frac{\partial f_{m}}{\partial g_{2}} & \cdots & \frac{\partial f_{m}}{\partial g_{k}}\end{array}\right]\left[\begin{array}{llll}\frac{\partial g_{1}}{\partial x_{1}} & \frac{\partial g_{1}}{\partial x_{2}} & \ldots & \frac{\partial g_{1}}{\partial x_{n}} \\ \frac{\partial g_{2}}{\partial x_{1}} & \frac{\partial g_{2}}{\partial x_{2}} & \cdots & \frac{\partial g_{2}}{\partial x_{n}} \\ \frac{\partial g_{k}}{\partial x_{1}} & \frac{\partial g_{k}}{\partial x_{2}} & \ldots & \frac{\partial g_{k}}{\partial x_{n}}\end{array}\right]
$$

사실 행렬의 대각 원소가 아니면 $\displaystyle \frac{\partial w_{i}}{\partial x_{j}}$ 에서 $i \neq j$ 인 경우는 0 의 값을 가진다. 결과적으로 위 식은 다음과 같이 [[diagonal matrix]] 로 간소화될 수 있다.

$$
\frac{\partial}{\partial \mathbf{x}} \mathbf{f}(\mathbf{g}(\mathbf{x}))=\operatorname{diag}\left(\frac{\partial f_{i}}{\partial g_{i}}\right) \operatorname{diag}\left(\frac{\partial g_{i}}{\partial x_{i}}\right)=\operatorname{diag}\left(\frac{\partial f_{i}}{\partial g_{i}} \frac{\partial g_{i}}{\partial x_{i}}\right)
$$

### 예시

vector [[dot product|내적]] $y=\mathbf{f}(\mathbf{w}) \cdot \mathbf{g}(\mathbf{x})=\sum_{i}^{n}\left(w_{i} x_{i}\right)=\operatorname{sum}(\mathbf{w} \otimes \mathbf{x})$ 에 대해서 $\displaystyle \frac{d y}{d \mathbf{x}}$ 를 계산한다고 해보자. 이때, $\mathbf{u}=\mathbf{w} \otimes \mathbf{x}$ 를 통해 치환하고, chain rule 을 활용하면 다음과 같다.

* $\displaystyle \frac{d \mathbf{u}}{d \mathbf{x}}=\frac{d}{d \mathbf{x}}(\mathbf{w} \otimes \mathbf{x})=\operatorname{diag}(\mathbf{w})$
* $\displaystyle \frac{d y}{d \mathbf{u}}=\frac{d}{d \mathbf{u}} \operatorname{sum}(\mathbf{u})=\overrightarrow{1}^{T}$
* $\displaystyle \frac{d y}{d \mathbf{x}}=\frac{d y}{d \mathbf{u}} \times \frac{d \mathbf{u}}{d \mathbf{x}}=\overrightarrow{1}^{T} \times \operatorname{diag}(\mathbf{w})=\mathbf{w}^{T}$

# References
