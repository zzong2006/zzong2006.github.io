---
tags: ["language_model", "NLP", "nlp", "paper_review"]
aliases: ["InfoNCE"]
---

# A) Information Noise-Contrastive Estimation ?

InfoNCE (Information Noise-Contrastive Estimation) 손실은 대조 학습 (contrastive learning) 에서 널리 사용되는 손실 함수

비지도 학습 방식

InfoNCE 손실은 양의 쌍 (positive pairs) 간의 유사도를 최대화하고, 음의 쌍 (negative pairs) 간의 유사도를 최소화함으로써 학습

기준이 되는 anchor representation $\mathbf{x}$ 에 대해서 positive sample $\mathbf{x}^{+}$ 가 주어지고, 나머지 $N-1$ 개의 negative samples $\mathbf{x}^{-}$ 가 주어질때, 아래와 같이 loss 가 계산된다.

$$
L_{\mathrm{InfoNCE}}=-\mathbb{E}\left[\log \frac{\exp \left(\operatorname{sim}\left(\mathbf{x}, \mathbf{x}^{+}\right) / \tau\right)}{\sum_{\mathbf{x}^{-} \in \mathcal{N}} \exp \left(\operatorname{sim}\left(\mathbf{x}, \mathbf{x}^{-}\right) / \tau\right)}\right]
$$

여기서 유사도는 [[linear_algebra/dot product|dot product]] 나 [[cosine similarity]] 같은 간단한 식을 사용한다.

# B) References

* [Representation Learning with Contrastive Predictive Coding](https://arxiv.org/abs/1807.03748)
