---
tags: ["word2vec", "NLP", "classification"]
aliases: ["SG"]
---

# A) Skip Gram ?

Skip Gram 은 중심 단어를 통해 주변단어를 예측하는 [[Word Embedding]] 모델이다.

target word 를 중심으로 window 를 구성해서 context words 를 정하고, context words 중 하나의 단어를 sampling 하여 target word 와 함께 [[embedding matrix]] 를 학습한다.

[[CBOW]] 와 비슷한 아이디어지만 반대의 개념이다.

# B) 예시

Training sample 은 (targate word, sampled word) 의 형태로 구성된다.

![600](https://i.imgur.com/2OwumN5.png)

마치 window 내 context word 에 대해서 한꺼번에 계산되어 학습하는 것 같지만, 단어 쌍 (pair) 으로 따로 따로 학습한다. 그래서 각 단어에 대하여 한번만 학습하는 CBOW 와 달리 중심 단어를 기준으로 여러번 학습하기 때문에 Skip Gram 의 성능이 더 좋은 편이다.

# C) 구조

![|400](https://i.imgur.com/5edaoPv.png)

최종적으로 학습이 완료되면 hidden layer 의 weight 를 embedding matrix 로 활용한다. 그래서 위 그림에서 $N$-dim 이 embedding vector 의 크기가 된다.

# D) 학습

skip-gram 은 다음의 확률 $p(t\mid c)$ 를 최대화 하는 방향으로 진행된다.

$$
 \displaystyle p(t\mid c)=\frac{e^{\theta_{t}^{T}e_{c}}}{\sum_{j=1}^{V}e^{\theta_{j}^{T}e_{c}}}
$$

$t$ 는 target 단어, 그리고 $c$ 는 context 단어다. $\theta_j$ 는 $j$ 번째 단어에 대한 softmax layer 의 weight vector 를 의미한다. 그리고 $V$ 는 단어의 총 개수다. 일반적으로 $V$ 는 매우 큰 편이라, 매번 확률 vector 를 계산할 때 많은 계산량이 요구된다.

softmax 의 계산량 이슈를 해소하기 위해 [[hierarchical softmax]] 그리고 [[negative sampling]] 가 제시되었다 (주로 negative sampling 이 많이 이용된다).

# E) References

* https://ratsgo.github.io/from%20frequency%20to%20semantics/2017/03/30/word2vec/
