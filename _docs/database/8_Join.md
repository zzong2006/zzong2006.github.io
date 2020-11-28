---
layout: default
title:  "Join"
category: Database
order: 8
---

두개이상의 테이블이나 데이터베이스를 연결하여 데이터를 검색하는 방법

* 주로 정규화된 릴레이션을 통해 원하는 정보를 찾고자 할때 사용한다.
* 테이블을 연결하려면 적어도 하나의 속성은 서로 공유되고 있어야한다.

---

JOIN 연산을 예시로 보여주기 위한 두개의 테이블 `TABLE_A` 그리고 `TABLE_B`

```sql
TABLE_A
  PK Value
---- ----------
   1 FOX
   2 COP
   3 TAXI
   6 WASHINGTON
   7 DELL
   5 ARIZONA
   4 LINCOLN
  10 LUCENT

TABLE_B
  PK Value
---- ----------
   1 TROT
   2 CAR
   3 CAB
   6 MONUMENT
   7 PC
   8 MICROSOFT
   9 APPLE
  11 SCOTCH
```

## INNER JOIN

<img src="https://i.loli.net/2020/11/29/vMJZOCwPYQjLIn9.png" alt="JOIN" style="zoom:50%;" />

```sql
-- INNER JOIN
SELECT A.PK AS A_PK, A.Value AS A_Value,
       B.Value AS B_Value, B.PK AS B_PK
FROM Table_A A
INNER JOIN Table_B B
ON A.PK = B.PK

A_PK A_Value    B_Value    B_PK
---- ---------- ---------- ----
   1 FOX        TROT          1
   2 COP        CAR           2
   3 TAXI       CAB           3
   6 WASHINGTON MONUMENT      6
   7 DELL       PC            7

(5 row(s) affected)
```



## LEFT OUTER JOIN

<img src="https://i.loli.net/2020/11/29/aCQuRtdYzFpHrlI.png" alt="JOIN" style="zoom:50%;" />

왼쪽 테이블을 기준으로 중복되는 튜플을 찾는다.

```sql
-- LEFT JOIN
SELECT A.PK AS A_PK, A.Value AS A_Value,
B.Value AS B_Value, B.PK AS B_PK
FROM Table_A A
LEFT JOIN Table_B B
ON A.PK = B.PK

A_PK A_Value    B_Value    B_PK
---- ---------- ---------- ----
   1 FOX        TROT          1
   2 COP        CAR           2
   3 TAXI       CAB           3
   4 LINCOLN    NULL       NULL
   5 ARIZONA    NULL       NULL
   6 WASHINGTON MONUMENT      6
   7 DELL       PC            7
  10 LUCENT     NULL       NULL

(8 row(s) affected)
```



### RIGHT OUTER JOIN

LEFT OUTER와 비슷하다.

<img src="https://i.loli.net/2020/11/29/jhPEICzkyUbNGgu.png" alt="JOIN" style="zoom:50%;" />

```sql
-- RIGHT JOIN
SELECT A.PK AS A_PK, A.Value AS A_Value,
B.Value AS B_Value, B.PK AS B_PK
FROM Table_A A
RIGHT JOIN Table_B B
ON A.PK = B.PK

A_PK A_Value    B_Value    B_PK
---- ---------- ---------- ----
   1 FOX        TROT          1
   2 COP        CAR           2
   3 TAXI       CAB           3
   6 WASHINGTON MONUMENT      6
   7 DELL       PC            7
NULL NULL       MICROSOFT     8
NULL NULL       APPLE         9
NULL NULL       SCOTCH       11

(8 row(s) affected)
```



### FULL OUTER JOIN

<img src="https://i.loli.net/2020/11/29/KDYxWwb4pUGXhRu.png" alt="JOIN" style="zoom:50%;" />



```sql
-- OUTER JOIN
SELECT A.PK AS A_PK, A.Value AS A_Value,
B.Value AS B_Value, B.PK AS B_PK
FROM Table_A A
FULL OUTER JOIN Table_B B
ON A.PK = B.PK

A_PK A_Value    B_Value    B_PK
---- ---------- ---------- ----
   1 FOX        TROT          1
   2 COP        CAR           2
   3 TAXI       CAB           3
   6 WASHINGTON MONUMENT      6
   7 DELL       PC            7
NULL NULL       MICROSOFT     8
NULL NULL       APPLE         9
NULL NULL       SCOTCH       11
   5 ARIZONA    NULL       NULL
   4 LINCOLN    NULL       NULL
  10 LUCENT     NULL       NULL

(11 row(s) affected)
```



## LEFT EXCLUDING JOIN

LEFT OUTER JOIN에 왼쪽 릴레이션에 존재하지 않는 속성을 지닌 오른쪽 릴레이션의 튜플들만 찾는 JOIN 

<img src="https://i.loli.net/2020/11/29/k9yEnJUXOj32PWt.png" alt="Visual_SQL_Joins/LEFT_EXCLUDING_JOIN.png" style="zoom:80%;" />

```sql
-- LEFT EXCLUDING JOIN
SELECT A.PK AS A_PK, A.Value AS A_Value,
B.Value AS B_Value, B.PK AS B_PK
FROM Table_A A
LEFT JOIN Table_B B
ON A.PK = B.PK
WHERE B.PK IS NULL

A_PK A_Value    B_Value    B_PK
---- ---------- ---------- ----
   4 LINCOLN    NULL       NULL
   5 ARIZONA    NULL       NULL
  10 LUCENT     NULL       NULL
(3 row(s) affected)
```



### RIGHT EXCLUDING JOIN

<img src="https://www.codeproject.com/KB/database/Visual_SQL_Joins/RIGHT_EXCLUDING_JOIN.png" alt="Visual_SQL_Joins/RIGHT_EXCLUDING_JOIN.png" style="zoom:80%;" />

```sql
-- RIGHT EXCLUDING JOIN
SELECT A.PK AS A_PK, A.Value AS A_Value,
B.Value AS B_Value, B.PK AS B_PK
FROM Table_A A
RIGHT JOIN Table_B B
ON A.PK = B.PK
WHERE A.PK IS NULL

A_PK A_Value    B_Value    B_PK
---- ---------- ---------- ----
NULL NULL       MICROSOFT     8
NULL NULL       APPLE         9
NULL NULL       SCOTCH       11

(3 row(s) affected)
```



### OUTER EXCLUDING JOIN

LEFT 와 RIGHT EXCLUDING JOIN을 합친 결과

<img src="https://i.loli.net/2020/11/29/s6ou74W3YM2DLvF.png" alt="Visual_SQL_Joins/OUTER_EXCLUDING_JOIN.png" style="zoom:80%;" />

```sql
-- OUTER EXCLUDING JOIN
SELECT A.PK AS A_PK, A.Value AS A_Value,
B.Value AS B_Value, B.PK AS B_PK
FROM Table_A A
FULL OUTER JOIN Table_B B
ON A.PK = B.PK
WHERE A.PK IS NULL
OR B.PK IS NULL

A_PK A_Value    B_Value    B_PK
---- ---------- ---------- ----
NULL NULL       MICROSOFT     8
NULL NULL       APPLE         9
NULL NULL       SCOTCH       11
   5 ARIZONA    NULL       NULL
   4 LINCOLN    NULL       NULL
  10 LUCENT     NULL       NULL

(6 row(s) affected)
```



## 정리

![Image 8](https://i.loli.net/2020/11/29/uSvEkIF9lKHXqPB.png)


