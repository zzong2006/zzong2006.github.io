---
tags: ["linear_regression", "machine_learning"]
---

# A) Elastic Net ?

[[ridge]] 과 [[lasso regression]] 을 합친 하이브리드 선형 모델

$$
\mathcal{L}\left(\boldsymbol{w}, \lambda_{1}, \lambda_{2}\right)=\|\boldsymbol{y}-\mathbf{X} \boldsymbol{w}\|^{2}+\lambda_{2}\|\boldsymbol{w}\|_{2}^{2}+\lambda_{1}\|\boldsymbol{w}\|_{1}
$$

위 함수는 $\lambda_{2}>0$ 를 가정했을 때, $\mathbf{X}$ 가 full [[the rank of a matrix|rank]] 가 아니여도 strictly convex 하다. 즉, unique global minimum 이 존재한다.

# B) Related

# C) References
