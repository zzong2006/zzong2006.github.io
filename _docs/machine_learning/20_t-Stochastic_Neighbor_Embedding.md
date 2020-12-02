---
layout: default
title:  "T-SNE"
category: Machine Learning
order: 20
---

>  출처: https://lovit.github.io/nlp/representation/2018/09/28/tsne/

t-Stochastic Nearest Embedding (t-SNE) 는 vector visualization 을 위하여 자주 이용되는 알고리즘이다. 

![Visualizing Fixed Income ETFs with T-SNE ](https://i.loli.net/2020/11/04/XilLkywO3n2Fxvh.png)

t-SNE는 다차원 벡터를 3차원 이하로 축소시켜 visualization을 진행하는데,  사실  차원 축소에 관련된 알고리즘은 autoencoder, PCA 등 다양하게 존재한다.

하지만, t-SNE는 transductive 학습 모델이고, 나머지 autoencoder와 PCA는 inductive 학습 모델이라는 특징을 지니고있다.

* Transductive Learning
  * 학습의 목적이 parameters가 아닌 학습을 의미한다.
  * 즉, 모델을 구축하지 않아서 새로운 데이터가 입력으로 들어왔을 때, 알고리즘을 처음부터 재학습할 필요성이 존재한다.
  * 예) t-SNE는 고차원 데이터에 대한 최적의 저차원 데이터를 추정한다.   
* Inductive Learning
  * 학습의 목적이 최적의 parameters를 추정하는 학습을 의미한다.
  * 즉, 모델을 구축하기 때문에 새로운 데이터가 입력으로 들어왔을 때, 알고리즘을 처음부터 재시작할 필요성이 없다.
  * 예) PCA는 주성분 벡터, autoencoder는 신경망의 weights를 추정하여 데이터를 차원 변환시킨다.

t-SNE는 Locally Linear Embedding (LLE)라는 차원 축소 방법과 비슷하다. 

* LLE는 고차원에서 nearest neighbors 이었던 $k$ 개의 점들은 저차원에서도 nearest neighbors 가 되도록 변환시킨다.  
* 하지만, 이것이 단점이 되기도 하는데, $k$ 개의 가장 가까운 점들은 신경쓰지만 그 외의 점들은 전혀 신경쓰지 않는다는 것이다. 또한, $k$는 사용자가 정의해야 하는 parameter 이기도 하다.

 t-SNE 는 원 공간에서의 데이터 간 유사도 $p_{i j}$와 임베딩 공간에서의 데이터 간 유사도 $q_{i j}$ 를 정의함

### $p_{i j}$

$$
p_{j \mid i}=\frac{\exp \left(-\left|x_{i}-x_{j}\right|^{2} / 2 \sigma_{i}^{2}\right)}{\sum_{k \neq i} \exp \left(-\left|x_{i}-x_{k}\right|^{2} / 2 \sigma_{i}^{2}\right)}
$$

* 어느 점 $x_{i}$에서 $x_j$로 이동할 확률을 의미 (즉, 0과 1사이의 값을 가짐)

* $x_{i}$ 와 $x_{j}$가 가까울 수록 높은 확률을 가짐 (negative exponential)

* $p_{i \mid j}$ 는 $p_{j \mid i}$ 와 다를 수 있음 (대칭이 아님)

  * 이를 위해 다음을 정의

  * $$
    p_{i j}=\frac{p_{i \mid j}+p_{j \mid i}}{2 n}
    $$

* 모든 점 $x_i$ 마다 $\sigma_{i}$가 다른 이유는 outlier에 robust한 확률 값 $p_{i j}$ 를 찾기 위해서다.
  
  * 어떤 점 사이가 매우 거리가 멀면 $$\mid x_{i}-x_{j}\mid^{2}$$ 는 매우 커지는데, 이때 $\sigma$ 값도 같이 커진다. 그래서 $$\exp \left(-\mid x_{k}-x_{l}\mid)^{2} / 2 \sigma^{2}\right)$$ 값은 작아진다.

### $q_{i j}$

$$
q_{i j}=\frac{\left(1+\left|y_{i}-y_{j}\right|^{2}\right)^{-1}}{\sum_{k \neq l}\left(1+\left|y_{k}-y_{l}\right|^{2}\right)^{-1}}
$$

*  임베딩 공간에서의 두 점 간의 유사도 $q_{i j}$ 를 나타냄
* 가까울 수록 값이 커짐 (역수)
  * 0 의 역수는 무한대에 가까우므로 이를 방지하기 위해 1을 넣어줌



그리고 t-SNE 는 $p_{i j}$ 에 가장 가깝도록 $q_{i j}$ 를 학습한다. 

* 정확히는 $q_{i j}$ 를 정의하는 $y_{i}, y_{j}$ 를 학습한다. 
* 이는 정답지 $p_{i j}$ 를 보면서$y_{i}, y_{j}$ 의 위치를 이동하는 것과 같다.

