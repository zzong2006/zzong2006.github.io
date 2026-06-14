---
title: "Bellman Equation"
tags: ["reinforcement_learning", "linear_algebra"]
---

# A) Bellman Equation ?

$$
v_{\pi}(s)=\mathbb{E}_{\pi}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right)\mid S_{t}=s\right],\ \ \text{for all }s\in\mathcal{S}
$$ 

## A.1) 식 유도

$$
\begin{aligned}
v_{\pi}(s)&\doteq\mathbb{E}_{\pi}\left[G_{t}\mid S_{t}=s\right]\\&=\mathbb{E}_{\pi}\left[R_{t+1}+\gamma G_{t+1}\mid S_{t}=s\right]\\&=\mathbb{E}_{\pi}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right)\mid S_{t}=s\right]\\&=\sum_{a}\pi(a\mid s)\sum_{s^{\prime},r}p\left(s^{\prime},r\mid s,a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]\end{aligned}
$$

# B) Bellman Equation for MRP

[[Markov Reward Process]] 에서 특정 state $s$ 와 다른 state $s'$ 간 value 관계를 표현한 수식

$$
v(s)=\sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s\right)\left[r+\gamma v\left(s^{\prime}\right)\right]
$$

여기서 $v(s)$ 는 state $s$ 의 value 를 의미하며, $s$ 에서 시작했을 때 expected [[expected return|discounted return]] 을 의미한다.

$$
v(s)=E\left[G_{t} \mid S_{t}=s\right]=E\left[\sum_{k=0}^{\infty} \gamma^{k} R_{t+k+1} \mid S_{t}=s\right]
$$

위 Bellman 공식은 다음과 같이 matrix form 으로 간략화 할 수 있다.

$$
v=P R+\gamma P v
$$

* $v$ 는 column vector 로, 각 원소는 state 의 value 를 나타낸다.
* $R$ 는 또 다른 column vector 로, 각 원소는 그 순서에 해당하는 state 로 전이되었을 때 얻을 수 있는 reward 를 의미한다.

즉, 위 식을 확장하여 표현하면 이렇게 된다.

$$

\left[\begin{array}{c}

v(1) \\

\vdots \\

v(n)

\end{array}\right]=\left[\begin{array}{ccc}

P_{1,1} & \cdots & P_{1, n} \\

\vdots & \ddots & \vdots \\

P_{n, 1} & \cdots & P_{n, n}

\end{array}\right]\left[\begin{array}{c}

R_{1} \\

\vdots \\

R_{n}

\end{array}\right]+\gamma\left[\begin{array}{ccc}

P_{1,1} & \cdots & P_{1, n} \\

\vdots & \ddots & \vdots \\

P_{n, 1} & \cdots & P_{n, n}

\end{array}\right]\left[\begin{array}{c}

v(1) \\

\vdots \\

v(n)

\end{array}\right]

$$

이 식을 풀면 $v$ 에 대한 solution 을 얻을 수 있다.

$$

\begin{gathered}

(I-\gamma P) v=P R \\

v=(I-\gamma P)^{-1} P R

\end{gathered}$$

즉, [[Markov Chain]] 에서 수렴된 전이 확률 행렬을 얻기 위해 step 을 열심히 반복하지 않아도, 위 계산식을 통해 얻을 수 있다는 의미가 된다. 하지만 $\gamma=1$ 인 경우 $I-\gamma P$ 가 [[singular]] matrix 가 되므로 역행렬이 존재하지 않아 solution 을 얻을 수 없다.

# C) Related

# D) References
