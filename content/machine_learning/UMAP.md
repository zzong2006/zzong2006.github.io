---
tags: ["feature_engineering"]
---

# A) UMAP ?

[[t-Stochastic Nearest Embedding|t-SNE]] 랑 비슷한 non-linear [[dimension reduction]] 방식

일반적으로 t-SNE 보다 훨씬 빠르다고 한다.

# B) Parameters

UMAP 적용할 때 parameter 설정 중 눈에 띄는 것들

* `init`: 초기화 방법에 [[machine_learning/Principal Component Analysis|PCA]] 적용이 있다. PCA -> UMAP 의 형태로 이중으로 차원 축소를 먹이는 방법이다. 기본은 `spectrum` 이라는 옵션인데, 이게 시간이랑 메모리를 많이 잡아먹어서 `random` 으로 바꾸는게 도움이 된다고 한다.
* `low_memory`: 메모리 절약할때 키는 옵션으로, 기본으로 켜져있다. 근데도 메모리를 엄청 먹는다.

가장 중요한 parameters

* `min_dist`: 최소 거리
* `metric`: 거리 측정 방식
* `n_neighbors`: 근처 이웃 노드 개수
* `n_components`: 저차원 수

# C) 대용량 데이터에 UMAP 적용하기

이슈를 찾아보니 데이터를 샘플링해서 로컬 그래프를 만들고, 여러 그래프를 하나로 합치는 방법을 권장한다고 한다 (link: [Combining multiple UMAP models — umap 0.5 documentation](https://umap-learn.readthedocs.io/en/latest/composing_models.html)).

# D) Lesson Learned

3gb 정도 feature(=`1725086 x 256`) 를 학습하는데 메모리 사용량이 너무 높다. 대략 20gb 가까이 사용하는 것 같고, 시간 b 도 꽤 오래 걸리는듯 (대략 3 시간 걸림). 특히 임베딩 구성이 엄청 오래걸리는 거 같다.

이슈를 돌다보니 아래와 같은 팁을 발견했다.

> Fourth, try to keep `n_neighbors` small; the larger it is, especially for large datasets, the worse the performance. Part of the efficiency of UMAP comes from its ability to make use of much smaller nearest neighbor sets than comparable algorithms.

metric 을 코사인 유사도로 했더니 이후에 [[dot product]] 로 계산하면 유사도가 거의 다 비슷하게 나온다. 최하가 0.9995, 최고가 0.9999 이런 수준으로 나왔다.

neighbor 수가 작을수록, min_dist 가 커질수록, 데이터 간 유사도 격차가 커진다.

차원 감소 이후의 component 개수도 작을수록 격차가 커진다.

# E) UMAP 장점

* **빠른 속도**: UMAP 은 매우 빠르게 작동하여 대규모 데이터셋에서도 효율적으로 사용할 수 있습니다.
* **차원 크기 제한 없음**: embedding 차원의 크기에 제한이 없어, 다양한 차원 축소 문제에 적용할 수 있습니다.
* **global structure 보존**: 데이터의 전체적인 구조를 잘 유지하며, 시각화 결과도 더 직관적이고 보기 좋습니다.
* **탄탄한 이론적 배경**: 리만 기하학과 위상수학에 기반을 둔 이론적 배경을 가지고 있어 신뢰성이 높습니다.

# F) UMAP 단점

* **Hyperparameter 의존성**: 모델 성능이 Hyperparameter 설정에 크게 영향을 받기 때문에 최적의 값을 찾는 과정이 중요합니다.
* **거리 왜곡 가능성**: 저차원으로 임베딩된 결과에서 각 데이터 간 거리가 실제 고차원 공간에서의 거리와 일치하지 않을 수 있습니다.
* **정보 손실로 인한 왜곡**: 저차원 임베딩 과정에서 일부 정보가 손실될 수 있으며, 이로 인해 데이터가 왜곡될 가능성이 있습니다.

# G) References
