---
layout: default
title:  "DB Connection Pool & Thread Pool"
category: Database
order: 3
---

클라이언트의 요청에 따라 각 어플리케이션의 thread에서 데이터베이스에 접근하기 위해서는 연결(Connection)이 필요하다.

### DB Connection Cycle

1. 어플리케이션 데이터 층(layer)에서 `DataSource`에게 DB Connection을 요청한다.
2. `DataSource` 는 DB 연결을 수립하기 위해 DB 드라이버를 사용한다.
3. DB 연결이 생성되고 TCP 소켓이 열린다. 이제 어플리케이션과 DB는 연결되었다.
4. 어플리케이션이 DB에 읽고 쓰기를 반복한다.
5. DB 연결이 더 이상 필요하지 않다면, 연결을 닫는다.
6. 이후 소켓도 닫는다.

## Connection Pool (연결 풀)

DB로의 추가 요청이 필요할 때 연결을 재사용할 수 있도록 관리되는 DB 연결의 캐시

* DB 연결 정보를 캐시(연결 풀)에 저장 및 관리하여 application 단에서 DB 연결 정보가 필요할 때마다 Connection pool 에서 연결 정보를 가지고 와 사용하도록 한다.
* 쉽게 생각하면, 연결 풀이라는 캐시안에 여러개의 연결 자원이 있고, 사용자는 DB에 연결하고 싶을 때마다 연결 자원을 풀에서 꺼내 사용하는 것으로 생각하면 된다.

![img](https://i.loli.net/2020/11/25/lyLDwPV81pqhEfe.png)

**장점**: 각 사용자마다 DB 연결을 열고 유지보수하는데 비용이 많이 들고 자원을 낭비하므로, 연결이 수립된 이후 풀에 위치시키면, 새로운 연결을 수립할 필요가 없어진다. 

* 어떤 방식으로 비용이 절약되는가? DB 에 연결하기 위한 **연결 정보 생성 시간을 절약**할 수 있다.

**단점**: Pool에 연결을 DB 연결 요청보다 너무 많이 생성해 놓으면, 메모리 낭비가 발생할 수 있다.

### Connection Pool Cycle

1. DB와 연결된 연결 객체들을 미리 생성하여 pool에 저장한다.
2. Application이 `DataSource`에 DB 연결을 요청하면, pool에서 Connection 객체를 가져와 DB에 접근한다.
   * Pool에 생성된 Connection을 모두 사용했을 때 연결 요청이 들어온다면, 요청한 클라이언트는 대기 상태로 전환시키고 Pool에 Connection이 반환되면 대기 상태에 있는 클라이언트에게 순차적으로 제공된다.
3. 처리가 끝나면 다시 pool에 반환한다.

![img](https://i.loli.net/2020/11/25/wu6gG8FnHMms3z5.jpg)



## Thread Pool (스레드 풀)

작업 처리에 사용되는 스레드를 제한된 개수만큼 정해 놓고, 작업 큐(Queue)에 들어오는 작업들을 하나씩 스레드가 맡아 처리하는 것

<img src="https://i.loli.net/2020/11/25/xiosvQ15F3XIZrp.jpg" alt="img" style="zoom:67%;" />

**장점**: 스레드를 생성 및 수거하는데 드는 비용이 절약된다. 또한, 이러한 장점에 의해 작업 실행에 딜레이 발생 정도를 완화할 수 있다.

**단점**: DB 연결 Pool과 비슷하게, 스레드를 너무 많이 생성해 놓으면 메모리 낭비가 발생한다.

