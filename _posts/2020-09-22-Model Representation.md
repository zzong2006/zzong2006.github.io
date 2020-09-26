---
layout: post
title:  "Machine Learning: Model Representation"
date:   2020-09-22 22:55:30 +0900
categories: machine learning
---

### (2) 모델과 비용 함수

* 모델 표현하기
  * $(x^{(i)},y^{(i)})$ 형식으로 $i$ 번째 training 데이터를 표현
  * $X$ 는 입력 데이터 공간(space), $Y$ 는 출력 데이터 공간
  * ![img](https://i.loli.net/2020/09/21/o3gMeikuFGzJ1SP.png) 
  * 위 그림의 $h$는 가설(hypothesis)을 뜻함 $h: X \rightarrow Y$

* Linear Regression
  * Linear regression 을 $h$로 표현 : $h_{\theta}(x)=\theta_0+\theta_{1}x$

    * $\theta_i$는 모델의 parameters

  * Cost Function $J(\theta_0,\theta_1)$ : 가설 $h$ 의 정확도를 측정하기 위해 사용하는 함수

    * $$
      \underset{\theta_0, \theta_1}{minimize} \  J(\theta_0,\theta_1)=\frac{1}{2m} \sum^{m}_{i=1}(h_\theta(x^{(i)})-y^{(i)})^2
      $$

      $m$은 training 데이터의 개수 (# of training examples)

      수식을 $2$로 나누는 것은 gradient descent 계산 시, 미분 term을 구하는데 편리해지기 때문

      > The mean is halved $\left(\frac{1}{2}\right)$ as a convenience for the computation of the gradient descent, as the derivative term of the square function will cancel out the $\left(\frac{1}{2}\right)$ term. 

  * 비용 함수 $J$를 최소화 한다는 것의 직관적 이해

    * $J(\theta_0, \theta_1)$를 간소화해서 $\theta_0$을 $0$ 이라 하자. 즉, $J(\theta_1)$ 을 최소화하는 문제로 바꿔보자.

    * 아래의 왼쪽 그림은 예측 모델 $h_\theta(x)=\theta_1x$ 그리고 왼쪽은 비용 함수 $J({\theta}_1)$ 이다.
    
    $$J({\theta}_1)=\frac{1}{2m} \sum^{m}_{i=1}(h_{\theta}(x^{(i)})-y^{(i)})^2=\frac{1}{2m} \sum^{m}_{i=1}({\theta}_1x^{(i)}-y^{(i)})^2$$ 
    

    * 학습 데이터는 $\theta_1=1$일 때의 모델 $h$와 정확하게 직선상에 일치하고, 오른쪽 그림에 $(\theta_1,J(\theta_1))$은 $(1,0)$ 으로 표기된다.   

    * ![img](https://i.loli.net/2020/09/21/hYT3EF8lOCDLaZA.png) 

      

    * 이후 계속 $J(\theta_1)$ 를 그려보면 다음과 같다.
      ![img](https://i.loli.net/2020/09/21/Kcgs7mowzE6ALnf.png)

      

    * 비용 함수를 최소화 하는것이 목적이므로, $\theta_1=1$을 선택하고, 이를 global minimum 이라 부른다.
      ![img](https://i.loli.net/2020/09/21/eCiF4aHw7pPQnbr.png)

    

    * 이제 $\theta_0=0$ 이었던, $\theta_0$를 다시 사용해보자. 더 이상 $J(\theta_0, \theta_1)$은 일반적인 선 그래프로 표현하기 힘들다. 두 개의 features($\theta_0, \theta_1$)를 사용하는 경우, 등고선(contour plot)을 사용한다.
      ![img](https://i.loli.net/2020/09/21/yLlMfOEQit6xceA.png)

    

    * 모델 $h_\theta(x)$가 학습 데이터에 더욱 적합해질수록, $J(\theta_0, \theta_1)$ 값은 등고선의 중심에 다가간다.
      ![img](https://i.loli.net/2020/09/21/9zHTwKDbg1WnxhJ.png)