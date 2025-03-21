"use client";
import { Button } from "@/components/ui/button";
import React, { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { accountState } from "@/atom/account";
import { xrpToDrops } from "xrpl";
import { providerState } from "@/atom/provider";
export default function Home() {
  const account = useRecoilValue(accountState);
  const provider = useRecoilValue(providerState);

  const onSendTransaction = useCallback(async () => {
    if (!account || !provider) {
      alert("account loading..");
      return;
    }
    const tx = {
      TransactionType: "Payment",
      Account: account,
      Amount: xrpToDrops(1),
      Destination: "rPt8Mnsj5AdPa2eYzwbwfTamReL22jULmd",
    };
    const txSign = await provider?.request({
      method: "xrpl_submitTransaction",
      params: {
        transaction: tx,
      },
    });
    console.log(txSign);
    alert(JSON.stringify(txSign));
    window.location.reload();
  }, [account, provider]);

  return (
    <main className="flex min-h-screen flex-col items-center py-10">
      <div className="flex flex-wrap gap-10 w-3/5">
        <Button onClick={onSendTransaction}>Send</Button>
      </div>
    </main>
  );
}
