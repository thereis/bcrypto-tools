import Head from "next/head";
import React from "react";

/**
 * Components
 */
import PreviewHeroBySeed from "./components/PreviewHeroBySeed";
import Body from "./shared/components/Body";
import Skeleton from "./shared/components/Skeleton";

const PreviewBySeed: React.FC = () => {
  return (
    <Body>
      <Head>
        <title>BHERO: Preview Hero by Seed</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Skeleton>
        <PreviewHeroBySeed />
      </Skeleton>
    </Body>
  );
};

export default PreviewBySeed;
