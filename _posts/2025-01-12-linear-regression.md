---
layout: post
title: ML Recap - Linear Regression 
date: 2025-01-12 21:00:00
giscus_comments: true
categories: fundamental
toc:
  beginning: true
tags: machine-learning linear-regression
---

## Lasso Regression

Lasso 는 L1 정규화(Regularization) 라고 불리는 선형 회귀 모델이다.

이 모델의 특징으로는 variable selection 과 regularization 을 통해 모델의 예측 정확도와 interpretability 을 향상시키는 것이다.

### vs. Ridge Regression

Ridge regression 은 과적합을 방지하기 위해 회귀 계수(coefficient)의 제곱의 합을 작게 만들어 준다. 하지만, 이 방식은 변수 선택을 하지 않기 때문에 모델을 해석하는데 어려움이 있다.

반대로 Lasso 는 회귀 계수의 절대값의 합을 작게 만들어 준다. 이 방식은 특정 계수를 0으로 만들어서 예측에 영향을 가지 않도록 만들기 때문에 변수 선택 과정에서 이점이 있다.

![Ridge vs. Lasso](https://i.imgur.com/c62Oxj7.png){: width="100%"}

## References

Lasso Regression

- [Lasso Regression (wikipedia)](https://en.wikipedia.org/wiki/Lasso_(statistics))