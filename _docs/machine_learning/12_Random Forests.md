---
layout: default
title:  "Random Forests"
category: Machine Learning
order: 12
---

* Random Forests : 단순한 decision tree들을 합쳐 flexibility와 accuracy를 향상시킨 model

## Build a Random Forests

1. Create Bootstrapped Dataset
   * Original Dataset에서 임의로 선택한 sample들을 모아놓은 dataset
   * 중요한 점: dataset의 sample을 중복해서 선택할 수 있음
   * ![image-20201016021449535](https://i.loli.net/2020/10/16/ycXN3SQROAVoLqG.png)

2. Create a decision tree using the bootstrapped dataset, but only use a random subset of variables (or columns) at each step.
   * Tree의 node에 대한 feature를 선택할 때, 임의로 선택한다.
   * 중요한 점: Tree 하나에 대해서가 아닌, Tree의 모든 node에 대하여 variable들을 **임의로** 선택한다. 
   * ![image-20201016021743444](https://i.loli.net/2020/10/16/1Dg4YPVwMHIEW3x.png)
3. 1과 2 step을 반복하여, 여러개의 decision tree들을 만든다. (이상적으로는 약 100개)
   * The variety is what makes random forests more effective than individual decision trees.

## Estimate the accuracy of a Random Forest

* 특정 데이터에 대해서 random forest를 적용하는 방법 : **Bagging**
  * 모든 tree의 결정 중 majority vote를 받은 prediction이 해당 데이터의 최종 prediction이 된다.
  * 즉, Bagging은 여러 모델들의 결과를 aggregating하는 방법
  * <img src="https://i.loli.net/2020/10/16/J3kflyb2UYOudRD.png" alt="image-20201016022239254" style="zoom:50%;" />
* 정확도 측정 방법: Bootstrapped Dataset에 포함되지 않은 데이터를 이용하여 random forest에 대한 정확도를 측정
  * 구체적으로는 random forest에 의해 올바르게 분류된 out-of-bag sample들의 비율을 구하는 것임
    * Out-Of-Bag Dataset: Bootstrapped Dataset에 포함되지 않은 데이터
  * ![image-20201016024552207](https://i.loli.net/2020/10/16/45JarWCj6lhz8eH.png)
* Random Forest를 만드는 과정 중 임의로 선택한 variables 개수에 대해서, 가능한 모든 개수에 연관된 random forests를 만들어보고, 그 중 가장 정확도가 높은 random forests를 선택한다.
  * 예시에서 총 4개 중 2개였다면, 4개 중 3개, 4개 중 1개 등등 으로 random forest build 시도
    * 일반적으로, 전체 variables 개수 $n$의 루트(square) 값($\sqrt{n}$)으로 시작해서, 조금씩 그 값 이하의 variables 개수에 대한 random forests building을 시도한다. 
  * ![image-20201016024909085](https://i.loli.net/2020/10/16/SjT9mhq5GyA17ME.png)

## Missing data and sample clustering

* 

## Reference

* [StatQuest: Random Forests Part 1](StatQuest: Random Forests Part 1 - Building, Using and Evaluating)