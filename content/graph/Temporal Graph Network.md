---
title: "Temporal Graph Network"
tags: ["GNN", "graph", "deep_learning"]
---

# A) Temporal Graph Network ?

* Related Link
* 정의
	* dynamic graphs represented as sequences of timed events 를 학습하기 위한 general **encoder** 구조
* 소개
	* real-world 그래프들은 dynamic 하고 시간에 따라 진화한다. 이 dynamic graph 는 ordered list 또는 비동기적인 이벤트의 stream 로 표현될 수 있다 (e.g. 노드 또는 edge 의 삭제나 추가)
		* ![[img-ceb7bca638.png]]
	* 이러한 event 의 stream 은 신경망으로 구성된 encoder 에 입력되어 그래프의 각 노드를 표현하기 위한 embedding (time-dependent) 을 출력하고, embedding 은 다시 decoder 로 입력되어 특정 task 를 수행하기 위한 예측을 한다.
		* 그 [[recommendation_system/Recommendation System|RS]] 와 관련된 task 란 다음과 같다: 시간 $t$ 에서 노드 $i$ 와 $j$ 의 edge 를 가질 확률은 얼마인가?
		* 예시
			* ![[img-30029d3735.png]]
			* $t_1\sim t_7$ 까지의 edge 를 TGN 에 입력하고, $t_8$ 에서 노드 2 와 4 의 edge 를 가질 확률을 계산한다.
			* TGN 은 $t_8$ 에서 노드 2 와 4 의 embedding 을 계산하고, 이 둘을 concat 한 다음 decoder 에 입력하여 edge 를 가질 확률을 구한다.
* TGN main components
	* Memory
		* 모든 노드의 상태를 저장하는 공간이며, 노드의 과거 상호작용에 대한 representation 을 압축된 형태로 저장한다.
			* 이는 마치 [[Recurrent Neural Network]] 의 hidden state 와 비슷하다.
		* state vector $s_i(t)$ 라고, 각 node $i$ 에 대한 vector 가 존재한다.
			* 새로운 노드에 대해서는 zero vector 로 초기화
		* 각 노드에 대한 memory 가 parameter 가 아닌 state vector 이기 때문에 evaluation 과정에서도 업데이트될 수 있다.
	* Message Function: main mechanism of updating the memory
		* 시간 $t$ 에서 두 노드 $i$ 와 $j$ 가 상호작용 하는 동안, message function 은 $i$ 와 $j$ 를 위해 메모리를 업데이트하기 위한 메세지를 각각 계산한다.
			* 이는 [[graph/Graph Neural Network]] 의 message-passing 에서 계산되는 message 와 비슷한다.
		* 메시지 함수는 $i$ 와 $j$ 가 상호작용하기 이전의 시간 $t^{-}$ 에서의 state vector 와 $t$ 에서의 edge feature 를 입력으로 받는다
: $\begin{aligned}&\mathbf{m}_{i}(t)=\operatorname{msg}\left(\mathbf{s}_{i}\left(t^{-}\right),\mathbf{s}_{j}\left(t^{-}\right),t,\mathbf{e}_{ij}(t)\right)\\&\mathbf{m}_{j}(t)=\operatorname{msg}\left(\mathbf{s}_{j}\left(t^{-}\right),\mathbf{s}_{i}\left(t^{-}\right),t,\mathbf{e}_{ij}(t)\right)\end{aligned}$
	* Memory Updater
		* 새로운 메시지를 이용해서 메모리를 업데이트하는데 사용된다: $\mathbf{s}_{i}(t)=\operatorname{mem}\left(\mathbf{m}_{i}(t),\mathbf{s}_{i}\left(t^{-}\right)\right)$
		* 일반적으로 RNN 을 통해 구현된다.
	* Embedding
		* staleness problem 에 의해 발생하는 문제를 해결하기 위한 방법으로, 해당 시간대에 존재하는 target node 의 이웃 노드들을 집계 (aggregate) 하여 그 node 의 embedding 을 만든다.
			* [[staleness problem]] 란, 특정 대상을 업데이트하기 위해 해당 대상의 embedding 을 직접적으로 사용하는 방법으로부터 발생하는 문제점을 의미한다. 만약, 그 대상이 오랫동안 상호작용하지 않으면, 대상의 embedding 은 업데이트가 영원히 멈춰있을 것이고, 이후에 시간이 많이 흘러 다시 상호작용이 발생하면 그 사이의 gap 으로 부터 문제가 발생한다 ([[cold-start]] 사용자와 비슷)
* Computations performed by TGN on a batch of training data
	* 중간에 읽다가 졸려서 못읽겠음
	* ![[img-fea1923eea.png]]

# B) Related

* https://towardsdatascience.com/temporal-graph-networks-ab8f327f2efe

# C) Temporal Graph Network (TGN)

## C.1) 정의

Temporal Graph Network(TGN)은 **시간에 따라 변화하는 동적 그래프(dynamic graph)** 를 학습하기 위한 범용 **인코더 구조**이다.
이때, 동적 그래프는 시간 순서가 있는 이벤트의 나열 혹은 비동기적으로 발생하는 이벤트 스트림으로 표현된다.
예를 들어, 노드나 엣지가 추가되거나 삭제되는 상황이 이에 해당한다.

---

## C.2) 소개

실세계의 그래프는 정적인 구조를 가지지 않고 끊임없이 진화한다. 이러한 변화는 이벤트 스트림 형태로 표현할 수 있으며, 이 스트림을 신경망 기반 인코더에 입력하여 각 노드의 **시간 의존적 임베딩**을 생성한다.

이 임베딩은 다시 디코더로 전달되어 특정 예측 작업을 수행하는 데 활용된다.
대표적인 예시로 [[Recommendation System]] 관련 작업에서 다음과 같은 문제를 풀 수 있다:

* *특정 시각 $t$에서 노드 $i$와 $j$가 엣지를 형성할 확률은 얼마인가?*

### C.2.1) 예시

1. $t_1 \sim t_7$ 동안 발생한 엣지 정보를 TGN에 입력한다.
2. 이후 시각 $t_8$에서 노드 2와 4가 연결될 확률을 계산한다.
3. TGN은 $t_8$ 기준으로 두 노드의 임베딩을 생성하고 이를 결합(concatenate)하여 디코더에 전달, 최종적으로 엣지 존재 확률을 출력한다.

---

## C.3) TGN의 주요 구성 요소

### C.3.1) 메모리 (Memory)

* 모든 노드의 상태(state)를 저장하는 공간이다.
* 각 노드는 과거 상호작용 정보를 압축해 표현한 벡터 $s_i(t)$를 가진다. 이는 [[Recurrent Neural Network]]의 hidden state와 유사하다.
* 새로운 노드는 초기값으로 영벡터(zero vector)를 갖는다.
* 메모리는 학습 파라미터가 아닌 상태 벡터이므로 평가 과정에서도 업데이트될 수 있다.

---

### C.3.2) 메시지 함수 (Message Function)

메모리 갱신의 핵심 기제이다.

* 시각 $t$에 두 노드 $i$, $j$가 상호작용할 때, 메시지 함수는 두 노드 각각에 대한 메시지를 생성하여 메모리를 업데이트할 준비를 한다.
* 입력: 상호작용 직전 시점($t^-$)의 상태 벡터와 해당 시점 엣지 특성(feature).

$$\begin{aligned}
\mathbf{m}*{i}(t) &= \operatorname{msg}\big(\mathbf{s}*{i}(t^-), \mathbf{s}*{j}(t^-), t, \mathbf{e}*{ij}(t)\big) \\
\mathbf{m}*{j}(t) &= \operatorname{msg}\big(\mathbf{s}*{j}(t^-), \mathbf{s}*{i}(t^-), t, \mathbf{e}*{ij}(t)\big)
\end{aligned}$$


이는 [[graph/Graph Neural Network]]에서 사용되는 message-passing 개념과 유사하다.

---

### C.3.3) 메모리 업데이트 (Memory Updater)

새로운 메시지를 반영해 메모리를 갱신한다:

$$\mathbf{s}_i(t) = \operatorname{mem}(\mathbf{m}_i(t), \mathbf{s}_i(t^-))$$

일반적으로 RNN 기반 구조(GRU, LSTM 등)를 활용하여 구현된다.

---

### C.3.4) 임베딩 (Embedding Module)

**Staleness problem**(임베딩 값이 오랜 기간 갱신되지 않는 문제)을 해결하기 위해 설계된 모듈이다.

* 특정 시점에서 대상 노드를 직접 업데이트하지 않고, 해당 시간대 이웃들의 정보를 집계(aggregate)하여 새로운 임베딩을 형성한다.
* 만약 어떤 노드가 오랫동안 상호작용하지 않으면 그 임베딩은 고정된 채 남아있게 되고, 이는 이후 모델 성능 저하로 이어진다.
* 이러한 현상은 [[cold-start]] 문제와 유사하다.

---

## C.4) 학습 과정 요약

TGN은 배치 단위로 주어진 학습 데이터를 처리하며,
1. 이벤트 발생 순서에 따라 메시지를 계산하고,
2. 메모리를 갱신하며,
3. 최종적으로 타깃 시점에서 필요한 임베딩을 생성해 예측 작업(예: 링크 예측)을 수행한다.

---

## C.5) 참고 자료

* [Towards Data Science: Temporal Graph Networks](https://towardsdatascience.com/temporal-graph-networks-ab8f327f2efe) 
