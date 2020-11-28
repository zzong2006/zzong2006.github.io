---
layout: default
title:  "Regularization"
category: Deep Learning
order: 7.1
---

모델의 overfitting 문제를 완화하기 위해서 정말 다양한 regularization 방법들이 적용되었다. 이번 포스팅은 그 방법들을 소개하려고 한다.

## (1) Regularization 

Regularization은 overfitting 문제를 완화하기 위한 방법이다.

Regularization을 logistic regression에 적용하기 위해서 L2 norm을 사용하고,  신경망에는 Frobenius norm을 적용한다.

### Logistic Regression

Regularization term이 붙은 cost function $J$는 다음과 같이 계산된다.

$$
J(w, b)=\frac{1}{m} \sum_{i=1}^{m} \mathcal{L}\left(\hat{y}^{(i)}, y^{(i)}\right)+\frac{\lambda}{2 m}\|w\|_{2}^{2}
$$

여기서 $\|w\|_{2}^{2}$ 는 L2 norm을 의미한다.

$$
\|w\|_{2}^{2}=\sum_{j=1}^{n_{x}} w_{j}^{2}=w^{\top} w
$$

* $w \in \mathbb{R}^{n_{x}}, b \in \mathbb{R}$



#### 왜 bias는 regularization을 적용하지 않는가?

실제로 regularization term에 bias를 추가해도 상관없다. 

그러나, 높은 차원의 벡터는 high variance에 크게 관련있는 반면, bias는 단순히 숫자(single number)일 뿐이므로 high variance에 큰 영향을 주지 않는다.



#### L1 Norm instead of L2 Norm?

L1 Norm 역시 적용할 수 있다.

$$
\frac{\lambda}{2 m} \sum_{j=1}^{n_{x}}\left|w_{j}\right|=\frac{\lambda}{2 m}\|w\|_{1}
$$

L1 Norm을 적용하여 나타나는 현상은 weight 값들이 sparse 해진다는 것이다 (대부분의 원소들이 0의 값을 가지는 것). 몇몇 사람들은 이러한 결과가 메모리를 절약하는데 도움을 준다고는 하지만, 실제로는 큰 영향이 없는 것으로 확인되었다. 결과적으로 L2 Norm을 가장 많이 사용한다.



### Neural Network

Regularization term이 붙은 cost function $J$는 다음과 같이 계산된다.

$$
J\left(w^{[1]}, b^{[1)}, \ldots, w^{[L]}, b^{[L]}\right)= \frac{1}{m} \sum_{i=1}^{m} f\left(\hat{y}^{(i)}, y^{(i)}\right)+\frac{\lambda}{2 m} \sum_{i=1}^{l}\left\|w^{[ l]}\right\|_{F}^{2}
$$

* $w^{[ l ]}$는 $(n^{[l]}, n^{[l-1]})$ 의 크기를 가진 matrix이다.
* 그리고  $\| w^{[l]} \|_{F}^{2}$ 는 matrix의 Frobenius norm 이다.

$$
\| w^{[l]} \|_{F}^{2}=\sum_{i=1}^{n^{l}} \sum_{j=1}^{n^{[l-1]}}\left(w_{i, j}^{[l]}\right)^{2}
$$

* $i$ 는 해당 layer 의 unit 개수 $n^{[l]}$를 나타내고, $j$ 는 이전 layer의 unit 개수  $n^{[l-1]}$ 를 나타낸다.




#### Weight Decay

위 cost function을 이용한 back propagation은 어떻게 계산되는가? Frobenius norm을 이용한 back propagation을 종종 weight decay 라고 부른다.

우선 Frobenius norm의 미분은 $\frac{\lambda}{m} w^{[l]}$ 로 표현된다. 즉, weight update는 다음과 같다.

$$
\begin{aligned}
w^{[l]} &:= w^{[l]} - \alpha [\text{from backprop} + \frac{\lambda}{m} w^{[l]}]\\
&=w^{[l]} - \frac{\alpha\lambda}{m} w^{[l]} - \alpha [\text{from backprop}] \\
&=  \left( 1- \frac{\alpha\lambda}{m} \right)  w^{[l]} - \alpha [\text{from backprop}]
\end{aligned}
$$

* $1- \frac{\alpha\lambda}{m} < 1$ 을 만족하므로, weight이 update 될 때마다 점점 감소한다 하여 weight decay로 불린다.



### How does regularization prevent overfitting?

$\lambda$ 값이 높아지면, weight가 줄어든다. (cost function 을 최소화하는 것이 학습의 목적이므로) 결과적으로, 줄어든 weight를 통해서 계산된 각 layer의 output은 0에 가깝게 된다. 

<img src="https://i.loli.net/2020/11/28/D42n1ZHav6OLEi9.png" alt="image-20201128143429310" style="zoom: 67%;" />

위 그림은 activation function 중 tanh 함수에 대한 그림이다. weight가 작다면, 0의 값 중심으로 layer의 output $z^{[l]}$ 이 몰릴것이고, 해당 레이어는 선형(linear) 모델과 비슷하게 된다.

만약, 전체 레이어가 이와같은 선형 모델이라면, 결과적으로 모델 자체가 선형 모델에 가깝게 될 것이고, 이는 곧 모델 단순화의 원인이 되어 overfitting을 예방한다.

<img src="https://i.loli.net/2020/11/28/vlgfa87FApsuwkW.png" alt="image-20201128143724118" style="zoom: 67%;" />

## (2) Dropout

드롭아웃 방식은 사용자 정의된 확률에 기반하여 각 레이어의 일부 노드들을 계산에 포함시키지 않는 방법을 의미한다.

<img src="https://i.loli.net/2020/11/28/sbX2cQ7oLPVlHxm.png" alt="image-20201128145351257" style="zoom: 80%;" />

코드 형식으로 dropout이 적용되는 과정을 소개하겠다.

```python
d3 = np.random.rand(a3.shape[0], a3.shape[1]) < keep_prob #1
a3 = np.multiply(a3, d3) #2
a3 /= keep_prob #3
# z4 = w4.dot(a3) + b4 ... 
```

여기서 `keep_prob`은 사용자 정의된 확률을 의미한다. 예를 들어 `keep_prob=0.8`라면, 20%의 노드들은 계산에 포함시키지 않겠다는 의미가 된다.

그리고 `d3`은 `boolean` 형태 matrix로, dropout에서 살릴 units들을 의미하며, `a3`은 3번째 레이어의 출력을 의미한다. 즉, `np.multiply(a3, d3)`를 통해 노드의 출력을 살릴지 말지 결정한다.

마지막 `a3 /= keep_prob` 은 inverted dropout 이라는 기법인데, dropout이 적용되더라도 layer 출력값 `a3`의 **기댓값이 일정**하도록 유지해준다. 만약 `keep_prob=1`이면, dropout이 적용되지 않는 것이므로, inverted dropout 방법도 의미가 없어진다 (어차피 기댓값은 동일하므로).



#### `keep_prob` by layers?

dropout 확률을 레이어마다 다르게 유지해도 좋다. 다만, 이런 경우 각 layer 마다 hyper-parameter를 추가한것과 같으므로 tuning에 추가적인 작업이 필요할 것이다.



### Making predictions at test time

중요한 점은 dropout으로 학습된 모델을 이용할 경우, 예측 단계에서는 dropout을 사용하지 않아야 한다는 점이다. 왜냐하면, dropout은 순전히 임의로 유닛들을 죽이거나 살리므로, 이에 따라 모델의 출력값이 변화하면 안되기 때문이다.



### Why does drop-out work?

직관적으로 설명하면 다음과 같다.

> 어떤 하나의 특징에만 의존할 수 없으므로, have to spread out weights.

<img src="https://i.loli.net/2020/11/28/Ipzj5lV2uLrboZQ.png" alt="image-20201128151109570" style="zoom: 43%;" />

위 그림과 같이, 4개의 units 중에 어떤 하나의 units이 다음 output을 결정하는데 중요한 역할을 한다고 해보자. dropout은 그런 units들을 종종 확률적으로 죽여서 다른 units도 output을 결정하는데 중요한 역할을 하게끔 만들어 준다.

이러한 효과는 weights를 shrink 하게 하는 효과를 내는데, L2 norm을 이용한 regularization과 비슷한 효과를 발생시킨다.



### training with dropout

dropout을 통해 학습하는 것은 확률적으로 units을 죽이거나 살리므로, cost function이 단조적으로 감소하지 않는다는 것을 의미한다. 결과적으로 dropout을 적용한 모델의 cost function을 iteration마다 plot 하더라도, 해당 모델이 제대로 학습하고 있는지 알기가 모호해진다.

이런 모델이 올바르게 학습하고 있는지 확인하기 위해서는 dropout을 제거하고, cost function이 단조적으로 감소하는지 확인하여 버그가 없는지 체크후, dropout을 이용해 학습하는 것을 추천한다.

 

## Data Augmentation

Overfitting에 대응하기 위해서는 많은 training data를 이용해서 학습하는 것이 좋다.

특히, 이미지 데이터의 경우, 기존 이미지를 변형해서 새로운 이미지 학습 데이터를 만들 수 있다.

![image-20201128173127818](https://i.loli.net/2020/11/28/miTgKXsaI2lJhOx.png)

이러한 이미지 변형 과정을 통해 얻어진 이미지는 완전히 새로운 학습 데이터를 얻는 것보다는 학습 효과가 덜 하겠지만, 저렴한 비용으로 학습 데이터를 늘릴 수 있다는 것이 장점이다.



## Early Stopping

early stopping은 학습을 하다가 중간에 멈추는 방법을 의미한다. 

weight가 처음에는 0과 비슷한 값으로 설정되고, 이후 학습을 거칠 수록 weight가 커질 것이다. overfitting 현상을 완화하기 위해 L2 Norm과 비슷한 metrics을 이용하여 weight가 너무 커지기 전에 중간에 학습을 멈춘다.

* 이는 L2 Regularization과 비슷한 효과를 준다.

Early Stopping의 단점은 비용 함수 최소화 과정과 overfitting 완화 과정을 분리해서 수행할 수 없다는 점이다. 중간에 학습이 멈추게되면 overfitting은 완화시킬 수 있지만, cost function의 최소화 과정을 더 이상 진행할 수 없다. (그래서 Andrew Ng 씨는 그냥 L2 Regularization을 적용한다고 한다. 다만 L2 Norm은 lambda 값을 일일이 찾아봐야 한다는 단점이 있다.)

<img src="https://i.loli.net/2020/11/28/mnZlsbFN8MwECPz.png" alt="image-20201128173444275" style="zoom: 80%;" />