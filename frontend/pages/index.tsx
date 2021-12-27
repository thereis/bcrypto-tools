import React from "react";

/**
 * Components
 */
import Head from "next/head";
import Skeleton from "../src/shared/components/Skeleton";
import Body from "../src/shared/components/Body";
import { Web3ReactProvider } from "@web3-react/core";
import { MetaMaskProvider } from "../src/shared/hooks/use-metamask";

import Web3 from "web3";

function getLibrary(provider: any) {
  return new Web3(provider);
}

function HomeApp() {
  return (
    <Body>
      <Head>
        <title>BHERO: Welcome!</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Skeleton />
    </Body>
  );
}

export default function Home() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <HomeApp />
      </MetaMaskProvider>
    </Web3ReactProvider>
  );
}
