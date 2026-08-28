---
title: "Super Key"
tags: ["database", "relation"]
---

# A) Super Key

Super Key는 relation에서 tuple을 유일하게 식별할 수 있는 attribute 집합이다. 유일성을 만족하기만 하면 되므로, 꼭 최소 집합일 필요는 없다.

# B) Candidate Key와의 차이

[[database/Candidate Key|Candidate Key]]는 더 이상 attribute를 제거할 수 없는 최소 Super Key다. 예를 들어 `{student_id}`만으로 학생을 식별할 수 있다면 `{student_id, name}`도 Super Key지만 Candidate Key는 아니다.

# References
