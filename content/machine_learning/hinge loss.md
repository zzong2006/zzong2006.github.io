---
title: "hinge loss"
tags: ["machine_learning", "classification"]
aliases: ["hinge"]
---

# A) Hinge Loss ?

분류기를 학습시키기 위해 사용되는 [[loss function]]

Maximum-margin 분류 문제를 풀기 위해 주로 사용하며, 가장 유명한 것은 [[support vector machine]].

## A.1) Hinge Loss 정의

Label 이 $t=\pm1$ 일때, 분류기 score $y$ 에 대한 hinge loss 는 다음과 같이 정의된다.  

$$
\ell(y)=\max(0,1-t\cdot y)
$$

$y$ 는 class label 이 아닌, 분류기의 raw output 임을 주의하자. 예를 들어, linear SVM 의 경우 $y=\mathbf{w}\cdot\mathbf{x}+b$ 가 될 수 있다.

또는 아래와 같이 표현되는 경우도 있다.  

$$
\max \left(0, t \cdot \left(c+y\right)\right)
$$

여기서 $c$ 는 positive parameter (e.g. $1$) 이다.

### A.1.1) Sign 에 따른 Loss 값

$t$ 와 $y$ 가 동일한 sign 을 가지고 $|y|\geq1$ 라면, $\ell(y)=0$ 이다. 서로 다른 sign 을 지닌다면, $\ell(y)$ 값은 $y$ 에 따라 linear 하게 늘어난다.

이는 동일한 sign 일지라도 $|y|<1$ 인 경우에 유사하게 loss 가 증가한다 (correct prediction, but not by enough margin).

# B) Hinge Loss Figure

for $t=1$ classification  
![|500](https://i.imgur.com/saWcRi1.png)

# C) References
