---
layout: default
title:  "Gradient Descent"
category: Machine Learning
order: 3
---

Gradient Descent란? 모델 $h$에 대한 적합한 ($\theta_i$ 와 같은) parameter를 찾기 위한 방법

아래는 $\theta_0$ 와 $\theta_1$에 대한 등고선 그래프이다.   

![img](https://i.loli.net/2020/10/28/MuamBTrb8lK5ypz.png)

* 이 그래프의 사용 목적은 비용 함수 $J(\theta_0,\theta_1)$가 등고면 바닥에 닿을 수 있는 parameter를 찾기 위함이다.  
  * 즉, 두 parameter의 적절한 값을 찾기위해 비용 함수를 미분하여 어느 방향으로 parameter  값을 조정해야 하는지 확인해야한다.   

* 위의 십자가 모양의 표시는 parameters $(\theta_0,\theta_1)$가 변화한 순간들을 포착한 것이다.   
  * 변화한 순간의 간격이 일정한듯 보이는데, 이러한 간격(size of each step)을 결정하는 것은 $\alpha$라는 학습률(learning rate)이 결정한다.  
  * 또한 $(\theta_0,\theta_1)$의 값이 어디서 시작하냐에 따라서(그림에서의 두 빨간 동그라미들), parameter가 수렴하는 값이 달라진다.  

Gradient Descent 알고리즘은 다음과 같은 수식으로 표현된다.    
$$
\theta_j:=\theta_j-\alpha \frac{\partial}{\partial\theta_j}J(\theta_0, \theta_1) \quad \text{where} \ \ j=0, 1
$$

* 중요한 점은 각 parameter에 대하여 업데이트 할 값($\frac{\partial}{\partial\theta_j}$)을 먼저 모두 구하고, parameter의 값들을 update 해야 한다는 점이다.    
* 아래 그림은 올바른 또는 올바르지 않은 update 방식을 나타낸다. 
* ![img](https://i.loli.net/2020/09/22/ohWbuw3XFTpN7KY.png)
  * $:=$는 assign의 의미가 있으며, $=$는 assert의 의미다 있다.  
  * 즉, $a := b$ 는 $b$ 의 값을 $a$에 부여하고, $a=b$는 $a$와 $b$의 값이 일치하는지 확인하는 것이다.

### Gradient Descent의 직관적 이해

* 비용 함수 $J(\theta_1)$에서, parameter $\theta_1$을 찾기 위해, 다음과 같은 gradient descent를 반복한다고 가정하자.
  $$
  \theta_1:=\theta_1-\alpha \frac{\partial}{\partial\theta_1}J(\theta_1)
  $$

* 위의 식은 $\theta_1$의 값은 점점 $\frac{\partial}{\partial\theta_1}$이 $0$에 수렴하는 방향으로 update될 것이다. 그 이유는 아래 그림을 참조하자.  
  ![img](https://i.loli.net/2020/09/22/cDfrRklsVeGqoMz.png)

  * 여기서 의문이 생길 수 있다.   
    Q. $\alpha$ 값이 크다면 step size가 커져서 $\theta_1$가 수렴하지 못할텐데, $\theta_1$이 수렴하는 과정에서 $\alpha$값도 점점 줄여줘야 하는 것인가?       
    ![img](https://i.loli.net/2020/09/22/vLOZ3pcfUHTwnB1.png)

    A. 답: 적절한 $\alpha$ 값만 설정한다면, 그럴필요 없다. 왜냐하면 $\theta_1$ 값이 수렴할수록, $\frac{\partial}{\partial\theta_1}$값도 0에 가까워지므로 step size가 감소한다. 아래 그림을 참고하자.  
    ![img](https://i.loli.net/2020/09/22/LQ4SZOi5uYFDl78.png)

### Gradient Descent For Linear Regression

$h_\theta(x_i )=\theta_0 +\theta_1x_i$ 의 비용 함수 $J(\theta_0,\theta_1)$을 이용하여 gradient descent를 진행해보자.    

$$
J(\theta_0,\theta_1)=\frac{1}{2m}\sum^{m}_{i=1}(h_\theta(x_i)-y_i)^2
$$

위에서 언급한 gradient descent를 사용.

$$
\theta_j:=\theta_j-\alpha \frac{\partial}{\partial\theta_j}J(\theta_0, \theta_1) \quad\\ \text{where} \ \ j=0, 1 \ \ \text{and} \ \ J(\theta_0,\theta_1)=\frac{1}{2m}\sum^{m}_{i=1}(h_\theta(x_i)-y_i)^2
$$


* 위 식은 모델이 수렴할때 까지 다음을 반복하라는 의미다.

$$
\theta_{0}:=\theta_{0}-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x_{i}\right)-y_{i}\right) \\
\theta_{1}:=\theta_{1}-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(\left(h_{\theta}\left(x_{i}\right)-y_{i}\right) \cdot x_{i}\right)
$$

* 위와 같이 gradient descent를 진행할 때, 모든 training example을 전부 사용하는 것을 **batch gradient descent**라 부른다. 

* 그리고 아래 그림과 같이 오직 하나의 minima (global minimum) 밖에 존재하지 않는 비용 함수 $J$를 convex quadratic function이라 부른다.    

  (convex는 윤곽이 볼록하다는 뜻이다.)

  ![img](https://i.loli.net/2020/09/22/ayop5RBENvDdMbI.png) 