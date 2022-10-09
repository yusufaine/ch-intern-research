# Decoding PubKey and Signature (from Keplr)

This repo is mainly based of [Cosmos' tutorial on Keplr integration](https://tutorials.cosmos.network/tutorials/6-cosmjs/4-with-keplr.html) with the intention of decoding:

1. Pubkey -> Wallet address, and
2. Signature -> Pubkey.

The current assumption is that the wallet address' prefix is known.

Files:

1. `component/FaucetSender.tsx` -- rough FE to generate a Keplr signature (click "Send to Faucet", accept message, check console)
2. `component/decoder.ts` -- includes the 2 decoding functions described above with some tests.

Assumptions:
1. Chain prefix is known (cosmos, juno, osmo, etc)
2. `PubKey` is only encrypted with `PubKeySecp256k1`
