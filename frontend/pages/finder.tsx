import Head from "next/head";
import React from "react";

/**
 * Components
 */
import HeroFinder from "./screens/HeroFinder/HeroFinder";
import Body from "../src/shared/components/Body";
import Skeleton from "../src/shared/components/Skeleton";

const Finder: React.FC = () => {
  return (
    <Body>
      <Head>
        <title>BHERO: Find Hero by ID or Wallet Address!</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Skeleton>
        <HeroFinder />
      </Skeleton>
    </Body>
  );
};

export default Finder;
