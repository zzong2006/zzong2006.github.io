---
layout: default
title:  "Keras"
category: Coding
order: 1
---

## 모델 만들기



### 모델 학습하기

`model.fit`의 학습 데이터 또는 테스트 데이터로 dictionary 형태가 올수있다. 다만, 각 데이터 key의 이름이 model `call` 함수에서 인자로 사용하는 `inputs`에서 적절히 다뤄져야 한다.

```python
# 이렇게 dictionary 입력이 가능하다.
history = ae_rnn_model.fit({"encoder_input": seq_train_data, "decoder_input": seq_train_data},
                                   seq_train_data,
                                   epochs=20,
                                   batch_size=512, shuffle=True)

# 그러면 모델 class의 call 함수에서 적절히 처리해줘야 한다.
class AutoEncoder(tf.keras.Model):
    def call(self, inputs, training=None, mask=None, **kwargs):
        encoder_input, decoder_input = inputs['encoder_input'], inputs['decoder_input']
    # ...
            
```



#### `Model.fit`  customize 하기

학습 모델 클래스에서 `train_step`을 override 하면 된다.

```python
class CustomModel(keras.Model):
    def train_step(self, data):
        # Unpack the data. Its structure depends on your model and
        # on what you pass to `fit()`.
        x, y = data

        with tf.GradientTape() as tape:
            y_pred = self(x, training=True)  # Forward pass
            # Compute the loss value
            # (the loss function is configured in `compile()`)
            loss = self.compiled_loss(y, y_pred, regularization_losses=self.losses)

        # Compute gradients
        trainable_vars = self.trainable_variables
        gradients = tape.gradient(loss, trainable_vars)
        # Update weights
        self.optimizer.apply_gradients(zip(gradients, trainable_vars))
        # Update metrics (includes the metric that tracks the loss)
        self.compiled_metrics.update_state(y, y_pred)
        # Return a dict mapping metric names to current value
        return {m.name: m.result() for m in self.metrics}
```

* `self.optimizer`의 경우, `__init__` 함수에서 만들 필요가 없다. `fit` 호출 시, 알아서 만들어준다.

  * 다만, `fit` 호출 전에 `compile` 함수를 꼭 호출해야 한다.

  * ```python
    model.compile(optimizer="adam", loss="mse", metrics=["mae"])
    
    # Just use `fit` as usual
    # ... 
    model.fit(x, y, epochs=3)
    ```

  



## 데이터 받아오기



```python
zip_path = tf.keras.utils.get_file(
    origin='https://storage.googleapis.com/tensorflow/tf-keras-datasets/jena_climate_2009_2016.csv.zip',
    fname='jena_climate_2009_2016.csv.zip',
    extract=True)

csv_path, _ = os.path.splitext(zip_path)

df = pd.read_csv(csv_path)
```



## 시계열 데이터 데이터셋 만들기

```python
dataset_train = keras.preprocessing.timeseries_dataset_from_array(
    x_train,
    y_train,
    sequence_length=sequence_length,
    sampling_rate=step,
    batch_size=batch_size,
)

```



LSTM 또는 GRU 의 입력 데이터셋은 다음과 같아야 한다.

[batch_size, time_step, features]

* features: 각 단어의 embedding vector 크기
* time_step: 한번에 얼마나 많은 단어들을 볼 것인지 (의존성 길이)

일반적으로, [데이터 row 개수, features] 형태를 지닌 데이터를 `keras.preprocessing.timseries_dataset_from_array` 에 입력하고, dataset loop 마다 [batch_size, time_step, features]를 얻게된다.

```python
model = keras.models.Sequential()
model.add(keras.layers.LSTM(unit=3, input_shape=(3, 5))) # unit= hidden layer units, input_shape= (time_stpes, features)
```



## `tf.Data`

### 텐서에서 바로 데이터셋 만들기

```python
dataset = tf.data.Dataset.from_tensor_slices((filenames, labels))

# Seq2Seq 모델처럼 두개의 input tensors와 한개의 output tensors가 요구되는 모델에 대한 dataset은 어떻게 만들어야 하나?
dataset = tf.data.Dataset.from_tensor_slices(({'a': input_data_a, 'b': input_data_b}, labels))
# 또는
dataset = tf.data.Dataset.from_tensor_slices((zip(input_data_a, input_data_b), labels))
```



### 데이터셋 섞기

```python
# 데이터셋 섞기
dataset = dataset.shuffle(buffer_size=3)
```

* 버퍼 사이즈는 섞어야 할 원소들의 사이즈를 의미한다. 
  * 만약 버퍼 사이즈가 `n`개라면,  총 `M`개의 원소들 중 앞에서부터 `n`개의 원소를 불러오고, 그 원소들끼리 섞는다. 그리고 그 buffer는 다음 원소로 sliding 하고, 그 내부 버퍼에서 또 섞고를 반복...    
  * 완전히 섞을라면 전체 데이터 크기랑 같거나 커야 한다. 버퍼 사이즈가 작게되면, 큰 흐름은 바뀌지 않는다. 

```python
dataset = tf.data.Dataset.range(10)
dataset = dataset.shuffle(2, reshuffle_each_iteration=False)
list(dataset.as_numpy_iterator())
# [0, 2, 3, 1, 5, 6, 7, 8, 4, 9]
dataset = dataset.shuffle(10, reshuffle_each_iteration=False)
list(dataset.as_numpy_iterator())
# [3, 4, 7, 8, 6, 2, 1, 0, 9, 5]
```



### `prefetch`

dataset의 batch를 RAM에 미리 불러와서 pipeline의 performance를 향상시킨다.  만약, prefetch의 buffer size가 1이라면, batch_size 만큼의 데이터를 미리 불러온 것이라 생각하면 된다. 

아래 코드와 같이 자동으로 size를 조절해줄수도 있다. `prefetch`는 `shuffle`, `batch` 등.. 에 비해서 항상 마지막에 온다.

```python
dataset = dataset.prefetch(tf.data.experimental.AUTOTUNE)

```

