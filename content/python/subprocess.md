---
title: "subprocess"
---
* [[Python]] subprocess - [link](https://docs.python.org/3/library/subprocess.html)
	* `subprocess.run` 함수
		* `shell`: true 라면, 새로운 shell 을 띄워서 해당 프로세스를 호출하게 된다.
			* shell injection 에 취약한 문제가 존재한다.
		* `check`: If check is true, and the process exits with a non-zero exit code, a CalledProcessError exception will be raised. Attributes of that exception hold the arguments, the exit code, and stdout and stderr if they were captured.
