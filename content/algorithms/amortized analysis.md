---
title: "amortized analysis"
tags: ["algorithm"]
---

# A) Amortized Analysis ?

amortized analysis 는 주어진 알고리즘을 실행할 때 얼마나 많은 자원 (특히 시간 또는 메모리) 가 필요한지를 분석하는 방법이다.

worst-case 런타임을 고려하는 방식이 너무 비관적이라고 생각된다면, amortized analysis 를 사용할 수 있다. 어떠한 임의의 알고리즘에 대해서, 어떤 연산은 자원적 측면에서 상당한 비용을 소모할 수 있지만, 반면 다른 연산은 그렇게 고비용을 소모하지 않을 수 있다. amortized analysis 은 알고리즘의 전반적인 연산 집합에 대해 비용이 높은 연산, 그리고 비용이 덜한 연산 모두를 함께 고려하는 기법이라 하겠다.

# B) 예시

## B.1) Dynamic Array

dynamic array 는 가끔 비싼 연산을 수행하지만 일반적으로 저렴한 연산을 수행할 수 있음을 amortized analysis 를 통해 확인할 수 있다.

`ArrayList` in Java 또는 `std::vector` in C++ 와 같은 dynamic array 는 자신이 보유한 크기보다 더 많은 원소가 입력되면 사이즈를 기존보다 두 배 불린다. 이 doubling 과정에서 $\Theta(n)$ 시간이 걸린다. 그러나 일반적으로 사이즈가 충분하다면 원소의 입력 (push) 은 상수 $\Theta(1)$ 시간이 걸린다. 예를 들어 $n$ 사이즈의 동적 배열에 $n+1$ 개의 원소를 입력하는 경우, 평균적으로 $\frac{n \Theta(1)+\Theta(n)}{n+1}=\Theta(1)$ 와 같은 상수 시간이 걸린다.

## B.2) Amortized Inference of VAE

[[machine_learning/deep_learning/Variational Autoencoder|Variational Autoencoder]] 는 학습이 완료된 모델의 경우 재활용할 수 있다. 예를 들어 [[collaborative filtering]] 방식에서 활용할 수 있는데, 학습된 데이터를 기반으로 비슷한 패턴을 활용하여 입력으로 주어진 새로운 유저의 선호도를 분석할 수 있다. 즉, 학습에는 많은 시간이 걸리지만, 재사용이 가능하므로 전반적 비용으로 보았을 때 저렴한 모델이라고 주장할 수 있는 것이다.

# C) References
