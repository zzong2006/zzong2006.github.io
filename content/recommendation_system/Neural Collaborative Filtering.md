---
tags: ["recommendation_system", "implicit_feedback", "deep_learning"]
aliases: ["NCF", "NeuMF"]
---

# A) Neural Collaborative Filtering ?

the neural collaborative filtering (NCF) framework for recommendation with implicit feedback.

This model leverages the flexibility and non-linearity of neural networks to replace dot products of [[matrix factorization]], aiming at enhancing the model expressiveness.

this model is structured with two subnetworks including generalized matrix factorization (GMF) and MLP and models the interactions from two pathways instead of simple dot products. The outputs of these two networks are concatenated for the final prediction scores calculation.

* Unlike the rating prediction task in [[AutoRec]], this model generates a ranked recommendation list to each user based on the implicit feedback

# B) 논문 맥락

NeuMF는 [[matrix factorization|MF]] 와 MLP의 장점을 결합해서 user-item interaction을 모델링한다. MF는 inner product로 단순한 상호작용을 잘 잡고, MLP는 더 복잡한 비선형 상호작용을 표현하기 좋다.

# C) References

* https://d2l.ai/chapter_recommender-systems/neumf.html
