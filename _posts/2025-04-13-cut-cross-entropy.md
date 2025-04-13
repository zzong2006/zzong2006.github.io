---
layout: post
title: "학습할때 메모리가 터진다고? Cut Your Losses!"
date: 2025-04-13 10:00:00
giscus_comments: true
categories: paper-review
toc:
  beginning: true
  sidebar: left
tags: LLM training memory optimization cross-entropy CCE Apple
---

## Cut Your Losses in Large-Vocabulary Language Models: 소개

언어 모델(LLM)의 규모가 커짐에 따라 어휘(vocabulary) 크기 또한 급증하고 있습니다. 이는 LLM 학습 시 메모리 사용량을 크게 증가시키는 요인이 되었으며, 특히 **cross-entropy 손실 계산** 단계에서 병목 현상을 야기합니다. 기존 cross-entropy 방식은 입력 토큰과 어휘 아이템 쌍마다 logit 행렬을 생성해야 하므로, 모델의 다른 부분보다 훨씬 많은 메모리를 소모합니다.

이 논문에서는 **Cut Cross-Entropy (CCE)** 라는 혁신적인 방법을 제안하여 이 문제를 해결합니다.

![Figure 1](https://i.imgur.com/T9QT7rk.png){: width="100%"}

*Figure 1: 다양한 모델에서의 메모리 사용량 및 최대 배치 크기 비교. 표준 Cross-Entropy 방식(왼쪽)과 CCE 방식(오른쪽)을 비교합니다. CCE는 cross-entropy 계산에 필요한 메모리(짙은 파란색 부분)를 극적으로 줄여, 동일한 하드웨어에서 더 큰 배치 크기(1.5배~10배)로 학습 가능하게 합니다.*

## Cut Cross-Entropy (CCE): 핵심 아이디어

CCE의 핵심 목표는 **logit 행렬 전체를 메모리에 저장하지 않고** cross-entropy 손실을 계산하는 것입니다.

1. **필요한 Logit만 계산**: CCE는 정답 토큰에 해당하는 logit 값만 명시적으로 계산합니다.
2. **Log-Sum-Exp 즉석 연산**: 나머지 모든 logit에 대한 log-sum-exp 연산은 전체 행렬을 구성하지 않고 즉석에서(on the fly) 수행됩니다.
3. **맞춤형 커널 활용**: 행렬 곱셈과 log-sum-exp 감소(reduction) 연산을 플래시 메모리(flash memory)에서 수행하는 맞춤형 커널을 구현했습니다. 이를 통해 cross-entropy 계산에 필요한 전역 메모리(global memory) 사용량을 거의 무시할 수 있는 수준으로 줄입니다.

### 수학적 원리: Logit 행렬 없이 계산하기

표준적인 cross-entropy 손실 $ L $ 은 다음과 같이 계산됩니다. 다음 토큰을 예측할 때, 모델은 어휘(vocabulary) 크기 $ V $ 만큼의 점수 벡터인 logit $ z $ 를 출력합니다. 정답 토큰의 인덱스를 $ y $ 라고 하면, 손실은 다음과 같습니다.

$$ L = -\log(\text{softmax}(z)_y) $$

여기서 $ \text{softmax}(z)_y $ 는 logit 벡터 $ z $ 에 softmax 함수를 적용했을 때 정답 토큰 $ y $ 에 해당하는 확률값입니다. Softmax 함수의 정의는 다음과 같습니다.

$$ \text{softmax}(z)_i = \frac{\exp(z_i)}{\sum_{j=1}^{V} \exp(z_j)} $$ 

따라서 정답 토큰 $ y $ 에 대한 softmax 값은 $\frac{\exp(z_y)}{\sum_{j=1}^{V} \exp(z_j)}$ 이 됩니다. 이를 손실 함수 $ L $ 에 대입하면:

$$ L = -\log\left( \frac{\exp(z_y)}{\sum_{j=1}^{V} \exp(z_j)} \right) $$ 

로그의 성질 $\log(a/b) = \log(a) - \log(b)$ 를 이용하면 다음과 같이 식을 전개할 수 있습니다:

$$ L = - \left( \log(\exp(z_y)) - \log\left(\sum_{j=1}^{V} \exp(z_j)\right) \right) $$ 

$ \log(\exp(z_y)) = z_y $ 이므로, 식은 다음과 같이 간단해집니다:

$$ L = - (z_y - \log\left(\sum_{j=1}^{V} \exp(z_j)\right)) $$ 

괄호를 풀면 최종적으로 다음 식을 얻습니다:

$$ L = -z_y + \log\left(\sum_{j=1}^{V} \exp(z_j)\right) $$ 

여기서 $ z_y $ 는 정답 토큰에 해당하는 logit 값이고, $ \log(\sum_{j=1}^{V} \exp(z_j)) $ 는 모든 logit 값에 대한 log-sum-exp (LSE) 연산입니다.

**문제점:** $ z $ 는 보통 마지막 레이어의 가중치 행렬 $ W $ (크기 $ V \times d $) 와 입력 임베딩 $ x $ (크기 $ d $) 의 곱 $ Wx $ 로 계산됩니다. $ V $ 가 매우 크면 (수십만 이상), logit 벡터 $ z $ 또는 배치(batch) 단위의 logit 행렬 $ Z $ 전체를 메모리에 저장하는 것이 엄청난 부담이 됩니다.

**CCE 해결책:** CCE는 위 손실 함수 $ L = -z_y + \text{LSE}(z) $ 를 계산할 때, 전체 logit 벡터 $ z $ 를 메모리에 생성하지 않습니다.

1. **$ z_y $ 직접 계산:** 정답 토큰 $ y $ 에 해당하는 logit $ z_y $ 만 계산합니다. 이는 가중치 행렬 $ W $ 에서 $ y $ 번째 행 $ W_y $ 만 가져와 입력 $ x $ 와 내적하여 $ z_y = W_y x $ 와 같이 효율적으로 계산할 수 있습니다. 전체 $ W $ 행렬이 필요하지 않습니다.
2. **$ \text{LSE}(z) $ 즉석 계산:** 모든 logit $ z_j $ 에 대한 $ \text{LSE}(z) = \log(\sum_{j=1}^{V} \exp(z_j)) $ 항은 전체 $ z $ 벡터를 만들지 않고 *즉석에서(on-the-fly)* 계산합니다. 논문에서 언급된 "맞춤형 커널"은 $ Wx $ 계산과 $ \sum \exp(\cdot) $ 연산을 융합(fuse)하여 수행합니다. 즉, $ W $ 의 작은 블록들을 순차적으로 로드하여 $ \exp(W_j x) $ 를 계산하고 합산한 뒤 마지막에 로그를 취하는 방식으로, 전체 $ z $ 를 저장할 필요 없이 최종 LSE 값을 얻습니다. 이 과정은 GPU의 빠른 공유 메모리(shared memory) 또는 캐시(cache)를 활용하여 전역 메모리(global memory) 접근을 최소화합니다.

결과적으로, CCE는 거대한 logit 행렬 $ Z $ 를 메모리에 저장하는 단계를 완전히 생략함으로써 메모리 사용량을 획기적으로 줄입니다.

### 메모리 절감 효과

CCE는 놀라운 메모리 절감 효과를 보여줍니다. 예를 들어 **Gemma 2 (2B)** 모델의 경우:

* 손실 계산 레이어의 메모리 사용량: **24 GB → 1 MB** 로 감소
* 분류기 헤드(classifier head) 전체의 학습 시 메모리 사용량: **28 GB → 1 GB** 로 감소

### 처리량 향상 (Throughput Improvement)

CCE는 메모리 절감 외에도 처리량(throughput)을 개선하기 위해 추가적인 최적화를 수행합니다. 이는 역전파(backward pass) 과정에서 **Softmax 함수의 희소성(sparsity)**을 활용하는 방식입니다.

1. **Softmax 결과의 희소성:** Forward pass에서 Softmax 함수를 거치면, 대부분의 어휘 토큰에 대한 확률값은 극도로 작아집니다. 즉, 정답 토큰 및 소수의 관련 토큰을 제외한 대다수 토큰의 확률은 거의 0에 수렴합니다.
2. **불필요한 기울기 계산 생략:** CCE는 역전파 시 기울기(gradient)를 계산할 때, 이처럼 확률값이 매우 낮은 (예: 머신 엡실론 이하로, 최종 결과에 미치는 영향이 무시할 수 있는 수준인) 토큰들에 대한 계산을 **의도적으로 생략**합니다. 이는 전체 학습 정확도나 수렴 성능에 거의 영향을 주지 않으면서 계산량을 줄이는 효과적인 방법입니다.
3. **계산량 감소 및 처리량 향상:** 전체 어휘 크기에 비례했던 기울기 계산의 상당 부분을 생략함으로써, 역전파 단계에 필요한 연산량이 크게 줄어듭니다. 결과적으로 한 번의 스텝(step)을 처리하는 속도가 빨라져 전체 모델 학습의 처리량이 향상됩니다.

이 최적화를 통해 CCE는 메모리 효율성뿐만 아니라 계산 속도 측면에서도 이점을 제공합니다.

![Figure 3](https://i.imgur.com/CE8IPUi.png){: width="50%"}

*Figure 3: 토큰 예측 확률 분포 (로그-로그 스케일). 모델이 예측하는 다음 토큰 후보들의 확률은 순위가 낮아질수록 급격히 감소하여, 소수 상위 토큰을 제외한 나머지는 확률이 거의 0에 가까워(수치 정밀도 이하로 떨어져) 계산에서 생략 가능함을 보여줍니다. CCE는 이 점을 활용하여 처리량을 높입니다.*

## 실험 결과 및 의의

실험 결과, CCE는 메모리 사용량을 극적으로 줄이면서도 **학습 속도나 수렴 성능 저하 없이** 목표를 달성했음을 보여주었습니다.

![Figure 4](https://i.imgur.com/1uKQuQL.png){: width="100%"}

*Figure 4: Alpaca 데이터셋에서의 학습 손실(Loss) 곡선 비교. CCE(파란색)와 표준 방식(torch.compile, 주황색)의 손실 곡선이 거의 일치합니다. 이는 CCE의 기울기 계산 최적화(일부 기울기 생략)가 모델의 최종 수렴 성능에 영향을 주지 않음을 나타냅니다.*

이는 대규모 어휘를 가진 LLM을 더 적은 메모리 자원으로 효율적으로 학습시킬 수 있는 가능성을 열어주며, 특히 메모리가 제한적인 환경에서 LLM 연구 및 개발의 장벽을 낮추는 데 기여할 수 있습니다.

## References

* Paper: [Cut Your Losses in Large-Vocabulary Language Models (arXiv:2411.09009)](https://arxiv.org/abs/2411.09009)
* Code: [https://github.com/apple/ml-cross-entropy](https://github.com/apple/ml-cross-entropy)
* Publication: ICLR 2025 (Oral)