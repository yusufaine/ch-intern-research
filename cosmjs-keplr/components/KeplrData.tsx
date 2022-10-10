import { Key, Window as KeplrWindow } from "@keplr-wallet/types";
import { MouseEvent, useState } from "react";
import { StdSignature } from "../decoder";

import styles from "../styles/Home.module.css";

declare global {
  interface Window extends KeplrWindow {}
}

export function KeplrSigner() {
  const [walletInfo, setWalletInfo] = useState<Key>();
  const [keplrSignature, setKeplrSignature] = useState<StdSignature>();

  const onSendClicked = async (e: MouseEvent<HTMLButtonElement>) => {
    const { keplr } = window;
    if (!keplr) {
      alert("no keplr");
    }

    // ! Set values here
    const chainId = "osmosis-1"; // or array of chainsIds
    let data: string | Uint8Array = "random-data";

    const key = await keplr!.getKey(chainId);
    const signer: string = key.bech32Address; // assume self as signer

    const signature = await keplr!.signArbitrary(chainId, signer, data);
    if (!signature) {
      alert("unable to generate signature");
    }

    setWalletInfo(key);
    setKeplrSignature(signature);
  };

  return (
    <div>
      <fieldset className={styles.card}>
        <legend>Keplr Data</legend>
        <fieldset className={styles.card}>
          <legend>Wallet details</legend>
          <span>
            <strong>Name</strong>: <br></br>
            {walletInfo?.name}
          </span>
          <br></br>
          <br></br>
          <span>
            <strong>Address</strong>: <br></br>
            {walletInfo?.bech32Address}
          </span>
          <br></br>
          <br></br>
          <span>
            <strong>Algo</strong>: <br></br>
            {walletInfo?.algo}
          </span>
        </fieldset>
        <fieldset className={styles.card}>
          <legend>PubKey</legend>
          <span>
            <strong>Type</strong>: <br></br> {keplrSignature?.pub_key.type}
          </span>
          <br></br>
          <br></br>
          <span>
            <strong>Value</strong>: <br></br> {keplrSignature?.pub_key.value}
          </span>
        </fieldset>
        <fieldset className={styles.card}>
          <legend>Signature</legend>
          <span>{keplrSignature?.signature}</span>
        </fieldset>
      </fieldset>
      <div className={styles.grid}>
        <button onClick={onSendClicked}>Click me</button>
      </div>
    </div>
  );
}
