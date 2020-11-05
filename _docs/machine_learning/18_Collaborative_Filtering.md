---
layout: default
title:  "Collaborative Filtering"
category: Machine Learning
order: 18
---

## Content Based Recommendations

item의 feature들을 이용하여 user의 선호도를 예측하는 시스템

![image-20201102190251093](https://i.loli.net/2020/11/02/b7xVAMYf6iCrRXj.png)

* 각 영화에 두가지 feature를 사용하여 4명의 사용자들의 영화에 대한 선호도를 추정한다.

Content Based 추천은 regression 문제와 비슷하다.

### Problem formulation

$r(i, j)=1$ : 사용자 $j$가 영화 $i$에 평가한 경우 (평가를 안했으면 $0$)

$y^{(i, j)}$ : 사용자 $j$의 영화 $i$에 대한 평가 (training data의 label 이라고 볼 수 있음)

$\theta^{(j)}$ : 사용자 $j$의 parameter vector (이것을 학습하는 것이 핵심임)

* 위 그림에서 영화의 features 가 2개였다면, bias term 까지 합쳐서 3개를 사용함: $\theta^{(j)} \in \mathbb{R}^{3}$

$x^{(i)}$ : 영화 $i$의 feature vector (training data의 feature space라고 볼 수 있음)

사용자 $j$와 영화 $i$에 대하여, 평점 예측 $$ \left(\theta^{(j)}\right)^{T}\left(x^{(i)}\right)$$

$m^{(j)}$ : 사용자 $j$에 의해 평가된 영화의 총 개수

### Optimization objective

사용자 $j$에 대한 parameter $\theta^{(j)}$를 학습

$$
\min _{\theta(j)} \frac{1}{2} \sum_{i: r(i, j)=1}\left(\left(\theta^{(j)}\right)^{T} x^{(i)}-y^{(i, j)}\right)^{2}+\frac{\lambda}{2} \sum_{k=1}^{n}\left(\theta_{k}^{(j)}\right)^{2}
$$

전체 사용자 $\theta^{(1)}, \theta^{(2)}, \ldots, \theta^{(n_{u})}$ 에 대한 parameters 학습

$$
\min _{\theta^{(1)}, \ldots, \theta^{\left(n_{u}\right)}} \frac{1}{2} \sum_{j=1}^{n_{u}} \sum_{i: r(i, j)=1}\left(\left(\theta^{(j)}\right)^{T} x^{(i)}-y^{(i, j)}\right)^{2}+\frac{\lambda}{2} \sum_{j=1}^{n_{u}} \sum_{k=1}^{n}\left(\theta_{k}^{(j)}\right)^{2}
$$

원래 평균을 계산하기 위해 $\frac{1}{m^{(j)}}$를 사용하는데 여기서는 안 사용함 (이유는 모르겠음)

### Optimization algorithm

Gradient descent update

$$
\begin{array}{l}
\theta_{k}^{(j)}:=\theta_{k}^{(j)}-\alpha \sum_{i: r(i, j)=1}\left(\left(\theta^{(j)}\right)^{T} x^{(i)}-y^{(i, j)}\right) x_{k}^{(i)}(\text { for } k=0) \\
\theta_{k}^{(j)}:=\theta_{k}^{(j)}-\alpha\left(\sum_{i: r(i, j)=1}\left(\left(\theta^{(j)}\right)^{T} x^{(i)}-y^{(i, j)}\right) x_{k}^{(i)}+\lambda \theta_{k}^{(j)}\right)(\text { for } k \neq 0)
\end{array}
$$

* $k$ 가 0일 때와 아닐 때를 따로 둔 이유는 bias term에 대한 parameter는 regularization을 적용하지 않기 때문임



## Collaborative Filtering

Collaborative filtering의 알고리즘 중 하나는 user based와 content based 방법을 번갈아 가면서 반복적으로 item과 rating 값을 갱신해나가는 방법이 존재한다.

![image-20201102200859180](https://i.loli.net/2020/11/02/ea1nE5jsMg8IQr7.png)

* 맨 처음 parameter는 randomly initialization

User based는 User 의 parameter를 이용해 item의 feature를 추측하는 방법이다. 즉, 방법은 content based와 같지만 parameter와 training data가 뒤바뀐 셈이다.

![image-20201102200354216](https://i.loli.net/2020/11/02/Y1VlhxkpEIzyq4e.png)

* 위 그림과 같이 item 에 대한 정보(features)가 없어도 user parameter를 이용해 유추할 수 있다.

### Optimization algorithm (User based)

User parameters $$\theta^{(1)}, \ldots, \theta^{\left(n_{u}\right)}$$ 가 주어졌을 때, $x^{(i)}$ 를 학습

$$
\min _{x^{(i)}} \frac{1}{2} \sum_{j: r(i, j)=1}\left(\left(\theta^{(j)}\right)^{T} x^{(i)}-y^{(i, j)}\right)^{2}+\frac{\lambda}{2} \sum_{k=1}^{n}\left(x_{k}^{(i)}\right)^{2}
$$

User parameters $$\theta^{(1)}, \ldots, \theta^{\left(n_{u}\right)}$$ 가 주어졌을 때, $$x^{(1)} \ldots, x^{\left(n_{m}\right)}$$ 를 학습

$$
\min _{x^{(1)}, \ldots, x^{\left(n_{m}\right)}} \frac{1}{2} \sum_{i=1}^{n_{m}} \sum_{j: r(i, j)=1}\left(\left(\theta^{(j)}\right)^{T} x^{(i)}-y^{(i, j)}\right)^{2}+\frac{\lambda}{2} \sum_{i=1}^{n_{m}} \sum_{k=1}^{n}\left(x_{k}^{(i)}\right)^{2}
$$



## Collaborative Filtering Algorithm

좀 더 효율적인 collaborative filtering 알고리즘은 user parameter와 item feature를 동시에 학습하는 과정이다.

$$
\frac{J\left(x^{(1)}, \ldots, x^{\left(n_{m}\right)}, \theta^{(1)}, \ldots, \theta^{\left(n_{u}\right)}\right)}{2}\\ \\=\frac{1}{2} \sum_{(i, j): r(i, j)=1}\left(\left(\theta^{(j)}\right)^{T} x^{(i)}-y^{(i, j)}\right)^{2}+\frac{\lambda}{2} \sum_{i=1}^{n_{m}} \sum_{k=1}^{n}\left(x_{k}^{(i)}\right)^{2}+\frac{\lambda}{2} \sum_{j=1}^{n_{u}} \sum_{k=1}^{n}\left(\theta_{k}^{(j)}\right)^{2}
$$

* 각 알고리즘의 regularization term을 가져왔다. 

이렇게 동시에 학습하게 되면 bias가 필요 없어진다. bias가 있는 이유는 parameter의 symmetric을 breaking하기 위함인데, user와 item에 대해 동시에 학습하게 되므로, symmetric 현상을 걱정할 필요가 없다.

* 즉, $n$개의 features를 $n+1$개로 학습할 필요 없이, $n$개로 학습하면 된다.

### 학습 방법

1. $$   x^{(1)}, \ldots, x^{\left(n_{m}\right)}, \theta^{(1)}, \ldots, \theta^{\left(n_{u}\right)} $$ 를 임의의 **작은** 값으로 초기화한다 (for breaking symmetric)
2. $$ J\left(x^{(1)}, \ldots, x^{\left(n_{m}\right)}, \theta^{(1)}, \ldots, \theta^{\left(n_{u}\right)}\right)$$ 를 최소화 하는 방향으로 gradient descent를 적용한다.
	* 즉, 모든 $j=1, \ldots, n_{u}, i=1, \ldots, n_{m}$ 에 대해 :
	* $$
        x_{k}^{(i)}:=x_{k}^{(i)}-\alpha\left(\sum_{j: r(i, j)=1}\left(\left(\theta^{(j)}\right)^{T} x^{(i)}-y^{(i, j)}\right) \theta_{k}^{(j)}+\lambda x_{k}^{(i)}\right)
        $$
	* $$
    \theta_{k}^{(j)}:=\theta_{k}^{(j)}-\alpha\left(\sum_{i: r(i, 	j)=1}\left(\left(\theta^{(j)}\right)^{T} x^{(i)}-y^{(i, j)}\right) x_{k}^{(i)}+\lambda \theta_{k}^{(j)}\right)
   $$

3. 학습이 완료되면, 사용자 parameter $\theta$와 item features $x$를 이용해 rating을 추측한다: $\theta^{T} x$



## Vectorization: Low Rank Matrix Factorization

Collaborating Filtering을 수행할 때, vectorization을 이용해서 rating prediction을 빠르게 수행할 수 있다.

![image-20201102205057974](https://i.loli.net/2020/11/02/8uieT1VQROlbg4K.png)

* 위 rating table을 $Y$라는 matrix로 나타낼 수 있으며, $Y$는 user parameters matrix와 item features matrix의 곱으로 표현될 수 있다.

아래 그림과 같은 방법을 low rank matrix factorization이라고 한다.

![image-20201102205239056](https://i.loli.net/2020/11/02/zOYEMHZxn15ug4q.png)

### Finding related movies

item에 대한 feature 학습이 완료된 상태라면, 각 item 간 유사도를 측정할 수 있다. 

* 아래 그림에서는 유사도 metrics 중 L2-norm을 활용하였다.

![image-20201102205335601](https://i.loli.net/2020/11/02/SrwFtHgOf1WvPbA.png)



## Implementational Detail: Mean Normalization

새로운 user에 대해서 rating 을 측정할 필요가 있다. 

![image-20201102210104328](https://i.loli.net/2020/11/02/o1aibBA9PGmnxCl.png)

* 위 그림처럼 cost function은 평가된 rating을 활용하여 parameter를 update하므로, 오직 cost function에서 영향이 있는 것은 regularization term이다.
* 즉, 사용자 Eve의 rating이 없는 상태에서는 학습 과정에서 Eve의 parameter들은 0으로 수렴할 수 밖에 없다.
* 최종적으로 rating 계산은 0이 되는데 직관적으로 이러한 점수 배정은 이상하다.

### Mean Normalization

새로운 user에 대한 rating을 좀 더 reasonable하게 바꿔주는 방법은 mean normalization이다.

![image-20201102210405993](https://i.loli.net/2020/11/02/35a2ozEkyOnX1IT.png)

* 우선 rating된 item에 대하여, 해당 점수 값들을 normalize하여 평균을 0으로 만든다.
  * normalize 에서 계산된 평균 $\mu$는 보관한다.
* 그리고 언급된 cost function을 이용하여 학습을 진행한다. 
  * 이 경우 당연히 Eve의 parameter는 0으로 수렴한다.
* 학습 이후 rating을 추정할 때, 추정값에 이전에 구한 평균 값 $\mu$를 더해준다.

