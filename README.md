# XRP Ledger API 통신 예제

이 저장소는 XRP Ledger(XRPL)와 통신하는 두 가지 주요 방법인 HTTP API와 WebSocket API를 사용하는 예제를 포함하고 있습니다. 각 방법별로 계정 생성, 잔액 조회, 트랜잭션 생성 및 제출 등의 기본적인 작업을 수행하는 방법을 보여줍니다.

## HTTP API 요청 (CURL 사용)

HTTP JSON-RPC를 사용하여 XRP Ledger와 통신하는 방법입니다.

### 1. 계정 생성 (Faucet API)

테스트넷에서 테스트용 계정을 생성하고 초기 XRP를 받습니다:

```bash
curl -X POST https://faucet.altnet.rippletest.net/accounts
```

응답 예시:
```json
{
  "account": {
    "xAddress": "XVG6r3p3wHfRkhqZbpEf375A8PGifeGATrqvHbE8hFTR3MP",
    "address": "rE7n5PFBejTkUtkzjqVvg1iyUMWus5FQC1",
    "classicAddress": "rE7n5PFBejTkUtkzjqVvg1iyUMWus5FQC1"
  },
  "amount": 100,
  "transactionHash": "A7FCEBDE2AC0EC471C23F471C8AB32E06AC9143337EEDD42450288D987AEF964",
  "seed": "sEd7eTxRxBgamWjrz9Kng4KePTVct6N"
}
```

### 2. 계정 잔액 조회

특정 계정의 정보와 잔액을 조회합니다:

```bash
curl -X POST https://xrp-testnet.g.allthatnode.com/full/json_rpc/YOUR_API_KEY \
     -H "Content-Type: application/json" \
     -d '{
          "method": "account_info",
          "params": [{
            "account": "rE7n5PFBejTkUtkzjqVvg1iyUMWus5FQC1", 
            "ledger_index": "current"
          }]
        }'
```

주요 파라미터:
- `account`: 조회할 계정 주소
- `ledger_index`: 원장 상태 (`current`, `closed`, `validated` 또는 특정 인덱스)

### 3. 트랜잭션 생성 및 서명

송금 트랜잭션을 생성하고 서명합니다:

```bash
curl -X POST https://xrp-testnet.g.allthatnode.com/full/json_rpc/YOUR_API_KEY \
     -H "Content-Type: application/json" \
     -d '{
         "method": "sign",
         "params": [{
           "secret": "sEd7eTxRxBgamWjrz9Kng4KePTVct6N",
           "tx_json": {
             "TransactionType": "Payment",
             "Account": "rE7n5PFBejTkUtkzjqVvg1iyUMWus5FQC1",
             "Destination": "rGfWw3jxQLr4GMjsTNQepmAkrMUwjJ2S4A",
             "Amount": "5000000", 
             "Fee": "12",
             "Sequence": 12345
           }
         }]
       }'
```

주요 필드:
- `TransactionType`: 트랜잭션 유형 (Payment)
- `Account`: 송신자 주소
- `Destination`: 수신자 주소
- `Amount`: 송금액 (드롭 단위, 1 XRP = 1,000,000 드롭)
- `Fee`: 수수료 (드롭 단위)
- `Sequence`: 계정의 현재 시퀀스 번호 (account_info에서 확인 가능)

### 4. 서명된 트랜잭션 제출

생성된 서명을 네트워크에 제출합니다:

```bash
curl -X POST https://xrp-testnet.g.allthatnode.com/full/json_rpc/YOUR_API_KEY \
     -H "Content-Type: application/json" \
     -d '{
          "method": "submit",
          "params": [{
            "tx_blob": "서명된_트랜잭션_문자열",
            "ledger_index": "validated"
          }]
        }'
```

### 5. 트랜잭션 결과 조회

트랜잭션 해시를 사용하여 결과를 확인합니다:

```bash
curl -X POST https://xrp-testnet.g.allthatnode.com/full/json_rpc/YOUR_API_KEY \
     -H "Content-Type: application/json" \
     -d '{
          "method": "tx",
          "params": [{
            "transaction": "트랜잭션_해시",
            "binary": false
          }]
        }'
```

## WebSocket API 요청 (wscat 사용)

WebSocket을 통해 XRP Ledger와 실시간으로 통신하는 방법입니다.

### 1. WebSocket 연결

먼저 wscat을 설치하고 XRP Ledger 테스트넷에 연결합니다:

```bash
npm install -g wscat
wscat -c wss://xrp-testnet.g.allthatnode.com/full/json_rpc/YOUR_API_KEY
```

### 2. 현재 원장 상태 확인

```json
{ "command": "ledger_current" }
```

### 3. 계정 정보 조회

```json
{ "command": "account_info", "account": "rE7n5PFBejTkUtkzjqVvg1iyUMWus5FQC1", "ledger_index": "validated" }
```

### 4. 트랜잭션 제출 (Payment 송금)

```json
{ "command": "submit", "tx_json": { "TransactionType": "Payment", "Account": "rE7n5PFBejTkUtkzjqVvg1iyUMWus5FQC1", "Destination": "rGfWw3jxQLr4GMjsTNQepmAkrMUwjJ2S4A", "Amount": "5000000", "Fee": "12", "Sequence": 12345 }, "secret": "sEd7eTxRxBgamWjrz9Kng4KePTVct6N" }
```

### 5. 트랜잭션 결과 조회

```json
{ "command": "tx", "transaction": "트랜잭션_해시", "binary": false }
```

### 6. 서버 정보 조회

```json
{ "command": "server_info" }
```

### 7. 계정 트랜잭션 히스토리 조회

```json
{ "command": "account_tx", "account": "rE7n5PFBejTkUtkzjqVvg1iyUMWus5FQC1", "ledger_index_min": -1, "ledger_index_max": -1 }
```

## 주요 참고사항

1. **주소 형식**:
   - Classic 주소: r로 시작하는 전통적인 주소 형식
   - X 주소: X로 시작하며 destination tag가 포함된 새로운 형식

2. **값 단위**:
   - XRP의 최소 단위는 '드롭'(drop)
   - 1 XRP = 1,000,000 드롭

3. **보안 주의사항**:
   - 프로덕션 환경에서는 secret 키를 직접 API 요청에 포함시키지 않는 것이 좋습니다
   - 로컬에서 트랜잭션 서명 후 서명된 바이너리만 전송하는 방식을 권장합니다

4. **테스트넷 vs 메인넷**:
   - 테스트넷: 개발 및 테스트 목적으로 사용 (이 예제에서 사용)
   - 메인넷: 실제 가치를 지닌 XRP가 거래되는 프로덕션 네트워크
