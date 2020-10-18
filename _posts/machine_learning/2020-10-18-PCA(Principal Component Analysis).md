---
layout: post
date:   2020-10-18 13:00:00
title: "Machine Learning: PCA(Principal Component Analysis)"
categories: machinelearning
series: 17
---

* In general, a **decision tree** asks a question and then classifies the person based on the answer.
  * the classification can be **categories** or **numeric**
    * Categories  
      Q: "A person has a resting heart rate > 100bpm?"  
      A: "True: See doctor", "False: No worries."    
    * Numeric   
      Q: "A mouse weighs between 15 and 20 grams?"   
      A: "True: It is between 150 and 180mm long", "False: It is less than 150mm long"

## Build decision tree (for categorical features)

* Decision Tree를 만들때, 가장 먼저 해야할 일은 root node를 정하는 것

  * labeled data의 feature들을 이용하여, 모든 feature들의 impurity를 측정한다.

  * 모든 계산을 완료하면, 가장 낮은 impurity를 가진 feature를 root에 올린다.

    * feature의 impurity: 그 feature만을 사용하여 얼마나 그 data를 잘 classify할 수 있는가를 나타내는 지표

  * 대표적인 impurity 측정은 Gini impurity (지니 계수)

    1. Tree의 node에 대한 the Gini impurity

        * $$
          G= \sum^{C}_{i=1}p(i)*(1-p(i))=1-\sum^{C}_{i=1}p(i)^2
          $$

        * $C$는 class의 개수 $p(i)$는 데이터를 선택했을 때, 특정 노드에서 class $i$로 분류될 확률

    2. Feature에 대한 The Gini Impurity
       
     * Weighted average of Gini impurities for the leaf nodes
  
* 지니 계수 측정 예시
  
  * ![image-20201016003714265](https://i.loli.net/2020/10/15/eKtQrWZ36PlTOFV.png)
  
    * left node의 지니 계수
      $$
      \begin{align*}
      G&=1-(\text{the probability of "yes"})^2-(\text{the probability of "no"})^2 \\
      &=1-(\frac{105}{105+39})^2-(\frac{39}{105+39})^2 \\
      &=0.395
      \end{align*}
    $$
  * right node의 지니 계수
    $$
      \begin{align*}G&=1-(\text{the probability of "yes"})^2-(\text{the probability of "no"})^2 \\&=1-(\frac{34}{34+125})^2-(\frac{125}{34+125})^2 \\&=0.336\end{align*}
    $$
    * Gini impurity for Chest Pain
  $$
      \begin{align*}G&=(\frac{144}{144+159})*0.395-(\frac{159}{144+159})*0.336 \\&=0.364\end{align*}
      $$
    
      * 144와 159는 left와 right의 total number of patients


* Decision Tree에서 가장 낮은 impurity를 지닌 feature에 대하여 root node를 선정했다면, 이후 남은 node들도 같은 방식으로 node를 선정하면서 진행한다.
  * 위의 예시에서 left node는 총 144명인데, 이들 중 나머지 feature들에 해당하는 결과를 활용해 impurity를 측정
  * ![image-20201016005309795](https://i.loli.net/2020/10/15/bdT9JxZCSIosQYn.png)
* 하지만,  feature를 부여하려는 node의 impurity가 feature에 대한 impurity 보다 낮다면, 굳이 나누지 않는다. 즉, tree의 leaf node로 만든다.
  * ![image-20201016005525660](https://i.loli.net/2020/10/15/rKDvPQc4ZB9f7wW.png)

### What if we use other types of features?

* Numerical and continuous variables

  1. Sort the value

  2. Calculate the average value for all adjacent patients
  3. Calculate the impurity values for each average value

  * ![image-20201016010600460](https://i.loli.net/2020/10/16/DlqwQNC5xZkcuWd.png)

* Ranked data (1, 2, 3 ...)

  * 가능한 모든 ranks에 대한 impurity scores를 계산
  * ![image-20201016010823398](https://i.loli.net/2020/10/16/gyhjYSlN6iv3dob.png)

* Multiple choice data

  * 가능한 모든 조합에 대한 impurity scores를 계산
  * ![image-20201016010806775](https://i.loli.net/2020/10/16/PQ2mpvDKwBaFstR.png)

## 문제점(Drawbacks)

* **Overfit**: 학습 데이터에 대해서는 잘 동작하지만, 새로운 데이터(new samples)에 대해서는 올바르게 classify 하지 못하는 경우를 보인다
  * They are not flexible.
* 이러한 문제를 해결하기 위해 Random Forests가 등장했다.

### Feature Selection & Missing Data

* Feature Selection
  * Node의 impurity가 낮고, feature의 impurity가 높은 경우에는 일반적으로 해당 feature는 Decision tree에서 사용되지 않는다.
  * 그러나 Overfit을 예방하기 위해, impurity 간 비교가 아닌, impurity가 특정 threshold 이상 또는 이하일 경우 그 feature를 사용하는 것으로 정할수 있다.
* Missing Data
  * 만약 데이터 중, 특정 Feature에 대해 알수없는 데이터가 있다면?
  * 해당 Feature의 값들 중 majority한 값을 대입 
    * Numerical data의 경우에는 median or mean 사용
  * 또는, 높은 correlation을 가진 다른 feature와 비교하여 값을 추정
  * Categorical data
    * ![image-20201016013744900](https://i.loli.net/2020/10/16/CQlq3sEJUx4L82p.png)
  * Numerical data
    * ![image-20201016013851102](https://i.loli.net/2020/10/16/AORskFfzTPCHDvi.png)

## Reference

- [StatQuest: Decision Tree (Part 1)](https://www.youtube.com/watch?v=7VeUPuFGJHk&ab_channel=StatQuestwithJoshStarmer)
- [StatQuest: Decision Tree (Part 2)](https://www.youtube.com/watch?v=wpNl-JwwplA&ab_channel=StatQuestwithJoshStarmer)