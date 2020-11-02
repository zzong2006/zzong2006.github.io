---
layout: default
title:  "RNN: Word Representation"
category: Deep Learning
order: 4.1
---

일반적인 word representation은 one-hot vector를 이용해서 이루어진다.

<img src="https://i.loli.net/2020/11/02/JaAQSVvm3LEWFhP.png" alt="image-20201102235604445" style="zoom:67%;" />

하지만 **one-hot vector의 단점**은 각 단어간의 관계를 일반화하기 힘들다는 점이다.

이러한 문제를 해결하기 위해 word embedding이라는 방법을 사용한다.

![image-20201102235642830](https://i.loli.net/2020/11/02/1Ob4gnQziUPW2hR.png)

* 각 단어에 대한 feature를 만들고 적절한 값을 부여한다.

Word embedding을 쉽게 시각화 하기 위해서 사용하는 대표적인 알고리즘은 t-SNE 다.

<img src="https://i.loli.net/2020/11/02/Uxz7vGih6R8oTX9.png" alt="image-20201102235741258" style="zoom:50%;" />

embedding 방법은 사실 encoding과 상당히 유사하다. 

![image-20201103001401892](https://i.loli.net/2020/11/02/DlS5XGpwQdP72Lf.png)

* 대표적으로 Convolutional layer를 이용하여 그림에 대한 feature vector를 encoding 하는 방법이 embedding과 유사하다.
* Encoding과 embedding의 차이점은 차원 축소를 적용하는 목적이 다르다는 것이며, embedding은 고정(fixed)된 단어에 대해 representation을 찾는 반면, 사진은 unlimited한 그림 파일들에 대해 representation을 찾는다는 것이다. 



## Transfer learning and word embeddings

모델이 학습하다가 모르는 단어가 나와도, 만약 해당 단어가 특정 타입의 단어와 비슷하다고 계산되면, 모르는 단어도 어떤 타입의 vector로 치환해야할지 쉽게 알 수 있을 것이다.

![image-20201103000853852](https://i.loli.net/2020/11/02/raWOyJFN3swqfPi.png)

* durian cultivator라는 단어를 몰라도 durian이 orange와 비슷하다면, cultivator 역시 farmer와 비슷하다고 생각할 것이다.

이러한 점을 활용해서 word embedding은 transfer learning에 다음과 같은 단계를 통해서 활용될 수 있다.

1.  대용량 text corpus(약 1-100백만 단어들)에서 학습된 word embedding을 찾는다 (pre-trained or just train yourself)
2. 이제 학습된 embedding을 transfer하여 좀 더 작은 training set에 맞춘다.
3. 원한다면 그 작은 데이터에 대해서 추가적으로 학습하여 finetune을 진행할 수 있다.



## Properties of word embeddings

Word Embedding은 어떻게 학습되는지 직관적으로 알아보자.

각 word는 embedding vector로 표현되는데, 이 vector들 간의 차이를 활용한다.

![image-20201103011312679](https://i.loli.net/2020/11/03/3JVDFhO6CXjEKeQ.png)

* 단어 Man과 Woman은 gender feature에서 비슷하므로, 두 vector를 서로 뺀 후의 값을 살펴보면, Gender 차원만 차이가 발생함을 확인할 수 있다.

* King 과 Queen도 Royal에서 비슷하다.

* 만약 Queen에 대한 embedding vector를 모른다면,  다음과 같은 수식을 활용하여 해당 vector를 찾을 수 있다.

  * $$
    e_{\operatorname{man}}-e_{\text {woman}} \approx e_{\text {king}}-e_{\text {?}}
    $$
  



즉, word embedding은 embedding vector 간 차이를 활용하여 다른 단어에 대한 vector embedding을 학습한다.

$$
\underset{w}{\mathbb{argmax}}\left(\operatorname{sim}\left(e_{w}, e_{\text {king}}-e_{\text {man}}+e_{\text {woman}}\right)\right)
$$

* $e_w$는 찾으려하는 word의 embedding vector다.
* 유사도를 최대로 하는 vector $e_w$를 찾는 것이다.

이러한 방법으로 아래 그림과 같은 다양한 관계를 찾을 수 있다.

![image-20201103012010670](https://i.loli.net/2020/11/03/vlBXAcR8t1Vpanj.png)

### Cosine similarity

embedding vector 간 유사도를 계산할 때, 일반적으로 Cosine similarity를 사용한다.

$$
\operatorname{sim} (u, v)=\frac{u^{\top} v}{\|u\|_{2}\|v\|_{2}}
$$

* 두 벡터가 서로 유사할수록, 유사도는 커진다. 
* Mean Square Error와의 차이점은 두 벡터 크기를 이용해 유사도의 정도를 normalize 할 수 있다는 점이다.

![image-20201103012249791](https://i.loli.net/2020/11/03/j4houtCXf9rTgLc.png)

### Embedding Matrix

학습이 완료된다면 embedding matrix $E$ 라는 것을 얻게된다. $E$는 one-hot vector에 어떻게 적용되는지 살펴보자.

![image-20201103012508235](https://i.loli.net/2020/11/03/fAqnmGUOVkIcBMo.png)

$j$ 번째 row 값이 1인 어떤 단어의 one-hot vector $o_j$는 $E$와 곱해져서 $E \cdot o_j =e_j$를 가진다. 

* $e_j$는 그림에서 보다시피, one-hot vector의 성질로 인해 $E$의 $j$번째 column vector와 동일하다. 즉, 실제 구현에서는 `E[:, j]` 와 같은 작업으로도 matrix multiplication을 대체할 수 있다.

