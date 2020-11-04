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

## Word2Vec: Learning Word Embeddings

word embedding matrix는 어떻게 학습시킬까?

![image-20201104174726713](https://i.loli.net/2020/11/04/tfWTIsQaUZ3nFMD.png)

* Word Embedding model의 weights $E$는 랜덤하게 초기화 된다.
* 그리고 corpus의 한 문장을 가져온다 (I want a glass of orange)
* 가져온 문장에서 context와 target을 고른다.
  * 여기서 context는 입력 데이터, target은 목적하는 출력 데이터다.
  * 위 그림에서 context는 "a glass of orange", target은 "juice"다.
* context의 단어들을 one-hot vector에서 weights를 통해 embedding vector로 바꾼 후, 이 vector들을 하나로 쌓고(stack), Softmax layer를 통해 확률 vector 출력값을 얻는다.
  * 이 확률 vector는 corpus의 unique 단어 개수인 $n$ 차원 vector로, $n$ 개의 단어에서 context에 기반하여 각 단어들이 선택될 확률을 의미한다.
* 최종적으로, Softmax output vector 중 target word에 대한 확률이 높혀지는 방향으로 학습을 진행한다.

### Other context/target pairs

중요한 점은 target은 단어 하나면 되는데, context는 과연 어떻게 설계해야 되는지에 대해 의문을 가질 수 있다.

![image-20201104175651647](https://i.loli.net/2020/11/04/hdZHfz4eSVltqMG.png)

일반적으로 target 이전의 $k$개의 단어를 context로 한다. 그러나 이 접근법은 target 이후의 context를 고려하지 않는다는 문제가 있다.

이를 해결하기 위해 다양한 방법이 존재하는데, 대표적으로 CBOW(Continuous Bag of Words Model)과 skip gram이라는 방법이 존재한다.

### CBOW ([Reference](https://reniew.github.io/21/))

CBOW는 주변단어(Context)를 통해서 주어진 단어(target)가 무엇인지 찾는 것이다. 

* 정확히는 앞뒤로 $\frac{c}{2}$개의 단어를 (총c개) 통해 주어진 단어를 예측한다는 것이 CBOW의 아이디어이다. 
* 위 그림의 "4 words on left & right"의 의미와 일맥상통한다(c = 8).
  * a glass of orange `_____` to go along with 

<img src="https://i.loli.net/2020/11/04/LjHGvANPsocXhR8.png" alt="cbow" style="zoom: 80%;" />

* $\mathbf{W}_{V \times N}$ 은 Embedding matrix, $x$는 $V$ 차원의 one-hot vector, $N$은 embedding vector의 크기다.
* 위에서 언급하였지만, $\mathbf{W}$는 one-hot-encoding된 입력벡터와 은닉층을 이어주는 가중치행렬임과 동시에, Word2Vec의 최종 결과물인 **임베딩 단어벡터의 모음**이다.

가운데 hidden layer는 총 $c = 2m$ 개 embedding vector들 $v$의 평균 vector다.

$$
\hat{v}=\frac{v_{c-m}+v_{c-m+1}+\cdots+v_{c+m}}{2 m} \in \mathbb{R}^{n}
$$

목적 함수 $H$는 이전에 서술한 것과 같이 target word에 대한 확률을 최대로 만드는 것이다. 즉, entropy 함수를 통해 다음과 같이 서술될 수 있다.

$$
H(\hat{y}, y)=-\sum_{j=1}^{|V|} y_{j} \log \left(\hat{y}_{j}\right) =-y_{i} \log \left(\hat{y}_{i}\right)
$$

* $y_i$는 one-hot vector므로, 하나만 제외하고 나머지는 0 이다. 

Optimization을 위해 SGD를 사용한다.

### Skip-Gram([Reference](https://ratsgo.github.io/from%20frequency%20to%20semantics/2017/03/30/word2vec/))

Skip-Gram은 중심 단어를 통해 주변단어를 예측하는 모델이다. 

* CBOW와 비슷한 아이디어지만 반대의 개념이다.  

![img](https://i.loli.net/2020/11/04/NhKTgCBHwQIJDxo.png)

* 다음과 같이 윈도우를 중심으로 context word를 기준으로 학습할 target word를 window size 내에서 골라낸다.
* window size는 한번에 학습할 단어의 개수로, "fox" 라는 단어에는 4개의 단어를 학습하게 된다. 

<img src="https://i.loli.net/2020/11/04/2g6BIH7JKmLc4rV.png" alt="skip" style="zoom:80%;" />

* 마치 한꺼번에 계산되어 학습하는 것 같지만, 사실은 단어 쌍(pair)으로 따로 따로 학습한다. (아까 그림의 training samples 처럼)
  * 그래서 각 단어에 대하여 한번만 학습하는 CBOW와 달리 중심 단어를 기준으로 여러번 학습하기 때문에 Skip-Gram의 성능이 더 좋은 편이다.

Skip-Gram은 다음의 확률 $p(t \mid c)$ 를 최대화 하는 방향으로 진행된다.

$$
p(t \mid c)=\frac{e^{\theta_{t}^{T} e_{c}}}{\sum_{j=1}^{V} e^{\theta_{j}^{T} e_{c}}}
$$

* $c$ 는 중심 단어, 그리고 $t$는 주변 단어다. $\theta_j$는 $j$번째 단어에 대한 Softmax layer의 weight vector를 의미한다. 마지막으로 $V$는 단어의 총 개수다.
* 일반적으로 $V$는 매우 큰 편이라, 매번 확률 vector를 계산할 때 많은 계산량이 요구된다. 

#### Subsampling Frequent words

Word2Vec 학습 과정을 보면, 관사 "the" 같은 단어들은 문장에서 그리 중요하지도 않지만, 빈도수가 많아서 embedding layer에서 자주 업데이트된다. 결과적으로 embedding의 학습 시간만 증가시킬 뿐, embedding vector의 정확도에는 크게 기여하지 않는다. 

이러한 문제를 해결하는 방법이 Subsampling Frequent Words 이다.

Subsampling하는 방법은 학습시에 단어들을 무작위로 제외시키는 것이다. 만약 자주 등장하는 단어라면 더 자주 제외시켜야한다. 단어별로 제외되는 확률은 다음과 같이 정의된다.

$$
P\left(w_{i}\right)=1-\sqrt{\frac{t}{f\left(w_{i}\right)}}
$$

위 식에서 $f\left(w_{i}\right)$는 각 단어 $w_{i}$의 corpus에서 출현하는 횟수이다. 

* 즉, 자주 등장하는 단어일수록 확률값을 줄어들게 된다. 

그리고 $t$는 parameter값으로 $10^{−5}$을 추천한다.

### Complexity Problem 

Skip-Gram과 CBOW는 Output Layer에서 모든 단어에 대한 Softmax 계산을 해야하기 때문에, 이에 따른 연산량이 막대하다. 

이 부분의 계산량을 줄이기 위한 방법이 두가지 제안되었는데, 하나는 계층적 Softmax고, 다른 하나는 Negative Sampling 이다.

Hierarchical Softmax와 Negative Sampling은 확률 값 계산의 계산량을 줄이기 위한 방법으로 목적이 같다. 따라서 택일하여 사용해야한다.

#### Hierarchical Softmax

Hierarchical Softmax는 Softmax를 전체로 계산하기 보다는 Tree구조로 Hierarchical하게 Softmax를 계산한다.

<img src="https://i.loli.net/2020/11/04/gqsUXVeNvrIKxba.png" alt="hi soft" style="zoom:67%;" />

#### Negative Sampling

Negative Sampling은 전체 단어 $V$개 대신에, Window 내에 등장하지 않는 단어를 $k$ 개만 뽑아서 확률을 계산하는 것이다.

![image-20201104193631308](https://i.loli.net/2020/11/04/NzPcOXGTJtmS7bU.png)

* 그림과 같이, skip-gram의 (orange, juice) pair 에 대한 학습 과정에서, $k$ 만큼 orange 의 window 내에 등장하지 않는 단어들을 뽑아서 확률을 구한다.
  * 일반적으로 dataset이 크면 $k$ 는 2~5, 작으면 $k$ 는 5~20 정도로 구한다고 한다.

확률을 계산할 때는, 이전처럼 Softmax function을 계산하는 것이 아니라, binary classification을 위한 layer를 둔다.

그래서 주어진 context word에 대해서, target이 맞는지/아닌지를 가려내는 학습 방법을 취한다.

$$
P(y=1 \mid c, t)=\sigma\left(\theta_{t}^{\top} e_{c}\right)
$$

## Glove word Vectors

음.. 시간이 나면 채워넣겠다. 생략



## Sentiment Classification

학습된 Embedding matrix를 어떻게 활용할 것인가? 주어진 문장을 통해 rating 점수를 예측하는 모델을 만들어보자. 

![image-20201104195123031](https://i.loli.net/2020/11/04/x2WLOce6ZG7rBMJ.png)

* 가장 기본적인 모델은 위와 같다. 단순히 embedding vector들에 대해 평균을 구하고, 그 평균 vector를 입력으로 하여 rating 점수에 대한 분류를 수행하는 것이다.

이 모델의 큰 단점이라고 한다면, 단어 간 순서를 고려하지 않는 것이다. 그림의 왼쪽 문장처럼 "not good good good .." 이 반복된다면, 정말 안좋은 것일텐데, 모델은 좋은 쪽으로 분류해버린다.

![image-20201104195327579](https://i.loli.net/2020/11/04/3X8BvFgoPukIwDf.png)

* 이러한 문제를 방지하기 위해 일반적으로 RNN을 embedding layer와 함께 사용한다.
* embedding layer가 대용량 단어에 대해서 학습되었다면, lacking in 대신 absent of와 같은 생소한 단어도 쉽게 인식하여 분류 정확도에 도움이 될 것이다.

