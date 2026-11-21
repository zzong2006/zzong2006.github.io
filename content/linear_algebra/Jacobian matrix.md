---
title: "Jacobian matrix"
aliases: ["자코비안", "자코비안 행렬", "Jacobian"]
tags:
  - calculus
  - linear_algebra
  - differentitation
---

다이얼 두 개($x$, $y$)를 돌리면 계기판 숫자 두 개($f_1$, $f_2$)가 함께 바뀌는 기계가 있다고 하자. 이 기계는 두 숫자를 다음 규칙으로 계산한다.

$$
\mathbf{f}\left(\begin{bmatrix}x\\y\end{bmatrix}\right)=\begin{bmatrix}f_{1}(x,y)\\f_{2}(x,y)\end{bmatrix}=\begin{bmatrix}x^{2}y\\5x+\sin y\end{bmatrix}
$$

지금 다이얼은 $(x,y)=(1,0)$ 에 놓여 있고, 계기판은 $(0,5)$ 를 가리킨다. 여기서 다이얼을 아주 조금 움직였을 때 두 계기판 숫자가 각각 얼마나 바뀔지 미리 계산하고 싶다. 신경망 학습에서도 같은 계산을 매 단계 반복한다. 층의 입력 벡터나 파라미터를 아주 조금 바꿨을 때 출력 벡터와 loss 가 얼마나 바뀌는지 알아야 파라미터를 업데이트할 수 있기 때문이다.

# 다변수 함수의 미분과 선형 근사

입력이 숫자 하나이고 출력도 숫자 하나인 함수 $f(x)$ 라면 미분 $f'(a)$ 하나로 충분하다. 입력을 기준점 $a$ 에서 아주 작은 값 $h$ 만큼 움직였을 때 출력의 변화는 일차식으로 어림할 수 있다.

$$
f(a+h)\approx f(a)+f'(a)\,h
$$

기계 예제처럼 입력이 여러 개이고 출력도 여러 개라면 숫자 하나로는 변화를 다 적을 수 없다. 입력 $x$ 를 바꿀 때 $f_1$ 과 $f_2$ 가 변하는 비율, 입력 $y$ 를 바꿀 때 $f_1$ 과 $f_2$ 가 변하는 비율까지 총 $2\times 2=4$ 개의 변화율이 생긴다. 이 변화율들을 행렬 하나로 모아 놓은 것이 Jacobian matrix 다.

기준점 $\mathbf{a}$ 에서 입력을 작은 벡터 $\mathbf{h}$ 만큼 움직였을 때의 출력은 Jacobian matrix $\mathbf{J}_{\mathbf{f}}(\mathbf{a})$ 로 어림한다.

$$
\mathbf{f}(\mathbf{a}+\mathbf{h})\approx\mathbf{f}(\mathbf{a})+\mathbf{J}_{\mathbf{f}}(\mathbf{a})\,\mathbf{h}
$$

기준점 $\mathbf{a}$ 근처의 좁은 범위에서는 복잡한 비선형 함수도 행렬 $\mathbf{J}_{\mathbf{f}}(\mathbf{a})$ 를 곱하는 일차식처럼 행동한다. 이렇게 기준점 근처에서 함수를 일차식으로 바꿔 어림하는 방법을 선형 근사(linear approximation)라고 부른다.

# Jacobian matrix 의 정의와 구조

## 원소별 편미분과 행렬 크기

함수 $\mathbf{f}:\mathbb{R}^{n}\rightarrow\mathbb{R}^{m}$ 은 $n$ 차원 입력 벡터 $\mathbf{x}=(x_1,\dots,x_n)$ 를 받아 $m$ 차원 출력 벡터를 내놓는다. 출력의 각 성분을 따로 떼어 보면 $m$ 개의 실숫값 함수가 나란히 놓인 셈이다.

$$
\mathbf{f}(\mathbf{x})=\begin{bmatrix}f_{1}(\mathbf{x})\\\vdots\\f_{m}(\mathbf{x})\end{bmatrix}
$$

이 함수의 Jacobian matrix $\mathbf{J}$ 는 $m\times n$ 행렬이고, $(i,j)$ 원소는 출력 $f_i$ 를 입력 $x_j$ 로 미분한 [[partial derivatives|편미분]]이다.

$$
\mathbf{J}_{ij}=\frac{\partial f_{i}}{\partial x_{j}}
$$

편미분은 다른 입력 변수를 모두 고정한 상태에서 $x_j$ 하나만 아주 조금 바꿨을 때 출력 $f_i$ 가 변하는 비율이다. **Jacobian 의 행 수는 출력 개수 $m$ 이고 열 수는 입력 개수 $n$ 이다.** 그래야 $n$ 차원 입력 변화 $\mathbf{h}$ 에 $m\times n$ 행렬 $\mathbf{J}$ 를 곱했을 때 $m$ 차원 출력 변화 $\mathbf{J}\mathbf{h}$ 가 나온다.

전체 행렬을 펼치면 같은 행렬을 가로 방향과 세로 방향으로 각각 읽을 수 있다.

$$
\mathbf{J}=\begin{bmatrix}\dfrac{\partial f_{1}}{\partial x_{1}}&\cdots&\dfrac{\partial f_{1}}{\partial x_{n}}\\\vdots&\ddots&\vdots\\\dfrac{\partial f_{m}}{\partial x_{1}}&\cdots&\dfrac{\partial f_{m}}{\partial x_{n}}\end{bmatrix}=\begin{bmatrix}\nabla f_{1}^{\top}\\\vdots\\\nabla f_{m}^{\top}\end{bmatrix}=\begin{bmatrix}\dfrac{\partial\mathbf{f}}{\partial x_{1}}&\cdots&\dfrac{\partial\mathbf{f}}{\partial x_{n}}\end{bmatrix}
$$

- **$i$ 번째 행**
	- 출력 성분 $f_i$ 하나가 입력 $x_1,\dots,x_n$ 각각에 얼마나 민감한지를 가로로 늘어놓은 벡터다.
	- 실숫값 함수 $f_i$ 의 [[gradient]] $\nabla f_i$ 는 열벡터로 쓰는 관례가 있어서, 행에 넣을 때 전치 기호 $\top$ 를 붙인다.
- **$j$ 번째 열**
	- 입력 성분 $x_j$ 하나를 바꿨을 때 출력 $f_1,\dots,f_m$ 이 각각 얼마나 바뀌는지를 세로로 세운 벡터 $\dfrac{\partial\mathbf{f}}{\partial x_j}$ 다.

gradient 와 Jacobian 의 관계는 [Difference between gradient and Jacobian](https://math.stackexchange.com/questions/1519367/difference-between-gradient-and-jacobian) 에 정리되어 있다.

## 입력과 출력 형태에 따른 모양

"행 수는 출력 개수, 열 수는 입력 개수" 규칙을 입력이나 출력이 스칼라인 경우까지 적용하면 익숙한 미분들이 모두 Jacobian 의 특수한 형태가 된다.

| 입력 | 출력 | Jacobian 크기 | 익숙한 이름 |
| --- | --- | --- | --- |
| 스칼라 $x$ | 스칼라 $f$ | $1\times 1$ | 일변수 함수의 미분 $f'(x)$ |
| 벡터 $\mathbf{x}\in\mathbb{R}^n$ | 스칼라 $f$ | $1\times n$ (행벡터) | gradient 의 transpose $\nabla f^{\top}$ |
| 스칼라 $x$ | 벡터 $\mathbf{f}\in\mathbb{R}^m$ | $m\times 1$ (열벡터) | 성분별 미분 벡터 (곡선의 속도 벡터) |
| 벡터 $\mathbf{x}\in\mathbb{R}^n$ | 벡터 $\mathbf{f}\in\mathbb{R}^m$ | $m\times n$ | Jacobian matrix |

신경망에서 loss 는 숫자 하나이므로 파라미터에 대한 loss 의 미분은 $1\times n$ 행벡터다. 반면 신경망의 한 층은 벡터를 받아 벡터를 내놓으므로 $m\times n$ Jacobian 행렬을 갖는다. 실숫값 함수의 이차 미분을 모은 [[Hessian matrix]] 도 같은 틀로 해석할 수 있다. gradient $\nabla f:\mathbb{R}^n\rightarrow\mathbb{R}^n$ 를 하나의 벡터 함수로 보고 그 Jacobian 을 구하면 $n\times n$ Hessian matrix 가 된다.

# 기계 예제의 계산과 입력 민감도

## 편미분 계산과 선형 근사 확인

기계 예제 $\mathbf{f}(x,y)=(x^2y,\;5x+\sin y)$ 의 네 칸을 하나씩 채운다. $x$ 로 편미분할 때는 $y$ 를 상수로, $y$ 로 편미분할 때는 $x$ 를 상수로 둔다.

1. $\dfrac{\partial f_1}{\partial x}=2xy$ ($x^2y$ 에서 $y$ 는 상수)
2. $\dfrac{\partial f_1}{\partial y}=x^2$ ($x^2y$ 에서 $x^2$ 은 상수)
3. $\dfrac{\partial f_2}{\partial x}=5$ ($5x+\sin y$ 에서 $\sin y$ 는 상수)
4. $\dfrac{\partial f_2}{\partial y}=\cos y$ ($5x+\sin y$ 에서 $5x$ 는 상수)

첫 행에 $f_1$ 의 편미분을, 둘째 행에 $f_2$ 의 편미분을 넣으면 함수 전체의 Jacobian 이 나온다.

$$
\mathbf{J}_{\mathbf{f}}(x,y)=\begin{bmatrix}2xy&x^{2}\\5&\cos y\end{bmatrix}
$$

**Jacobian 의 성분은 입력에 따라 달라지므로, 구체적인 기준점을 대입해야 숫자 행렬이 된다.** 현재 다이얼 위치인 $(1,0)$ 을 대입하면 다음과 같다.

$$
\mathbf{J}_{\mathbf{f}}(1,0)=\begin{bmatrix}0&1\\5&1\end{bmatrix}
$$

이 행렬이 출력 변화를 얼마나 정확히 어림하는지 변화량 크기가 다른 두 경우로 확인한다.

- **작은 변화 $\mathbf{h}=(0.01,\,0.02)$**
	- Jacobian 으로 어림한 출력 변화는 $\mathbf{J}\mathbf{h}=(0\cdot 0.01+1\cdot 0.02,\;5\cdot 0.01+1\cdot 0.02)=(0.02,\;0.07)$ 이다.
	- 실제 출력은 $\mathbf{f}(1.01,\,0.02)=(1.0201\times 0.02,\;5.05+\sin 0.02)\approx(0.020402,\;5.069999)$ 이고, $\mathbf{f}(1,0)=(0,5)$ 를 빼면 실제 변화는 약 $(0.0204,\,0.0700)$ 이다.
	- 어림값과 실제 값이 소수 셋째 자리까지 일치한다.
- **큰 변화 $\mathbf{h}=(1,\,1)$**
	- Jacobian 으로 어림한 출력 변화는 $\mathbf{J}\mathbf{h}=(0\cdot 1+1\cdot 1,\;5\cdot 1+1\cdot 1)=(1,\;6)$ 이다.
	- 실제 출력은 $\mathbf{f}(2,\,1)=(4,\;10+\sin 1)\approx(4,\;10.84)$ 이고, 실제 변화는 약 $(4,\;5.84)$ 다.
	- 첫째 성분에서 어림값 $1$ 과 실제 변화 $4$ 가 $3$ 만큼 어긋난다.

**Jacobian 의 선형 근사는 기준점 근처의 작은 변화에서만 정확하고, 변화가 커지면 비선형 오차가 빠르게 커진다.**

## 입력 민감도 해석과 머신러닝 응용

행렬 $\mathbf{J}_{\mathbf{f}}(1,0)$ 의 첫째 열은 $(0,5)^{\top}$ 이다. 다이얼 $x$ 를 $0.01$ 만큼 돌릴 때 $f_1$ 은 거의 변하지 않지만, $f_2$ 는 $5$ 배인 $0.05$ 만큼 변한다. 이처럼 Jacobian 의 각 원소는 특정 입력이 특정 출력을 얼마나 크게 바꾸는지 나타내는 민감도다.

학습된 모델의 출력을 입력에 대해 미분하면 이 민감도를 두 가지 문제에 그대로 쓸 수 있다.

- **입력 attribution**
	- 분류 모델의 정답 클래스 점수나 언어 모델의 다음 토큰 log-probability 처럼 스칼라 출력 하나를 고르고 입력(픽셀이나 토큰 embedding)으로 미분한다.
	- 출력이 하나이므로 Jacobian 의 한 행, 즉 입력에 대한 gradient 가 나오고, 이 값이 큰 위치가 출력에 큰 영향을 준 입력이다.
	- 이 값을 시각화한 기법이 saliency map 같은 gradient 기반 설명 방법이다.
- **모델의 robustness**
	- 입력에 대한 Jacobian 의 원소가 크면 작은 입력 변화 $\mathbf{h}$ 에도 출력 변화 $\mathbf{J}\mathbf{h}$ 가 커진다.
	- 사람 눈에 보이지 않는 작은 노이즈로 모델 예측을 바꾸는 adversarial example 이 이 성질을 이용한다.
	- 반대로 학습할 때 입력 Jacobian 의 모든 원소를 제곱해 더한 값(Frobenius norm 의 제곱)을 loss 에 더하면, 입력이 조금 바뀌어도 출력이 덜 변하는 모델을 얻는다.
	- Contractive Autoencoder(Rifai et al., 2011)와 Jacobian regularization(Hoffman et al., 2019)이 이 방식을 사용한다.

# Jacobian 행렬식과 넓이 변화

## 작은 정사각형의 변환과 부호의 뜻

입력과 출력의 차원이 같으면($m=n$) Jacobian 은 정사각행렬이 되어 [[determinant|행렬식]](determinant)을 구할 수 있다. 이 값을 Jacobian determinant 라고 부르며, 흔히 줄여서 "Jacobian" 이라고도 부른다.

행렬식의 기하학적 뜻은 행렬을 곱했을 때 넓이(3 차원 이상이면 부피)가 몇 배가 되는지다. Jacobian 은 기준점 근처에서 함수가 하는 일을 행렬 하나로 어림한 것이므로, Jacobian determinant 는 기준점 근처의 아주 작은 영역이 함수를 거친 뒤 넓이가 몇 배로 바뀌는지 알려 준다.

기계 예제의 Jacobian 행렬식을 구하고 점 $(1,0)$ 을 대입한다.

$$
\det\mathbf{J}_{\mathbf{f}}(x,y)=2xy\cos y-5x^{2},\qquad\det\mathbf{J}_{\mathbf{f}}(1,0)=-5
$$

다음 그림은 점 $(1,0)$ 에서 입력 쪽 변화량 $\mathbf{h}$ 의 단위 정사각형(청록색 화살표 $(1,0)$, 주황색 화살표 $(0,1)$)이 출력 쪽 $\mathbf{J}\mathbf{h}$ 의 평행사변형(청록색 화살표 $(0,5)$, 주황색 화살표 $(1,1)$)으로 옮겨지는 모양을 보여 준다.

![[img-0a081eeb5d.png|800]]

결과값 $-5$ 에서 두 가지를 읽는다.

1. **절댓값 $5$**: 왼쪽의 넓이 $1$ 인 정사각형이 오른쪽에서 넓이 $5$ 인 평행사변형으로 $5$ 배 커졌다.
2. **음수 부호**: 왼쪽에서는 청록색 화살표에서 주황색 화살표로 반시계 방향으로 돌지만, 오른쪽에서는 시계 방향으로 뒤집혔다.

## 적분의 변수 변환과 극좌표

Jacobian determinant 는 다중 적분에서 좌표를 바꿀 때 넓이 보정 계수로 쓰인다. 직교좌표 $(x,y)$ 를 극좌표 $(r,\theta)$ 로 바꾸는 함수 $x=r\cos\theta$, $y=r\sin\theta$ 의 Jacobian 과 행렬식은 다음과 같다.

$$
\mathbf{J}=\begin{bmatrix}\dfrac{\partial x}{\partial r}&\dfrac{\partial x}{\partial\theta}\\\dfrac{\partial y}{\partial r}&\dfrac{\partial y}{\partial\theta}\end{bmatrix}=\begin{bmatrix}\cos\theta&-r\sin\theta\\\sin\theta&r\cos\theta\end{bmatrix},\qquad\det\mathbf{J}=r\cos^{2}\theta+r\sin^{2}\theta=r
$$

그래서 극좌표 적분에서는 $dx\,dy$ 자리에 $r\,dr\,d\theta$ 를 쓴다. $(r,\theta)$ 공간에서 가로 $dr$, 세로 $d\theta$ 인 작은 직사각형이 $xy$ 평면에서는 넓이 $r\,dr\,d\theta$ 인 조각이 된다. 원점에서 멀어질수록($r$ 이 클수록) 같은 각도 $d\theta$ 가 더 긴 호를 이루므로 조각의 넓이도 커진다.

## 확률 밀도 변환과 normalizing flow

생성 모델 가운데에는 표준 정규분포 같은 단순한 분포에서 뽑은 $\mathbf{z}$ 를 신경망 $\mathbf{g}$ 로 변환해 데이터 $\mathbf{x}=\mathbf{g}(\mathbf{z})$ 를 만드는 모델이 있다. 이때 데이터 $\mathbf{x}$ 의 확률 밀도 $p_{\mathbf{x}}(\mathbf{x})$ 를 구하려면 변환 전 분포의 밀도 $p_{\mathbf{z}}(\mathbf{z})$ 에 Jacobian determinant 를 반영해야 한다.

확률의 총합은 변환 전후에 변하지 않는다. 만약 $\mathbf{g}$ 가 어떤 작은 영역의 넓이를 $5$ 배로 늘리면 같은 양의 확률이 $5$ 배 넓은 영역에 퍼지므로 확률 밀도는 $1/5$ 로 줄어든다. 반대로 넓이가 줄어들면 밀도는 커진다. 이를 로그 형태로 쓰면 다음과 같다.

$$
\log p_{\mathbf{x}}(\mathbf{x})=\log p_{\mathbf{z}}(\mathbf{z})-\log\left\lvert\det\mathbf{J}_{\mathbf{g}}(\mathbf{z})\right\rvert
$$

normalizing flow 는 이 식으로 log-likelihood 를 정확히 계산해서 학습한다. **일반적인 $n\times n$ 행렬의 행렬식은 $n^3$ 에 비례하는 연산이 필요하므로, 이미지처럼 차원 $n$ 이 수만 이상이면 그대로 계산할 수 없다.** 그래서 RealNVP 나 Glow 같은 모델은 각 층의 Jacobian 이 삼각 행렬이 되도록 구조를 설계한다. 삼각 행렬의 행렬식은 대각 원소들의 곱이므로 $n$ 번의 곱셈만으로 끝난다.

# 합성 함수의 Jacobian 과 chain rule

## 기계 예제에 두 번째 단계 연결하기

기계 예제 $\mathbf{f}(x,y)=(x^2y,\;5x+\sin y)$ 의 계기판 숫자 두 개를 $(u,v)$ 라 하고, 이 값을 받아 최종 점수 하나를 계산하는 두 번째 장치 $g(u,v)=u+v^2$ 를 이어 붙인다. 우리가 구하려는 목표는 다이얼 $(x,y)$ 를 아주 조금 움직였을 때 최종 점수 $g$ 가 얼마나 바뀌는지다. 그런데 $g$ 는 $(x,y)$ 에 직접 붙어 있지 않고 $(x,y)\rightarrow(u,v)\rightarrow g$ 순서로 이어져 있다.

일변수 미분의 [[chain rule (calculus)|chain rule]] $\dfrac{dz}{dx}=\dfrac{dz}{dy}\dfrac{dy}{dx}$ 에서 숫자 곱셈을 행렬 곱셈으로 바꾸면 다변수 합성 함수의 Jacobian 이 된다.

1. 기준점 $(x,y)=(1,0)$ 에서 첫째 장치의 출력은 $(u,v)=\mathbf{f}(1,0)=(0,5)$ 다.
2. 둘째 장치의 Jacobian 은 $\mathbf{J}_g(u,v)=\begin{bmatrix}1&2v\end{bmatrix}$ 이고, 실제로 받은 입력 $(0,5)$ 를 대입하면 $\mathbf{J}_g(0,5)=\begin{bmatrix}1&10\end{bmatrix}$ 이 된다.
3. 두 Jacobian 을 마지막 단계부터 왼쪽에 놓고 곱한다.

$$
\mathbf{J}_{g\circ\mathbf{f}}(1,0)=\mathbf{J}_{g}(0,5)\,\mathbf{J}_{\mathbf{f}}(1,0)=\begin{bmatrix}1&10\end{bmatrix}\begin{bmatrix}0&1\\5&1\end{bmatrix}=\begin{bmatrix}50&11\end{bmatrix}
$$

다이얼 $x$ 를 $0.01$ 돌리면 최종 점수는 약 $0.5$ 변하고, 다이얼 $y$ 를 $0.01$ 돌리면 약 $0.11$ 변한다. **합성 함수의 각 Jacobian 은 원래 입력이 아니라 그 함수가 실제로 받은 중간 출력에서 계산해야 한다.** 만약 둘째 장치에 중간 출력 $(0,5)$ 대신 원래 입력 $(1,0)$ 을 넣으면 $\begin{bmatrix}1&0\end{bmatrix}$ 이 되어 완전히 틀린 답이 나온다.

## 여러 층의 합성과 역전파의 계산 순서

신경망은 이런 함수를 수십 개 이어 붙인 합성 함수다. 입력 $\mathbf{x}\in\mathbb{R}^{n}$ 에서 출력 $\mathbf{o}\in\mathbb{R}^{m}$ 까지 네 함수를 차례로 통과하는 합성 함수 $\mathbf{f}=\mathbf{f}_{4}\circ\mathbf{f}_{3}\circ\mathbf{f}_{2}\circ\mathbf{f}_{1}$ 이 있다고 하자.

```mermaid
flowchart LR
    x["입력 x (n차원)"] -->|"f₁"| x2["x₂ (m₁차원)"]
    x2 -->|"f₂"| x3["x₃ (m₂차원)"]
    x3 -->|"f₃"| x4["x₄ (m₃차원)"]
    x4 -->|"f₄"| o["출력 o (m차원)"]
```

각 단계의 Jacobian 크기는 차례로 $m_1\times n$, $m_2\times m_1$, $m_3\times m_2$, $m\times m_3$ 이다. 전체 Jacobian 은 마지막 단계부터 왼쪽에 놓고 곱한다.

$$
\mathbf{J}_{\mathbf{f}}(\mathbf{x})=\frac{\partial\mathbf{o}}{\partial\mathbf{x}}=\mathbf{J}_{\mathbf{f}_{4}}(\mathbf{x}_{4})\,\mathbf{J}_{\mathbf{f}_{3}}(\mathbf{x}_{3})\,\mathbf{J}_{\mathbf{f}_{2}}(\mathbf{x}_{2})\,\mathbf{J}_{\mathbf{f}_{1}}(\mathbf{x})
$$

이 식에서 두 가지 구조적 성질이 드러난다.

1. 행렬 크기가 $(m\times m_3)(m_3\times m_2)(m_2\times m_1)(m_1\times n)$ 으로 맞물려 최종 크기가 $m\times n$ 이 되고, 순서를 바꾸면 곱셈 자체가 정의되지 않는다.
2. 각 Jacobian 이 그 단계의 중간 입력($\mathbf{x}_2,\mathbf{x}_3,\mathbf{x}_4$)에 의존하므로, 입력부터 순방향으로 계산하면서 중간 결과를 저장해 두어야 한다.

신경망 학습에서는 마지막 출력 $\mathbf{o}$ 가 스칼라 loss 다($m=1$). 그러면 맨 왼쪽 Jacobian $\mathbf{J}_{\mathbf{f}_4}(\mathbf{x}_4)$ 는 $1\times m_3$ 행벡터가 된다. 행렬 곱셈은 어느 쪽부터 묶어도 결과가 같지만, 필요한 연산량과 메모리는 계산 순서에 따라 극단적으로 달라진다.

- **왼쪽(출력 쪽)부터 곱할 때**
	- 매 단계가 "행벡터 × 행렬 = 행벡터" 로 계산된다.
	- 중간 결과가 매번 벡터 하나뿐이므로 연산량과 메모리가 적다.
- **오른쪽(입력 쪽)부터 곱할 때**
	- $\mathbf{J}_{\mathbf{f}_2}\mathbf{J}_{\mathbf{f}_1}$ 처럼 행렬끼리 곱해야 한다.
	- 중간 행렬의 열 수가 입력 차원 $n$ 이므로 파라미터가 수십억 개인 모델에서는 메모리에 저장할 수 없다.

**[[backpropagation]] 이 출력에서 입력 방향으로 거꾸로 진행하는 이유는 왼쪽부터 곱해야 중간 결과가 벡터로 유지되기 때문이다.**

이렇게 행벡터에 Jacobian 을 곱하는 연산을 vector-Jacobian product(VJP)라고 부른다. $l$ 번째 층의 activation 이전 값 $z^l$ 에 대한 loss 의 미분을 $\delta^l$ 이라고 하자. 선형 층 $z^{l+1}=w^{l+1}a^{l}+b^{l+1}$ 의 Jacobian 은 $w^{l+1}$ 이고, activation $a^l=\sigma(z^l)$ 의 Jacobian 은 대각 원소가 $\sigma'(z^l)$ 인 행렬 $\operatorname{diag}(\sigma'(z^l))$ 이다. 역전파의 오차 전달 식 $\delta^{l}=\left(\left(w^{l+1}\right)^{\top}\delta^{l+1}\right)\odot\sigma'(z^{l})$ 를 행벡터로 바꿔 쓰면 VJP 두 번과 같다.

$$
\left(\delta^{l}\right)^{\top}=\left(\delta^{l+1}\right)^{\top}\,w^{l+1}\,\operatorname{diag}\big(\sigma'(z^{l})\big)
$$

**딥러닝 프레임워크는 Jacobian 행렬을 메모리에 만들지 않고, 출력 쪽 gradient 벡터에 Jacobian 을 곱한 결과만 직접 계산한다.** hidden 차원이 $4096$ 이고 sequence 길이가 $2048$ 인 Transformer 층은 입력과 출력이 각각 $2048\times 4096\approx 840$ 만 개 숫자다. 이 층의 Jacobian 을 그대로 만들면 약 $7\times 10^{13}$ 칸이 되어 fp32 기준으로 약 $280\text{ TB}$ 메모리가 필요하다. 그래서 [[PyTorch]] 의 각 연산은 Jacobian 행렬 대신 VJP 만 계산하는 `backward` 함수를 구현한다.

## 깊은 모델의 gradient 변화와 residual connection

역전파에서 입력에 가까운 층에 도착하는 gradient 는 그 위 모든 층의 Jacobian 을 차례로 곱한 결과다. 각 층의 Jacobian 이 벡터 크기를 조금만 바꾸더라도, 층이 수십 개 이상 쌓이면 그 배율이 거듭제곱으로 누적된다.

다음 그래프는 층마다 gradient 크기에 같은 배율을 곱했을 때 지나간 층 수($0$–$100$)에 따른 gradient 크기 변화를 로그 눈금으로 그린 것이다. 주황색 선은 층마다 $1.1$ 배, 청록색 선은 층마다 $0.9$ 배, 점선은 처음 크기 $1$ 을 나타낸다.

![[img-86146ad8c8.png|700]]

층마다 $0.9$ 배씩 줄어들면 $100$ 층을 지났을 때 gradient 크기가 $0.9^{100}\approx 2.7\times 10^{-5}$ 로 작아져 앞쪽 층 파라미터가 거의 업데이트되지 않는다. 반대로 층마다 $1.1$ 배씩 커지면 $100$ 층에서 $1.1^{100}\approx 1.4\times 10^{4}$ 로 급격히 커져 학습이 불안정해진다. 이것이 [[vanishing gradients|vanishing / exploding gradients]] 문제다.

[[skip connection|residual connection]] 은 층의 출력을 $\mathbf{y}=\mathbf{x}+F(\mathbf{x})$ 로 구성해 이 문제를 Jacobian 수준에서 완화한다.

$$
\frac{\partial\mathbf{y}}{\partial\mathbf{x}}=I+\mathbf{J}_{F}(\mathbf{x})
$$

여기서 $I$ 는 대각선만 $1$ 인 단위 행렬(identity matrix)로, 벡터를 크기 변화 없이 그대로 통과시킨다. $\mathbf{J}_F(\mathbf{x})$ 가 $0$ 에 가까워져도 $I$ 항이 남기 때문에 gradient 가 $0$ 으로 사라지지 않는다. 또 $\mathbf{J}_F$ 가 작은 동안에는 각 층의 Jacobian 이 단위 행렬에 가까워져 여러 층을 곱해도 gradient 크기가 급격히 변하지 않는다. 대부분의 LLM 이 쓰는 Pre-LN Transformer 는 이 덧셈 경로에 정규화를 끼우지 않아 $I$ 항이 그대로 유지된다.

# Element-wise 연산과 softmax 의 Jacobian

## Element-wise 연산과 대각 행렬

신경망에는 두 벡터의 덧셈 $\mathbf{w}+\mathbf{x}$, 같은 위치끼리의 곱 $\mathbf{w}\odot\mathbf{x}$, 각 원소에 따로 적용하는 activation $\sigma(\mathbf{x})$ 처럼 같은 위치 원소끼리만 계산하는 연산이 많다. 이런 연산을 element-wise 연산이라고 부른다.

element-wise 연산에서는 출력의 $i$ 번째 성분 $y_i$ 가 입력의 $i$ 번째 성분에만 의존한다. 따라서 $i\neq j$ 이면 $w_j$ 를 바꿔도 $y_i$ 는 변하지 않는다.

$$
\frac{\partial y_i}{\partial w_j}=0\qquad(i\neq j)
$$

Jacobian 에서 대각선 바깥 원소가 모두 $0$ 이 되므로 [[diagonal matrix|대각 행렬]]이 나온다. 예를 들어 $\mathbf{w},\mathbf{x}\in\mathbb{R}^3$ 이고 $\mathbf{y}=\mathbf{w}\odot\mathbf{x}$ 이면 $\dfrac{\partial y_i}{\partial w_i}=x_i$ 이고 나머지 원소는 $0$ 이다.

$$
\frac{\partial\mathbf{y}}{\partial\mathbf{w}}=\begin{bmatrix}x_1&0&0\\0&x_2&0\\0&0&x_3\end{bmatrix}=\operatorname{diag}(\mathbf{x})
$$

자주 쓰는 element-wise 연산의 Jacobian 을 모으면 다음과 같다.

| 연산 | Jacobian | 이유 |
| --- | --- | --- |
| $\mathbf{y}=\mathbf{w}\odot\mathbf{x}$ | $\dfrac{\partial\mathbf{y}}{\partial\mathbf{w}}=\operatorname{diag}(\mathbf{x})$ | $\dfrac{\partial(w_ix_i)}{\partial w_i}=x_i$ |
| $\mathbf{y}=\mathbf{w}+\mathbf{x}$ | $\dfrac{\partial\mathbf{y}}{\partial\mathbf{w}}=I$ | $\dfrac{\partial(w_i+x_i)}{\partial w_i}=1$ |
| $\mathbf{y}=\mathbf{x}$ (항등 함수) | $\dfrac{\partial\mathbf{y}}{\partial\mathbf{x}}=I$ | $\dfrac{\partial x_i}{\partial x_i}=1$ |
| $\mathbf{y}=\sigma(\mathbf{x})$ (원소별 activation) | $\operatorname{diag}\big(\sigma'(x_1),\dots,\sigma'(x_n)\big)$ | $y_i=\sigma(x_i)$ 는 $x_i$ 에만 의존 |

대각 행렬은 대각선의 $n$ 개 값만 저장하면 되므로 실제 구현에서는 $n\times n$ 행렬을 만들지 않는다. 대각선 값을 벡터로 두고 같은 위치끼리 곱하면 행렬 곱셈과 동일한 결과가 나온다. 역전파에서 activation 을 지날 때 gradient 에 $\sigma'(z)$ 를 원소별로 곱하는($\odot$) 이유가 여기에 있다.

## softmax 와 cross-entropy 의 결합

[[softmax function|softmax]] 는 원소마다 $e^{x_i}$ 를 계산하지만 element-wise 연산이 아니다. **softmax 는 정규화 분모 $\sum_k e^{x_k}$ 에 모든 입력이 들어가므로 대각 행렬이 아니다.**

$$
s_i=\frac{e^{x_i}}{\sum_{k}e^{x_k}},\qquad\frac{\partial s_i}{\partial x_j}=s_i\left(\delta_{ij}-s_j\right)
$$

여기서 $\delta_{ij}$ 는 $i=j$ 이면 $1$, 다르면 $0$ 인 기호다. 대각선 바깥 칸도 모두 $0$ 이 아니므로 모든 칸이 채워진 $n\times n$ 행렬이 된다. 언어 모델에서 어휘 크기가 약 $13$ 만 개라면 토큰 하나마다 약 $170$ 억 칸짜리 Jacobian 이 생긴다.

그런데 softmax 뒤에 [[cross-entropy]] loss 를 붙이면 이 거대한 행렬을 만들 필요가 사라진다. 정답 토큰 위치만 $1$ 인 one-hot 벡터를 $\mathbf{y}$ 라 하고 loss 를 $L=-\sum_i y_i\log s_i$ 로 두자. 최종 목표는 softmax 입력(logit) $x_j$ 에 대한 loss 의 미분이지만, loss 는 $x_j$ 에 직접 붙어 있지 않고 $\mathbf{x}\rightarrow\mathbf{s}\rightarrow L$ 순서로 이어져 있다. 그래서 chain rule 로 가운데 고리 $\mathbf{s}$ 를 거쳐 미분한다.

1. loss 를 softmax 출력으로 미분하면 $1\times n$ 행벡터의 각 성분은 $\dfrac{\partial L}{\partial s_i}=-\dfrac{y_i}{s_i}$ 다.
2. 이 행벡터에 softmax 의 Jacobian 을 곱한다(VJP).

$$
\frac{\partial L}{\partial x_j}=\sum_{i}\left(-\frac{y_i}{s_i}\right)s_i\left(\delta_{ij}-s_j\right)=-\sum_i y_i\delta_{ij}+s_j\sum_i y_i=-y_j+s_j
$$

마지막 단계에서는 $\sum_i y_i\delta_{ij}=y_j$ 이고 정답 분포의 합 $\sum_i y_i=1$ 이라는 성질을 썼다. 전체 벡터로 정리하면 다음과 같다.

$$
\frac{\partial L}{\partial\mathbf{x}}=\mathbf{s}-\mathbf{y}
$$

**softmax 와 cross-entropy 를 함께 미분하면 $170$ 억 칸 행렬을 거치지 않고 예측 확률에서 정답을 빼는 짧은 벡터 하나로 끝난다.** PyTorch 의 `F.cross_entropy` 가 확률이 아니라 softmax 이전의 logit 을 입력으로 받는 것도 이 때문이다. 두 연산을 한 번에 처리하면 이 단순한 gradient 를 바로 쓸 수 있고, 확률을 따로 구한 뒤 로그를 취할 때 생기는 수치 오차도 피할 수 있다.

# 부록: 추가 주제와 계산 도구

## 연속 시간 변환의 trace 와 Hutchinson 추정

변환을 이산적인 층이 아니라 연속적인 시간 흐름으로 보는 continuous normalizing flow 나 diffusion 모델의 likelihood 계산에서는 Jacobian 행렬식 대신 Jacobian 의 대각 원소 합인 trace 가 나타난다. 고차원 공간에서는 Jacobian 행렬 전체를 만들지 않고, 무작위 벡터와의 곱을 이용해 trace 를 어림하는 Hutchinson 추정을 사용한다.

## PyTorch 의 Jacobian 계산 API

일반 학습에서는 VJP 만으로 충분하지만, 연구나 분석 과정에서 Jacobian 행렬 전체가 직접 필요할 때도 있다. PyTorch 의 `torch.func` 모듈은 두 가지 함수를 제공한다.

- **`torch.func.jacrev`**: 출력 쪽부터 곱하는 VJP 를 출력 개수만큼 반복해 Jacobian 을 구한다.
- **`torch.func.jacfwd`**: 입력 쪽부터 곱하는 Jacobian-vector product(JVP)를 입력 개수만큼 반복해 Jacobian 을 구한다.

출력이 입력보다 적으면 `jacrev` 가 빠르고, 출력이 입력보다 많으면 `jacfwd` 가 빠르다.

# References

- [Difference between gradient and Jacobian](https://math.stackexchange.com/questions/1519367/difference-between-gradient-and-jacobian) — Mathematics Stack Exchange
- Terence Parr, Jeremy Howard. [The Matrix Calculus You Need For Deep Learning](https://arxiv.org/abs/1802.01528), 2018 — Jacobian 모양 표와 element-wise 연산의 대각 Jacobian
- Salah Rifai et al. Contractive Auto-Encoders: Explicit Invariance During Feature Extraction. ICML 2011
- Judy Hoffman, Daniel A. Roberts, Sho Yaida. [Robust Learning with Jacobian Regularization](https://arxiv.org/abs/1908.02729), 2019
- Laurent Dinh, Jascha Sohl-Dickstein, Samy Bengio. [Density estimation using Real NVP](https://arxiv.org/abs/1605.08803), 2016
- [torch.func API](https://pytorch.org/docs/stable/func.api.html) — `jacrev`, `jacfwd`, `vjp`, `jvp`