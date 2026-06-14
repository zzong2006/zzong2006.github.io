---
tags: ["sampling", "statistic"]
---

# A) Rejection Sampling ?

Rejection sampling 은 어떤 확률 밀도 함수 $p(x)$ 에 대해, 다음과 같은 조건에서 효율적으로 sampling 을 수행할 수 있는 방법이다.

주어진 확률 분포 $p(x)$ 의 확률 밀도 함수 ([[Probability Density Function|pdf]]) 를 알고 있어야 한다. 그러나 $p(x)$ 에서 직접 샘플을 생성하는 것은 매우 어렵거나 불가능하다.

리젝션 샘플링을 수행하는 방법은 간단하다: **Sampling 을 통해서 나온 값들이 우리가 알아내기 원하는 확률의 조건에 만족한다면 accept, 그렇지 않으면 reject** 를 함으로써 확률값을 계산해 나가는 방법이다.

# B) 제안 분포 (proposal distribution) 란 무엇인가

Rejection sampling 의 기본적인 동작은 쉽게 샘플을 생성할 수 있는 $q$ 에서 sample 들을 생성한 뒤에 이 sample 들의 분포가 $p$ 를 따르도록 수정하는 것이다. 이를 통해 실제로는 $q$ 에서 샘플이 생성되었지만, 그 결과는 $p$ 에서 생성된 것처럼 만드는 것이다. 이때 쉽게 샘플을 생성할 수 있도록 임의로 설정한 $q$ 를 제안 분포 (proposal distribution) 이라고 한다. 

제안 분포는 uniform distribution, normal distribution 등이 이용될 수 있으며, 가능하면 $p$ 와 비슷한 형태의 확률 분포를 사용하는 것이 좋다. 제안 분포 $q$ 를 설정한 다음에는 상수 $M$ 을 설정한다. 이때 $M$ 은 아래 그림과 같이 모든 $x$ 에 대해 $p(x)≤Mq(x)$ 가 되도록 설정해야 한다.

![|450](https://i.imgur.com/KuavFc9.png)  
위 그림처럼 제안 분포가 target 분포를 감싸는 모양을 envelope 한다고 표현한다.

# C) Rejection Sampling 과정

## C.1) Sampling 알고리즘

![|500](https://i.imgur.com/1Vbn90B.png)

## C.2) Step by Steps

Rejection sampling 의 첫 번째 단계는 다음 그림과 같이 $q$ 에서 샘플 $x_0$ 를 생성하는 것이다.  

![|450](https://i.imgur.com/lnSZZ46.png)

그다음, $[0, Mq(x_0)]$ 사이의 uniform distribution 에서 $u$ 를 생성하여 $u$ 가 아래 그림의 A 영역에 존재한다면 $x_0$ 를 기각 (rejection) 하고, B 영역에 존재한다면 (i.e. $\displaystyle u<\frac{p\left(x_{0}\right)}{Mq\left(x_{0}\right)}$) $x_0$ 를 샘플로 이용한다. 이 과정을 통해 $q$ 에서 생성된 샘플들은 $p$ 를 따르게 된다.  

![|450](https://i.imgur.com/nx1CgQQ.png)

$q$ 에서 샘플을 생성하여 [0, $Mq(x0)$] 사이의 난수에 따라 샘플을 기각 - 수용하는 과정을 무한히 반복하면, Rejection sampling 을 통해 얻은 샘플들은 결국 아래 그림과 같이 $p$ 에서 생성된 샘플처럼 보이게 된다.  
![|450](https://i.imgur.com/sqcPLzv.png)

# D) 채택률과 M 값의 설정

좋은 샘플링 알고리즘의 조건은 원하는 분포에서 빠르게 샘플을 생성하는 것이다. 그러나 rejection sampling 은 샘플을 생성한 뒤에 랜덤하게 생성된 샘플을 기각 - 수용하기 때문에 일정 시간 내에 원하는 수의 샘플을 생성한다는 보장을 할 수 없다.

이것은 rejection sampling 의 채택률과 관련이 있는데, 채택률 $p(accept)$ 는 다음과 같이 정의된다.  

$$
\displaystyle p(\text{accept})=\int\left\{\frac{p(x)}{Mq(x)}\right\}q(x)dx=\frac{1}{M}\int p(x)dx
$$

따라서, 채택률은 $M$ 에 반비례한다.

즉, 채택률을 최대화하여, Rejection sampling 의 실행 속도를 빠르게 만들기 위해서는 $p(x)≤Mq(x)$ 를 만족하면서 가능한 작은 $M$ 을 선택해야 한다.

# E) Related

* [[importance sampling]]

# F) References

* [daum blog](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile24.uf.tistory.com%2Fimage%2F99C1AF3E5AC997D80359D0)
