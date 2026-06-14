---
tags: ["pandas", "tip", "python", "library"]
aliases: ["판다스"]
---

# 1. Convert

`DataFrame` 을 list of dictionary 로 변경

```python
df.to_dict('records')
```

`records` 값은 특정 column 값이 아니다. 그냥 붙이는 것.

# 2. Notation

## 2.1. Scientific Notation -> Floating Notation

`df.describe().apply(lambda s: s.apply('{0:.5f}'.format))`

# 3. Cleaning

## 3.1. 특정 조건을 만족하는 행 지우기

`df.drop(df[<condition>].index, inplace=True)`  
예시) column vimp 값이 0 인 행 지우기: `df.drop(df[df['vimps'] == 0].index)`

# 4. String

* column `A` 값에 특정 string 값 (`hello`) 가 포함되있는지 확인하기
	* `df[df['A'].str.contains("hello")]`
* string cleaning
	* 영어 문장에 포함되어 있는 punctuation 및 whitespace 등을 제거하는 방법: [stackoverflow](https://stackoverflow.com/questions/50444346/fast-punctuation-removal-with-pandas)
	* 영어 문장에 포함되어 있는 숫자 제거하기: `df.text.str.replace(r'\d+', '', regex=True)`
		* `regex` 를 명시해야만 warning 이 뜨지 않음

# 5. Plotting

## 5.1. Scientific Notation 지우기

```python
plt.ticklabel_format(style='plain', axis='y')
```

# 6. Indexing

특정 조건을 만족하는 row 만 불러오기 ([stackoverflow](https://stackoverflow.com/questions/17071871/how-do-i-select-rows-from-a-dataframe-based-on-column-values))

```python
df.loc[df['column_name'].isin(some_values)]
```

## 6.1. Query

아래와 같이 query 함수를 활용하여 인덱싱이 가능하다.

```python
min_year = 1980
min_time = 10
df = df.query('Year < 1980 and Time > 10')
df = df.query('Year < @min_year and Time > @min_time') 
```

# 7. Large Dataset 다루기

References: [link](https://pandas.pydata.org/docs/user_guide/scale.html)  

가장 쉬운 방법은 pandas 를 쓰지 않는 것이다. 일반적으로 PostgreSQL 과 같은 대용량 데이터 도구를 사용하는 것이 훨씬 효율적이다.

## 7.1. CSV 읽기

`pandas.read_csv()` 에서 `usecols` 옵션을 통해 원하는 column 만 읽어와서 메모리를 절약할 수 있다.

### 7.1.1. Parquet 을 사용한 로딩 속도 감축

csv 파일을 [[parquet]] 포맷으로 저장하고 다시 불러오면 훨씬 속도가 빠르다. 다만 용량은 어떤지 잘 모르겠음. 직접 확인해봐야 한다.

**How?**  
`pd.read_csv` 로 불러온 뒤에 `to_parquet` 으로 저장, 그리고 `read_parquet` 수행

## 7.2. 데이터 타입 바꾸기

`DataFrame.memory_usage(deep=True)` 를 통해 각 column 의 메모리 사용량을 bytes 로 확인할 수 있다. 만약 특정 column 이 너무 많은 메모리를 사용한다면, `dtype` 을 바꾸는게 좋은 전략이다.

1. `object` 타입 데이터를 `Categorical` 타입으로 바꿀 수 있다면 메모리가 매우 절약된다.
2. `pandas.to_numeric()` 함수에 `downcast` 인자를 적절히 넣어주면, 필요한 수준의 `dtype` 을 사용할 수 있다 (e.g. `int64` -> `uint16`).

## 7.3. Chunking 사용하기

csv 파일들이 저장되어있는 전체 폴더를 parquet 으로 바꿀 수 있지만, 이를 좀 더 단순화 시켜서 개별 csv 파일들을 각각 parquet 으로 바꿀 수 있다. 변환된 각 chunk(i.e. parquet) 들이 메모리에 들어가는 한, 전체 시스템 메모리보다 더 많은 용량에 대한 작업을 수행할 수 있다.

**예시**

* 모든 csv 파일들을 parquet 형식으로 바꾼다.
* 각 parquet 을 읽어가면서 divide-and-conquer 방식으로 필요한 작업을 수행한다.

`groupby` 와 같은 메소드는 chunkwise 방식과는 어울리지 않는다. 이런 경우, 그냥 [[pySpark]] 를 쓰는게 빠를 것 같다.

## 7.4. 다른 Library 사용하기

Dask 가 괜찮다.
