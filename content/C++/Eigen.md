---
tags: ["library", "Cpp"]
---

# A) Eigen

Eigen은 행렬, 벡터, 그리고 수치 해법 등 선형 연산에 특화된 함수와 클래스를 제공하는 라이브러리입니다.

---

## A.1) 행렬(Matrix) 클래스

행렬의 타입, 행(row), 열(column) 개수는 다음과 같이 지정합니다.

```cpp
Matrix<typename Scalar, int RowsAtCompileTime, int ColsAtCompileTime>
```

예를 들어,
```cpp
typedef Matrix<float, 4, 4> Matrix4f;
```
처럼 4x4 크기의 float 타입 행렬을 정의할 수 있습니다.

### A.1.1) 동적 크기(Dynamic) 행렬 및 벡터

행 또는 열의 크기를 고정하지 않고 선언하려면 `Dynamic`을 사용합니다.

- 동적 행렬 예시:
	```cpp
    typedef Matrix<double, Dynamic, Dynamic> MatrixXd;
    ```
- 벡터(행 또는 열 중 하나의 크기가 1인 경우)
	- 동적 벡터 예시:
		```cpp
        typedef Matrix<int, Dynamic, 1> VectorXi;
        ```

---

## A.2) 저장 순서(Storage Orders) [[link](https://eigen.tuxfamily.org/dox/group__TopicStorageOrders.html)]

Eigen에서는 두 가지 방식으로 행렬 데이터를 저장할 수 있습니다: column-major(열 우선), row-major(행 우선) 방식입니다.

예를 들어,

$$
A = \begin{bmatrix}
8 & 2 & 2 & 9 \\
9 & 1 & 4 & 4 \\
3 & 5 & 4 & 5
\end{bmatrix}
$$

- **row-major**: `8 2 2 9 9 1 4 4 3 5 4 5`
- **col-major**: `8 9 3 2 1 5 2 4 4 9 4 5`

---

## A.3) Aliasing [[link](https://eigen.tuxfamily.org/dox/group__TopicAliasing.html)]

동일한 행렬 객체에 대한 대입문에서 발생하는 문제를 의미합니다.

예시:
```cpp
mat = mat * mat;      // 안전 (임시 객체 사용)
mat = mat.transpose(); // 위험! 절대 이렇게 사용하지 말 것
```

특히 두 번째 예시는 내부 데이터가 겹치면서 예기치 않은 결과를 낼 수 있으므로 반드시 아래와 같이 처리해야 합니다.
```cpp
mat = mat.transpose().eval();
```
또는 다음처럼 in-place 변환 함수를 사용할 수도 있습니다.
```cpp
mat.transposeInPlace();
```

### A.3.1) noalias() 함수

`noalias()`는 불필요한 임시 객체 생성을 피하고 계산 효율을 높이기 위해 사용됩니다.
예를 들어,
```cpp
matB.noalias() = matA * matA;
```
이와 같이 명시적으로 aliasing이 발생하지 않음을 선언할 수 있습니다.

---

## A.4) Lazy Evaluation (지연 평가)

Eigen에서는 연산 결과를 즉시 계산하지 않고 필요할 때까지 연산을 미루는 lazy evaluation 방식을 채택하고 있습니다.

---

## A.5) Eigen 설치 경로와 심볼릭 링크

Eigen은 `/usr/local/include/eigen3/` 위치에 설치되어 있으며,
컴파일 시 아래 명령어로 심볼릭 링크를 생성해야 사용할 수 있습니다.
```python
sudo ln -s /usr/local/include/eigen3/Eigen /usr/include/Eigen
```

---

## A.6) Array

[link](https://eigen.tuxfamily.org/dox/group__TutorialArrayClass.html)

Array 클래스는 일반적인 목적의 배열이며, 선형대수 목적이라면 Matrix 클래스를 사용합니다.
Matrix 객체는 `.array()` 함수를 통해 Array로 변환 가능하며 coefficient-wise(원소별) 연산이 쉬워집니다.
반대로 Array 객체는 `.matrix()`로 Matrix 타입으로 변환할 수도 있습니다.

예시:

- 두 matrix `m`, `n`이 있을 때
	- `m * n`: matrix multiplication(행렬 곱)
	- `m.array() * n.array()`: element-wise 곱셈

Array와 Matrix 간에는 직접적인 연산이 불가능하며 동일한 타입끼리만 연산 가능합니다.

---

## A.7) 자주 헷갈리는 함수 정리

- `.topLeftCorner(rows, cols)` : 주어진 matrix에서 `(rows x cols)` 크기의 좌상단 부분을 반환합니다.
	- 예를 들면 $3\times3$ matrix
	  ```python
      [1   2  3]
      [4  5  6]
      [7  8  9]
      ```
	  의 `.topLeftCorner(2,2)` 호출 시
	  ```python
      [1 2]
      [4 5]
      ```
	  와 같은 $2\times2$ submatrix가 반환됩니다.
