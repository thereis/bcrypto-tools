import React from "react";
import Head from "next/head";

/**
 * Components
 */
import PreviewMint from "./screens/PreviewMint";
import Body from "../src/shared/components/Body";
import GlobalStats from "../src/shared/components/GlobalStats";
import Skeleton from "../src/shared/components/Skeleton";

const Preview: React.FC = () => {
  return (
    <Body>
      <Head>
        <title>BHERO: Preview Hero by Seed</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Skeleton className="mt-6 sm:flex gap-4 xs:flex-col sm:flex-row">
        <PreviewMint />
        <GlobalStats />
      </Skeleton>
    </Body>
  );
};

export default Preview;
