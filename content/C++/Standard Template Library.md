---
tags: ["Cpp"]
aliases: ["STL"]
---

# A) C++ STL ?

# B) Vector

## B.1) Functions

### B.1.1) emplace_back

C++11 부터 추가된 멤버 함수로써, vector 의 요소 끝에 원소를 추가하는 함수

#### B.1.1.1) Vs. push_back

`push_back` 은 삽입 함수이고, `emplace_back` 은 생성 삽입 함수이다.

삽입 함수는 삽입할 객체를 입력받지만, 생성 삽입 함수는 삽입할 객체의 생성자를 위한 parameter 를 받아서 `std::vector` 내에서 직접 객체를 생성하여 삽입한다.
즉, 임시 객체의 생성과 파괴, 복사를 하지 않아도 되어서 성능상 유리함

# C) Tie

`pair` 나 `tuple` 에 묶은 값들을 여러 변수에 대해서 한번에 assign 가능한 방식

## C.1) 예시

```c++
#include <iostream>
#include <tuple>

int main() {
	auto t = make_tuple(1, 2, 3);

    int x = get<0>(t);
    int y = get<1>(t);
    int z = get<2>(t);

    cout << x << ' ' << y << ' ' << z << '\n';    //1 2 3

    x = y = z = 0;
    cout << x << ' ' << y << ' ' << z << '\n';    //0 0 0
    
    std::tie(x, y, z) = t;
    cout << x << ' ' << y << ' ' << z << '\n';    //1 2 3

    x = y = z = 0;
    std::tie(x, y, ignore) = t;    //세번째 자리는 무시 키워드 : ignore
    cout << x << ' ' << y << ' ' << z << '\n';    //1 2 0

    return 0;
}
```

# D) References
