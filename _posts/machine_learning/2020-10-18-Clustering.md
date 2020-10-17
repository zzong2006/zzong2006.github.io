---
layout: post
date:   2020-10-17 
title: "Machine Learning: Clustering"
categories: machinelearning
series: 15
---



### K-means optimization object

* k-means clustering도 cost function(distortion)이 존재함

  * $$
    J(c^{(1)},\cdots,c^{(m)},\mu_1,\cdots,\mu_k)=\frac{1}{m}\sum^m_{i=1}||x^{(i)}-\mu_{c}(i)||^2
    $$

  * 이 값은 K가 증가할수록, 항상 감소함

    * 만약, K가 증가했는데 이전보다 cost가 증가할 경우, 그것은 local minima에 빠진것
    * center를 re-initialize한다. 

  * 해당 function을 minimizing 하는 것이 K-means clustering의 목적 

* 실루엣(Silhouette)

  * 클러스터의 데이터가 얼마나 잘 분류되었는지 수치적으로 확인할 수 있는 값

    * -1 부터 1의 값을 가지며, 높을수록 데이터(object)가 클러스터에 잘 매치된다는 의미를 가짐
    * Distortion과의 비교
      * 실루엣 측정값은 데이터 자체에 대한 클러스터 할당의 적합성을 판단하는 것
      * distortion은 전반적인 데이터와 클러스터 중심 간 거리를 계산
      * 하지만 둘 다 heuristic 하다는 사실은 같음

  * $$
    {\displaystyle s(i)={\frac {b(i)-a(i)}{\max\{a(i),b(i)\}}}}
    $$

    * $a(i)$는 같은 클러스터 내부에 있는 모든 데이터들 사이의 **평균** 거리, 특정 데이터 $i$가 얼마나 클러스터에 잘 할당되었는지 확인하는 값임
    * $b(i)$는 $i$와 다른 클러스터 중, **가장 가까운** 클러스터에 속한 다른 데이터들 간의 **평균** 거리 

###  Random Initialization

* $K<m$인 경우 전체 $m$개의 데이터 중 distinct한 random data를 center로 선택
* Center를 어떻게 초기화하냐에 따라서 cluster의 결과가 달라질 수 있음
  * Local optima
  * 여러번 random initializing을 수행해서 최적의 solution을 찾음

### Choosing the Number of Clusters

* Elbow Method
  * ![image-20201017211129012](https://i.loli.net/2020/10/17/csmb7X1knSRgMYe.png)

