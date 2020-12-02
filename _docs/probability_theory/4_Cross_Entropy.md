---
layout: default
title:  "Entropy & KL Divergence"
category: Probability Theory
order: 4
---

## Entropy

entropy 란 불확실성 (uncertainty) 에 대한 척도이다. 

* 가방 안에 빨간공만 들어있다고 하자. 이 경우, 불확실성은 없다. 왜냐하면 어떤공을 꺼내도 빨간 공이기 때문이다. 따라서 이 경우 entropy 는 0이다.

Entropy는 다음과 같이 계산된다.

$$
H(q)=-\sum_{c=1}^{C} q\left(y_{c}\right) \log \left(q\left(y_{c}\right)\right)
$$

* $C$는 범주의 갯수이고, $q$는 사건의 확률질량함수 (probability mass function) 이다. 


entropy 는 예측하기 쉬운 일에서보다, 예측하기 힘든일에서 더 높다. 

* 예를 들어, 가방 안에 빨간공과 녹색공이 20:80 으로 들어있는 경우, $$H(q)=-(0.2log(0.2)+0.8log(0.8))=0.5$$ 이다.

* 반대로, 빨간공과 녹색공 비율이 99:1 인 경우, $$-(0.99*log(0.99)+0.01log(0.01)) = 0.02$$ 이다.

  

## Cross-Entropy

우리가 예측 모형을 build하는 이유는 불확실성을 제어하고자 하는 것이다. 예측 모형은 실제 분포인 $q$ 를 모르고, 모델링을 하여 $q$ 분포를 예측하고자 하는 것이다. 

예측 모델링을 통해 구한 분포를 $p$ 라고 해보자. 실제 분포인 $q$를 예측하는 $p$ 분포를 만들었을 때, 이 때 cross-entropy 는 아래와 같이 정의된다. 

$$
H_{p}(q)=-\sum_{c=1}^{C} q\left(y_{c}\right) \log \left(p\left(y_{c}\right)\right)
$$

* 머신러닝을 통한 예측 모형에서 훈련 데이터에서는 실제 분포인 p 를 알 수 있기 때문에 cross-entropy 를 계산할 수 있다. 즉, 훈련 데이터를 사용한 예측 모형에서 cross-entropy 는 실제 값과 예측값의 차이 (dissimilarity) 를 계산하는데 사용할 수 있다는 것이다. 
* Cross-entropy 의 값은 entropy 값보다 항상 크다. 

예를 들어, 가방에 0.8/0.1/0.1 의 비율로, 빨간/녹색/노랑 공이 들어가 있다고 하자, 하지만 직감에는 0.2/0.2/0.6의 비율로 들어가 있을 것 같다. 이 때, entropy 와 cross-entropy 는 아래와 같이 계산된다. 

$$
\begin{array}{l}
H(q)=-[0.8 \log (0.8)+0.1 \log (0.1)+0.1 \log (0.1)]=0.63 \\
H_{p}(q)=-[0.8 \log (0.2)+0.1 \log (0.2)+0.1 \log (0.6)]=1.50
\end{array}
$$



## Kullback-Leibler Divergence

KL Divergence는 서로 다른 두 분포의 차이 (dissimilarity) 를 측정하는데 쓰이는 metric 이다. 두 분포, $q$(실제)와 $p$(예측)가 있을 때, KL Divergence는 다음과 같다.

$$
D_{K L}(q \| p)=-\sum_{c=1}^{C} q\left(y_{c}\right)\left[\log \left(p\left(y_{c}\right)\right)-\log \left(q\left(y_{c}\right)\right)\right]=H_{p}(q)-H(q)
$$

* 보다시피, Cross Entropy 값에 entropy 값을 뺀 것이 KL-Divergence다. 
  * Cross-entropy 의 값은 entropy 값보다 항상 크므로, KL-Divergence 값은 0보다 항상 크다.

예측 분포인 $p$ 를 실제분포 $q$에 가깝게 하는 것이, 예측모형이 하고자하는 것이며, $p$가 $q$에 가까이갈 수록 KL Divergence 값은 $0$에 가까워질 것이다. 

* 그리고 $H(q)$ 는 고정이기 때문에, $H_p(q)$를 최소화 시키는 것이 예측 모형을 최적화 시키는 것이라고 할 수 있다. 따라서 cross-entropy 를 최소화 시키는 것이 KL-Divergence 를 최소화 시키는 것이며, 이것이 불확실성을 제어하고자하는 예측모형의 실질적인 목적이라고 볼 수 있다. 



## Reference

https://3months.tistory.com/436