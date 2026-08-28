---
title: "Huber Loss"
---

# A) MAE (Mean Absolute Error, 평균 절대 오차)

MAE 는 실제값과 예측값의 차이에 절대값을 취한 후 모두 더해 평균을 낸 값입니다. MAE 는 L1 손실 (L1 Loss) 이라고도 불립니다.

<img src="https://latex.codecogs.com/svg.image?MAE&space;=&space;\frac{1}{n}\sum_{i=1}^{n}|y_i&space;-&space;\hat{y}_i|" title="MAE = \frac{1}{n}\sum_{i=1}^{n}|y_i - \hat{y}_i|" />

	* n: 데이터의 개수
	* y_i: 실제 값
	* ŷ_i: 모델의 예측값
		
* **특징:**
	* **장점:** 오차의 크기에 상관없이 제곱을 하지 않는다는 점 때문에 이상치 (outlier) 에 덜 민감하며, 모델이 이상치에 크게 영향을 받지 않는다는 장점이 있습니다.
	* **단점:** 오차가 0 에 가까워져도 기울기가 일정하여 최적값에 수렴하는 과정에서 값이 크게 변동할 수 있으며, 이는 최적화에 어려움을 줄 수 있습니다.

# B) MSE (Mean Squared Error, 평균 제곱 오차)

MSE 는 실제값과 예측값의 차이를 제곱하여 모두 더한 후 평균을 낸 값입니다.MSE 는 L2 손실 (L2 Loss) 이라고도 불립니다.

* **수식**
	<img src="https://latex.codecogs.com/svg.image?MSE&space;=&space;\frac{1}{n}\sum_{i=1}^{n}(y_i&space;-&space;\hat{y}_i)^2" title="MSE = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2" />
	
* **특징:**
	* **장점:** 오차를 제곱하기 때문에 오차가 클수록 더 큰 페널티를 부여합니다.손실 함수가 매끄러운 곡선 형태이므로, 경사 하강법 (Gradient Descent) 을 사용한 최적화에 용이합니다.
	* **단점:** 오차를 제곱하는 특성 때문에 이상치에 매우 민감하게 반응하여 모델의 성능을 왜곡시킬 수 있습니다.

# C) Huber Loss (후버 손실)

Huber Loss 는 MSE 와 MAE 의 장점을 결합한 손실 함수입니다. 특정 임계값 (델타, δ) 을 기준으로, 오차가 작으면 MSE 처럼 행동하고 오차가 크면 MAE 처럼 행동하여 이상치에 강건하면서도 안정적인 최적화가 가능합니다.

* **수식:
	<img src="https://latex.codecogs.com/svg.image?L_{\delta}(y,&space;\hat{y})&space;=&space;\begin{cases}&space;\frac{1}{2}(y-\hat{y})^2&space;&&space;\text{for&space;}|y-\hat{y}|&space;\leq&space;\delta&space;\\&space;\delta(|y-\hat{y}|&space;-&space;\frac{1}{2}\delta)&space;&&space;\text{otherwise}&space;\end{cases}" title="L_{\delta}(y, \hat{y}) = \begin{cases} \frac{1}{2}(y-\hat{y})^2 & \text{for }|y-\hat{y}| \leq \delta \\ \delta(|y-\hat{y}| - \frac{1}{2}\delta) & \text{otherwise} \end{cases}" />
	
* **특징:**
	* **장점:** 작은 오차에서는 MSE 처럼 작동하여 정밀한 예측을 유도하고, 큰 오차 (이상치) 에서는 MAE 처럼 작동하여 이상치의 영향을 줄입니다.
	* **단점:** MSE 와 MAE 의 장점을 언제 전환할지 결정하는 하이퍼파라미터 δ를 사용자가 직접 설정해야 합니다.
* **MSE**는 이상치가 적고, 큰 오차를 강력하게 패널티를 주어 정밀한 모델을 만들고 싶을 때 사용합니다.
* **MAE**는 데이터에 이상치가 많아서 모델이 왜곡될 가능성이 있을 때 사용하면 효과적입니다.
* **Huber Loss**는 이상치에 대한 저항력과 안정적인 학습 능력을 모두 원할 때 사용하는 좋은 절충안입니다.
