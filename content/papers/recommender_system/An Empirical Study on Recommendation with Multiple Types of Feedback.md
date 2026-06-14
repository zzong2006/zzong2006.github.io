---
tags: ["KDD", "LinkedIn", "multiple_feedback", "paper_review", "recommendation_system", "y2016"]
---

# A) An Empirical Study on Recommendation with Multiple Types of Feedback ?

이 논문에서는 generalized linear model ([[Generalized Linear Model|GLM]]) 기반의 추천을 중심으로 전개하고, linear model 에서 사용할 feature 는 [[matrix factorization|MF]] 와 같은 [[collaborative filtering|CF]] 모델에서 가져온다.

1. model combination
   개별적인 피드백 데이터를 통해 각각의 모델을 학습하고 이를 하나로 모으는 방식. 모델의 predicted response 를 합치거나 모델의 coefficients 를 합치는 방향으로 가능함 (물론 feature space 가 같아야하고 formulation 역시 동일해야 겠지만).
   예시) two feedback 에 대한 Logistic regression model: 좋아요 & 싫어요
2. sequential training based on [[Bayesian inference]]
   `좋아요` 데이터로 먼저 학습을 하고 학습한 모델을 prior 로 하여, `싫어요` 모델을 학습한다. 최종 모델은 싫어요 모델이지만 좋아요 모델에 의해 regularized 되는 형태로 생각할 수 있다. 여기서는 *prior combine* 이라 불린다.
3. joint training
   multiple feedback 타입을 하나의 training 문제로 보는 것이다. Joint training 은 여전히 하나의 메인 feedback 을 놓고 최적화를 진행하지만 세컨더리 feedback 을 두어서 constraints 으로 여겨 최적화 과정의 regularization 으로 작용하도록 한다.

# B) Methos

## B.1) (3) Joint Training

General Form

$$
\min _{\beta} \sum_{i=1}^{N} L\left(\mathbf{x}_{i}, y_{i}^{(1)}, \ldots, y_{i}^{(m)} ; \beta\right)
$$

Example) Linear combination of a [[logistic loss]] and a [[hinge loss]]

$$
\begin{aligned} L\left(\mathbf{x}_{i}, y_{i}^{(1)}, y_{i}^{(2)}\right)=& w_{1} \cdot \log \left(1+\exp \left(-y_{i}^{(1)} \cdot f\left(\mathbf{x}_{i}, \beta\right)\right)\right) \\ &+w_{2} \cdot \max \left(0, y_{i}^{(2)}\left(c+f\left(\mathbf{x}_{i}, \beta\right)\right)\right) \end{aligned}
$$

예시에서 $y_{i}^{(2)}$ 가 strong negative feedback 으로 생각할 수 있는데 (e.g. 싫어요), 그 이유는 - $y_{i}^{(2)}=1$ 로 가정할때 - 위 함수를 최소화 하기 위해서는 $f\left(\mathbf{x}_{i}, \beta\right) \leq-c$ 를 만족해야 하기 때문이다. 즉, 강제적으로 해당 예측에 대한 ranking score 를 낮춘다. 그래서 constrained optimization 으로 동작한다.

만약에 strong positive feedback 이라면 $\max \left(0, y_{i}^{(2)}\left(c-f\left(\mathbf{x}_{i}, \beta\right)\right)\right)$ 와 같이 hinge loss 를 바꿔주면 된다. 즉, $y_{i}^{(2)}=1$ 일 때 $f\left(\mathbf{x}_{i}, \beta\right) \geq c$ 을 만족시키는 것이다.

일반적으로 feedback 간에 서로 [[correlation]] 이 존재하면, 이것이 constraints 로 동작하여 학습에 도움을 준다. 특히 이런 correlation 은 실제 시나리오에서 유용한데, 왜냐하면 [[explicit feedback]] 은 [[implicit feedback]] 보다 훨씬 개수가 떨어지기 때문이다.

이 논문에서는 이를 *constrained regression*라고 부르고, 이러한 방법을 종종 [[machine learning|ML]] 에서는 [[transfer learning]] 이라고 부른다.

# C) Implementation

offline model 학습으로 진행했으며, 빠른 학습을 위해 coordinate gradient descent algorithm 을 사용했다. 그리고 step size 의 경우 $\nabla L$ 의 Lipschitz constant 의 역수를 step size 로 활용하였다.

online [[AB Test]] 과정에서는 분산 최적화 알고리즘인 [[alternating direction method of multipliers|ADMM]] 를 활용하여 모델 training 을 진행하였다.

# D) Conclusion

prior combine 방식은 real-world dataset 에서 잘 동작하지 않았다. Why? prior model 과 prior distribution 에 대한 가정이 real data 에서는 종종 성립하지 않는 경우가 있기 때문이다.

만약 유저 피드백 데이터가 충분하다면, model combine 방식이나 constrained regression 방식은 매우 비슷한 성능을 보였다. 그런데 어떤 한 피드백이 흔치 않고, 다른 피드백이 매우 많으면서 correlation 을 보인다면 constrained regression 방식이 model combine 보다 더 좋았다.

# E) Related

# F) References

* https://www.kdd.org/kdd2016/papers/files/adf0677-tangA.pdf
