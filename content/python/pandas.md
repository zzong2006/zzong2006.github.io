* [[tip/Pandas]]

# A) `groupby`

* 다음과 같은 [[DataFrame]] 을 보유하고 있다고 가정하자.

```plain text
   code    Countries
0   999  Switzerland
1   113  Switzerland
2   112        Japan
3   112  Switzerland
4   113       Canada
5   114        Japan
6   100      Germany
7   114        Japan
8   115      Germany
```

## A.1) `nunique`

* 국가에 따라서 고유한 코드 개수가 몇 개 있는지 세어보자.

```python
df.groupby('Countries')['code'].nunique()
```

```plain text
Countries
Canada         1
Germany        2
Japan          2
Switzerland    3
Name: code, dtype: int64
```

# B) `unique`

* `nunique` 와 비슷하지만 고유한 개수 대신, 값 자체를 리스트 형식으로 반환한다.
* `df.groupby('Countries')["code"].unique()`
* ```plain text

Countries  
Canada [113]  
Germany [100, 115]  
Japan [112, 114]  
Switzerland [999, 113, 112]  
Name: code, dtype: object```

# C) `map`

* 주어진 `DataFrame` 또는 `Series` 에 입력값을 적용한다.
* 딕셔너리 타입의 값을 입력받으면, 딕셔너리의 `key` 와 동일한 값을 `value` 로 바꾼다.

**예시**

```plain text
0      cat
1      dog
2      NaN
3   rabbit
dtype: object```
            - `s.map({'cat': 'kitten', 'dog': 'puppy'})` 적용 후
            - ```plain text
0   kitten
1    puppy
2      NaN
3      NaN
dtype: object
```
