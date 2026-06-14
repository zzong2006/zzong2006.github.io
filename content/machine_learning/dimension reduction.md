---
tags: ["feature_engineering"]
---

# A) Dimension Reduction ?

데이터의 차원수를 줄이는 방법

# B) Lesson Learned

가장 보편적인 방식은 [[Principal Component Analysis|PCA]], UMAP, [[t-Stochastic Nearest Embedding|t-SNE]] 가 있다.

선형 변환 방식인 PCA 은 비선형 변환 방식인 UMAP 또는 t-SNE 와 비교하진 않고, 서로 조합하면서 사용하는 것 같다. 즉, PCA + UMAP 또는 PCA + t-SNE 와 같은 방식으로 진행하는듯 하다. 이를 PCA initialization 이라고 부르는 듯.

그런데 궁금한 것이 어차피 차원수를 줄이는 목적이라면 그냥 PCA 만 사용하면 되는데 굳이 비선형 변환을 붙이는 이유는 무엇인지 잘 모르겠다. 다만 클러스터링 결과를 시각적으로 확인해보면 확실히 단순 PCA 를 붙이는 것보다는 비선형 변환까지 조합하는게 보다 결과가 좋은듯 하다 (참고: [t-SNE and UMAP - Effect of initialization on the dimensionality reduction | Pushkar G. Ghanekar](https://pgg1610.github.io/blog_fastpages/python/data-visualization/2021/02/03/tSNEvsUMAP.html#1.-Looking-at-2D-circle)).

# C) Related

# D) References
