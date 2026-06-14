---
tags: ["recommendation_system", "work"]
aliases: ["content_based"]
---

# 1. CB ?

CB(Contents Based) 추천은 콘텐츠 자체의 내용을 분석하여 유사한 콘텐츠를 찾는 방법이다.

콘텐츠의 종류는 글, 사진, 음악 등 다양하므로, 다양한 데이터 도메인을 위해 각기 다른 여러 종류의 CB 기술이 필요하다.

# 2. 텍스트 데이터

* [[Word Embedding]]
* [[Word2Vec]]
* Topic modeling & Clustering: 비슷한 주제를 가진 글을 묶음
* Latent Dirichlet Allocation ([[LDA]]): Topic modeling 기술 중 하나로 베이지안 통계 기반 기술

# 3. 이미지 데이터

* [[Convolution Neural Network|CNN]] 과 [[autoencoder]] 를 사용한 이미지 CB 기술
* Spectrogram, Mel-frequency Cepstral Coefficient (MFCC) 를 사용한 신호 처리 기술

# 4. CB 장점 그리고 단점

✅ 장점

콜드 스타트, 인기 편향 문제가 없다. 즉, 사용자들의 선호 데이터가 없는 콘텐츠도 추천할 수 있다.

❎ 단점

다소 의외의 추천을 한다. 다양하고 참신한 추천을 원한다면 이러한 단점은 장점이 될 수 있다.
