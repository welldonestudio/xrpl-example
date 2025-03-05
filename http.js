const xrpl = require("xrpl"); // XRPL SDK (XRP Ledger 상호작용을 위한 라이브러리)
const fetch = require("node-fetch"); // HTTP 요청을 위한 라이브러리

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * HTTP JSON-RPC를 사용한 XRP Ledger 트랜잭션 수행
 * - HTTP 요청을 사용하여 블록체인과 상호작용
 * - Faucet API를 통해 계정 생성 및 초기 자금 확보
 * - 잔액 조회 (account_info 요청)
 * - Payment 트랜잭션 생성 및 전송
 * - 송금 후 잔액 재확인
 */
const http = async () => {
  // XRPL Testnet 엔드포인트, All That Node(https://allthatnode.com/)에서 제공
  const RPC_URL = `https://xrp-testnet.g.allthatnode.com/full/json_rpc/${process.env.MY_API_KEY}`;
  const FAUCET_URL = "https://faucet.altnet.rippletest.net/accounts";

  // Faucet API 호출하여 테스트 계정 2개 생성 (송신자, 수신자)
  const [senderWalletFetched, receiverWalletFetched] = await Promise.all(
    Array.from({ length: 2 }).map(() => fetch(FAUCET_URL, { method: "POST" }))
  );

  const [senderWallet, receiverWallet] = await Promise.all(
    [senderWalletFetched, receiverWalletFetched].map((res) => res.json())
  );

  console.log("Sender Wallet:", senderWallet);
  console.log("Receiver Wallet:", receiverWallet);

  await sleep(7000);

  // 특정 계정 정보를 조회하는 JSON-RPC 요청 객체 생성
  const makeAccountReq = (wallet) => ({
    method: "account_info",
    params: [
      {
        account: wallet.account.address,
        ledger_index: "validated",
      },
    ],
  });

  const [senderAccountJson, receiverAccountJson] = await Promise.all(
    [senderWallet, receiverWallet].map((wallet) =>
      fetch(RPC_URL, { method: "POST", body: JSON.stringify(makeAccountReq(wallet)) })
    )
  );

  const [senderAccount, receiverAccount] = await Promise.all(
    [senderAccountJson, receiverAccountJson].map((res) => res.json())
  );

  console.log("Initial sender balance (XRP):", xrpl.dropsToXrp(senderAccount.result.account_data.Balance));
  console.log("Initial receiver balance (XRP):", xrpl.dropsToXrp(receiverAccount.result.account_data.Balance));

  // Payment 트랜잭션을 생성하여 전송 (5 XRP 송금)
  const paymentTx = {
    TransactionType: "Payment",
    Account: senderWallet.account.address, // 송신자 주소
    Amount: xrpl.xrpToDrops("5"), // 송금할 금액 (5 XRP)
    Destination: receiverWallet.account.address, // 수신자 주소
    // 추가로 필요한 필드
    Fee: xrpl.xrpToDrops("0.000012"), // 트랜잭션 수수료
    Sequence: senderAccount.result.account_data.Sequence, // 계정 시퀀스 번호
    LastLedgerSequence: senderAccount.result.ledger_index + 20, // 타임아웃 설정
  };

  // 트랜잭션을 서명하기 위한 방법
  const wallet = xrpl.Wallet.fromSeed(senderWallet.seed); // 올바른 시드 위치 사용
  const signedTx = wallet.sign(paymentTx); // 트랜잭션 서명

  // 서명된 트랜잭션을 제출
  const result = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: "submit",
      params: [
        {
          tx_blob: signedTx.tx_blob,
        },
      ],
    }),
  });

  const submitResult = await result.json();
  console.log("Transaction result:", submitResult.result.engine_result); // 트랜잭션 실행 결과 출력
  console.log("Transaction hash:", submitResult.result.tx_json.hash); // 트랜잭션 고유 해시 출력

  await sleep(7000);

  // 송신자와 수신자의 새로운 잔액 확인
  const [newSenderAccountJson, newReceiverAccountJson] = await Promise.all(
    [senderWallet, receiverWallet].map((account) =>
      fetch(RPC_URL, { method: "POST", body: JSON.stringify(makeAccountReq(account)) })
    )
  );

  const [newSenderAccount, newReceiverAccount] = await Promise.all(
    [newSenderAccountJson, newReceiverAccountJson].map((res) => res.json())
  );

  console.log("New sender balance (XRP):", xrpl.dropsToXrp(newSenderAccount.result.account_data.Balance));
  console.log("New receiver balance (XRP):", xrpl.dropsToXrp(newReceiverAccount.result.account_data.Balance));
};

module.exports = http;
