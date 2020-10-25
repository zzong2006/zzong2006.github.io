---
title: Latex
category: Github Page by Jekyll
order: 1
---

latex (Katex 기준) 적용 시, 스마트폰이나 타블렛으로 latex 식을 확인할 때, 수식이 너무 길면 불편한 경우가 있다.

이러한 경우를 대비하기 위해, 다음과 같이 메인 `scss`파일에 아래의 내용을 추가한다.

```scss

@media only screen and (min-device-width : 320px) and (max-device-width : 1024px) {
	.katex-display > .katex {
		display: inline-block;
		max-width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		text-align: initial;
	}
}

.katex {
	white-space: normal;
}

.katex .katex-html {
	overflow-wrap: normal;
}

```





