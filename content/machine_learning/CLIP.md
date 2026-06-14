---
title: "CLIP"
tags: ["machine_learning", "multimodal", "contrastive_learning"]
aliases: ["CLIP", "Contrastive Language-Image Pre-training"]
---

# A) CLIP ?

CLIP(Contrastive Language-Image Pre-training)은 image encoder 와 text encoder 를 함께 학습해서, 이미지와 텍스트를 같은 embedding space 에 맞추는 multimodal model 이다.

# B) 학습 아이디어

같은 image-caption pair 는 가깝게, batch 안의 다른 image-caption 조합은 멀게 학습한다. 이 구조 때문에 zero-shot image classification, image-text retrieval, multimodal retrieval 의 baseline 으로 자주 쓰인다.

# C) Related

* [[contrastive learning]]
* [[multimodal]]
* [[retrieval]]

