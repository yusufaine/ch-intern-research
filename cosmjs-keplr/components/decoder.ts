import { bech32 } from "bech32";
import { createHash } from "crypto";

export type StdSignature = {
  pub_key: {
    type: string;
    value: string; // base64
  };
  signature: string;
};

export function pubkeyToAddress(publicKey: Uint8Array, prefix: string) {
  const pkToSha256 = createHash("sha256").update(publicKey).digest();
  const sha256ToRipemd160 = createHash("ripemd160").update(pkToSha256).digest();
  const words = bech32.toWords(sha256ToRipemd160);

  return bech32.encode(prefix, words);
}

export function signatureToPubkey(signature: StdSignature) {
  if (signature.pub_key.type === "tendermint/PubKeySecp256k1") {
    return Buffer.from(signature.pub_key.value, "base64");
  } else {
    throw "Unsupported type";
  }
}
