import {
  AccountData,
  OfflineSigner,
  SigningCosmosClient,
} from "@cosmjs/launchpad";
import { Coin, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { ChainInfo, Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { ChangeEvent, Component, MouseEvent } from "react";

import styles from "../styles/Home.module.css";

declare global {
  interface Window extends KeplrWindow {}
}

interface FaucetSenderState {
  denom: string;
  faucetBalance: string;
  myAddress: string;
  myBalance: string;
  toSend: string;
}

export interface FaucetSenderProps {
  faucetAddress: string;
  rpcUrl: string;
}

export class FaucetSender extends Component<
  FaucetSenderProps,
  FaucetSenderState
> {
  // Set the initial state
  constructor(props: FaucetSenderProps) {
    super(props);
    this.state = {
      denom: "Loading...",
      faucetBalance: "Loading...",
      myAddress: "Click first",
      myBalance: "Click first",
      toSend: "0",
    };
    setTimeout(this.init, 500);
  }

  init = async () => {
    if (!window.keplr) {
      alert("Please install keplr extension");
    } else {
      const chainId = "osmosis-1";

      // Enabling before using the Keplr is recommended.
      // This method will ask the user whether to allow access if they haven't visited this website.
      // Also, it will request that the user unlock the wallet if the wallet is locked.
      await window.keplr.enable(chainId);

      const offlineSigner = window.keplr.getOfflineSigner(chainId);

      // You can get the address/public keys by `getAccounts` method.
      // It can return the array of address/public key.
      // But, currently, Keplr extension manages only one address/public key pair.
      // XXX: This line is needed to set the sender address for SigningCosmosClient.
      const accounts = await offlineSigner.getAccounts();

      // Initialize the gaia api with the offline signer that is injected by Keplr extension.
      const cosmJS = new SigningCosmosClient(
        "https://lcd-cosmoshub.keplr.app",
        accounts[0].address,
        offlineSigner
      );
    }
  };

  // Get the faucet's balance
  updateFaucetBalance = async (client: StargateClient) => {
    const balances: readonly Coin[] = await client.getAllBalances(
      this.props.faucetAddress
    );
    const first: Coin = balances[0];
    this.setState({
      denom: first.denom,
      faucetBalance: first.amount,
    });
  };

  // Store changed token amount to state
  onToSendChanged = (e: ChangeEvent<HTMLInputElement>) =>
    this.setState({
      toSend: e.currentTarget.value,
    });

  // When the user clicks the "send to faucet button"
  onSendClicked = async (e: MouseEvent<HTMLButtonElement>) => {
    const { keplr } = window;
    if (!keplr) {
      alert("no keplr");
    }

    const chainId = "osmosis-1";
    const key = await keplr!.getKey(chainId);
    const signer: string = key.bech32Address;
    let data: string | Uint8Array = "hi";

    const signature = await keplr!.signArbitrary(chainId, signer, data);

    console.log(signature);
    // TODO: decode signature, get chain ID, determine prefix for wallet addr
    // {
    //   "pub_key": {
    //       "type": "tendermint/PubKeySecp256k1",
    //       "value": "A/oHBueaRtsLDC/bUEaoCr+/CDeLyt5iy6XV6CGx9GOH"
    //   },
    //   "signature": "BwZf9J+A8IwN1aCJvj20koJHQHv/Azd0z9uUpXtZIZYLEh0ZYRbkRskQOMH1l1KXWQEs4LfuRxwb8EICKsZj9Q=="
    // }
  };

  // The render function that draws the component at init and at state change
  render() {
    const { denom, faucetBalance, myAddress, myBalance, toSend } = this.state;
    const { faucetAddress } = this.props;
    console.log(toSend);
    // The web page structure itself
    return (
      <div>
        <fieldset className={styles.card}>
          <legend>Faucet</legend>
          <p>Address: {faucetAddress}</p>
          <p>Balance: {faucetBalance}</p>
        </fieldset>
        <fieldset className={styles.card}>
          <legend>You</legend>
          <p>Address: {myAddress}</p>
          <p>Balance: {myBalance}</p>
        </fieldset>
        <fieldset className={styles.card}>
          <legend>Send</legend>
          <p>To faucet:</p>
          <input
            value={toSend}
            type="number"
            onChange={this.onToSendChanged}
          />{" "}
          {denom}
          <button onClick={this.onSendClicked}>Send to faucet</button>
        </fieldset>
      </div>
    );
  }
}
