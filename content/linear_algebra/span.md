---
tags: ["linear_algebra"]
---

# Span ?

벡터 집합의 span 이란, original vectors 들의 [[linear combination|선형 결합]] 으로 인해 얻어지는 모든 points 들의 집합 ([[vector space]]) 을 의미한다.

$$
\operatorname{span}\left\{\mathbf{v}_{1}, \ldots, \mathbf{v}_{n}\right\}=\left\{\mathbf{v} \in V: \exists \alpha_{1}, \ldots, \alpha_{n}\right. \ \text{such that} 
 \ \left.\alpha_{1} \mathbf{v}_{1}+\cdots+\alpha_{n} \mathbf{v}_{n}=\mathbf{v}\right\}$$
예를 들어, $A$ 의 column vector들의 span은 $A$ 의 column space를 의미한다.
# Application
$Ax=b$ 가 solution 이 존재하는지 여부는 $A$ 의 column vector들의 span([[column space]])에 $b$가 포함되는지 여부를 조사하는 것과 같다.


# References
* [[deep learning book]] - Linear Algebra
