---
tags: ["database"]
---

# Sqlite ?

## incremental_vacuum

vacuum 과 달리 incremental_vacuum 은 DB 에 임시 복사파일을 만들지 않음. 대신, free pages 를 DB 끝에 옮기고 잘라버린다 (truncate). 일반적으로 trade-off 가 발생한다.

인자없이 incremental_vacuum 을 호출하면 얘는 모든 free pages 를 지우려고 한다. 이런 방식을 “entire” incremental vacuum 이라고 부른다. 양의 정수값을 통해 freelist 에 있는 pages 를 얼마나 많이 지우려 하는지 명시할 수 있다. 이는 “granular” 방식으로 불린다.

# References

https://www.theunterminatedstring.com/sqlite-vacuuming/
