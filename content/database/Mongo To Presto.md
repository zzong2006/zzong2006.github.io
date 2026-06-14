---
title: "Mongo To Presto"
tags: ["recoteam", "Youtube"]
---

* Metadata
	* Link: {{[[video]]: https://www.youtube.com/watch?v=ItrUVChQhQA&ab_channel=Recotechkakao}}
	* Related Reference: None
	* Type: [[Reference Note]]
* Body
	* [[MongoDB]] collection 을 [[database/Presto]] query 를 통해 얻어오는 방법
	* mongoDB
		* semicolon `:` 기준으로 key 와 value 로 나뉘어 적재됨
	* Nifi
		* mongoDB 와 Presto 의 중계 역할
		* 접속 관련 내용 slack 공유
		* 하는 방법
			* collection 수집 카드 클릭
			* 원하는 카드를 복사 붙여넣기 할수있음
				* 아니면 새로 만들어도됨
			* mongoDB 에서 json
				* Nifi: aurochs MongoDBControllerService
			* 형식을 가져와서 split, attribute 생성,
			* Projection


* Metadata  
	* Link: {{[[video]]: https://www.youtube.com/watch?v=ItrUVChQhQA&ab_channel=Recotechkakao}}  
	* Related Reference: 없음  
	* Type: [[Reference Note]]

* Body  
	* [[MongoDB]]의 collection 데이터를 [[database/Presto]]에서 쿼리로 조회하는 방법에 대해 정리합니다.  
	* mongoDB에서는 데이터가 세미콜론 `:`을 기준으로 key와 value로 구분되어 저장됩니다.  
	* Nifi는 mongoDB와 Presto 사이에서 중계 역할을 담당합니다.  
		* 접속 관련 사항은 Slack을 통해 공유합니다.  
		* 구체적인 절차는 다음과 같습니다.  
			1. collection 수집 카드를 클릭합니다.  
			2. 원하는 카드를 복사해서 붙여넣거나, 새롭게 생성할 수도 있습니다.  
			3. mongoDB에서 json 형식의 데이터를 가져옵니다.
				- Nifi에서는 aurochs MongoDBControllerService를 사용합니다.
			4. 가져온 데이터의 형식을 split하여 attribute를 생성합니다.
			5. Projection 작업을 수행합니다.