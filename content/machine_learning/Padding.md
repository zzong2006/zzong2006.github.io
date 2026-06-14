---
tags: ["deep_learning CNN", "plzlookup"]
---

# A) Padding ?

Padding 은 [[convolution]] 연산을 적용할 때 사용하는 기법이다.

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2F9jHLd2FsUq.png?alt=media&token=3ba9e1dd-b9c4-4ba2-adb9-8f2e704caa57)

Padding 을 사용하는 두 가지 이유

1. [[convolution]] 연산 후 output 이미지가 크게 축소되는 것을 방지한다.
2. 가장자리의 픽셀이 [[convolution]] 연산에 적게 사용되어 필터링된 정보는 이에 대한 정보가 그리 많지않다.

	* ![image-20201105153432824](https://i.loli.net/2020/11/05/I6sWxKpAZbNrG27.png)
	* 빨간색 네모는 필터가 여러번 적용되는 반면, 초록색 네모는 두 번밖에 적용되지 않는다.
* [[Padding]] 적용 후 [[convolution]] 연산의 크기 계산
	* Convolution Filter 크기가 $f$ 고, padding size 가 $p$ 면, 변환된 $n\timesn$ 의 이미지 크기 $n'\times n'$ 는 다음과 같다.
		* $(n+2p-f)+1=n'$
* Valid and Same [[convolution]]
	* Valid 는 [[Padding]] 을 적용하지 않는 기법을 의미한다.
	* Same 은 입력 사이즈와 같은 사이즈가 나오도록 [[Padding]] 을 적용하는 방법이다.
		* Same 을 위한 [[Padding]] size $p$ 는 다음과 같다.

$$
\displaystyle n+2p-f+1=n\rightarrow p=\frac{f-1}{2}
$$

# B) Related

# C) References
