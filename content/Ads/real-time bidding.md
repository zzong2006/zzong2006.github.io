---
title: "real-time bidding"
tags: ["advertisement"]
aliases: ["RTB"]
---

# A) Real-time Bidding ?

광고 지면 실시간 (자동화) 경매 시스템을 의미한다.

광고를 팔려는 측 (” 매체 “) 에서 쿠키 ID (유저의 접속 기록) 를 보내주면 광고를 사려는 측 (” 광고주 “) 에서 그 ID 에 맞는 가격 (Bidding CPM, [[eCPM]]) 을 제시하는데, 여러 광고주가 동시에 가격을 제시하고, 그 중에서 최고가를 써낸 광고주에게 광고 지면을 판매하는 경매 방식으로 지면이 거래가 된다.

광고주는 내가 원하는 ID 에 맞춰서 광고가 나가서 좋고, 매체 측에서는 비싸게 팔아서 좋다.

## A.1) 과정 도식화

![](https://i.imgur.com/GgFVWyJ.png)

1. AD Exchange 가 DSP 로 광고 제공 요청을 보냄 (SSP 가 빈 지면을 AD Exchange 에 보냄): BidRequest
2. 지면을 제공하는 매체, 유저 데이터를 이용해 해당 지면에 적절한 광고 매체를 선정
3. 해당 매체를 RTB (Real-Time Bidding) 방식을 통해 입찰가를 선정하여 입찰: BidResponse

# B) Related

# C) References
