---
title: "contrastive learning"
tags:
  - machine_learning
  - representation_learning
  - self_supervised
aliases: [contrastive learning]
---

# A) Contrastive Learning ?

Contrastive learning 은 비슷해야 하는 pair 는 embedding 공간에서 가깝게, 달라야 하는 pair 는 멀게 학습하는 representation learning 방법이다.

# B) Positive 와 Negative

같은 image 의 augmentation, 같은 query 의 clicked item, 같은 product 의 text/image pair 처럼 가까워져야 하는 쌍을 positive pair 라고 한다. 반대로 다른 class, 다른 item, batch 안의 다른 sample 은 negative 로 사용될 수 있다.

# C) Loss

대표적인 objective 로 [[InfoNCE]], [[retrieval/concepts/Triplet Loss|Triplet Loss]] 가 있다. 핵심은 score 차이를 통해 embedding space 의 상대적 구조를 학습한다는 점이다.

# D) Related

* [[metric learning]]
* [[hard negative]]
* [[self-supervised]]

