---
tags: ["calculus", "linear_algebra", "differentitation"]
aliases: ["자코비안"]
---

# A) Jacobian Matrix ?

In vector calculus, the Jacobian matrix of a vector-valued function of several variables is the matrix of all its first-order partial derivatives.

다음과 같은 함수 $\mathbf{f}:\mathbf{R}^{n}\rightarrow\mathbf{R}^{m}$ 를 가정하자. 이 함수의 1 차 부분 미분은 $\mathbf{R}^{n}$ 이다. 다시 말하면, 이 함수는 $\mathbf{x}\in\mathbf{R}^{n}$ 의 점을 입력으로 받고, $\mathbf{f}(\mathbf{x})\in\mathbf{R}^{m}$ 의 벡터를 출력으로 뱉는다.

이때, $\mathbf{f}$ 의 Jacobian matrix 는 - $\mathbf{f}$ 의 입출력 차원을 뒤집은 - $m\times n$ 크기를 가지며, $\mathbf{J}$ 로 표현된다. 그리고 $(i,j)$ 번째의 entry 는 $\displaystyle \mathbf{J}_{ij}=\frac{\partial f_{i}}{\partial x_{j}}$ 이며, $\mathbf{J}$ 는 다음과 같이 계산된다

$$
\displaystyle \mathbf{J}=\left[\begin{array}{ccc}\displaystyle\frac{\partial\mathbf{f}}{\partial x_{1}}&\displaystyle\cdots&\displaystyle\frac{\partial\mathbf{f}}{\partial x_{n}}\end{array}\right]=\left[\begin{array}{c}\nabla^{\mathrm{T}}f_{1}\\\vdots\\\nabla^{\mathrm{T}}f_{m}\end{array}\right]=\displaystyle\left[\begin{array}{ccc}\frac{\partial f_{1}}{\partial x_{1}}&\displaystyle\cdots&\frac{\partial f_{1}}{\partial x_{n}}\\\vdots&\ddots&\vdots\\\frac{\partial f_{m}}{\partial x_{1}}&\cdots&\frac{\partial f_{m}}{\partial x_{n}}\end{array}\right]
$$

여기서 $\nabla^{\mathrm{T}}f_{i}$ 는 $i$ 번째 원소의 gradient 에 대한 transpose (row vector) 이다. 즉, 자코비안 행렬의 각 행은 특정 함수의 [[machine_learning/optimization/gradient]] 를 나타낸 것으로 생각할 수 있다.

자세한 내용은 여기를 참고: [Difference between gradient and Jacobian](https://math.stackexchange.com/questions/1519367/difference-between-gradient-and-jacobian)

# B) Jaccobian of the Element-wise Operations

두 벡터 $\mathbf{w}$ 와 $\mathbf{x}$ 에 대한 element-wise 연산을 나타내는 함수 $y$ 가 있다고 가정하자.

$$
\left[\begin{array}{c}y_{1} \\ y_{2} \\ \vdots \\ y_{n}\end{array}\right]=\left[\begin{array}{cc}f_{1}(\mathbf{w}) \bigcirc g_{1}(\mathbf{x}) \\ f_{n}(\mathbf{w}) \bigcirc g_{2}(\mathbf{x}) \\ \vdots \\ f_{n}(\mathbf{w}) \bigcirc g_{n}(\mathbf{x})\end{array}\right]
$$

여기서 $\bigcirc$ 은 $+$ 와 같은 element-wise 연산을 나타내며, $f$ 와 $g$ 는 각 벡터에 적용되는 서로 다른 함수를 나타낸다. 예를 들어 $y_{1}=f_{1}(\mathbf{x})=3 x_{1}^{2} x_{2}$ 또는 $y_{2}=f_{2}(\mathbf{x})=2 x_{1}+x_{2}^{8}$ 와 같은 형태로 생각할 수 있다.

이제 위 operations vector 의 $\mathbf{w}$ 에 대한 자코비안 행렬을 구하면 다음과 같다.

$$
J_{\mathbf{w}}=\frac{\partial \mathbf{y}}{\partial \mathbf{w}}=\left[\begin{array}{cccc}\frac{\partial}{\partial w_{1}}\left(f_{1}(\mathbf{w}) \bigcirc g_{1}(\mathbf{x})\right) & \frac{\partial}{\partial w_{2}}\left(f_{1}(\mathbf{w}) \bigcirc g_{1}(\mathbf{x})\right) & \ldots & \frac{\partial}{\partial w_{n}}\left(f_{1}(\mathbf{w}) \bigcirc g_{1}(\mathbf{x})\right) \\ \frac{\partial}{\partial w_{1}}\left(f_{2}(\mathbf{w}) \bigcirc g_{2}(\mathbf{x})\right) & \frac{\partial}{\partial w_{2}}\left(f_{2}(\mathbf{w}) \bigcirc g_{2}(\mathbf{x})\right) & \ldots & \frac{\partial}{\partial w_{n}}\left(f_{2}(\mathbf{w}) \bigcirc g_{2}(\mathbf{x})\right) \\ \ldots & & & \\ \frac{\partial}{\partial w_{1}}\left(f_{n}(\mathbf{w}) \bigcirc g_{n}(\mathbf{x})\right) & \frac{\partial}{\partial w_{2}}\left(f_{n}(\mathbf{w}) \bigcirc g_{n}(\mathbf{x})\right) & \ldots & \frac{\partial}{\partial w_{n}}\left(f_{n}(\mathbf{w}) \bigcirc g_{n}(\mathbf{x})\right)\end{array}\right]
$$

만약 $f_{i}(\mathbf{w})$ 와 $g_{i}(\mathbf{x})$ 가 각각 $\mathbf{w}$ 와 $\mathbf{x}$ 의 $i$ 번째 원소 $w_i$ 그리고 $x_i$ 만 접근이 가능하다고 해보자. 이런 경우, 자코비안 행렬의 대각 원소를 제외한 나머지는 0 이 된다.

$$
\frac{\partial \mathbf{y}}{\partial \mathbf{w}}=\operatorname{diag}\left(\frac{\partial}{\partial w_{1}}\left(f_{1}\left(w_{1}\right) \bigcirc g_{1}\left(x_{1}\right)\right), \frac{\partial}{\partial w_{2}}\left(f_{2}\left(w_{2}\right) \bigcirc g_{2}\left(x_{2}\right)\right), \ldots, \frac{\partial}{\partial w_{n}}\left(f_{n}\left(w_{n}\right) \bigcirc g_{n}\left(x_{n}\right)\right)\right)
$$

# C) 예시

## C.1) Example 1

$\mathbf{f}:\mathbf{R}^{2}\rightarrow\mathbf{R}^{2}$ 이고 $(x,y)\mapsto\left(f_{1}(x,y),f_{2}(x,y)\right)$ 인 함수를 고려해보자.

$$
\mathbf{f}\left(\left[\begin{array}{l}x\\y\end{array}\right]\right)=\left[\begin{array}{l}f_{1}(x,y)\\f_{2}(x,y)\end{array}\right]=\left[\begin{array}{c}x^{2}y\\5x+\sin y\end{array}\right]
$$

여기서 Jacobian matrix $\mathbf{f}$ 는 다음과 같다.

$$
\mathbf{J}_{\mathbf{f}}(x,y)=\left[\begin{array}{cc}\frac{\partial f_{1}}{\partial x}&\frac{\partial f_{1}}{\partial y}\\ \frac{\partial f_{2}}{\partial x}&\frac{\partial f_{2}}{\partial y}\end{array}\right]=\left[\begin{array}{cc}2xy&x^{2}\\5&\cos y\end{array}\right]
$$

그리고 Jacobian [[determinant]] 는 $\operatorname{det}\left(\mathbf{J}_{\mathbf{f}}(x,y)\right)=2xy\cos y-5x^{2}$ 이다.

## C.2) Example 2

$\boldsymbol{x}\in\mathbb{R}^{n}$ 이고 $\boldsymbol{o}\in\mathbb{R}^{m}$ 일 때, $\boldsymbol{o}=\boldsymbol{f}(\boldsymbol{x})$ 라는 mapping 이 있다고 가정해보자. 그리고 이 $\boldsymbol{f}$ 는 다음과 같은 여러개의 함수들의 합성으로 이뤄졌다고 하자.

$$
\boldsymbol{f}=\boldsymbol{f}_{4}\circ\boldsymbol{f}_{3}\circ\boldsymbol{f}_{2}\circ\boldsymbol{f}_{1}
$$

$\boldsymbol{f}_{1}:\mathbb{R}^{n}\rightarrow\mathbb{R}^{m_{1}},\boldsymbol{f}_{2}:\mathbb{R}^{m_{1}}\rightarrow\mathbb{R}^{m_{2}},\boldsymbol{f}_{3}:\mathbb{R}^{m_{2}}\rightarrow\mathbb{R}^{m_{3}},\text{and}\boldsymbol{f}_{4}:\mathbb{R}^{m_{3}}\rightarrow\mathbb{R}^{m}$

즉, $\boldsymbol{o}=\boldsymbol{f}(\boldsymbol{x})$ 는 $\boldsymbol{x}_{2}=\boldsymbol{f}_{1}(\boldsymbol{x}),\boldsymbol{x}_{3}=\boldsymbol{f}_{2}\left(\boldsymbol{x}_{2}\right),\boldsymbol{x}_{4}=\boldsymbol{f}_{3}\left(\boldsymbol{x}_{3}\right),\text{and}\boldsymbol{o}=\boldsymbol{f}_{4}\left(\boldsymbol{x}_{4}\right)$ 순으로 계산이 이뤄진다. 이때, Jacobian matrix $\displaystyle\mathbf{J}_{\boldsymbol{f}}(\boldsymbol{x})=\frac{\partial\boldsymbol{o}}{\partial\boldsymbol{x}^{\top}}\in\mathbb{R}^{m\times n}$ 를 [[chain rule (calculus)]] 을 통해 계산할 수 있다

$$
\displaystyle\begin{aligned}\frac{\partial\boldsymbol{o}}{\partial\boldsymbol{x}}&=\frac{\partial\boldsymbol{o}}{\partial\boldsymbol{x}_{4}}\frac{\partial\boldsymbol{x}_{4}}{\partial\boldsymbol{x}_{3}}\frac{\partial\boldsymbol{x}_{3}}{\partial\boldsymbol{x}_{2}}\frac{\partial\boldsymbol{x}_{2}}{\partial\boldsymbol{x}}=\frac{\partial\boldsymbol{f}_{4}\left(\boldsymbol{x}_{4}\right)}{\partial\boldsymbol{x}_{4}}\frac{\partial\boldsymbol{f}_{3}\left(\boldsymbol{x}_{3}\right)}{\partial\boldsymbol{x}_{3}}\frac{\partial\boldsymbol{f}_{2}\left(\boldsymbol{x}_{2}\right)}{\partial\boldsymbol{x}_{2}}\frac{\partial\boldsymbol{f}_{1}(\boldsymbol{x})}{\partial\boldsymbol{x}}\\&=\mathbf{J}_{f_{4}}\left(\boldsymbol{x}_{4}\right)\mathbf{J}_{\boldsymbol{f}_{3}}\left(\boldsymbol{x}_{3}\right)\mathbf{J}_{f_{2}}\left(\boldsymbol{x}_{2}\right)\mathbf{J}_{\boldsymbol{f}_{1}}(\boldsymbol{x})\end{aligned}
$$

## C.3) Example 3

identity function $\mathbf{f}(\mathbf{x})=\mathbf{x}$ 에 대한 자코비안 행렬은 identity matrix $I$ 이다.

# D) The Possible Jacobian Shapes

함수와 함수의 입력값의 형태에 따라 가질 수 있는 자코비안 행렬의 형태를 시각적으로 표현하면 다음과 같다.

![|350](https://i.imgur.com/jyzvUDl.png)

여기서 함수가 scalar 라는 의미는 입력값을 넣었을 때 결과값이 scalar 란 뜻이다.

# E) Related

# F) References
