---
title: "SentEval"
tags: ["machine_learning classification"]
---

# A) SentEval ?

sentence embedding 의 품질을 측정하는 라이브러리

# B) STS Benchmark (code review)

논문 “Improved Semantic Representations From Tree-Structured Long Short-Term Memory Networks” 을 참고한 벤치마크 방식이다.

## B.1) 데이터셋 준비

벤치마크에 사용할 데이터셋을 준비한다. 이때 서로 비교대상이 되는 두 문장의 임베딩을 서로 곱하거나 뺀다. 그리고 그 둘을 서로 이어붙여서 하나의 임베딩 벡터를 만든다.

**예시**  
아래의 `a` 와 `b` 는 `2 by 4` 크기를 가지는 데이터셋이라고 가정하자. 즉, 두개의 샘플이 존재하고 임베딩 벡터의 크기는 4 이다.

```python
>>> a - b
tensor([[ -3,  -4,  -5,  -6],
        [ -7,  -8,  -9, -10]])
>>> a * b
tensor([[  0,   5,  14,  27],
        [ 44,  65,  90, 119]])
>>> np.c_[(a - b), (a * b)]
array([[ -3,  -4,  -5,  -6,   0,   5,  14,  27],
       [ -7,  -8,  -9, -10,  44,  65,  90, 119]])
```

그런데 왜 임베딩을 서로 빼고 곱할까?  
논문의 내용을 인용하면 임베딩을 개별적으로 사용하는 것보다 서로 조합해서 모델 입력에 넣어주는것이 보다 효과가 좋았다고 한다.

### B.1.1) 레이블

일반적으로 Raw 레이블 $y$ 는 1 부터 K 사이의 값으로 주어진다. K 에 가까울수록 두 문장이 서로 유사하다는 의미다.

Raw 레이블이 실수값으로 주어졌다면, K 차원의 Spare target vector $p$ 로 바꾼다. 바꾸는 방법은 $y=r^T p$ 를 만족시키는 $p$ 를 아래와 같이 계산하는 것이다. 여기서 $r$ 은 $r^T=\left[\begin{array}{llll}1 & 2 & \ldots & K\end{array}\right]$ 라는 정수 벡터이다.

$$
p_i= \begin{cases}y-\lfloor y\rfloor, & i=\lfloor y\rfloor+1 \\ \lfloor y\rfloor-y+1, & i=\lfloor y\rfloor \\ 0 & \text { otherwise }\end{cases}
$$

$p$ 의 각 원소를 위의 식을 따라 계산하면 해당 벡터를 label 로 하여 모델이 학습하게 된다.

이렇게 만든 분포를 황금 비율 (gold rating) 이라고 하는데, 왜인지는 모르겠다.

## B.2) 모델

모델은 간단한 softmax 를 활용한 선형 모델이다. Loss 는 [[machine_learning/mean squared error|MSE]] 를 적용했다.

```python
model = nn.Sequential(  
    nn.Linear(inputdim, nclasses),  
    nn.Softmax(dim=-1),  
)
```

## B.3) Discussion

벤치마크 과정에서 논문을 참고했다고 하는데, 일부 따르지 않은 것도 있다. 예를 들어 논문에서 loss 는 [[KL-Divergence]] 를 사용하는데, 구현에서는 MSE 이다.

그리고 임베딩을 조합하거나 레이블을 수정하는 방식이 왜 적합한지에 대한 자세한 설명이 없다. 그 부분이 많이 아쉽다.

# C) Related

# D) References
