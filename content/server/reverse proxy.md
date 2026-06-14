---
tags: ["work", "network"]
---

# A) Reverse Proxy ?

reverse proxy 는 Forward proxy 와 반대 방식이다.

클라이언트가 어떤 웹에 데이터를 요청하는 경우 포워드 방식과는 달리 인터넷을 통해 리버스 프록시에 도착한다. 요청을 받은 리버스 프록시는 내부 서버에게 데이터를 전송하고 응답을 받으면 클라이언트에게 전송한다.

아래는 리버스 프록시를 설명하는 그림이다.

![](https://i.imgur.com/Bqm1JIh.png)

# B) Reverse Proxy 사용 이유

내부 서버의 보안성을 높일 수 있다.

일반적인 기업의 네트워크 환경은 이 리버시 프록시 방식을 이용한다.

즉, 리버스 프록시 서버를 외부에 두고, 실제 서비스하는 서버는 내부 서버망에 위치 시킨다. 이후 리버스 프록시 서버만 서비스 서버와 통신할 수 있도록 한다.

# C) Stargate 에서의 Reverse Proxy

[[Stargate|스타게이트]] 가 받은 HTTP 요청에 들어있는 데이터 중 지정된 header 와 data 를 [[Starport]] 로 전달한다. 

## C.1) Example

```python
...
"toros_reverse_proxy_test": {
	"type": "starport",
	"tpl": "$starport_dot",
	"starport_uri":"http://...",
	"reverse_proxy":{
	"pass_headers":["Content-Type"],
	"pass_body":["my-param"]
	}
}
...```
- `pass_headers`에 `header`요청에 있는 경우 지정된 `header`를 스타포트 요청에 포함시키며, `pass_body`에 지정된 파라미터가 request body에 있는 경우, 해당 데이터를 starport 요청에 포함시킨다.



# References
 - [stargate rule wiki](https://github.daumkakao.com/toros/stargate/wiki/_Rules#331-reverse_proxy)
