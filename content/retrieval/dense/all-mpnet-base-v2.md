---
title: "all-mpnet-base-v2"
tags: ["embedding", "dense_retrieval"]
---

# A) 배경

이 프로젝트는 대규모 문장 수준 데이터셋을 활용해 문장 임베딩 모델을 학습하는 것을 목표로 합니다. 사전 학습된 [`microsoft/mpnet-base`](https://huggingface.co/microsoft/mpnet-base)모델을 기반으로, 10억 쌍의 문장 페어 데이터셋에서 추가로 파인튜닝을 진행하였습니다. 모델 학습에는 자기 지도형(셀프 슈퍼바이즈드) 대조 학습(contrastive learning) 목표를 사용하였습니다. 구체적으로, 주어진 쌍 중 한 문장이 입력되었을 때, 여러 개의 무작위로 샘플링된 다른 문장들 중 실제로 쌍을 이룬 문장을 올바르게 예측하도록 모델을 훈련시켰습니다.

# B) Reference

[sentence-transformers/all-mpnet-base-v2 · Hugging Face](https://huggingface.co/sentence-transformers/all-mpnet-base-v2)
