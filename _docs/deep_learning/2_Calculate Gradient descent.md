---
layout: default
title:  "Calculate Gradient Descent"
category: Deep Learning
order: 2
---

## Logistic regression recap

$i$번째 training example $x^i$에 대한 Logistic Regression의 loss function $L(x^{i},y^{i})$ 은 다음과 같다.

$$
L(x^{i},y^{i})= 
y^{(i)} \log h_\theta (x^{i}) +
(1-y^{(i)}) \log \left( 1-h_\theta (x^{i}) \right)
$$

그리고 식 $h_\theta(x^{i})$는 다음과 같다.

$$
h_\theta(x^{i})=a=\sigma(z)=\frac{1}{1+e^{-z}}
$$

* $\sigma$는 activation function인 sigmoid를 의미한다.

* 마지막 $z$는 일반적인 polynomial function이다.

  * $$
    z=w^Tx+b
    $$


위의 식을 간단하게 flow graph로 표현하면 다음과 같다.

![image-20201016181752079](https://i.loli.net/2020/10/16/mbcoFslnJ7IKNUf.png)

* 위 그림은 weights가 2개인 logistic regression이다.

## Logistic regression derivatives

$\frac{d\mathcal{L}(a,y)}{dw_{1}}=dw_1$ 값을 구해보자.

* 편의를 위해서 $\frac{d\mathcal{L}(a,y)}{dw_1}$는 자주 $dw_1$로 표현된다.

1. $$
   \frac{d\mathcal{L}(a,y)}{dw_1}=\frac{d\mathcal{L}(a,y)}{da}\frac{da}{dz}\frac{dz}{dw_1}
   $$

2.   $$
     \frac{d\mathcal{L}(a,y)}{da}=-\frac{y}{a} +\frac{1-y}{1-a}
     $$

     * $\mathcal{L}(a,y)= y \log a + (1-y) \log \left( 1-a \right)$
     * Machine Learning 분야에서 모든 $log$는 자연 로그 $log_e$를 의미한다.

3.   $$
     \frac{da}{dz}=a(1-a)
     $$

     * 이 방정식은 sigmoid function 미분을 나타낸다.

4.   $$
     \frac{d\mathcal{L}(a,y)}{dw_1}=(a-y) * x_1
     $$



