---
layout: default
title:  "RNN: Sequence Model"
category: Deep Learning
order: 4
---

## Why not a standard network?

* 입력과 출력이 examples마다 길이가 다르다.
* text의에 위치한 position들에 따라 feature를 공유하지 않기 때문이다.

## Representing words

![image-20201101184124570](https://i.loli.net/2020/11/01/5VQigYq7CrxPZKd.png)

문장의 $t$번째 $x^{<t>}$ 는 one hot vector 

<img src="https://i.loli.net/2020/11/01/UwXgseau6G3bmZY.png" alt="image-20201101184314049" style="zoom: 50%;" />

## Recurrent Neural Networks (RNN)

![image-20201101184424057](https://i.loli.net/2020/11/01/R9Fm4TVS2jqBhQ6.png)
$$
\begin{array}{l}
a^{<t>}=g\left(W_{a a} a^{<t>}+W_{a x} x^{<t>}+b_{a}\right) \\
\hat{y}^{<t>}=g\left(W_{y a} a^{<t>}+b_{y}\right)
\end{array}
$$
RNN의 단점은 이전에 나온 정보만을 활용해 이후의 출력값을 결정한다는 점이다.

* 이를 보완하기 위해 Bi-directional RNN이 나옴

그리고 $a^{<t>}$는 아래와 같이 좀 더 축소시켜서 표현할 수 있다.
$$
a^{(t)}=g\left(W_a\left[a^{<t-1>}, x^{<t>}\right] +b_{a} \right)
$$
왜 이렇게 축소될까? 아래와 같은 예시를 보자.

![image-20201101185407518](https://i.loli.net/2020/11/01/PZu1IAzk6M9HwED.png)

각 weights $W_{aa}$와 $W_{ax}$를 행렬 내부에서 이어붙이면 더욱 계산하기 편할 것이다. 마찬가지로 vector $a^{<t-1>}$와 $x^{<t>}$  도 이어붙여준다.

![](https://i.loli.net/2020/11/01/Tlb1W4nFEBwrOMZ.png)

## Different types of RNNs

RNN은 입력과 출력 데이터의 차원이 다를 수 있다. 아래 그림은 RNN의 다양한 활용 예시다.

![image-20201101190357285](https://i.loli.net/2020/11/01/OLuiItYZ7GSMfwV.png)



![Example of Many-to-One LSTM - PyTorch Forums](https://i.loli.net/2020/11/01/2MKXvaq5WYgxrZN.jpg)

### Many-to-many Example (Machine Translation)

![image-20201101190716390](https://i.loli.net/2020/11/01/jFbTtaRpVZ3fhHL.png)

### One-to-many Example (Music Generation)

![image-20201101190819413](https://i.loli.net/2020/11/01/eHW6P9ZQ8hg3aMB.png)

* $x=\empty$ (무에서 유를 창조하는 느낌)

## Language modeling with an RNN

RNN을 이용해 언어 모델을 학습시키는 방법

1. Training set으로 주어진 문장들을 tokenize한다.
   * Training set: large corpus of English text
     * Corpus: 매우 많은 문장들
   * ![image-20201101191514692](https://i.loli.net/2020/11/01/69zb28WnjLH1JvE.png)
     * 각각의 단어들을 one-hot vector로 변환시키고, 마지막에 <EOS> 구문을 넣음
     * 위 문장은 <EOS>를 포함하여 총 9개의 token으로 구성됨 (마침표 제외)
   * ![image-20201101191729148](https://i.loli.net/2020/11/01/IKMoZhCOa5NH2Tb.png)
     * token화 하기 어려운 단어(e.g. Mau)들은 <UNK> 라는 unknown word 표시로 tokenize



2. Tokenize된 token들을 RNN에 넣고 학습

![image-20201101192332760](https://i.loli.net/2020/11/01/HUTQxA38RVZbnMJ.png)

학습 문장: Cats average 15 hours of sleep a day. <EOS>

* token $x^{<1>}$를 입력으로 넣을 때, 바로 다음 단어가 Cats 일 확률은 $P(Cats)$

* token $x^{<2>}$를 입력으로 넣을 때, 바로 다음 단어가 $average$일 확률은 $P(average\  | \ Cats)$

* RNN의 출력이 순서대로 $  y^{<1>}, y^{<2>}, y^{<3>}$ 가 나올 확률은 $P(y^{\langle 1\rangle}) P(y^{\langle 2\rangle} \mid y^{\langle 1\rangle}) P(y^{\langle 3\rangle} \mid y^{\langle 1\rangle}, y^{\langle 2\rangle})$

  


위와 같은 확률들은 SoftMax function으로 표현되며, loss function은 아래와 같이 계산된다(cross entropy). 
$$
\begin{array}{l}
\mathcal{L}\left(\hat{y}^{<t>}, y^{<t>}\right)=-\sum_{i} y_{i}^{<t>} \log \hat{y}_{i}^{<t>} \\
\mathcal{L}=\sum_{t} \mathcal{L}^{<t>}\left(\hat{y}^{<t>}, y^{<t>}\right)
\end{array}
$$

### Sampling sequences

학습이 완료된 모델을 이용해서 문장을 생성해보자.

1. 아래 그림과 같이 초기 token $x^{<1>}$은 zero vector로 입력 후, 출력 vector $\hat{y}^{<1>}$를 이용하여 출력 값을 정한다.
   * $\hat{y}^{<1>}$는 SoftMax를 이용하여 확률 벡터로 치환된 후, 그 확률 중에서 임의로 word 또는 character를 선택한다.
2. 그리고 출력 vector는 그 다음 출력 vector $\hat{y}^{<2>}$를 위한 입력 vector로 들어가게 된다. 
3. 이와 같은 작업을 반복하여 출력 vector가 <EOS> 로 선택되거나, 미리 정의된 sampling 횟수 이상을 출력한다면 중지한다.

![image-20201101200043936](https://i.loli.net/2020/11/01/ITb9GgMUcXahy2q.png)

#### Character-level language model

문자-수준 언어 모델은 단어 수준 언어 모델과 달리, 말 그대로 매 출력마다 어느 문자가 나올지에 대한 확률을 이용하는 모델이다.

즉, token을 담은 Vocabulary 가 [a, aaron, …, zulu, <UNK>] 와 같지 않고, [a,b,c,d, .., z, ; , 0, 1 …] 와 같은 단일 문자로 여겨진다.

장점

* 단어를 tokenize 하지 않기 때문에, 알려지지 않은 단어 (e.g. Mau)에 강하다.

단점

* 문장이 길어지면 vanishing gradient 문제에 취약하다. (즉, 문장 내부의 종속성을 찾아내는데 취약하다.)
* 단어 수준 언어 모델과 비교해서 학습과 sampling에 매우 많은 비용이 요구된다.

## Vanishing / Exploding gradients with RNNs

Vanishing gradients : 미분값이 backpropagation을 통해 layer들을 지날 때 마다 exponential하게 감소하는 현상

* 해결책: GRU / LSTM / Truncated BTT

Exploding gradients : 미분값이 backpropagation을 통해 layer들을 지날 때 마다 exponential하게 **증가**하는 현상

* 해결책: gradient clipping
* ![image-20201101234742246](https://i.loli.net/2020/11/01/mvOLBftjAJn9Req.png)

### Truncated Backpropagation through time



### Gated Recurrent Unit (GRU)

우선, RNN 은 어떻게 생겼는지 다시 기억해보자.
$$
a^{<t>}=g\left(W_{a}\left[a^{<t-1>}, x^{<t>}\right]+b_{a}\right)
$$
<img src="https://i.loli.net/2020/11/01/NpAe9i7fqgbnv3B.png" alt="image-20201101210939190" style="zoom:50%;" />

GRU는 위 RNN unit을 하나의 cell로 인식하고($a^{<t>}=c^{<t>}$), update gate와 relevance gate를 추가하여 vanishing gradient 문제를 완화시킨다.

![RNN, T](https://i.loli.net/2020/11/01/9yfMxWUQ4Pj7TcY.png)
$$
\begin{array}{l}
\tilde{c}^{<t>}=\tanh \left( W_{c}\left[ \Gamma_r *c^{<t-1>}, x^{<t>}\right]+b_{c}\right) \\
\Gamma_{u}=\sigma\left(W_{u}\left[c^{<t-1>}, x^{<t>}\right]+b_{u}\right) \\
\Gamma_{r}=\sigma\left(W_{r}\left[c^{<t-1>}, x^{<t>}\right]+b_{r}\right) \\
c^{<t>}=\Gamma_{u} * \tilde{c}^{<t>}+\left(1-\Gamma_{u}\right)*c^{<t-1>}
\end{array}
$$

* 위 그림에서 $z_t$는 update gate $\Gamma_u$를 의미하고, $r_t$는 relevance 또는 reset gate $\Gamma_r$을 의미한다. 
* $\Gamma_u$는 update gate이다. activation function으로 sigmoid 를 사용하며, 이전 cell의 내용에 기반하여 현재 내용을 기억할지 말지 결정한다.
* $\Gamma_r$는 relevance gate이다. 마찬가지로 sigmoid를 사용하며, 이전 cell의 내용이 현재 cell과 얼마나 관련이 있는지를 수치화하여, 현재 cell 값($\tilde{c}^{<t>}$)을 계산할 때 이전 cell의 내용이 얼마나 들어갈지를 결정하게 된다.

### Long Short Term Memory (LSTM)

<img src="https://i.loli.net/2020/11/01/RVcyXODha8qtnWB.png" alt="image-20201101213612591" style="zoom: 80%;" />
$$
\begin{array}{l}
\tilde{c}^{<t>}=\tanh \left(W_{c}\left[a^{<t-1>}, x^{<t>}\right]+b_{c}\right) \\
\Gamma_{u}=\sigma\left(W_{u}\left[a^{<t-1>}, x^{<t>}\right]+b_{u}\right) \\
\Gamma_{f}=\sigma\left(W_{f}\left[a^{<t-1>}, x^{<t>}\right]+b_{f}\right) \\
\Gamma_{o}=\sigma\left(W_{o}\left[a^{<t-1>}, x^{<t>}\right]+b_{o}\right) \\
c^{<t>}=\Gamma_{u} * \tilde{c}^{<t>}+\Gamma_{f} * c^{<t-1>} \\
a^{<t>}=\Gamma_{o} * \tanh (c^{<t>})
\end{array}
$$

* GRU와 달리 cell state를 update하기 위한 두 개의 update gate $\Gamma_u$, $\Gamma_f$를 가진다.
* Output gate $\Gamma_o$가 존재한다. output gate는 출력 또는 다음 cell unit으로 넘길 $a^{<t>}$의 정도를 결정한다.
* <u>peephole connection</u>은 각 gate의 weight에 곱해질 vector에 이전 cell state를 포함하는 것을 말한다(즉, $[a^{<t-1>}, x^{<t>}]$ 를 $[a^{<t-1>}, x^{<t>},c^{<t-1>}]$ 로 변경)
* LSTM은 GRU에 비해 gate가 많아서 성능이 좋지만, 계산량이 많아서 network 사이즈를 늘리기에는 부담이 크다.

![image-20201101213643402](https://i.loli.net/2020/11/01/aWev4oj52UQOGZr.png)

## Bidirectional RNN (BRNN)

![image-20201101220414462](https://i.loli.net/2020/11/01/KVtxvr9NcniFMS1.png)

BRNN은 이전 시간의 정보뿐만 아니라, 특정 시간 이후의 정보들도 활용하여 예측 및 학습을 수행한다.

![image-20201101220534150](https://i.loli.net/2020/11/01/SsCwRzvjUIlKDXF.png)

BRNN은 위의 그림처럼 표현될 수 있는데, Acyclic graph 형태를 띄고있다.

<img src="https://i.loli.net/2020/11/01/TIbuQMOS3KtZLRy.png" alt="image-20201101220946072" style="zoom:67%;" />

예를 들어, $x^{<3>}$에 대하여 예측을 수행하고자 한다면, $t=1, 2, 3$에 있는 cell state $a$를 가져오고, 뒤로는 $t=3, 4$에 있는 cell state $a$를 가져와서 하나의 vector를 구성한다.   

단점

* 학습 및 예측을 위해서 전체 입력을 활용해야 한다.
  * 음성 인식의 경우, 인식을 위해서 화자가 말을 마칠때까지 기다려야 한다.
  * 하지만 자연어 처리의 경우 이미 완벽한 문장이 주어지기 때문에 효율적이다.

* 전체 입력을 활용하여 예측을 수행하므로 RNN 보다 계산량이 높다.

## Deep RNN 

DRNN은 RNN을 여러 층으로 쌓은 RNN을 의미한다.

![image-20201101223235795](https://i.loli.net/2020/11/01/u2yzFhIK48btPmZ.png)

* 여기서 $a^{[l]<t>}$의 $l$은 layer의 번호고, $t$는 시간을 의미한다.

각 cell 들은 해당 cell에 있는 왼쪽과 아래의 cell state를 이용해 계산된다. 예를 들면 위 그림의 보라색 동그라미($a^{[2]\langle 3\rangle}$) 는 다음과 같이 계산된다.
$$
a^{[2]\langle 3\rangle}=g(\omega_{a}^{[2]}[a^{[2](2\rangle}, a^{[1](3\rangle}]+b_{a}^{[2]})
$$


