---
layout: default
title:  "REST API"
category: Network
order: 5
---

## API(Application Programming Interface)

API는 어떠한 응용프로그램에서 데이터를 주고 받기 위한 방법을 의미한다. 또한, 데이터 공유 시, 어떤 방식으로 정보를 요청하고 어떠한 데이터를 제공받을 수 있는지에 대한 규격(인터페이스)도 API라고 한다.



## REST(REpresentational State Transfer)

REST 아키텍처의 제약 조건을 준수하는 API를 의미한다.  REST API는 HTTP 프로토콜을 기반하여 동작한다.

### REST의 특징

1. Uniform Interface: URI로 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행한다.

2. Stateless: 서버에서 클라이언트의 context(세션 정보나 쿠기 정보)를 별도로 저장하고 관리하지 않고, API 서버는 들어오는 요청만을 단순히 처리한다(단순 구현).

3. Caching: HTTP 웹 표준에서 제공하는 캐싱 기능을 적용할 수 있다.

4. Client-Server: 클라이언트와 서버 각각의 역할이 확실히 구분되어, 둘 간 의존성을 줄인다.

5. Hierarchical system: REST 서버는 다중 계층으로 구성될 수 있으며, 프록시나 게이트웨이 같은 네트워크 기반의 중간 매체를 적용할 수 있다.

6. Code on Demand (optional): 클라이언트는 리소스에 대한 표현을 응답으로 받고 처리해야 하는데, 어떻게 처리해야 하는지에 대한 Code를 서버가 제공하는 것을 의미

### REST API 디자인 가이드

1. 서버에 있는 모든 resource는 클라이언트가 바로 접근할 수 있는 고유 URI가 존재해야 한다.
2. 자원에 대한 행위는 반드시 HTTP Method(GET, POST, PUT, DELETE)로 표현한다.
   * PUT: 리소스 수정
   * DELETE: 리소스 삭제