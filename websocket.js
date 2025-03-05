const xrpl = require("xrpl"); // XRPL SDK (XRP Ledger 상호작용을 위한 라이브러리)

/**
 * WebSocket을 사용한 XRP Ledger 트랜잭션 수행
 * - XRPL WebSocket 서버에 연결
 * - 계정 생성 및 초기 자금 확보 (Faucet 사용)
 * - 잔액 조회 (account_info 요청)
 * - Payment 트랜잭션 생성 및 송금
 * - 송금 후 잔액 재확인
 */
const websocket = async () => {
  // XRPL Testnet 엔드포인트, All That Node(https://allthatnode.com/)에서 제공
  const WEBSOCKET_URL = `wss://xrp-testnet.g.allthatnode.com/full/json_rpc/${process.env.MY_API_KEY}`;

  // 1. XRPL 테스트넷 WebSocket 서버에 연결
  const client = new xrpl.Client(WEBSOCKET_URL);
  await client.connect(); // WebSocket 연결 시작

  // 2. Faucet API를 호출하여 테스트 계정 생성 및 초기 자금 확보
  // `fundWallet()` 함수는 새로운 지갑을 만들고 XRP를 지급함.
  const { wallet: senderWallet, balance: senderBalance } = await client.fundWallet(); // 송신자 계정 생성
  const { wallet: receiverWallet } = await client.fundWallet(); // 수신자 계정 생성

  const senderAddr = senderWallet.address; // 송신자 지갑 주소
  const receiverAddr = receiverWallet.address; // 수신자 지갑 주소

  console.log("Sender wallet:", senderWallet);
  console.log("Receiver wallet:", receiverWallet);

  // 3. 송신자의 잔액 조회 (account_info 요청)
  const acctInfoReq = {
    command: "account_info",
    account: senderAddr, // 조회할 계정 주소
    ledger_index: "validated", // 최근 검증된 원장 기준으로 조회
  };

  const infoResponse = await client.request(acctInfoReq);
  const balanceDrops = infoResponse.result.account_data.Balance; // 잔액 조회 (단위: drops)
  console.log("Sender balance (XRP):", xrpl.dropsToXrp(balanceDrops)); // drops 단위를 XRP로 변환하여 출력

  // 4. Payment 트랜잭션 생성 및 전송 (5 XRP 송금)
  const transaction = {
    TransactionType: "Payment", // 송금 트랜잭션 타입
    Account: senderAddr, // 송신자 주소
    Amount: xrpl.xrpToDrops("5"), // 송금할 금액 (5 XRP → drops로 변환)
    Destination: receiverAddr, // 수신자 주소
  };

  // 트랜잭션 실행 및 결과 확인
  const txResult = await client.submitAndWait(transaction, { wallet: senderWallet });

  // 결과 확인 (TransactionResult 코드 추출)
  const resultMeta = txResult.result.meta;
  const outcome = typeof resultMeta === "string" ? resultMeta : resultMeta.TransactionResult; // 성공 여부 확인
  console.log("Transaction result:", outcome); // 트랜잭션 결과 출력
  console.log("Transaction hash:", txResult.result.hash); // 트랜잭션 고유 해시 출력

  // 송신자 및 수신자의 새로운 잔액 확인
  const [infoResponseSender, infoResponseReceiver] = await Promise.all(
    [senderAddr, receiverAddr].map((addr) =>
      client.request({
        command: "account_info",
        account: addr,
        ledger_index: "validated",
      })
    )
  );
  console.log("New sender balance (XRP):", xrpl.dropsToXrp(infoResponseSender.result.account_data.Balance));
  console.log("New Receiver balance (XRP):", xrpl.dropsToXrp(infoResponseReceiver.result.account_data.Balance));

  await client.disconnect(); // WebSocket 연결 종료
  return;
};

module.exports = websocket;
