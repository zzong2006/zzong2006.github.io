---
tags: ["machine_learning"]
aliases: ["하이퍼파라매터"]
---

# 1. Hyperparameter ?

* 주로 최적화하는 Hyperparameter 들
	* [[Learning rate]] $\alpha$
		* 가장 중요한 [[hyperparameter]]
	* Number of layers
	* Number of hidden units
	* [[Learning rate]] decay
	* Mini-batch size
	* [[Momentum]] term
		* 일반적으로 $0.9$
* [[Hyperparameter Optimization]]
	* [[Grid Search]]
		* 모델에 대한 hyperparameter]] 로 가능한 값들을 순차적으로 입력한 뒤에 가장 높은 성능을 보이는 모델이 가진 [[hyperparameter]] 를 찾는 방법

## 1.1. Sklearn - GridSearch

`sklearn` 의 `GridSearchCV` 가 이를 지원한다.

```python
from sklearn.model_selection import GridSearchCV

# .. 일부 내용 생략
dtree = DecisionTreeClassifier()

### parameter 들을 dictionary 형태로 설정
parameters = {'max_depth':[1,2,3], 
              'min_samples_split':[2,3]}

# cv: cross-validation
grid_dtree = GridSearchCV(dtree, param_grid=parameters, cv=3, refit=True)
```

* 장점 및 단점
	* 최적의 [[hyperparameter]] 를 정확하게 찾을 수 있지만, 시간이 오래 걸린다.
	* 또한 [[hyperparameter]] 후보를 사람이 정하기 때문에, heuristic 한 면이 존재한다.

# 2. Related

* [[Random search]]

# 3. References
