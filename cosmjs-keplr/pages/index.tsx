import type { NextPage } from "next";
// import { FaucetSender } from "../components/FaucetSender";
import { KeplrSigner } from "../components/KeplrData";

const Home: NextPage = () => {
  return <KeplrSigner />;
};

export default Home;
