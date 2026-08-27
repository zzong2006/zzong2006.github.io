
# Entropy Regularizer ?

# Definition

$$
h(S,\mathbf{X})=\frac{1}{2}|S|\log(2 \pi e)+\frac{1}{2}\log\operatorname{det}\left(\mathbf{X}(S)^{T}\mathbf{X}(S)\right.+\left.\sigma^{2}\mathbf{I}\right)
$$

* $\mathbf{X}(S)$ 는 집합 $S$ 에 포함된 item 들의 feature vector 로만 이루어진 matrix 를 의미: $\mathbf{X}(S)\in\mathbb{R}^{d\times|S|}$

This definition of entropy regularizer is derived as the differential entropy of ratings based on the Probabilistic Matrix Factorization (PMF) model.

# 특징

* The value of entropy regularizer $h(S,\mathbf{X})$ is **maximized** if the feature vectors of movies in $S$ are orthogonal (most dissimilar).
* And it is **minimized** when the feature vectors are linearly dependent (most similar).

# References

* [[Contextual Combinatorial Bandit and its Application on Diversified Online Recommendation]]

# References
