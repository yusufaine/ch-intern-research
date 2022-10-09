import { Secp256k1HdWallet } from "@cosmjs/launchpad"; // to generate wallet for testing
import { bech32 } from "bech32";
import { createHash } from "crypto";

type StdSignature = {
  pub_key: {
    type: string;
    value: string; // base64
  };
  signature: string;
};

(async () => {
  // Cosmos -- cosmos1drn5vcpnar8ake238p2k463me8gtxgwymh2g0w
  const cosmosWallet = await Secp256k1HdWallet.fromMnemonic(
    "fan style orphan verb glow cancel people brother sea void rebel claim"
  );

  // Juno address -- juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y
  const junoWallet = await Secp256k1HdWallet.fromMnemonic(
    "clip hire initial neck maid actor venue client foam budget lock catalog sweet steak waste crater broccoli pipe steak sister coyote moment obvious choose",
    { prefix: "juno" }
  );

  const cosmosAccounts = await cosmosWallet.getAccounts();

  const junoAccounts = await junoWallet.getAccounts();

  const cosmosAddr = pubkeyToAddress(cosmosAccounts[0].pubkey, "cosmos");
  const junoAddr = pubkeyToAddress(junoAccounts[0].pubkey, "juno");

  console.log({
    derived: cosmosAddr,
    original: cosmosAccounts[0].address,
    isMatching: cosmosAddr === cosmosAccounts[0].address,
  });

  // {
  //   derived: 'cosmos1drn5vcpnar8ake238p2k463me8gtxgwymh2g0w',
  //   original: 'cosmos1drn5vcpnar8ake238p2k463me8gtxgwymh2g0w',
  //   isMatching: true
  // }

  console.log({
    derived: junoAddr,
    original: junoAccounts[0].address,
    isMatching: junoAddr === junoAccounts[0].address,
  });

  // {
  //   derived: 'juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y',
  //   original: 'juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y',
  //   isMatching: true
  // }

  // Data from coinhall terra-station connection

  const data = {
    bytes: "V0FSTklORzogc2lnbiB0aGlzIG1lc3NhZ2UgT05MWSBvbiBjb2luaGFsbC5vcmch",
    publicKey: "A0/W4gQhdFR9Blz5AKwEJgvyH1Qx6koYRWqx0YR7/9RX",
    signature:
      "/GCT4ySrKuDGm9bdYRf9dNxny6KR6Lqj6JVFhVFs6517Yq2J7Ozj8Btt3UScB/fa2caDk+gu3zGuom+0+UZwTA==",
    walletAddr: "terra1ex9g6jglf80r5tum36m84dqffrwx2fd22gnqfs",
  };

  const derived = pubkeyToAddress(
    Buffer.from(data.publicKey, "base64"),
    "terra"
  );

  console.log({
    derived,
    original: data.walletAddr,
    isMatching: derived === data.walletAddr,
  });

  // {
  //   derived: 'terra1ex9g6jglf80r5tum36m84dqffrwx2fd22gnqfs',
  //   original: 'terra1ex9g6jglf80r5tum36m84dqffrwx2fd22gnqfs',
  //   isMatching: true
  // }

  const arbStdSignature: StdSignature = {
    pub_key: {
      type: "tendermint/PubKeySecp256k1",
      value: "A/oHBueaRtsLDC/bUEaoCr+/CDeLyt5iy6XV6CGx9GOH",
    },
    signature:
      "BwZf9J+A8IwN1aCJvj20koJHQHv/Azd0z9uUpXtZIZYLEh0ZYRbkRskQOMH1l1KXWQEs4LfuRxwb8EICKsZj9Q==",
  };

  const originalAddr = "osmo16jvt8389huy8ga20r3jj8qlg6tr46huwjqegj6";
  const sigToPubKey = signatureToPubkey(arbStdSignature);
  const PubKeyToAddr = pubkeyToAddress(sigToPubKey, "osmo");

  console.log({
    derived: PubKeyToAddr,
    original: originalAddr,
    isMatching: PubKeyToAddr === originalAddr,
  });

  // {
  //   derived: 'osmo16jvt8389huy8ga20r3jj8qlg6tr46huwjqegj6',
  //   original: 'osmo16jvt8389huy8ga20r3jj8qlg6tr46huwjqegj6',
  //   isMatching: true
  // }
})();

function pubkeyToAddress(publicKey: Uint8Array, prefix: string) {
  const pkToSha256 = createHash("sha256").update(publicKey).digest();
  const sha256ToRipemd160 = createHash("ripemd160").update(pkToSha256).digest();
  const words = bech32.toWords(sha256ToRipemd160);

  return bech32.encode(prefix, words);
}

function signatureToPubkey(signature: StdSignature) {
  if (signature.pub_key.type === "tendermint/PubKeySecp256k1") {
    return Buffer.from(signature.pub_key.value, "base64");
  } else {
    throw "Unsupported type";
  }
}
