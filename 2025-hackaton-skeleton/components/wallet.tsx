"use client";

import { CHAIN_NAMESPACES, IProvider, UserInfo } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { XrplPrivateKeyProvider } from "@web3auth/xrpl-provider";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRecoilState } from "recoil";
import { accountState } from "@/atom/account";
import { balanceState } from "@/atom/balance";
import { ellipsisAddress } from "@/utils/strings";
import { providerState } from "@/atom/provider";

export const Wallet: React.FC = () => {
  const [provider, setProvider] = useRecoilState<IProvider | null>(
    providerState
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useRecoilState(accountState);
  const [balance, setBalance] = useRecoilState(balanceState);
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "";

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.XRPL,
    chainId: "0x2",
    rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET || "",
    wsTarget: process.env.NEXT_PUBLIC_WS_TARGET || "",
    ticker: "XRP",
    tickerName: "XRPL",
    displayName: "xrpl testnet",
    blockExplorerUrl: "https://testnet.xrpl.org",
    clientId: "",
  };

  const privateKeyProvider = new XrplPrivateKeyProvider({
    config: { chainConfig },
  });
  const web3auth = new Web3Auth({
    clientId,
    privateKeyProvider,
    web3AuthNetwork: "sapphire_devnet",
  });

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    await web3auth.initModal();
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const logout = async () => {
    await web3auth.initModal();
    setProvider(null);
    setLoggedIn(false);
    await web3auth.logout();
  };

  useEffect(() => {
    const loadAccount = async () => {
      const accounts: any = await provider?.request({
        method: "xrpl_getAccounts",
      });

      if (!accounts) {
        return;
      }

      try {
        const accountInfo: any = await provider?.request({
          method: "account_info",
          params: [
            {
              account: accounts[0],
              strict: true,
              ledger_index: "current",
              queue: true,
            },
          ],
        });
        const account = accounts[0];
        setAccount(account);
        const balance = accountInfo?.account_data?.Balance;
        if (balance) {
          const decimalBalance = (BigInt(balance) / BigInt(1000000)).toString();
          setBalance(decimalBalance);
        } else {
          setBalance("0");
        }
      } catch {
        setBalance("0");
      }
    };
    if (loggedIn) {
      loadAccount();
    }
  }, [loggedIn]);

  return (
    <>
      {loggedIn && account ? (
        <Button
          onClick={() => {
            logout();
          }}
        >
          {ellipsisAddress(account)} ( {balance} XRP )
        </Button>
      ) : (
        <Button
          onClick={() => {
            login();
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};
