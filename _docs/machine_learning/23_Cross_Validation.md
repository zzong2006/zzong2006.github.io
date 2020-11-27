---
layout: default
title:  "Cross Validation"
category: Machine Learning
order: 23
---

교차 검증(cross validation)은 모든 데이터를 이용하여 모델을 검증하는 방식을 의미한다.



## 왜 교차 검증을 사용해야 하는가?

고정된 training set 에 대한 overfitting 현상을 막기위해서 사용한다. 즉, 더 일반화된 모델을 제작하기 위해서 사용한다.

## Holdout Cross Validation

가장 일반적인 교차 검증 방법으로서, training set의 일부를 validation set으로 나누어 검증하는 방법이다.

일반적으로 8:2, 7:3, 9:1 등으로 비율을 나눠서 사용한다.  

![img](https://i.loli.net/2020/11/27/ejkCBQMaD8vPZVm.png)

Holdout 교차 검증 방법은 validation data가 고정되있다는 문제가 존재한다. 즉, validation에 의에 검증된 모델은 해당 validation dataset에 overfitting될 가능성이 높다.

이러한 문제를 완화하기 위해서 $k$-fold cross validation 방법을 사용한다.

 

## $k$-fold cross validation

전체 데이터 셋을 $k$ 개의 validation subset으로 나누고(이를 data fold set 이라고 부른다) $k$ 번의 평가를 실시하게 되는데, validation set은 겹치는 구간이 없도록 만들어서 모델의 평가를 각각 진행한다.

<img src="https://i.loli.net/2020/11/27/YkiaOtqpD2hxJ16.png" alt="img" style="zoom:67%;" />

* 그림에서는 Test set으로 나왔는데, validation set이 맞다.

$$
\text { Accuracy }=\text { Average }(\text { Accuracy}_{1}, \cdots, \text { Accuracy }_{k})
$$

이후 $k$ 개의 평가 지표를 aggregate(e.g.평균) 하여서 최종적으로 모델의 성능을 평가하게 된다.



### 장점

* 모든 데이터 셋을 평가에 활용하여 모델이 특정 데이터에 overfit 되는 현상을 막을 수 있고, 모델의 성능을 향상시킬 수 있다.

### 단점

* $k$ 가 높을수록, 데이터를 나누고 학습 및 평가하는 횟수가 많아지므로, 시간이 오래 걸린다.



## Leave-$p$-out cross validation (LPOCV)

<img src="https://i.loli.net/2020/11/27/dHNxQkWzKnYXR1b.png" alt="img" style="zoom:67%;" />

전체 데이터 (서로 다른 데이터 샘플들) 중에서 $p$ 개의 샘플들을 선택하여 모델 검증에 사용하는 방법이다. Validation set을 구성할 수 있는 경우의 수는 $${ }_{n} C_{p}$$ 이다. ($n$ 은 데이터 샘플의 총 개수)

$k$-fold cross validation과 마찬가지로, 각 data fold set에 대하여 나온 검증 결과들을 aggregate 하여 최종적인 검증 결과를 도출하는 것이 일반적이다.



### $k$-fold Cross Validation의 전반적 진행을 보여주는 그림

<img src="https://i.loli.net/2020/11/27/ApwFQRy4boTa2U7.png" alt="" style="zoom:77%;" />