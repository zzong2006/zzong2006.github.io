---
title: "Gunicorn"
aliases: []
tags:
  - network
  - server
  - python
---

# A) Gunicorn ?

UNIX 기반 OS 를 위한 [[Web Server Gateway Interface|WSGI]] HTTP 서버

[[Sanic]] application 하고 Gunicorn 을 함께 돌리기 위해서는 `sanic.worker.GunicornWorker` 인자를 함께 넣어줘야함

```sh
gunicorn myapp:app --bind 0.0.0.0:1337 --worker-class sanic.worker.GunicornWorker
```

# B) Performance Considerations

production level 에서는 `debug` 옵션을 꼭 꺼줘야 한다.

```python
app.run(..., debug=False)
```

속도 향상을 위해 `access_log` 옵션 역시 끌 수 있다.

```python
app.run(..., access_log=False)
```

`access_log` 옵션도 끄고 log 에 접근하고 싶다면 Nginx 를 proxy 로 사용하는 방법으로 이를 대신할 수 있다.

# C) Custom Application

`gunicorn.app.base.BaseApplication` 를 상속해서 WSGI application 을 만들어 볼 수 있다.

# D) References
