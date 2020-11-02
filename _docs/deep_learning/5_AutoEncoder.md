---
layout: default
title:  "Auto Encoder"
category: Deep Learning
order: 5
---

> AutoEncoder(AE): (latent vector를 찾는데 효과적임)

### AE의 특징

* Self-Supervised 기술이다. (Similar to unsupervised)
  * self-supervised: 데이터로부터 target(label)을 만들어내는 학습
* Data denoising 에 사용될 수 있다.

![Applied Deep Lear](https://i.loli.net/2020/11/02/QtPuUBkdKWgCevm.png)

* Data Restoration 에도 사용될 수 있다.

### 오토인코더의 장점

* Non-linear한 데이터 분포에도 높은 차원 압축 성능을 보인다
  * PCA는 SVD를 통한 차원 압축을 진행하는데, SVD는 데이터가 linear한 상황에서 잘 동작한다.

### 오토인코더의 단점

* Autoencoder는 훈련에 많은 시간이 필요하다.
  * A lot of data, processing time, hyperparameter tuning, 그리고, 모델 검증 등

* AE는 data-specific하다. 즉, 훈련된 데이터와 비슷한 데이터만 올바르게 압축할 수 있다.
* 데이터 압축에 있어서 손실이 발생함
* 



## Variant AutoEncoder(VAE)

* VAE는 AE보다 높은 군집 강도를 형성할 수 있게끔 도와주는 신경망이다.
  * VAE를 통해 생성된 latent vectors는 AE보다 차원상에서 compact하게 뭉쳐져 있다.
  * AE와 VAE를 통해 4차원으로 압축된 latent vectors를 PCA로 2차원에 압축 된 데이터를 표현한 그래프
    * ![image-20201020181647374](https://i.loli.net/2020/10/20/ECfRQAz6xBvbqNG.png)
* VAE는 오토인코더의 latent vectors를 단일 value로 표현하지 않고, gaussian probability distribution에 기반한 확률값으로 나타낸다.
  * ![img](https://i.loli.net/2020/10/20/z24Phi91LkqZogF.png)

### VAE의 학습 과정

1. VAE의 encoder 네트워크는 입력 샘플 `x`를 잠재공간(latent space)에서 두 개의 매개 변수 $\mu$와 $\sigma$로 변환시킨다. 

2. $z=\mu+e^{\log{\sigma}} \cdot \varepsilon$ 를 잠재정규분포(latent normal distribution)로 정하고, $z$과 유사한 데이터를 무작위로 sampling한다.
   * $\varepsilon$은 gaussian noise로, 임의의 정규 tensor다.
3. decoder 네트워크는 sampling된 데이터를 원래의 입력 데이터로 복원한다(완벽하진 않지만).

* ![img](https://i.loli.net/2020/10/20/TiBosS6x5CegUbY.png)
* 