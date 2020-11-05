---
layout: default
title:  "CNN: Convolutional Neural Networks"
category: Deep Learning
order: 9
---

## Why Convolutional Network?

이미지를 일반적인 fully neural network로 학습하게 된다면 많은 parameters를 가져야 한다.

![image-20201105152615777](https://i.loli.net/2020/11/05/QJ3l6mdGLp7VDhM.png)

* 위 사진은 $1000\times 1000 \times 3$의 크기를 가지는 고양이 사진이다. 이 사진을 입력 벡터로 사용하기 위해서 필요한 weights의 개수는 3 million 이다. 
* 즉, 매우 많은 parameters로 인해 연산량이 크게 증가하고, overfitting의 위험도 커진다.



## Edge Detection

기존의 이미지들에 대한 lower feature들을 추출해내기 위하여 다양한 filter들을 사용한다.

대표적으로는 vertical edge와 horizontal edge가 존재한다.

![image-20201105152747486](https://i.loli.net/2020/11/05/iyIdW1xaU4o3XtB.png)

### Vertical Edge detection

![image-20201105152838201](https://i.loli.net/2020/11/05/s4DmUBueW5jinQg.png)

* 위 그림은 vertical edge detection을 위해 이미지에 filter를 적용하는 과정을 나타낸 것이다.
* 필터는 단순히 convolution이라는 연산에 의해 적용되는데, 각 filter matrix의 원소에 mapping되는 이미지의 값을 곱하고, 이를 모두 합치면 하나의 필터링된 값을 가지게 된다.

![image-20201105153036494](https://i.loli.net/2020/11/05/jUnBXNhRQ7vz8u5.png)

* 좀 더 다양한 detection 을 위한 filter들이 있다. 
  * 필터링된 값은 높은 값을 가질수록 밝고, 낮은 값을 가질 수록 어둡다. 

기존에는 원하는 필터링 된 값을 얻기 위해, 필터 matrix내 값을 모두 수작업해야 했다. 하지만 이미지에 따라 필터가 올바르게 적용되기도 하고 그렇지 않기도 했다.



## Padding

padding은 convolution 연산을 적용할 때 사용하는 기법이다.

![004 CNN Padding](https://i.loli.net/2020/11/05/nEprzDMIX5NmAbu.png)

Padding을 사용하는 두 가지 이유는 아래와 같다.

* Convolution 연산 후 output 이미지가 크게 축소되는 것을 방지한다.
* 가장자리의 픽셀이 convolution 연산에 적게 사용되어 필터링된 정보는 이에 대한 정보가 그리 많지않다.
  * ![image-20201105153432824](https://i.loli.net/2020/11/05/I6sWxKpAZbNrG27.png)
  * 빨간색 네모는 필터가 여러번 적용되는 반면, 초록색 네모는 두 번밖에 적용되지 않는다.

Convolution Filter 크기가 $f$고, padding size가 $p$면, 변환된 $n \times n$ 이미지 크기 $n' \times n'$는 다음과 같다.

$$
(n +2p-f)+1=n'
$$

### Valid and Same convolutions

Valid

* padding을 적용하지 않는 기법을 의미한다.

* 

* $$
  n \times n \quad * \quad f \times f \rightarrow (x-f+1) \times (x-f+1)
  $$

Same

* 입력 사이즈와 같은 사이즈가 나오도록 padding을 적용하는 방법이다.

* $$
  n + 2p -f + 1 =n \rightarrow p=\frac{f-1}{2}
  $$



## Strided convolution

stride $s$는 filter를 이미지에 적용할 때 사용할 step을 의미한다. 지금까지 보아왔던 stride는 전부 1을 가정하고 설명한 것이다.

<img src="https://i.loli.net/2020/11/05/X1bSZinxPg5DumO.png" alt="Convolutional Neural Networks(CNN) #1 Kernel, Stride, Padding -  BrilliantCode.net" style="zoom: 50%;" />

### Output size 계산 방법

$n \times n$ input image,$f \times f$ filter, padding $p$, stride $s$ 가 주어질 때, output size는 다음과 같다.

$$
\left\lfloor{\frac{n+2 p-f}{s}+1}\right\rfloor\times \left\lfloor{\frac{n+2 p-f}{s}+1}\right\rfloor 
$$

* floor sign은 $s$에 의해 정확히 나누어 떨어지지 않을 때, 적용하는 것이다.
* 직관적으로 생각하면, stride를 옮기면서 filter에 전부 들어오지 않는 이미지 segment는 무시하겠다는 의미가 된다.



## Convolutions over volumes

이미지는 흑백이 아닌 이상 RGB 값인 3개의 channel로 구성된다. 지금까지는 2차원 이미지에 대해서만 다뤘지만, 실제로는 3차원 이미지에 필터를 적용해야 한다.

![image-20201105154818070](https://i.loli.net/2020/11/05/XjgSAJPqxramsFy.png)

* 각 채널은 따로따로 계산되는 것이 아니라, image 채널이 $n$개라면, 적용하는 convolution 필터도 $n$개의 채널을 가져야 한다.
* 그리고 계산 과정도 2차원이랑 비슷하다. 모두 element-wise 곱을 한 뒤에 합쳐주면 된다.

### Multiple filters

필터가 하나가 아닌 여러개가 있을 수 있다. 주의할 점은 필터의 채널과 개수를 명확히 해야한다는 것이다. 채널은 단순히 필터의 3차원 성분이다. 이 값은 이미지를 따라간다. 

![image-20201105155118822](https://i.loli.net/2020/11/05/xu5GY9ZTP4FQH6L.png)

* 필터가 $n'$개라면, output 이미지의 3차원 개수도 $n'$개이다. 

## One Layer of a Convolutional Network

CNN의 단일 레이어는 다음과 같이 동작한다.

* Input image * filter $\rightarrow$ activation (output + bias)  
  * activation까지 적용된 결과가 filter의 개수만큼 쌓이게 된다.

![image-20201105155906520](https://i.loli.net/2020/11/05/sJnjRZrI1ga98X6.png)

### Summary of notation

$l$ 번째 convolution layer가 다음과 같은 특성을 가진다고 하자.
$$
\begin{array}{l}
f^{[l]}=\text { filter size } \\
p^{[l]}=\text { padding } \\
s^{[l]}=\text { stride } \\
n_{c}^{[l]}=\text { number of filters }
\end{array}
$$
Input Size: $n_{H}^{[l-1]} \times n_{W}^{[l-1]} \times n_{c}^{[l-1]}$ 가 주어지면 Output Size는 다음과 같다.

Output Size:  $n_{H}^{[l]} \times n_{W}^{[l]} \times n_{c}^{[l]}$

* $$
  n_{H}^{[l]} = \left\lfloor \frac{n_{H}^{[l-1]} + 2p^{[l]} - f^{[l]}}{s^{[l]}} + 1\right\rfloor
  $$

  * $ n_{W}^{[l]}$ 도 $n_{W}^{[l-1]}$ 에 대하여 동일하게 적용할 수 있다.

각 filter : $f^{[l]} \times f^{[l]} \times n_{c}^{[l-1]}$ ($n_{c}^{[0]}$ 일 경우, 이미지의 채널 수 와 같다.)

Activation : $a^{[l]} \rightarrow n_{H}^{[l]} \times n_{W}^{[l]} \times n_{c}^{[l]} $

**Weights (parameter 개수)**: $f^{[l]} \times f^{[l]} \times n_{c}^{[l-1]} \times n_{c}^{[l]} $ 

bias : $n_{c}^{[l]} $ (일반적으로, $(1,1,1,n_c^{[l]})$) 로 구현하는게 편하다)



## Simple Convolutional Network Example

CNN은 총 3개의 layer로 구성된다.

1. Convolution (CONV)
2. Pooling (POOL)
3. Fully Connected (FC)

다음은 CNN의 단순한 예제다. 위의 Notation을 이용하여 수식이 맞는지 적용해보자.

![image-20201105160958604](https://i.loli.net/2020/11/05/DmacfGq8RUpsObT.png)

## Pooling layer

Pooling layer는 단순히 주어진 filter에 포함되는 값들로 연산을 수행한다. 즉, weights 같은 parameters는 존재하지 않는다.

* 다만, filter size 와 stride 가 hyper-parameters로 필요하다.

대표적으로 Max Pooling, Average Pooling이 있다.

Pooling을 사용하는 이유는 convolution에서 얻어진 feature들 중 더욱 중요한 feature들만 남겨서 overfitting을 방지하기 위함이라고 알고있다.

* 대부분 논문에서도 실험적으로 이를 증명한다고 한다.

Pooling layer의 output size 계산도 Convolution layer의 계산과 똑같다. stride가 좀 더 늘어난 것이라 생각하면 편하다.

### Max Pooling

<img src="https://i.loli.net/2020/11/05/okps9Efjym3gwXZ.png" alt="Pooling " style="zoom:80%;" />

* 필터 내 가장 큰 값을 찾으면 된다.

###   Average pooling

![image-20201105161523882](https://i.loli.net/2020/11/05/EdvYlybCUqIxGOP.png)

* 평균을 구하면 된다.

## AlexNet 예시

![image-20201105161802810](https://i.loli.net/2020/11/05/ml79YeEKbjcSUDq.png)

## Convolutions의 특징 2가지

Parameter sharing 

* 이미지의 특정 부분(part)에서 사용되는 필터가 그 이미지의 다른 부분에서도 사용됨

Sparsity of Connections

* 각 layer의 각 출력은 오직 전체 입력 중 일부에만 독립적으로 의존함.

![image-20201105162230454](https://i.loli.net/2020/11/05/urIPzivVGHynaMR.png)

* output 값 중 $0$과 $30$을 구할 때, 같은 filter를 사용함 (parameter sharing)
* $0$을 구할 때는 image 왼쪽 상단의  $3 \times 3$ 부분만 이용하여 독립적으로 계산됨. 나머지는 관여하지 않음 (Sparsity of Connections)

