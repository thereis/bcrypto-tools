import React from "react";

/**
 * Components
 */
import Head from "next/head";
import Skeleton from "../src/shared/components/Skeleton";
import Body from "../src/shared/components/Body";

export default function Home() {
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
