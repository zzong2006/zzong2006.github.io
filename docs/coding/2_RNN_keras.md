---
layout: default
title:  "RNN"
category: Coding
order: 2
---

Keras를 통해 RNN을 사용하면서 느낀 점을 작성한 포스팅이다.

## RNN with Timeseries: LSTM AutoEncoder

시계열 데이터를 오토인코더에 적용하는 실험을 진행하고 있는데, LSTM AutoEncoder 라는 것을 보고, 시계열 데이터에 잘 어울릴 것으로 생각해서 구현해보았다.

구조는 간단한데,  인코더와 디코더에 `Dense` 대신`LSTM`을 사용하는 것이다. 그리고 인코더 `LSTM` 의 마지막 출력값을 `RepeatedVector` layer를 이용해 시계열 데이터 time step만큼 복사하고, 이를 디코더의 `LSTM`의 입력값으로 설정하여 최종적으로 시계열 데이터를 복구하면 된다.

```python
model = Sequential()
model.add(LSTM(100, activation='relu', return_sequences=False, input_shape=(n_in,1)))
model.add(RepeatVector(n_out))
model.add(LSTM(100, activation='relu', return_sequences=True))
model.add(TimeDistributed(Dense(1)))
```

### 결과

상당히 좋지않다. 아래 그림처럼, 거의 선형 모습의 복원을 한다.

<img src="https://i.loli.net/2020/11/24/FwMTYzQ7LBZAlvI.png" alt="image-20201124231502671" style="zoom: 80%;" />

이런 저런 실험을 돌리다가, 결국 너무 시간 의존도가 높으면 복원도가 너무 떨어진다는 것을 확인했다. 위 시계열 데이터는 길이가 140인데, LSTM layer에 적용을 한다면 feature가 1이므로 140번이나 재귀적 계산을 수행해야 한다. 

이러한 문제를 개선하기 위해, feature를 늘리고, time step을 줄였다. 즉, `[140,1]` 차원의 데이터를 `[14, 10]` 차원의 데이터 형식으로 바꿨다. 이랬더니 복원률이 훨씬 나아졌다.

<img src="https://i.loli.net/2020/11/24/ScOEvGLtW64PFib.png" alt="image-20201124231830282" style="zoom:80%;" />

하지만 너무 feature를 늘리면 안된다. 만약 주객이 전도되어서 `[1, 140]` 차원의 데이터가 된다면, 그건 그냥 `Dense` 레이어와 다를바가 없어진다. time step을 한번만 계산하기 때문이다.

또한 Decoder 마지막 output에 sigmoid activation function을 넣어주는 것도 복원률 향상에 도움이 된다.

### 차원 압축을 위한 LSTM?

작은 시계열 데이터의 차원 압축에는 LSTM을 사용하는 것은 좋지않다. Sequence 데이터에 대한 정보를 LSTM에 담아야 하므로, 일정 차원보다 훨씬 커야한다.  