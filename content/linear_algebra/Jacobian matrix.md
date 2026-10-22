---
title: "Jacobian matrix"
aliases: ["자코비안", "자코비안 행렬", "Jacobian"]
tags:
  - calculus
  - linear_algebra
  - differentitation
---

# A) 머신러닝에서 Jacobian 이 필요한 이유

신경망 학습은 같은 질문을 계속 반복한다. **"파라미터를 아주 조금 바꾸면 loss 가 얼마나 바뀌는가?"** 이 답을 알아야 loss 가 줄어드는 방향으로 파라미터를 옮길 수 있다.

그런데 신경망은 벡터를 받아 벡터를 내놓는 층(layer)을 수십 개 쌓은 함수다. 그래서 위 질문은 층마다 쪼개진다. "이 층의 입력을 조금 바꾸면 이 층의 출력이 얼마나 바뀌는가?" 입력도 벡터, 출력도 벡터인 함수에 대해 이 질문의 답을 모아 놓은 것이 Jacobian matrix 다.

이 질문은 파라미터 학습 말고도 딥러닝의 여러 장면에서 다시 나온다.

| 장면 | Jacobian 이 답하는 질문 | 다루는 절 |
| --- | --- | --- |
| 역전파 (모든 학습) | 층마다 구한 Jacobian 을 어떤 순서로 곱해야 파라미터의 gradient 가 나오는가 | 합성 함수의 Jacobian |
| 깊은 모델의 학습 안정성 | Jacobian 을 수십 번 곱하면 gradient 가 사라지거나 폭발하는 이유, residual connection 이 이를 막는 이유 | 합성 함수의 Jacobian |
| softmax 와 cross-entropy | 어휘 수의 제곱만큼 큰 softmax 의 Jacobian 이 왜 "예측 확률 − 정답" 이라는 짧은 gradient 로 줄어드는가 | Element-wise 연산의 Jacobian |
| 입력 민감도 (attribution, robustness) | 입력 토큰이나 픽셀을 조금 바꾸면 출력이 얼마나 흔들리는가 | 작은 예제로 계산하기 |
| 확률 밀도 변환 (normalizing flow, diffusion) | 변환이 공간을 얼마나 늘리거나 줄여서 확률 밀도가 묽어지거나 진해지는가 | Jacobian 행렬식 |

아래에서는 먼저 Jacobian 이 무엇이고 어떻게 계산하는지 정리한다. 위의 장면들은 각각 필요한 개념을 설명한 절의 끝에서 다룬다.

# B) 다변수 함수의 미분을 담는 행렬

변수가 하나인 함수 $f(x)$ 의 미분 $f'(a)$ 는 숫자 하나다. 이 숫자는 "입력을 $a$ 에서 아주 조금($h$ 만큼) 움직이면 출력이 얼마나 움직이는가"를 알려준다.

$$
f(a+h)\approx f(a)+f'(a)\,h
$$

그런데 입력이 벡터이고 출력도 벡터인 함수라면 사정이 달라진다. 예를 들어 입력이 2 개, 출력이 3 개라면, "입력 1번을 움직였을 때 출력 1번의 변화", "입력 1번을 움직였을 때 출력 2번의 변화" 처럼 따져야 할 조합이 $3\times 2=6$ 개 생긴다. 숫자 하나로는 이걸 다 담을 수 없다.

Jacobian matrix 는 이 조합들을 모두 모아 놓은 행렬이다. 그리고 위의 일변수 식에서 $f'(a)$ 가 하던 역할을 그대로 이어받는다.

$$
\mathbf{f}(\mathbf{a}+\mathbf{h})\approx\mathbf{f}(\mathbf{a})+\mathbf{J}_{\mathbf{f}}(\mathbf{a})\,\mathbf{h}
$$

| 기호 | 뜻 |
| --- | --- |
| $\mathbf{a}$ | 미분을 구하는 기준점 (입력 벡터) |
| $\mathbf{h}$ | 기준점에서 입력을 움직인 작은 변화량 (벡터) |
| $\mathbf{J}_{\mathbf{f}}(\mathbf{a})$ | 점 $\mathbf{a}$ 에서 계산한 $\mathbf{f}$ 의 Jacobian matrix |
| $\mathbf{J}_{\mathbf{f}}(\mathbf{a})\,\mathbf{h}$ | 입력을 $\mathbf{h}$ 만큼 움직였을 때 출력이 움직이는 양의 어림값 |

즉, Jacobian 은 "입력 변화 벡터를 넣으면 출력 변화 벡터를 돌려주는 행렬"이다. 기준점 근처의 아주 좁은 범위에서는 복잡한 비선형 함수도 이 행렬 하나를 곱하는 일차식처럼 행동한다. 이렇게 함수를 기준점 근처에서 일차식으로 바꿔 어림하는 것을 선형 근사(linear approximation)라고 한다.

# C) 정의

## C.1) 원소 하나하나의 뜻

함수 $\mathbf{f}:\mathbb{R}^{n}\rightarrow\mathbb{R}^{m}$ 이 있다고 하자. 이 함수는 $n$ 차원 벡터 $\mathbf{x}=(x_1,\dots,x_n)$ 를 받아서 $m$ 차원 벡터를 내놓는다. 출력의 각 성분을 따로 떼어 보면 $m$ 개의 실숫값 함수가 나란히 있는 셈이다.

$$
\mathbf{f}(\mathbf{x})=\begin{bmatrix}f_{1}(\mathbf{x})\\\vdots\\f_{m}(\mathbf{x})\end{bmatrix}
$$

$\mathbf{f}$ 의 Jacobian matrix $\mathbf{J}$ 는 $m\times n$ 행렬이고, $(i,j)$ 원소는 다음과 같다.

$$
\mathbf{J}_{ij}=\frac{\partial f_{i}}{\partial x_{j}}
$$

$\dfrac{\partial f_{i}}{\partial x_{j}}$ 는 [[partial derivatives|편미분]]이다. 다른 입력 변수는 모두 고정해 두고 $x_j$ 하나만 조금 움직였을 때, 출력 성분 $f_i$ 가 변하는 비율이다. Jacobian 은 이 편미분을 (출력 성분, 입력 성분) 의 모든 쌍에 대해 계산해서 표로 만든 것이다.

크기를 외우는 방법은 간단하다. **행의 수는 출력 개수 $m$, 열의 수는 입력 개수 $n$** 이다. 이렇게 정해야 앞 절의 $\mathbf{J}\mathbf{h}$ 에서 $n$ 차원 입력 변화 $\mathbf{h}$ 를 곱해 $m$ 차원 출력 변화가 나온다.

## C.2) 행으로 읽기, 열로 읽기

전체 행렬을 펼치면 다음과 같다.

$$
\mathbf{J}=\begin{bmatrix}\dfrac{\partial f_{1}}{\partial x_{1}}&\cdots&\dfrac{\partial f_{1}}{\partial x_{n}}\\\vdots&\ddots&\vdots\\\dfrac{\partial f_{m}}{\partial x_{1}}&\cdots&\dfrac{\partial f_{m}}{\partial x_{n}}\end{bmatrix}=\begin{bmatrix}\nabla f_{1}^{\top}\\\vdots\\\nabla f_{m}^{\top}\end{bmatrix}=\begin{bmatrix}\dfrac{\partial\mathbf{f}}{\partial x_{1}}&\cdots&\dfrac{\partial\mathbf{f}}{\partial x_{n}}\end{bmatrix}
$$

같은 행렬을 두 방향으로 읽을 수 있다.

- **$i$ 번째 행**: 출력 성분 $f_i$ 하나가 입력 $x_1,\dots,x_n$ 각각에 얼마나 민감한지를 늘어놓은 것이다. 이것은 실숫값 함수 $f_i$ 의 [[gradient]] $\nabla f_i$ 를 가로로 눕힌 것(transpose)과 같다.
- **$j$ 번째 열**: 입력 성분 $x_j$ 하나를 움직였을 때 출력 $f_1,\dots,f_m$ 이 각각 얼마나 움직이는지를 세로로 늘어놓은 벡터 $\dfrac{\partial\mathbf{f}}{\partial x_j}$ 다.

여기서 $\nabla f_i$ 는 열벡터로 쓰는 것이 관례라서, 행에 넣을 때 $\top$ 를 붙였다. gradient 와 Jacobian 의 관계는 [Difference between gradient and Jacobian](https://math.stackexchange.com/questions/1519367/difference-between-gradient-and-jacobian) 에 정리되어 있다.

## C.3) 입력과 출력의 형태에 따른 모양

"행 = 출력 개수, 열 = 입력 개수" 규칙을 입력·출력이 스칼라인 경우까지 적용하면, 익숙한 미분들이 모두 Jacobian 의 특수한 경우라는 것이 보인다.

| 입력 | 출력 | Jacobian 크기 | 익숙한 이름 |
| --- | --- | --- | --- |
| 스칼라 $x$ | 스칼라 $f$ | $1\times 1$ | 일변수 함수의 미분 $f'(x)$ |
| 벡터 $\mathbf{x}\in\mathbb{R}^n$ | 스칼라 $f$ | $1\times n$ (행벡터) | gradient 의 transpose $\nabla f^{\top}$ |
| 스칼라 $x$ | 벡터 $\mathbf{f}\in\mathbb{R}^m$ | $m\times 1$ (열벡터) | 성분별 미분을 세운 벡터 (곡선의 속도 벡터) |
| 벡터 $\mathbf{x}\in\mathbb{R}^n$ | 벡터 $\mathbf{f}\in\mathbb{R}^m$ | $m\times n$ | Jacobian matrix |

딥러닝에서 loss 는 스칼라이므로, 파라미터에 대한 loss 의 미분은 두 번째 줄의 경우다. 반면 층 하나는 벡터를 받아 벡터를 내놓으므로 네 번째 줄의 경우다. 역전파는 이 두 종류를 이어 붙이는 계산이다.

실숫값 함수의 이차 미분을 모은 [[Hessian matrix]] 도 이 틀로 볼 수 있다. Hessian 은 gradient $\nabla f:\mathbb{R}^n\rightarrow\mathbb{R}^n$ 를 하나의 벡터 함수로 보고 그 Jacobian 을 구한 $n\times n$ 행렬이다.

# D) 작은 예제로 계산하기

입력 2 개, 출력 2 개인 함수 $\mathbf{f}:\mathbb{R}^{2}\rightarrow\mathbb{R}^{2}$ 를 보자.

$$
\mathbf{f}\left(\begin{bmatrix}x\\y\end{bmatrix}\right)=\begin{bmatrix}f_{1}(x,y)\\f_{2}(x,y)\end{bmatrix}=\begin{bmatrix}x^{2}y\\5x+\sin y\end{bmatrix}
$$

Jacobian 의 네 칸을 하나씩 채운다. $x$ 로 편미분할 때는 $y$ 를 상수로, $y$ 로 편미분할 때는 $x$ 를 상수로 본다.

1. $\dfrac{\partial f_1}{\partial x}$: $x^2y$ 에서 $y$ 는 상수이므로 $2xy$
2. $\dfrac{\partial f_1}{\partial y}$: $x^2y$ 에서 $x^2$ 은 상수이므로 $x^2$
3. $\dfrac{\partial f_2}{\partial x}$: $5x+\sin y$ 에서 $\sin y$ 는 상수이므로 $5$
4. $\dfrac{\partial f_2}{\partial y}$: $5x+\sin y$ 에서 $5x$ 는 상수이므로 $\cos y$

첫 행에는 $f_1$ 의 편미분을, 둘째 행에는 $f_2$ 의 편미분을 넣는다.

$$
\mathbf{J}_{\mathbf{f}}(x,y)=\begin{bmatrix}\dfrac{\partial f_{1}}{\partial x}&\dfrac{\partial f_{1}}{\partial y}\\\dfrac{\partial f_{2}}{\partial x}&\dfrac{\partial f_{2}}{\partial y}\end{bmatrix}=\begin{bmatrix}2xy&x^{2}\\5&\cos y\end{bmatrix}
$$

이 결과는 아직 $(x,y)$ 에 따라 값이 바뀌는 행렬이다. 구체적인 점을 넣어야 숫자 행렬이 된다. 점 $(1,0)$ 에서는 다음과 같다.

$$
\mathbf{J}_{\mathbf{f}}(1,0)=\begin{bmatrix}0&1\\5&1\end{bmatrix}
$$

이 행렬이 정말 "출력 변화를 어림하는 행렬"인지 확인해 보자. 입력을 $(1,0)$ 에서 $(1.01,\,0.02)$ 로, 즉 $\mathbf{h}=(0.01,\,0.02)$ 만큼 움직인다.

- **Jacobian 으로 어림한 출력 변화**: $\mathbf{J}\mathbf{h}=(0\cdot 0.01+1\cdot 0.02,\;5\cdot 0.01+1\cdot 0.02)=(0.02,\;0.07)$
- **실제 출력 변화**: $\mathbf{f}(1,0)=(0,\,5)$ 이고 $\mathbf{f}(1.01,0.02)=(1.0201\times 0.02,\;5.05+\sin 0.02)\approx(0.020402,\;5.069999)$ 이므로, 차이는 약 $(0.0204,\;0.0700)$

두 값이 소수 셋째 자리까지 맞는다. $\mathbf{h}$ 가 작을수록 어림값과 실제 값은 더 가까워진다.

## D.1) 입력에 대한 Jacobian 은 민감도다

위 예제에서 출력 $f_2$ 는 $x$ 를 $0.01$ 움직이자 $0.05$ 나 움직였다. Jacobian 의 $(2,1)$ 칸 값 $5$ 가 그 배율이다. 이처럼 Jacobian 의 각 칸은 "어느 입력이 어느 출력을 얼마나 세게 흔드는가"를 나타낸다. 학습된 모델의 출력을 입력에 대해 미분하면 같은 정보를 얻는다.

- **입력 attribution**: 분류 모델이라면 정답 클래스의 점수, 언어 모델이라면 다음 토큰의 log-probability 처럼 스칼라 출력 하나를 고르고, 그것을 입력(픽셀, 토큰 embedding)으로 미분한다. 출력이 하나이므로 Jacobian 의 한 행, 즉 gradient 를 구하는 셈이다. 값이 큰 위치가 출력에 영향을 많이 준 입력이라고 보고, 이를 시각화한 것이 saliency map 같은 gradient 기반 설명 기법이다.
- **robustness**: Jacobian 의 값이 크면 작은 입력 변화 $\mathbf{h}$ 에도 출력 변화 $\mathbf{J}\mathbf{h}$ 가 커진다. 사람 눈에는 안 보이는 작은 노이즈로 예측을 바꾸는 adversarial example 이 이 성질을 이용한다. 반대로 학습할 때 입력에 대한 Jacobian 의 모든 칸을 제곱해 더한 값(Frobenius norm 의 제곱)을 loss 에 더하면, 입력이 조금 흔들려도 출력이 덜 흔들리는 모델을 얻는다. Contractive Autoencoder(Rifai et al., 2011)와 Jacobian regularization(Hoffman et al., 2019)이 이 방식이다.

# E) Jacobian 행렬식: 넓이가 몇 배로 바뀌는가

입력과 출력의 차원이 같으면($m=n$) Jacobian 은 정사각행렬이 되고, [[determinant|행렬식]](determinant)을 구할 수 있다. 이 값을 Jacobian determinant 라고 부르고, 흔히 줄여서 "Jacobian" 이라고도 부른다.

행렬식의 기하학적 뜻은 "이 행렬을 곱하면 넓이(3 차원 이상이면 부피)가 몇 배가 되는가" 다. Jacobian 은 기준점 근처에서 함수가 하는 일을 행렬 하나로 어림한 것이므로, Jacobian determinant 는 **기준점 근처의 아주 작은 영역이 함수를 거치면서 넓이가 몇 배로 바뀌는지** 를 알려준다.

앞 절의 예제로 계산하면 다음과 같다.

$$
\det\mathbf{J}_{\mathbf{f}}(x,y)=2xy\cdot\cos y-x^{2}\cdot 5=2xy\cos y-5x^{2}
$$

점 $(1,0)$ 에서는 $0-5=-5$ 다. 이 값에서 두 가지를 읽는다.

- **절댓값 $5$**: $(1,0)$ 근처의 작은 정사각형은 $\mathbf{f}$ 를 거친 뒤 넓이가 약 5 배인 평행사변형이 된다.
- **부호가 음수**: 도형이 거울에 비친 것처럼 뒤집힌다. 실제로 $x$ 축 방향 단위 벡터 $(1,0)$ 은 $(0,5)$ 로, $y$ 축 방향 단위 벡터 $(0,1)$ 은 $(1,1)$ 로 옮겨진다. 원래는 첫 벡터에서 둘째 벡터로 반시계 방향으로 돌아가는데, 옮겨진 뒤에는 시계 방향이 된다.

이 성질이 가장 많이 쓰이는 곳은 적분의 변수 변환이다. 직교좌표 $(x,y)$ 를 극좌표 $(r,\theta)$ 로 바꾸는 함수 $x=r\cos\theta,\;y=r\sin\theta$ 의 Jacobian 을 구하면 다음과 같다.

$$
\mathbf{J}=\begin{bmatrix}\dfrac{\partial x}{\partial r}&\dfrac{\partial x}{\partial\theta}\\\dfrac{\partial y}{\partial r}&\dfrac{\partial y}{\partial\theta}\end{bmatrix}=\begin{bmatrix}\cos\theta&-r\sin\theta\\\sin\theta&r\cos\theta\end{bmatrix},\qquad\det\mathbf{J}=r\cos^{2}\theta+r\sin^{2}\theta=r
$$

그래서 극좌표로 적분할 때 $dx\,dy$ 자리에 $r\,dr\,d\theta$ 를 쓴다. $(r,\theta)$ 공간에서 가로 $dr$, 세로 $d\theta$ 인 작은 직사각형이 $xy$ 평면에서는 넓이 $r\,dr\,d\theta$ 인 조각이 된다는 뜻이다. 원점에서 멀수록($r$ 이 클수록) 같은 각도 $d\theta$ 가 더 긴 호를 쓸고 지나가므로 조각이 넓어진다.

## E.1) 확률 밀도를 변환할 때: normalizing flow

생성 모델 중에는 단순한 분포(예: 표준 정규분포)에서 뽑은 $\mathbf{z}$ 를 신경망 $\mathbf{g}$ 로 변환해 데이터 $\mathbf{x}=\mathbf{g}(\mathbf{z})$ 를 만드는 것들이 있다. 이때 "이 데이터 $\mathbf{x}$ 가 나올 확률 밀도는 얼마인가"를 계산하려면 Jacobian determinant 가 필요하다.

이유는 넓이와 밀도의 관계에 있다. 확률의 총량은 변환 전후에 같다. 그런데 $\mathbf{g}$ 가 어떤 작은 영역의 넓이를 5 배로 늘리면, 같은 양의 확률이 5 배 넓은 곳에 퍼지므로 밀도는 $1/5$ 로 묽어진다. 이를 식으로 쓰면 다음과 같다.

$$
\log p_{\mathbf{x}}(\mathbf{x})=\log p_{\mathbf{z}}(\mathbf{z})-\log\left\lvert\det\mathbf{J}_{\mathbf{g}}(\mathbf{z})\right\rvert
$$

| 기호 | 뜻 |
| --- | --- |
| $p_{\mathbf{z}}$ | 변환 전 단순한 분포의 밀도 |
| $p_{\mathbf{x}}$ | 변환 후 데이터 분포의 밀도 |
| $\mathbf{J}_{\mathbf{g}}(\mathbf{z})$ | 변환 $\mathbf{g}$ 의 점 $\mathbf{z}$ 에서의 Jacobian |

normalizing flow 는 이 식으로 log-likelihood 를 정확히 계산해서 학습한다. 문제는 비용이다. $n\times n$ 행렬의 행렬식은 일반적으로 $n^3$ 에 비례하는 계산이 필요하고, 이미지처럼 $n$ 이 수만 이상이면 감당할 수 없다. 그래서 RealNVP, Glow 같은 flow 모델은 층의 Jacobian 이 삼각 행렬이 되도록 구조를 설계한다. 삼각 행렬의 행렬식은 대각 원소의 곱이므로 $n$ 번의 곱셈으로 끝난다.

변환을 연속적인 시간 흐름으로 보는 continuous normalizing flow 나 diffusion 모델의 likelihood 계산에서는 행렬식 대신 Jacobian 의 trace(대각 원소의 합)가 나온다. 이 경우에도 Jacobian 전체를 만들지 않고 무작위 벡터와의 곱으로 trace 를 어림하는 Hutchinson 추정을 쓴다.

# F) 합성 함수의 Jacobian 은 Jacobian 들의 곱이다

여러 함수를 차례로 적용한 합성 함수의 Jacobian 은, 각 함수의 Jacobian 을 곱해서 구한다. 일변수 미분의 [[chain rule (calculus)|chain rule]] $\dfrac{dz}{dx}=\dfrac{dz}{dy}\dfrac{dy}{dx}$ 에서 곱셈이 행렬 곱셈으로 바뀐 것이다.

입력 $\mathbf{x}\in\mathbb{R}^{n}$ 에서 출력 $\mathbf{o}\in\mathbb{R}^{m}$ 을 만드는 함수 $\mathbf{f}$ 가 네 함수의 합성이라고 하자.

$$
\mathbf{f}=\mathbf{f}_{4}\circ\mathbf{f}_{3}\circ\mathbf{f}_{2}\circ\mathbf{f}_{1}
$$

계산은 오른쪽 함수부터 순서대로 일어나고, 중간 결과에 이름을 붙이면 다음과 같다.

| 단계 | 계산 | 함수의 입력 → 출력 차원 | 그 함수의 Jacobian 크기 |
| --- | --- | --- | --- |
| 1 | $\mathbf{x}_{2}=\mathbf{f}_{1}(\mathbf{x})$ | $n\rightarrow m_1$ | $m_1\times n$ |
| 2 | $\mathbf{x}_{3}=\mathbf{f}_{2}(\mathbf{x}_{2})$ | $m_1\rightarrow m_2$ | $m_2\times m_1$ |
| 3 | $\mathbf{x}_{4}=\mathbf{f}_{3}(\mathbf{x}_{3})$ | $m_2\rightarrow m_3$ | $m_3\times m_2$ |
| 4 | $\mathbf{o}=\mathbf{f}_{4}(\mathbf{x}_{4})$ | $m_3\rightarrow m$ | $m\times m_3$ |

전체 Jacobian 은 각 단계의 Jacobian 을 **마지막 단계부터** 왼쪽에 놓고 곱한다.

$$
\mathbf{J}_{\mathbf{f}}(\mathbf{x})=\frac{\partial\mathbf{o}}{\partial\mathbf{x}}=\frac{\partial\mathbf{o}}{\partial\mathbf{x}_{4}}\frac{\partial\mathbf{x}_{4}}{\partial\mathbf{x}_{3}}\frac{\partial\mathbf{x}_{3}}{\partial\mathbf{x}_{2}}\frac{\partial\mathbf{x}_{2}}{\partial\mathbf{x}}=\mathbf{J}_{\mathbf{f}_{4}}(\mathbf{x}_{4})\,\mathbf{J}_{\mathbf{f}_{3}}(\mathbf{x}_{3})\,\mathbf{J}_{\mathbf{f}_{2}}(\mathbf{x}_{2})\,\mathbf{J}_{\mathbf{f}_{1}}(\mathbf{x})
$$

이 식에서 두 가지를 확인할 수 있다.

- **크기가 맞물린다.** $(m\times m_3)(m_3\times m_2)(m_2\times m_1)(m_1\times n)$ 을 곱하면 $m\times n$ 이 되어, $\mathbf{f}$ 의 Jacobian 크기와 일치한다. 순서를 바꾸면 행렬 곱셈 자체가 정의되지 않는다.
- **각 Jacobian 은 그 함수가 실제로 받은 입력에서 계산한다.** $\mathbf{J}_{\mathbf{f}_3}$ 은 원래 입력 $\mathbf{x}$ 가 아니라 $\mathbf{f}_3$ 에 들어간 중간 결과 $\mathbf{x}_3$ 에서 구한다. 그래서 먼저 입력부터 순서대로 계산하면서 중간 결과를 저장해 둬야 한다.

## F.1) 역전파는 Jacobian 을 출력 쪽부터 곱한다

신경망이 바로 이런 합성 함수다. 층 하나하나가 $\mathbf{f}_k$ 이고, 마지막 함수는 스칼라 loss 를 내놓는다($m=1$). 그러면 맨 왼쪽 Jacobian 은 $1\times m_3$ 행벡터가 된다.

행렬 곱셈은 어느 쪽부터 묶어도 결과가 같지만 비용은 크게 다르다.

- **왼쪽(출력 쪽)부터 곱하면** 매 단계가 "행벡터 × 행렬 = 행벡터" 다. 중간 결과가 늘 벡터 하나라서 저장과 계산이 가볍다.
- **오른쪽(입력 쪽)부터 곱하면** $\mathbf{J}_{\mathbf{f}_2}\mathbf{J}_{\mathbf{f}_1}$ 처럼 행렬끼리 곱해야 하고, 중간 결과의 열 수가 입력 차원 $n$ 이다. 입력이 수십억 개 파라미터라면 이 행렬을 들고 다닐 수 없다.

[[backpropagation]] 이 출력에서 입력 쪽으로 거꾸로 진행하는 이유가 이것이다. 이렇게 행벡터에 Jacobian 을 곱하는 연산을 vector-Jacobian product(VJP)라고 부른다. 역전파 노트의 오차 전달 식 $\delta^{l}=\left(\left(w^{l+1}\right)^{\top}\delta^{l+1}\right)\odot\sigma'(z^{l})$ 도 행벡터로 바꿔 쓰면 VJP 두 번이다. 여기서 $\delta^l$ 은 $l$ 번째 층의 activation 이전 값 $z^l$ 에 대한 loss 의 미분이다.

$$
\left(\delta^{l}\right)^{\top}=\left(\delta^{l+1}\right)^{\top}\,w^{l+1}\,\operatorname{diag}\big(\sigma'(z^{l})\big)
$$

$w^{l+1}$ 은 선형 층 $z^{l+1}=w^{l+1}a^{l}+b^{l+1}$ 의 Jacobian $\partial z^{l+1}/\partial a^{l}$ 이고, $\operatorname{diag}(\sigma'(z^l))$ 은 activation $a^l=\sigma(z^l)$ 의 Jacobian 이다. 뒤쪽 대각 행렬이 나오는 이유는 Element-wise 연산 절에서 다룬다.

실제 프레임워크는 Jacobian 행렬을 만들지 않는다. 크기를 따져보면 만들 수가 없다. hidden 차원이 4096 이고 sequence 길이가 2048 인 Transformer 층은 입력과 출력이 각각 $2048\times 4096\approx 840$ 만 개 숫자다. 이 층의 Jacobian 은 $840\text{만}\times 840\text{만}\approx 7\times 10^{13}$ 칸이고, fp32 로 약 280 TB 다. 그래서 [[PyTorch]] 의 각 연산은 Jacobian 대신 "출력 쪽 gradient 벡터를 받아 입력 쪽 gradient 벡터를 돌려주는" VJP 함수만 구현한다. 이것이 각 연산의 `backward` 다.

Jacobian 이 직접 필요할 때는 `torch.func.jacrev`(VJP 를 출력 개수만큼 반복), `torch.func.jacfwd`(입력 쪽부터 곱하는 JVP 를 입력 개수만큼 반복)로 구할 수 있다. 출력이 입력보다 적으면 `jacrev`, 많으면 `jacfwd` 가 빠르다.

## F.2) 깊은 모델에서 Jacobian 곱이 커지거나 작아지는 문제

역전파에서 입력 가까운 층에 도착하는 gradient 는 그 위의 모든 층의 Jacobian 을 곱한 결과다. 층이 많으면 같은 효과가 수십 번 반복된다.

각 층의 Jacobian 이 벡터의 길이를 0.9 배로 줄인다고 해보자. 100 층을 지나면 $0.9^{100}\approx 2.7\times 10^{-5}$ 배가 되어 gradient 가 사실상 사라진다. 반대로 1.1 배로 늘린다면 $1.1^{100}\approx 1.4\times 10^{4}$ 배로 폭발한다. 이것이 [[vanishing gradients|vanishing / exploding gradients]] 다.

[[skip connection|residual connection]] 은 이 문제를 Jacobian 수준에서 해결한다. 층의 출력을 $\mathbf{y}=\mathbf{x}+F(\mathbf{x})$ 로 만들면 그 Jacobian 은 다음과 같다.

$$
\frac{\partial\mathbf{y}}{\partial\mathbf{x}}=I+\mathbf{J}_{F}(\mathbf{x})
$$

$I$ 는 대각선이 모두 1 인 단위 행렬(identity matrix)로, 벡터를 그대로 통과시킨다. $F$ 의 Jacobian 이 0 에 가까워져도 $I$ 항은 남으므로, 이 층을 지나는 gradient 가 0 으로 무너지지 않는다. 또 $\mathbf{J}_F$ 가 작은 동안에는 각 층의 Jacobian 이 단위 행렬에 가까워서, 수십 개를 곱해도 크기가 크게 변하지 않는다. 대부분의 LLM 이 쓰는 Pre-LN Transformer 는 이 더하기 경로에 정규화를 끼우지 않아 $I$ 항이 그대로 남는다.

# G) Element-wise 연산의 Jacobian 은 대각 행렬이다

신경망에는 벡터의 같은 위치끼리만 계산하는 연산이 많다. 두 벡터의 덧셈 $\mathbf{w}+\mathbf{x}$, 같은 위치끼리의 곱 $\mathbf{w}\odot\mathbf{x}$, 벡터의 각 원소에 따로 적용하는 activation $\sigma(\mathbf{x})$ 같은 것들이다. 이런 연산을 element-wise 연산이라고 한다.

element-wise 연산에서는 출력의 $i$ 번째 성분 $y_i$ 가 입력의 $i$ 번째 성분($w_i$, $x_i$)에만 의존한다. 따라서 $i\neq j$ 이면 $w_j$ 를 아무리 움직여도 $y_i$ 는 변하지 않는다.

$$
\frac{\partial y_i}{\partial w_j}=0\qquad(i\neq j)
$$

Jacobian 에서 $i\neq j$ 인 칸은 대각선 바깥 칸이므로, 대각선만 남은 [[diagonal matrix|대각 행렬]]이 된다.

$\mathbf{w},\mathbf{x}\in\mathbb{R}^3$ 이고 $\mathbf{y}=\mathbf{w}\odot\mathbf{x}$, 즉 $y_i=w_ix_i$ 인 경우를 계산해 보자. $\dfrac{\partial y_i}{\partial w_i}=x_i$ 이고 나머지 칸은 0 이다.

$$
\frac{\partial\mathbf{y}}{\partial\mathbf{w}}=\begin{bmatrix}\dfrac{\partial y_1}{\partial w_1}&\dfrac{\partial y_1}{\partial w_2}&\dfrac{\partial y_1}{\partial w_3}\\\dfrac{\partial y_2}{\partial w_1}&\dfrac{\partial y_2}{\partial w_2}&\dfrac{\partial y_2}{\partial w_3}\\\dfrac{\partial y_3}{\partial w_1}&\dfrac{\partial y_3}{\partial w_2}&\dfrac{\partial y_3}{\partial w_3}\end{bmatrix}=\begin{bmatrix}x_1&0&0\\0&x_2&0\\0&0&x_3\end{bmatrix}=\operatorname{diag}(\mathbf{x})
$$

같은 방법으로 자주 쓰는 연산의 Jacobian 을 구하면 다음과 같다.

| 연산 | Jacobian | 이유 |
| --- | --- | --- |
| $\mathbf{y}=\mathbf{w}\odot\mathbf{x}$ | $\dfrac{\partial\mathbf{y}}{\partial\mathbf{w}}=\operatorname{diag}(\mathbf{x})$ | $\dfrac{\partial(w_ix_i)}{\partial w_i}=x_i$ |
| $\mathbf{y}=\mathbf{w}+\mathbf{x}$ | $\dfrac{\partial\mathbf{y}}{\partial\mathbf{w}}=I$ | $\dfrac{\partial(w_i+x_i)}{\partial w_i}=1$ |
| $\mathbf{y}=\mathbf{x}$ (항등 함수) | $\dfrac{\partial\mathbf{y}}{\partial\mathbf{x}}=I$ | $\dfrac{\partial x_i}{\partial x_i}=1$ |
| $\mathbf{y}=\sigma(\mathbf{x})$ (원소별 activation) | $\operatorname{diag}\big(\sigma'(x_1),\dots,\sigma'(x_n)\big)$ | $y_i=\sigma(x_i)$ 는 $x_i$ 에만 의존 |

대각 행렬은 대각선의 $n$ 개 값만 알면 되므로, 실제 구현에서는 $n\times n$ 행렬을 만들지 않는다. 대각선 값을 벡터로 들고 있다가 같은 위치끼리 곱하면 행렬 곱셈과 같은 결과가 나온다. 역전파에서 activation 을 지날 때 gradient 에 $\sigma'(z)$ 를 원소별로 곱하는($\odot$) 이유가 이것이다.

## G.1) softmax 는 대각 행렬이 아니다: cross-entropy 와 함께 쓰는 이유

출력 성분 하나가 여러 입력 성분에 의존하면 대각선 바깥 칸이 0 이 아니다. [[softmax function|softmax]] 가 대표적이다. 원소마다 $e^{x_i}$ 를 계산하니 element-wise 처럼 보이지만, 정규화하는 분모 $\sum_k e^{x_k}$ 에 모든 입력이 들어간다.

$$
s_i=\frac{e^{x_i}}{\sum_{k}e^{x_k}},\qquad\frac{\partial s_i}{\partial x_j}=s_i\left(\delta_{ij}-s_j\right)
$$

여기서 $\delta_{ij}$ 는 $i=j$ 이면 1, 아니면 0 인 기호다. 모든 칸이 채워진 $n\times n$ 행렬이다. 언어 모델이라면 $n$ 이 어휘 크기라서, 어휘가 약 13 만 개면 토큰 하나마다 약 170 억 칸짜리 Jacobian 이 생긴다.

그런데 softmax 뒤에 [[cross-entropy]] loss 를 붙이면 이 큰 행렬이 사라진다. 정답 분포를 $\mathbf{y}$(정답 토큰 위치만 1 인 one-hot 벡터)라 하고, loss 를 $L=-\sum_i y_i\log s_i$ 로 두자. chain rule 로 loss 를 softmax 입력 $x_j$ 로 미분한다.

1. loss 를 softmax 출력으로 미분하면 $\dfrac{\partial L}{\partial s_i}=-\dfrac{y_i}{s_i}$ 다. 이것이 $1\times n$ 행벡터다.
2. 이 행벡터에 softmax 의 Jacobian 을 곱한다(VJP).

$$
\frac{\partial L}{\partial x_j}=\sum_{i}\left(-\frac{y_i}{s_i}\right)s_i\left(\delta_{ij}-s_j\right)=-\sum_i y_i\delta_{ij}+s_j\sum_i y_i=-y_j+s_j
$$

마지막 단계에서는 $\sum_i y_i\delta_{ij}=y_j$ 이고, 정답 분포의 합 $\sum_i y_i=1$ 이라는 것을 썼다. 결과는 다음과 같다.

$$
\frac{\partial L}{\partial\mathbf{x}}=\mathbf{s}-\mathbf{y}
$$

"예측 확률에서 정답을 뺀 것"이라는 짧은 벡터다. 170 억 칸 행렬을 거치지 않고 어휘 크기만큼의 뺄셈으로 끝난다. PyTorch 의 `F.cross_entropy` 가 확률이 아니라 softmax 이전의 logit 을 입력으로 받는 이유도 여기에 있다. 두 연산을 한 번에 처리하면 이 단순한 gradient 를 바로 쓸 수 있고, 확률을 따로 계산했다가 log 를 취할 때 생기는 수치 오차도 피할 수 있다.

# References

- [Difference between gradient and Jacobian](https://math.stackexchange.com/questions/1519367/difference-between-gradient-and-jacobian) — Mathematics Stack Exchange
- Terence Parr, Jeremy Howard. [The Matrix Calculus You Need For Deep Learning](https://arxiv.org/abs/1802.01528), 2018 — Jacobian 모양 표와 element-wise 연산의 대각 Jacobian
- Salah Rifai et al. Contractive Auto-Encoders: Explicit Invariance During Feature Extraction. ICML 2011
- Judy Hoffman, Daniel A. Roberts, Sho Yaida. [Robust Learning with Jacobian Regularization](https://arxiv.org/abs/1908.02729), 2019
- Laurent Dinh, Jascha Sohl-Dickstein, Samy Bengio. [Density estimation using Real NVP](https://arxiv.org/abs/1605.08803), 2016
- [torch.func API](https://pytorch.org/docs/stable/func.api.html) — `jacrev`, `jacfwd`, `vjp`, `jvp`
