---
title: "proxy"
tags: ["network"]
aliases: ["프록시"]
---

# A) Proxy ?

클라이언트가 자신 (Proxy) 을 통해서 다른 네트워크 서비스에 간접적으로 접속할 수 있게 해주는 컴퓨터 시스템이나 응용 프로그램을 의미한다. 즉, 클라이언트와 서버 사이에 존재하며 대리로 통신을 수행하는 것을 의미한다.

# B) Proxy 사용하는 이유

1. 보안  
2. cache 사용으로 인한 네트워크 병목 현상 완화
3. 지역 제한 우회

# C) Proxy 종류

## C.1) Forward Proxy

가장 일반적인 프록시.

클라이언트가 어떤 웹에 접속을 요청할 때, 직접 연결을 시도하지 않고 프록시 서버가 연결 요청을 대신 받는다. 응답 역시 웹 대신 받아서 클라이언트에게 전달해준다.

아래는 포워드 프록시를 설명하는 그림이다.

![|500](https://i.imgur.com/n2b6umM.png)

## C.2) Reverse Proxy

[[reverse proxy]] 참조

# D) References

# F) Tips

## F.1) Pip 설치 오류

`pip` 설치가 안되는 경우 프록시 서버를 통해 설치할 수 있다.

**예시**

```bash
pip install --proxy="https://192.168.0.1:8080" django
```

pip config 파일 (`pip.ini`) 에 proxy 를 추가하면 자동으로 proxy 가 적용된다.

`unset http_porxy https_proxy HTTP_PROXY HTTPS_PROXY`
