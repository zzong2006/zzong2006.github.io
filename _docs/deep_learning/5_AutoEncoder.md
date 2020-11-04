---
layout: default
title:  "Auto Encoder"
category: Deep Learning
order: 5
---

### AE의 특징

* Self-Supervised 기술이다. (Similar to unsupervised)
  * self-supervised: 데이터로부터 target(label)을 만들어내는 학습
* Data denoising 에 사용될 수 있다.

![Applied Deep Lear](https://i.loli.net/2020/11/02/QtPuUBkdKWgCevm.png)

* Data Restoration 에도 사용될 수 있다.

![Automatic Object Removal and Realistic Image Completion NVIDIA Developer](https://i.loli.net/2020/11/04/WovYjCIVfXr3ayx.png)

* 학습된 manifold 근방의 데이터에 대해서만 제대로 작동함으로써 간접적으로 manifold를 표현한다.
  * 직접 manifold를 추정하고 표현하는 기법은 t-SNE다.

### 오토인코더의 장점

* 신경망에 non-linear activation function을 사용하기 때문에, non-linear한 데이터에 대한 차원 압축을 원활히 진행할 수 있다.
  * PCA는 주성분 벡터를 이용해 기존 데이터를 변형하므로, 선형 변환만 가능하다.
* 차원 변환 외에도 활용 가능성이 높다.
  * Data denoising & Restoration

### 오토인코더의 단점

* 훈련에 많은 시간이 필요하다.
  
* A lot of data, processing time, hyperparameter tuning, 그리고, 모델 검증 등
  
* data-specific하다. 즉, 훈련된 데이터와 비슷한 데이터만 올바르게 압축 및 복원할 수 있다.

  * 다른 말로 하면, AE는 training set이 형성하는 manifold 와 비슷한 형질을 지닌 데이터만 올바르게 복원할 수 있다.

* AE 학습을 위해서는 축소된 차원을 복원하는 과정을 거쳐야 하는데, hidden layer의 unit이 일정 차원수 이상을 보장하지 않으면 축소 과정에서 정보 손실이 너무 커져서 올바른 복원이 되지 않고, 학습이 잘 이루어지지 않음

  * 결과적으로 일정 차원수 이상을 보장해야 하는데, 이로 인해서 간접적인manifold의 표현밖에 가능하지 않음

  

## Stacked AutoEncoder (SAE)

얕은 network를 가지는 autoencoder는 한계가 있고, hidden layer를 여러 개 쌓아서 deep architecture로 확장시킬 수 있다. 이렇게 확장한 구조를 SAE라고 한다.

### layer-wise pre-training

여러 layer의 autoencoder를 한꺼번에 학습시키기 전에 다음과 같은 예비 학습 과정을 거치게된다.

![image-20201104142045274](https://i.loli.net/2020/11/04/m9WuD8MVRXPO1Aq.png)

1. 우선 첫번째 layer를 학습시킨다. 이때 입력은 $x$ , 출력은 $x$로 일반적인 autoencoder의 학습을 시킨다.
2. 이후 첫번째 layer의 weight $w_1$는 고정시키고, 두번째 layer를 학습시킨다. 이전 학습 시, $x$를 입력했을 때 첫번째 hidden layer에서 얻어지는 출력 $h_1 (=XW^{\top})$을 입력으로 하고, 출력도 $h_1$로 하게 만든다.
3. 세번째 layer도 비슷한 방식으로 입력은 $h_2$, 출력도 $h_2$로 수행한다.
4. 이렇게 반복적으로 하고, 마지막에 원하는 layer를 추가하면 된다.
   * 예를 들어서 마지막 layer에 classification을 위한 layer를 추가할 수 있다. 이럴 경우 입력은 $h_3$, 출력은 $o$가 된다 (그냥 shallow network랑 같다).

이렇게 층별 레이어 학습을 통해서 gradient vanishing 문제를 완화시킬 수 있었기에, 혁신적인 연구였지만, 지금은 GPU 성능 향상 및 대용량 데이터 확보와 같은 외부적인 영향으로 예비 학습 과정을 거치지 않아도 충분한 성능을 얻을 수 있게 되었다.

## Variant AutoEncoder(VAE)

VAE는 AE보다 높은 군집 강도를 형성할 수 있게끔 도와주는 신경망이다.
* VAE를 통해 생성된 latent vectors는 AE보다 차원상에서 compact하게 뭉쳐져 있다.
* AE와 VAE를 통해 4차원으로 압축된 latent vectors를 PCA로 2차원에 압축 된 데이터를 표현한 그래프
  * ![image-20201020181647374](https://i.loli.net/2020/10/20/ECfRQAz6xBvbqNG.png)

VAE는 오토인코더의 latent vectors를 단일 value로 표현하지 않고, gaussian probability distribution에 기반한 확률값으로 나타낸다.

* ![img](https://i.loli.net/2020/10/20/z24Phi91LkqZogF.png)

### VAE의 학습 과정

![img](https://i.loli.net/2020/11/04/aOByNF7XdZeWgRD.png)

1. VAE의 encoder 네트워크는 입력 샘플 `x`를 잠재공간(latent space)에서 두 개의 매개 변수 $\mu$와 $\sigma$로 변환시킨다. 

2. $z=\mu+e^{\log{\sigma}} \cdot \varepsilon$ 를 잠재정규분포(latent normal distribution)로 정하고, $z$과 유사한 데이터를 무작위로 sampling한다.
   * $\varepsilon$은 gaussian noise로, 임의의 정규 tensor다.
3. decoder 네트워크는 sampling된 데이터를 원래의 입력 데이터로 복원한다(완벽하진 않지만).

