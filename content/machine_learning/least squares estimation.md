---
aliases: ["machine_learning", "linear_regression", "optimization"]
---

# A) Least Squares Estimation ?

least squares estimation 이란 주어진 데이터의 선형 모델을 풀기 위한 접근 방식들의 통칭을 의미한다.

[[linear regression]] 모델을 데이터에 맞추기 위해서, 학습 데이터에 대한 [[negative log likelihood]] 값을 최소화 해야한다.

최소화하는 목적 함수는 다음과 같다

$$
\begin{aligned}\operatorname{NLL}\left(\boldsymbol{w},\sigma^{2}\right)&=-\sum_{n=1}^{N}\log\left[\left(\frac{1}{2\pi\sigma^{2}}\right)^{\frac{1}{2}}\exp\left(-\frac{1}{2\sigma^{2}}\left(y_{n}-\boldsymbol{w}^{\top}\boldsymbol{x}_{n}\right)^{2}\right)\right]\\&=\frac{1}{2\sigma^{2}}\sum_{n=1}^{N}\left(y_{n}-\hat{y}_{n}\right)^{2}+\frac{N}{2}\log\left(2\pi\sigma^{2}\right)\end{aligned}
$$

* the predicted response: $\hat{y}_{n}\triangleq\boldsymbol{w}^{\top}\boldsymbol{x}_{r}$

$\nabla_{\boldsymbol{w},\sigma}\mathrm{NLL}\left(\boldsymbol{w},\sigma^{2}\right)=\mathbf{0}$ 를 만족하는 [[Maximum Likelihood Estimation]] point 를 찾으면 $\boldsymbol{w}$ 에 대해서 최적화를 수행하게 되는데, 이것은 [[residual sum of squares]] 와 같다.

$$
\displaystyle\operatorname{RSS}(\boldsymbol{w})=\frac{1}{2}\sum_{n=1}^{N}\left(y_{n}-\boldsymbol{w}^{\top}\boldsymbol{x}_{n}\right)^{2}=\frac{1}{2}\|\mathbf{X}\boldsymbol{w}-\boldsymbol{y}\|_{2}^{2}=\frac{1}{2}(\mathbf{X}\boldsymbol{w}-\boldsymbol{y})^{\top}(\mathbf{X}\boldsymbol{w}-\boldsymbol{y})
$$

# B) Related

[[statistic/negative log likelihood|NLL]], [[ordinary least squares]], [[weighted least squares]]

# C) References
