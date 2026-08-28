---
title: "perplexity"
tags: ["metrics", "NLP"]
aliases: ["PPL"]
---

# A) Perplexity ?

높은 확률은 모델이 새로운 예시에 “ 놀라거나 (surprised)” “ 당황하지 (perplexed)” 않았음을 나타내며 언어의 기본 문법 패턴을 학습했음을 나타냅니다. 즉, PPL 은 수치가 높으면 좋은 성능을 의미하는 것이 아니라, ‘ 낮을수록 ’ 언어 모델의 성능이 좋다는 것을 의미한다는 점입니다.

이 perplexity 에 대한 다양한 수학적 정의가 있지만 우리가 사용할 것은 교차 엔트로피 손실 ([[cross-entropy]] loss) 의 지수 (exponential) 로 정의합니다 (`PPL=exp(Cross Entropy)`).

# B) 정의

퍼플렉시티는 문장 확률을 문장의 길이(단어 수)로 정규화(normalize)한 값

PPL 은 문장의 길이로 정규화된 문장 확률의 역수입니다. 문장 $W$ 의 길이가 $N$ 이라고 하였을 때의 PPL 은 다음과 같습니다.

$$
P P L(W)=P\left(w_1, w_2, w_3, \ldots, w_N\right)^{-\frac{1}{N}}=\sqrt[N]{\frac{1}{P\left(w_1, w_2, w_3, \ldots, w_N\right)}}
$$

[[chain rule (probability)|chain rule]] 을 이용하면 다음과 같다.

$$
P P L(W)=\sqrt[N]{\frac{1}{P\left(w_1, w_2, w_3, \ldots, w_N\right)}}=\sqrt[N]{\frac{1}{\prod_{i=1}^N P\left(w_i \mid w_1, w_2, \ldots, w_{i-1}\right)}}
$$

# C) PPL 의 의미: 분기 계수 (Branching factor)

PPL 은 선택할 수 있는 가능한 경우의 수를 의미하는 분기계수 (branching factor) 입니다. 즉, PPL 은 이 언어 모델이 특정 시점에서 평균적으로 몇 개의 선택지를 가지고 고민하고 있는지를 의미합니다.

예를 들어 6 면 주사위를 던져서 나오는 값을 통해 수열을 만들어낸다고 해보겠습니다. 1 부터 6 까지 숫자의 출현 확률은 균등 분포를 따르므로 모두 같다고 가정합니다. 이때 $N$ 번 주사위를 던져 얻어내는 수열에 대한 PPL 은 다음과 같습니다.

$$
\operatorname{PPL}(x)=\left(\frac{1}{6}^N\right)^{-\frac{1}{N}}=6
$$

이렇게 PPL 은 우리가 뻗어나갈 수 있는 가지 (branch) 의 숫자를 의미하기도 합니다.

가령, 언어 모델에 어떤 테스트 데이터을 주고 측정했더니 PPL 이 10 이 나왔다고 해봅시다. 그렇다면 해당 언어 모델은 테스트 데이터에 대해서 다음 단어를 예측하는 모든 시점 (time step) 마다 평균 10 개의 단어를 가지고 어떤 것이 정답인지 고민하고 있다고 볼 수 있습니다.

# D) References

* [언어 모델의 평가 방법 - Natural Language Processing with PyTorch](https://kh-kim.gitbook.io/natural-language-processing-with-pytorch/00-cover-8/03-perpexity)
* [Perplexity of fixed-length models](https://huggingface.co/docs/transformers/perplexity)
