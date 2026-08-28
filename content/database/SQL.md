---
title: "SQL"
tags: ["SQL"]
---
```table-of-contents
```
# A) SQL ?

[[SQL Tip]]

* `LIMIT`: 테이블 가장 상위의 행 하나만 출력하기 `SELECT * FROM sample LIMIT 1`
	* SUM,MAX, MIN 의 aggregation 을 이용해서 하나만 출력할 수 있다.
	* 관련 문제
		* [weather observation station](https://www.hackerrank.com/challenges/weather-observation-station-5/problem)
* `REGEXP`: regular expression
	* `a, e, i, o, u` 로 시작하는 이름 출력: `SELECT * FROM sample WHERE name REGEXP "^[aeiou].*"`
		* `^`: 시작하는 문자열
			* `^hi`: `hi` 로 시작하는 문자열 찾기
		* `[]`: `[]` 안에 나열된 패턴 중 하나
			* `[123]d`: `1d` 또는 `2d` 또는 `3d` 인 문자열 찾기
		* `.`: 문자 하나
	* `a, e, i, o, u` 로 시작하지 않는 이름 출력: `SELECT * FROM sample WHERE name REGEXP "^[^aeiou].*"`
		* `[^문자]`: 괄호 안의 문자를 포함하지 않음 (부정)
	* `a, e, i, o, u` 로 끝나는 이름 출력: `SELECT * FROM sample WHERE name REGEXP "[aeiou]$";`
* `$`: 끝나는 문자열
			- `hi$`:`hi` 로끝나는문자열찾기
* 중요한점은 `^` 와위치가반대임
* regular expression 시각화
	* https://regexper.com/
* 관련문제
-[WeatherObservationStation6](https://www.hackerrank.com/challenges/weather-observation-station-6/forum)
-[WeatherObservationStation7](https://www.hackerrank.com/challenges/weather-observation-station-7/problem)
* 중복제거
-tuple 중복에는 DISTINCT 사용:`SELECTDISTINCT*FROMsample`
-COUNT 와중복해서사용하는법:`SELECTCOUNT(DISTINCTname)FROMsample`
* 특정 column 중복에는 GROUPBY 사용:`SELECT*FROMsampleGROUPBYname`
-BETWEEN
* 특정값사이에존재하는값만추출하기:`SELECT*FROMsampleWHEREvalBETWEENmin_valANDmax_val`
-NULL 처리
-NULL 제거:`SELECT*FROMsampleWHEREnameisnotNULL`
-COUNT 사용시,NULL 은알아서제외하고 count 함
-IFNULL(NULL 값이면다른값으로처리):`SELECTIFNULL(name,'Noname')FROMsample`
* 날짜데이터추출
-YEAR,MONTH,DAY,HOUR,MINUTE,SECOND
* 날짜출력포맷변경:`SELECTDATE_FORMAT(datetime,'%Y-%m-%d)fromsample`
* 시/분/초:%h-%i-%s(%H 는 24 시간,%h 는 12 시간단위)
-column 포맷변환 (CAST):`SELECTCAST(datetimeASDATE)fromsample`
* 날짜차이:DATEDIFF(d1,d2) 또는 d1-d2(d1 가이후그리고 d2 가이전이여야양수값)
-JOIN
-OUTERJOIN
-`SELECT*FROMsampleASaLEFTOUTERJOINsample_2ASbONa.name=b.name`
-INNERJOIN
-`SELECT*FROMsampleASaINNERJOINsample_2ASbONa.name=b.name`
* 다른방법:`SELECT*FROMsamplea,sample_2bWHEREa.name=b.name`
* 응용가능 (이름이같거나성적이같거나)
-`SELECT*FROMsamplea,sample_2bWHEREa.name=b.nameORa.grade=b.grade`
* 관련문제
-[TopCompetitors](https://www.hackerrank.com/challenges/full-score/problem)
-CASE 또는 `IF`
-`IF`
-`IF(condition,ifyes,ifno)`
* 이름에’woo’가들어가있으면’O’로표시
-`SELECTCASEWHENnameLIKE'%woo%'THEN'O'FROMsample`
-IF 를사용한버전 (안들어가있으면’X’표시도추가)
-`SELECTIF(nameLIKE'%woo%','O','X')FROMsample`
-`RIGHT`
* 문자열의오른쪽에서 `N` 번째까지추출함
* 예시
-Orderbylastthreecharacters
-`SELECTnameFROMstudentsORDERBYRIGHT(name,3)`
-`HAVING`
-Aggregation(GROUPBY,SUM,COUNTetc.) 에조건문처럼쓰임
-`SELECTCOUNT(CustomerID)FROMCustomersGROUPBYCountryHAVINGCOUNT(CustomerID)>5`
-`WHERE` 절은 aggregation 에서사용할수없음
-`IN`
* 특정 value 에포함된 record 만추려냄
-`SELECT*FROMCustomersWHERECountryIN('Germany','France','UK')`
-`SELECT*FROMCustomersWHERECountryIN(SELECTCountryFROMSuppliers)`
-`TRUNCATE`
* 주어진숫자의소수점을절삭함
-4 번째자리까지절삭하고싶을때:`SELECTTRUNCATE(val,4)FROMsample`
-WithRecursive
-1 부터 10 까지포함하는테이블만들기
-`withrecursivef(n)as(select1unionallselectn+1fromfwheren<10)`
* 사용:`selectnfromf`
-String
-string 서로붙이기:`||`
-`star||bucks`=`starbucks`
-`rank`
-`rank` 는 tie 발생시,동일한랭크를할당한다 (공동 1 위개념)
* 중복이없는랭킹을원한다면 `row_number` 를사용하자.

# B) SQL 기초 요약

[[SQL Tip]]

---

## B.1) 행 제한

* **LIMIT**: 테이블에서 가장 상위의 행 하나만 출력하려면
  `SELECT * FROM sample LIMIT 1`
* 집계 함수(SUM, MAX, MIN 등)를 이용해서도 한 행만 출력 가능
* 관련 문제: [weather observation station](https://www.hackerrank.com/challenges/weather-observation-station-5/problem)

---

## B.2) 정규표현식(REGEXP)

* **REGEXP**: 정규표현식을 사용하여 문자열을 검색할 수 있습니다.
	* 이름이 a, e, i, o, u 중 하나로 시작하는 경우
	  `SELECT * FROM sample WHERE name REGEXP "^[aeiou].*"`
		* `^`: 문자열의 시작
		* `[]`: 괄호 안에 나열된 문자 중 하나
		* `.`: 임의의 한 문자
	* 이름이 a, e, i, o, u로 시작하지 않는 경우
	  `SELECT * FROM sample WHERE name REGEXP "^[^aeiou].*"`
		* `[^문자]`: 괄호 안 문자를 제외한(부정) 패턴
	* 이름이 a, e, i, o, u로 끝나는 경우
	  `SELECT * FROM sample WHERE name REGEXP "[aeiou]$"`
		* `$`: 문자열의 끝
	* 예시:
		* `"^hi"`: hi로 시작하는 문자열
		* `"hi$"`: hi로 끝나는 문자열 (참고: ^는 시작 위치 의미이고 $는 끝 위치 의미임)
* 정규표현식 시각화 도구: [https://regexper.com/](https://regexper.com/)
* 관련 문제:
	* [Weather Observation Station 6](https://www.hackerrank.com/challenges/weather-observation-station-6/forum)
	* [Weather Observation Station 7](https://www.hackerrank.com/challenges/weather-observation-station-7/problem)

---

## B.3) 중복 제거 및 그룹핑

* **중복 튜플 제거:**
  `SELECT DISTINCT * FROM sample`
* **특정 컬럼 중복 제거 및 개수 세기:**
  `SELECT COUNT(DISTINCT name) FROM sample`
* **GROUP BY**를 활용한 특정 컬럼 단위 그룹핑:
  ```python
  SELECT *
    FROM sample
   GROUP BY name;
  ```

---

## B.4) 값 범위 및 NULL 처리

* **BETWEEN:** 특정 값 사이에 있는 값만 추출
  ```python
  SELECT *
    FROM sample
   WHERE val BETWEEN min_val AND max_val;
  ```
* **NULL 처리**
	* NULL 값이 아닌 데이터만 추출
	  `SELECT * FROM sample WHERE name IS NOT NULL`
	* COUNT는 자동으로 NULL을 제외하고 셈
	* IFNULL을 통해 NULL 값을 다른 값으로 대체 가능
	  `SELECT IFNULL(name,'Noname') FROM sample`

---

## B.5) 날짜/시간 다루기 및 포맷 변경

* 날짜/시간에서 연도(YEAR), 월(MONTH), 일(DAY), 시(HOUR), 분(MINUTE), 초(SECOND) 추출 가능.
* 날짜 포맷 변경 예시:
	```python
    SELECT DATE_FORMAT(datetime,'%Y-%m-%d') from sample;
    ```
	 (%H는 24시간제, %h는 오전/오후 구분)
 
* 타입 변환(CAST):
   ```python
   SELECT CAST(datetime AS DATE) from sample;
   ```

* 날짜 차이 계산:
   ```python
   DATEDIFF(d1,d2) 또는 (d1-d2)
   ```
   (d1이 d2보다 이후라야 양수 결과)

---

## B.6) JOIN(조인)

### B.6.1) OUTER JOIN (LEFT OUTER JOIN)

```python
SELECT *
FROM sample AS a LEFT OUTER JOIN sample_2 AS b ON a.name = b.name;
```

### B.6.2) INNER JOIN

```python
SELECT *
FROM sample AS a INNER JOIN sample_2 AS b ON a.name = b.name;

-- 또는 아래와 같이도 가능:
SELECT *
FROM sample a,sample_2 b
WHERE a.name = b.name;
```

### B.6.3) 응용(예: 이름이나 성적 중 하나라도 일치하는 경우)

```python
SELECT *
FROM sample a,sample_2 b
WHERE a.name = b.name OR a.grade = b.grade;
```

#### B.6.3.1) 관련 문제: [Top Competitors](https://www.hackerrank.com/challenges/full-score/problem)

---

## B.7) 조건 분기(CASE / IF문)

### B.7.1) CASE문 예시

```python
SELECT CASE WHEN name LIKE '%woo%' THEN 'O' END FROM sample;
```

### B.7.2) IF문 예시 (조건 미일치시 X 표시)

```python
SELECT IF(name LIKE '%woo%', 'O', 'X') FROM sample;
```

---

## B.8) 문자열 다루기

### B.8.1) 오른쪽(N번째까지) 추출(RIGHT)

예시–마지막 세 글자로 정렬하기:
```python
SELECT name 
FROM students 
ORDER BY RIGHT(name,3);
```

### B.8.2) 문자열 합치기(CONCAT)

MySQL에서는 CONCAT 사용 / 일부 DBMS에서는 || 사용 가능.
예시: star || bucks → starbucks

---

## B.9) 집계 조건(HAVING)

집계 결과에 조건을 걸 때 HAVING 사용(WHERE와 차이 주의).
예시–국가별 고객 수가 5명 초과인 경우만 출력:
```python
SELECT COUNT(CustomerID)
FROM Customers
GROUP BY Country
HAVING COUNT(CustomerID) >5;
```
※ WHERE 절은 집계 결과에는 사용할 수 없음.

---

## B.10) IN 연산자

특정 값 목록 또는 서브쿼리 결과에 포함되는 레코드만 추출.
예시:

```sql
-- 여러 값을 지정해서 찾기
SELECT *
FROM Customers 
WHERE Country IN ('Germany','France','UK');

-- 서브쿼리 결과와 비교하기    
SELECT *
FROM Customers 
WHERE Country IN (SELECT Country FROM Suppliers);
```

---

## B.11) 숫자 절삭(TRUNCATE)

소수점 이하 절삭할 때 사용.
예시–소수점 네 번째 자리까지 자르기:
`SELECT TRUNCATE(val,4) FROM sample;`

---

## B.12) 재귀 쿼리 (WITH RECURSIVE)

1부터 n까지 포함하는 테이블 만들기 예제:

```sql
WITH RECURSIVE f(n) AS (
     SELECT 1 
     UNION ALL 
     SELECT n+1 FROM f WHERE n<10 )
-- 사용 방법       
select n from f;       
``` 

---

## B.13) 랭킹 함수(RANK / ROW_NUMBER)

**RANK** 함수는 동점자가 있으면 동일한 순위를 부여함(공동 순위).
중복 없는 랭킹을 원한다면 ROW_NUMBER를 사용할 것.

---문자열 다루기

### B.13.1) 오른쪽(N번째까지) 추출(RIGHT)

예시–마지막 세 글자로 정 포맷 변경 끝
