import { Secp256k1HdWallet } from "@cosmjs/launchpad"; // to generate wallet for testing
import { pubkeyToAddress, signatureToPubkey, StdSignature } from "./decoder";

describe("test pubkeyToAddress", () => {
  describe("from mnemonic", () => {
    test("cosmos wallet", async () => {
      // Cosmos -- cosmos1drn5vcpnar8ake238p2k463me8gtxgwymh2g0w
      const cosmosWallet = await Secp256k1HdWallet.fromMnemonic(
        "fan style orphan verb glow cancel people brother sea void rebel claim"
      );
      const cosmosAccounts = await cosmosWallet.getAccounts();

      const derivedAddr = pubkeyToAddress(cosmosAccounts[0].pubkey, "cosmos");

      expect(cosmosAccounts[0].address === derivedAddr).toBe(true);
    });
    test("juno wallet", async () => {
      // Juno address -- juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y
      const junoWallet = await Secp256k1HdWallet.fromMnemonic(
        "clip hire initial neck maid actor venue client foam budget lock catalog sweet steak waste crater broccoli pipe steak sister coyote moment obvious choose",
        undefined,
        "juno"
      );
      const junoAccounts = await junoWallet.getAccounts();

      const derivedAddr = pubkeyToAddress(junoAccounts[0].pubkey, "juno");

      expect(junoAccounts[0].address === derivedAddr).toBe(true);
    });
  });

  describe("from Coinhall wallet connection", () => {
    test("extracted terra-station wallet info", () => {
      const data = {
        bytes:
          "V0FSTklORzogc2lnbiB0aGlzIG1lc3NhZ2UgT05MWSBvbiBjb2luaGFsbC5vcmch",
        publicKey: "A0/W4gQhdFR9Blz5AKwEJgvyH1Qx6koYRWqx0YR7/9RX",
        signature:
          "/GCT4ySrKuDGm9bdYRf9dNxny6KR6Lqj6JVFhVFs6517Yq2J7Ozj8Btt3UScB/fa2caDk+gu3zGuom+0+UZwTA==",
        walletAddr: "terra1ex9g6jglf80r5tum36m84dqffrwx2fd22gnqfs",
      };
      const derived = pubkeyToAddress(
        Buffer.from(data.publicKey, "base64"),
        "terra"
      );

      expect(data.walletAddr === derived).toBe(true);
    });
  });
});

describe("test signatureToPubKey", () => {
  describe("from localhost wallet connection", () => {
    test("extracted Keplr signature", () => {
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

      expect(originalAddr === PubKeyToAddr).toBe(true);
    });
  });
});
