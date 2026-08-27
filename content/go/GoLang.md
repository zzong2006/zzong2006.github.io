---
tags: ["programming", "language", "server"]
---

# A) GoLang ?

복잡한 변수 출력할땐 go-spew 활용하는 것이 유용함: [go - How to print struct variables in console? - Stack Overflow](https://stackoverflow.com/a/34480005/4533917)

```python
process = subprocess.Popen(['./benchmarker','dataset', '-u', weaviate_url, '-c', 'Benchmark', '-q', 'queries.json', '-p', str(CPUs), '-f', 'json', '-l', str(l)], stdout=subprocess.PIPE)
```

# B) Keywords

## B.1) Defer

`defer` 키워드는 특정 문장 혹은 함수를 나중에 (defer 를 호출하는 함수가 리턴하기 직전에) 실행

## B.2) Nil

함수가 결과와 함께 에러를 반환한다면, 이 에러가 `nil` 인지를 체크해서 에러가 없는지를 체크할 수 있다.

```go
func main() { 
	f, err := os.Open("C:\\temp\\1.txt") 
	if err != nil { 
		log.Fatal(err.Error()) 
	} 
	println(f.Name()) }
```

# C) Lesson Learned

struct 변수 이름은 항상 대문자로 시작할 것 !

[JSON-to-Go: Convert JSON to Go instantly](https://mholt.github.io/json-to-go/) 이거 쓰면 편함

# D) References
