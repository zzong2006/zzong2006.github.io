---
tags: ["language"]
---

# Shell Script ?

comment: `#`

script 의 가장 첫번째 라인 `#!` 는 그 스크립트가 `#!` 이후의 프로그램으로 실행되야 한다는 것을 의미

예시) `#!/bin/sh` 또는 `#!/usr/bin/perl`

`$0` 부터 `$9` 까지, 그리고 `$#`

* `$0`: 호출된 script 이름 (basename)
	* `$1` 부터 `$9` 까지: script 가 호출될 때 사용된 9 개의 parameters
		* `$@`: 모든 parameters(default)
-`$*`: `$@` 와비슷하지만 whitespace 를포함하지않음 (avoidthis)
* 예시)“Filewithspaces”becomes“File”“with”“spaces”
-`$#`: script 가 호출될 때 총 parameter 개수
	* `$?`: 마지막 command 실행의 exitstatus
* `shift` command([참고](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=teastful&logNo=140156472235))
* 입력받은 parameter 들을 left 로 shift 하는 command
-`shiftn` 으로수행할수있으며,`$#` 는 `n` 만큼 감소한다
	* 예시) `a b c d e` 의 인수가 주어졌을 때, `shift 2` 수행 후 `c d e` 만 남는다.
* 변수 할당
	- 
* `set` command ([link](http://linuxcommand.org/lc3_man_pages/seth.html))
	* Set or unset values of shell options and positional parameters
	* `-e`: Exit immediately if a command exits with a non-zero status.

# String

* `${varname:-word}`: `varname` 이 존재하면 (not null) 그 값을 반환하고 그렇지 않으면 `word` 를 반환한다.

# References

* https://www.shellscript.sh/
