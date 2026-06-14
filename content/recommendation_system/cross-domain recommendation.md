---
tags: ["recommendation_system"]
---

# A) Cross-domain Recommendation ?

* Merging user preferences: User preferences from both domains are aggregated in such a way that single-domain recommender systems can be used.
* Linking domains: Graph-based approaches, in which nodes from different domains are linked by the means of shared attributes or interactions.
* [[transfer learning]]: Knowledge obtained while training a model on the source domain is transferred to make recommendations in the target domain.
* Co-training of shared features ([[multi-task learning]]): Multiple tasks are solved at the same time in the source and target domains, to learn shared latent features.
* Deep learning: Neural network models are used to share/transfer latent features across domains through unstructured semantic features extracted during training.

# B) (1) Merging User Preferences

여러 도메인에서의 사용자 선호도를 domain-independent feature 로 mapping 하고, target domain 의 유저 선호도를 예측하는 모델을 학습할 때 mapping 된 feature 를 사용하는 방법이 있다.

**장점**

간단해서 baseline 으로 자주 쓰인다.

**단점**

도메인을 모두 합치는 과정에서 그 크기가 매우 커질 수 있다.

# C) (2) Linking Domains

user 또는 item 을 노드로 취급하여 그래프를 구성한다.

구성된 그래프에서 random walk 알고리즘을 통해 유저가 좋아할만한 아이템을 찾아낼 수 있다. -> item pool 구성에 사용해볼 수 있을듯 함

그래프 기반 feature 추출 방식도 고려해보면 좋을 것 같다.

# D) (3) Transfer Learning

source recommenders 의 유저 모델링 데이터를 target recommender 에 적용하는 방법.

예시) Nearest Neighbors: 두 유저가 source domain 에서 유사하다면, 이 둘은 target domain 에서도 유사할 수 있다는 전제가 있다.

Paper lists

* Cross-domain recommendation: An embedding and mapping approach
* Multiple domain user personalization. KDD’ 11.

# E) (4) Co-Training of Shared Latent Features

여러 도메인의 latent features 를 동시에 학습하는 방법

# F) (5) Deep Learning

A deep function was used to map the benchmark factors with the ones computed in each domain. Example) Leveraged unstructured text for collaborative recommendations.

# G) Related

# H) References
