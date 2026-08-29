---
title: "MixedPrecisionManager"
aliases: []
tags:
  - deep_learning
---

아래는 [modeling.py · pinecone/ConstBERT at main](https://huggingface.co/pinecone/ConstBERT/blob/main/modeling.py#L19-L49) 에서 확인할 수 있는 `MixedPrecisionManager` 클래스에 대해 궁금한 점을 정리한 내용입니다.

# A) MixedPrecisionManager 의 역할

`MixedPrecisionManager` 클래스는 ConstBERT 모델의 학습 과정에서 **혼합 정밀도(Mixed Precision)를 관리하는 역할**을 합니다.

혼합 정밀도 학습은 딥러닝 모델의 학습 속도를 높이고 메모리 사용량을 줄이기 위해 사용되는 기법입니다. 이는 학습 중에 모델의 가중치, 활성화 값 등을 16비트 부동 소수점(FP16)과 32비트 부동 소수점(FP32)을 혼합하여 사용하는 것을 의미합니다.

`MixedPrecisionManager` 클래스는 다음과 같은 주요 기능을 수행합니다.

1. **`__init__(self, activated)`:**
	* `activated`: 혼합 정밀도 사용 여부를 결정하는 불리언(boolean) 플래그입니다.
	* `self.scaler = torch.amp.GradScaler("cuda")`: 만약 `activated`가 `True`이면, PyTorch의 `torch.cuda.amp.GradScaler` 인스턴스를 생성합니다. 이 스케일러는 FP16으로 저장된 그래디언트의 크기를 조정하여 FP32로 변환할 때 발생할 수 있는 언더플로우(underflow)를 방지하는 중요한 역할을 합니다.

2. **`context(self)`:**
	* `torch.cuda.amp.autocast("cuda")` 또는 `NullContextManager`를 반환합니다.
	* `torch.cuda.amp.autocast("cuda")`는 FP16을 지원하는 연산(예: 행렬 곱셈, 컨볼루션 등)을 수행할 때 자동으로 FP16을 사용하도록 하는 컨텍스트 관리자입니다. 이는 `with self.amp_manager.context():` 블록 안에서 수행되는 모든 연산에 적용됩니다.
	* `NullContextManager`는 `activated`가 `False`일 때, 즉 혼합 정밀도를 사용하지 않을 때 아무런 효과가 없는 더미 컨텍스트를 제공합니다.

3. **`backward(self, loss)`:**
	* 혼합 정밀도가 활성화된 경우 (`self.activated == True`), `self.scaler.scale(loss).backward()`를 호출합니다. 이는 손실(loss)에 대해 그래디언트를 계산할 때 스케일러를 사용하여 FP16 그래디언트의 크기를 조정합니다.
	* 활성화되지 않은 경우 (`self.activated == False`), 일반적인 `loss.backward()`를 호출합니다.

4. **`step(self, colbert, optimizer, scheduler=None)`:**
	* 옵티마이저 스텝을 수행할 때 혼합 정밀도 관련 처리를 담당합니다.
	* **`self.scaler.unscale_(optimizer)`**: FP16 그래디언트의 스케일을 원래대로 복구합니다.
	* **`torch.nn.utils.clip_grad_norm_(colbert.parameters(), 2.0, error_if_nonfinite=False)`**: 그래디언트 클리핑을 수행합니다. FP16으로 인해 발생할 수 있는 비정상적인 그래디언트(NaN, Inf)를 처리하기 위해 `error_if_nonfinite=False`가 설정될 수 있습니다.
	* **`self.scaler.step(optimizer)`**: 조정된 그래디언트로 옵티마이저 스텝을 수행합니다.
	* **`self.scaler.update()`**: 다음 스케일링을 위해 스케일러를 업데이트합니다.
	* 혼합 정밀도가 비활성화된 경우, 일반적인 그래디언트 클리핑 및 옵티마이저 스텝을 수행합니다.
	* `scheduler.step()`: (옵션) 학습률 스케줄러도 업데이트합니다.
	* `optimizer.zero_grad()`: 다음 반복을 위해 그래디언트를 초기화합니다.

**요약:**

`MixedPrecisionManager`는 ConstBERT 모델이 `torch.cuda.amp` 기능을 활용하여 FP16과 FP32를 혼합하여 더 빠르고 효율적으로 학습할 수 있도록 돕는 "컨트롤 타워" 역할을 합니다. 그래디언트 계산(`backward`) 및 옵티마이저 업데이트(`step`) 단계에서 FP16으로 인한 문제를 해결하고 성능을 최적화하는 핵심 로직을 캡슐화합니다.

# B) Backward 에서 loss scale 하고 step 에서 optimizer 에게 unscale 하는 이유

왜 `backward`에서 `loss`에 `scale`을 하고, `step`에서 `optimizer`에게 `unscale`을 하는지, 그리고 그 이유에 대해 깊이 파고들어 보겠습니다.

## B.1) `backward` -> `step` 의 흐름

딥러닝 모델 학습의 기본적인 흐름은 다음과 같습니다.

1. **Forward Pass**: 입력 데이터로 모델을 통과시켜 예측값을 얻습니다.
2. **Loss Calculation**: 예측값과 실제 정답을 비교하여 손실(loss)을 계산합니다.
3. **Backward Pass (`backward`)**: 이 손실을 기반으로 각 모델 파라미터에 대한 그래디언트(기울기)를 계산합니다. 이 기울기는 파라미터를 어떻게 조정해야 손실을 줄일 수 있는지를 알려줍니다.
4. **Optimizer Step (`step`)**: 계산된 그래디언트를 사용하여 모델 파라미터를 업데이트합니다.

`MixedPrecisionManager`는 이 과정 중 **Backward Pass**와 **Optimizer Step** 부분을 혼합 정밀도에 맞게 조절하는 역할을 합니다.

## B.2) 왜 `loss`에 `scale`을 하고 `optimizer`에게 `unscale`을 하는가?

이것이 혼합 정밀도 학습의 핵심적인 트릭이며, 매우 중요한 부분입니다.

**배경:**

* **FP16의 한계**: 16비트 부동 소수점(FP16)은 32비트 부동 소수점(FP32)보다 표현할 수 있는 숫자의 범위가 훨씬 좁습니다. 특히 아주 작은 값(그래디언트)을 표현하는 데 어려움이 있습니다.
* **그래디언트 언더플로우 (Gradient Underflow)**: 모델 학습 중 계산되는 그래디언트 값은 때때로 매우 작을 수 있습니다. FP16으로 이 작은 값들을 표현하려고 하면, 그 크기가 너무 작아져서 0으로 처리되거나 손실될 수 있습니다. 이렇게 되면 모델의 가중치가 전혀 업데이트되지 않아 학습이 멈춰버립니다.

**해결책: `GradScaler`의 역할**

`GradScaler`는 이 문제를 해결하기 위해 다음과 같은 두 단계를 사용합니다.

1. **`loss.backward()` 전에 `scaler.scale(loss)`**:
	* **목표**: 계산될 그래디언트의 크기를 **일시적으로 키워서** FP16으로 표현할 때 0이 되지 않도록 합니다.
	* **동작**: `scaler.scale(loss)`는 실제로는 `loss`에 어떤 "스케일링 팩터"(매우 큰 수)를 곱한 것으로 생각할 수 있습니다. 이 스케일링된 `loss`에 대해 `.backward()`를 호출하면, 결과적으로 모든 그래디언트도 이 "스케일링 팩터"만큼 커지게 됩니다.
	* **비유**: 마치 "매우 무거운 물건"을 옮기기 전에, 물건에 "가벼운 끈"을 달아서 옮기기 쉽게 만드는 것과 같습니다. 실제 물건은 그대로이지만, 옮기는 방식(그래디언트 계산)이 달라지는 것이죠.

2. **`optimizer.step()` 전에 `scaler.unscale_(optimizer)`**:
	* **목표**: 모델 가중치를 업데이트하기 전에, **그래디언트를 다시 원래 크기로 되돌립니다.**
	* **동작**: `scaler.unscale_(optimizer)`는 옵티마이저에 적용되기 직전의 그래디언트들에 대해, `backward` 단계에서 곱했던 "스케일링 팩터"를 다시 나누어 줍니다. 이렇게 하면 그래디언트가 원래의 올바른 크기를 갖게 되어, 옵티마이저가 정확한 방향으로 가중치를 업데이트할 수 있습니다.
	* **비유**: "가벼운 끈"으로 옮겨온 "매우 무거운 물건"을, 이제 실제 원래 위치에 놓기 전에 "가벼운 끈"을 제거하는 것과 같습니다. 그래야 물건 자체의 무게를 정확히 느끼고 제자리에 놓을 수 있습니다.

**왜 `loss`에 `scale`을 하고, `optimizer`에게 `unscale`을 하는가?**

* **`loss`에 `scale`**: 그래디언트 계산(`backward`) 과정에서 발생할 수 있는 **언더플로우를 방지**하기 위해, 그래디언트 자체를 더 큰 값으로 만듭니다. 이는 `loss`를 통해 이루어집니다.
* **`optimizer`에게 `unscale`**: 모델 파라미터 업데이트(`step`)는 **정확한 그래디언트 값**을 사용해야 합니다. `backward`에서 커진 그래디언트를 그대로 사용하면 파라미터가 잘못 업데이트될 수 있으므로, 옵티마이저가 적용되기 직전에 원래 크기로 되돌리는(`unscale`) 과정이 반드시 필요합니다. `optimizer`는 이 `unscale` 작업을 알아서 처리할 수 있도록 설계되어 있습니다.

**만약 `loss`에 `unscale`을 한다면?**
`loss`에 `unscale`을 하는 것은 의미가 없습니다. `unscale`은 이미 커져 있는 그래디언트를 원래대로 돌리는 과정인데, `loss` 자체는 그래디언트가 아니기 때문입니다. 그래디언트는 `loss.backward()` 호출 후에 생성되는 것이죠.

## B.3) `MixedPrecisionManager`의 코드 재해석

```python
    def backward(self, loss):
        if self.activated:
            # 1. loss에 스케일러를 적용하여, 커질 그래디언트의 '기준'을 높입니다.
            #    (언더플로우 방지를 위해)
            #    이 스케일링된 loss에 대해 backward를 호출하면, 모든 그래디언트가 커집니다.
            self.scaler.scale(loss).backward()
        else:
            loss.backward() # 일반적인 그래디언트 계산

    def step(self, colbert, optimizer, scheduler=None):
        if self.activated:
            # 2. 옵티마이저가 파라미터 업데이트에 사용하기 전에,
            #    커졌던 그래디언트들을 원래대로 되돌립니다.
            #    (정확한 업데이트를 위해)
            self.scaler.unscale_(optimizer)
            
            # ... (그래디언트 클리핑 등) ...

            # 3. unscale된 그래디언트로 옵티마이저 스텝을 실행합니다.
            self.scaler.step(optimizer)
            
            # 4. 스케일러를 다음 backward 단계를 위해 업데이트합니다.
            self.scaler.update()
        else:
            # ... (일반적인 옵티마이저 스텝) ...
```

이처럼 `scaler.scale(loss).backward()` 와 `scaler.unscale_(optimizer)`는 혼합 정밀도 학습에서 그래디언트 언더플로우를 방지하고 정확한 가중치 업데이트를 보장하기 위한 필수적인 메커니즘입니다.
