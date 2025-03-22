# XRPL 해커톤 관련 소소한 정보

## XRPL(XRP Ledger) 소개

XRP Ledger는 빠르고, 지속가능하며, 분산화된 블록체인 플랫폼입니다. 주요 특징은 다음과 같습니다:

- **Base Reserve**: 네트워크 스팸 방지를 위한 최소 예치금 제도
  - 신규 계정 생성시 최소 1 XRP 이상 필요
  - Object 생성시 추가 Reserve 필요 (NFT, Trust Line 등)
- **빠른 처리 속도**: 3-5초의 거래 완결성
- **낮은 수수료**: 일반적으로 거래당 0.00001 XRP

## XRPL 주요 기능

XRPL Ledger는 아래와 같은 기능들을 제공합니다.

### 1. 결제 및 금융 기능

- **Payment**: 기본적인 XRP 송금 및 발행된 토큰 전송
- **Cross-Currency Payment**: 서로 다른 통화 간 자동 환전 및 송금
- **Escrow**:
  - 조건부 결제 (시간 기반, 조건 기반)
  - 크립토 조건부 결제 (암호화 조건)
  - 대금 에스크로 (제3자 보관)

### 2. 토큰화 기능

- **Issue Token**: 자체 토큰 발행 (예: 스테이블코인)
- **NFT**:
  - NFT 발행 및 거래
  - NFT 판매 오퍼 생성/수락
- **Trust Line**: 토큰 신뢰선 설정

### 3. 탈중앙화 거래소(DEX) 기능

- **Offer**: 거래 주문 생성/취소
- **Payment Path**: 최적 거래 경로 탐색
- **Auto-Bridging**: 자동 통화 브릿징

### 4. 계정 관리

- **Multi-signing**: 다중 서명 계정 설정
- **Regular Key**: 보조 키 설정
- **Account Delete**: 계정 삭제 및 XRP 회수

### 5. 기타 고급 기능

- **Hooks**: 스마트 컨트랙트 유사 기능 (베타)
- **AMM**: 자동화된 마켓 메이커 (베타)
- **Checks**: 수표 발행 및 현금화
- **Payment Channel**: 확장성 있는 소액 결제 채널

## XRPL 개발 리소스

### 1. 해커톤용 스켈레톤 프로젝트

- [2025 Hackaton Skeleton Project](/2025-hackaton-skeleton)
  - Next.js
  - Web3Auth
  - 지갑 연결 및 잔액 조회 기능 Component
  - XRPL 트랜잭션 전송 기능

### 2. 지갑 연결

- Girin Wallet(Android, iOS)
  - [Girin WalletConnect Example](https://github.com/girin-app/girin-walletconnect-example)

### 3. 개발 도구 및 API

- XRPL JavaScript 라이브러리 예제:
  - [HTTP API](http.js)
  - [WebSocket API](websocket.js)

### 4. 유용한 리소스

- [XRPL Ledger Explorer](https://livenet.xrpl.org/)
- [XRPL Meta](https://xrplmeta.org/) - XRPL 자산 메타데이터 정보(토큰 가격 관련 정보)

## 참고 자료

- [XRPL 공식 문서](https://xrpl.org/docs.html)
- [XRPL 개발자 포럼](https://dev.to/ripplexdev)
- [XRPL 깃허브](https://github.com/XRPLF)
- [XRPL Dev Resource](https://linktr.ee/rippledevrel)

## 기타 리소스 모음

- [2024 XRPL Hackaton](https://github.com/XRPL-Hackathon-Seoul-2024)
- [XRPL Ledger MCP](https://github.com/strangelove-ventures/web3-mcp)

