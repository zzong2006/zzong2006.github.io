---
title: "Sanic"
tags: ["python", "server"]
---

# Sanic ?

Sanic is __both__ a framework and a web server.

hello world application: `sever.py`

```python
from sanic import Sanic
from sanic.response import text

app = Sanic("My Hello, world app")

@app.get("/")
async def hello_world(request):
    return text("Hello, world.")\
```

Let’s save the above code as `server.py`.

And launch it by `sanic server.app`

## Some Notes

Every request handler can either be sync (`def hello_world`) or async (`async def hello_world`).

Unless you have a clear reason for it, always go with `async`.

The `request` object is always the first argument of your handler.

* Other frameworks pass this around in a context variable to be imported.
* In the `async` world, this would not work so well and it is far easier (not to mention cleaner and more performant) to be explicit about it.
	* Explicit Call: You __must__ use a response type.
		* MANY other frameworks allow you to have a return value like this: `return "Hello, world."` or this: `return {"foo": "bar"}`.
		* But, in order to do this implicit calling, somewhere in the chain needs to spend valuable time trying to determine what you meant.
		* So, at the expense of this ease, Sanic has decided to require an explicit call.

# References
