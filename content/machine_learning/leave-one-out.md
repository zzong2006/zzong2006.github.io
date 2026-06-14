---
title: "leave-one-out"
tags: ["machine_learning offline_evaluation"]
aliases: ["LOOCV"]
---

# A) Leave-one-out ?

[[cross-validation]] 방법 중 하나로, NN(샘플 수 만큼) 번의 model 을 만들고, 각 모델을 만들 때에 하나의 샘플만 제외하면서 그 제외한 샘플로 test set performance 를 계산하여 N 개의 performance 에 대해서 평균을 내는 방법입니다.

![](https://i.imgur.com/reNqqXc.png)

## A.1) 장점

LOOCV 의 장점으로는 결국 모든 샘플에 대해서 다 한번씩은 test 하기 때문에 어떠한 randomness 도 존재하지 않게 되는 것과, validation set approach 와는 다르게 굉장히 stable 한 결과를 얻을 수 있다는 점입니다. 또한 하나의 샘플만을 test set 으로 사용하기 때문에 그만큼 많은 수의 training data 를 활용하여 model 을 만들어 볼 수 있게 됩니다.

## A.2) 단점

반면 단점은 그만큼 많은 수의 model 을 만들고 test 해야하기 때문에 computing time 이 굉장히 오래 걸릴 수 있습니다. 또한 나중에 언급할 k-fold CV 에 비해서 model 의 다양성을 포함하기 어렵다는 단점이 있습니다.

# B) Related

# C) References
