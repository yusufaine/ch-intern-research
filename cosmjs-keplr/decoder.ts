import { bech32 } from "bech32";
import { createHash } from "crypto";

export type StdSignature = {
  pub_key: {
    type: string;
    value: string; // base64
  };
  signature: string;
};

/**
 * Converts a PubKey to a chain-prefixed human-readable wallet address
 *
 * @param   {Uint8Array}  publicKey  Base64 encoded Buffer
 * @param   {string}      prefix     Determines chain prefix
 *
 * @return  {string}                 Chain-prefixed human-readable wallet address
 */
export function pubkeyToAddress(publicKey: Uint8Array, prefix: string): string {
  const pkToSha256 = createHash("sha256").update(publicKey).digest();
  const sha256ToRipemd160 = createHash("ripemd160").update(pkToSha256).digest();
  const words = bech32.toWords(sha256ToRipemd160);

  return bech32.encode(prefix, words);
}

/**
 * Converts a Keplr (ADR-36) signature to a Base64-encoded PubKey (UInt8Array)
 *
 * @param   {StdSignature}  signature  ADR-36 Signature
 *
 * @return  {Uint8Array}               Base64-encoded PubKey
 * @throws  Will throw an error if PubKey is not encrypted using "tendermint/PubKeySecp256k1"
 */
export function signatureToPubkey(signature: StdSignature): Uint8Array {
  if (signature.pub_key.type === "tendermint/PubKeySecp256k1") {
    return Buffer.from(signature.pub_key.value, "base64");
  } else {
    throw "Unsupported type";
  }
}
