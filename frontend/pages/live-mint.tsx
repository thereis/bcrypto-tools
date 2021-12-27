import Head from "next/head";
import React from "react";
import { startLiveTracking } from "../src/core/live";
import Body from "../src/shared/components/Body";
import Skeleton from "../src/shared/components/Skeleton";

/**
 * Dependencies
 */

const LiveMint: React.FC = () => {
  startLiveTracking();

  return (
    <Body>
      <Head>
        <title>BHERO: Track live mints</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Skeleton className="mt-6 flex gap-4"></Skeleton>
    </Body>
  );
};

export default LiveMint;
