---
title: "django"
aliases: []
tags:
  - server
---

# A) Django ?

# B) Lesson Learned

## B.1) CSRF 에러 발생 시 해결법

`{{csrf_token}}` 을 parameter 에 넣어주면 된다.

**예시**

```javascript
ajax: {
	...
	type: "POST",
	"data": function ( d ) {
		d.csrfmiddlewaretoken = '{{ csrf_token }}';
		return $.param( d );
	},
},
```
