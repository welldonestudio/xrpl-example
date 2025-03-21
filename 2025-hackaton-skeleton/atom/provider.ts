import { atom } from "recoil";
import { IProvider } from "@web3auth/base";
export const providerState = atom<IProvider | null>({
  key: "provider",
  default: null,
});
