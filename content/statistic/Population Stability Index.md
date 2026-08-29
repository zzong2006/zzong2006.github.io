---
title: "Population Stability Index"
tags:
  - metrics
  - machine_learning
aliases: [PSI]
---

# A) Population Stability Index (PSI)

![](https://i.imgur.com/VJ0Gmvm.png)

**Population Stability Index (PSI) 는 모델 모니터링 지표로, 연속형 반응 변수 (the distribution of a continuous [[statistic/response variable|response variable]]) 의 분포가 두 샘플 간에 얼마나 변화했는지를 정량화하는 데 사용됩니다. 이 두 샘플은 일반적으로 서로 다른 시점에서 수집된 데이터입니다.

원래 PSI 는 훈련 데이터셋에서 Y(반응 변수 또는 스코어링 변수) 의 분포가 테스트 데이터셋 (샘플 외 데이터) 에서의 스코어링 변수 분포와 일치하는지 확인하기 위해 사용되었습니다. 즉, 모델이 학습된 데이터와 비교하여 Y 의 분포가 달라졌는지를 체크하는 것입니다.

이상적으로는 스코어링 데이터셋에서의 Y 분포가 훈련 데이터셋에서의 분포와 유사해야 합니다. 만약 Y 의 분포에 비정상적인 변화가 발생하면, PSI 값이 크게 나타납니다.

## A.1) PSI 값 해석

* **PSI < 0.1**: 큰 변화 없음, 현재 모델을 계속 사용할 수 있습니다.
* **PSI < 0.2**: 중간 정도의 인구 변화, 상황에 따라 판단이 필요합니다.
* **PSI >= 0.2**: 상당한 인구 변화 발생, 모델 재학습이 필요할 수 있습니다.

# B) PSI 의 목적

PSI 는 모델을 모니터링하는 지표입니다.

최근에는 PSI 를 주로 모델이 예측한 값들의 분포를 지속적으로 추적하는 데 사용합니다. 여기서 ‘스코어링 실행’이란, 훈련된 모델이 시간이 지나면서 여러 데이터 배치를 대상으로 예측을 수행하는 과정을 의미합니다.

PSI 값이 크게 상승할 경우, 이는 데이터 과학자들이 주목해야 할 중요한 신호일 수 있습니다.

또한, 스코어링 변수뿐만 아니라 각 특징 (feature) 에 대해서도 PSI 를 계산하는 것이 중요합니다. 만약 예측력이 강한 특정 특징이 급격하게 변동한다면, 해당 특징을 모델에 포함시킬지 다시 고려해볼 필요가 있습니다.

참고로 독립 변수 (예측 변수) 에 대해 PSI 를 적용할 때는 이를 **Characteristic Stability Index (CSI)**라고 부릅니다.

# C) How to Calculate PSI?

Population Stability Index Formula

```python
Sum of ((Actual% – Expected%) * ln(Actual%/Expected%))
```

In the above equation, `Expected %` corresponds to the first reference distribution at the time of scoring the model. `Actual %` points to the current data (that belongs to a more recent model scoring).

## C.1) PSI Calculation Table

**(예시 1)**
![](https://i.imgur.com/klHrdrl.png)

**(예시 2)**
[![[img-6ee4ac762b.png|Population stability Index Calculation]]](https://www.machinelearningplus.com/wp-content/uploads/2022/08/Population-Stability-Index-calculation-table.png)

PSI 값이 클수록 두 분포 간의 차이가 더 뚜렷해집니다.

예를 들어, 파란색이 예상된 값이고 빨간색이 실제 값이라고 가정해 봅시다. 변수를 분포로 나타내면, PSI 가 큰 경우에는 실제 값과 예상된 값 사이의 차이가 더 크게 나타납니다.

![](https://i.imgur.com/Z6wB0ST.png)

또한, 각 구간별로 히스토그램을 만들어 분포 변화를 시각화할 수 있습니다. 이렇게 하면 실제 값과 예상된 값 간의 차이가 명확하게 드러나며, 어느 범위에서 data drift 가 더 두드러지는지 쉽게 파악할 수 있습니다.

# D) Reference

* [성능지표 산출원리 \> 개인신용평점체계 공시 \> 평점체계공시 \> 알아보기 \> NICE지키미](https://www.credit.co.kr/ib20/mnu/BZWCACCCS15)
