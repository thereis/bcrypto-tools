import React from "react";
import Head from "next/head";

/**
 * Components
 */
import PreviewMint from "./components/PreviewMint";
import Body from "./shared/components/Body";
import GlobalStats from "./shared/components/GlobalStats";
import Skeleton from "./shared/components/Skeleton";

const Preview: React.FC = () => {
  return (
    <Body>
      <Head>
        <title>BHERO: Preview Hero by Seed</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Skeleton className="flex">
        <PreviewMint />
        <GlobalStats />
      </Skeleton>
    </Body>
  );
};

export default Preview;
