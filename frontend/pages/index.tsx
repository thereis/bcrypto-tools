import Head from "next/head";
import React from "react";
import Body from "./shared/components/Body";

/**
 * Components
 */

import Skeleton from "./shared/components/Skeleton";

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
