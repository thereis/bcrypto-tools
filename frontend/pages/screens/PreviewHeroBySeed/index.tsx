import React, { useState } from "react";

/**
 * Dependencies
 */

import { decodeToHero } from "../../../src/core/bhero";
import { Hero } from "../../../src/core/models/hero";

/**
 * Components
 */
import Box from "../../../src/shared/components/Box";
import Button from "../../../src/shared/components/Button";
import HeroViewer from "../../../src/shared/components/HeroViewer";
import Input from "../../../src/shared/components/Input";

const PreviewHeroBySeed: React.FC = ({}) => {
  const [seed, setSeed] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const [hero, setHero] = useState<Hero>();

  const _handleSeedOnChange = (value: string) => {
    setSeed(value);
  };

  const _handleDecodeHero = async () => {
    try {
      setIsFetching(true);

      const hero = decodeToHero(seed);

      setHero(hero);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Box className="mt-6">
      <Input
        id="seed"
        primary="Seed"
        value={seed}
        onChange={_handleSeedOnChange}
        placeholder="Hero seed"
        disabled={isFetching}
      />

      <Button
        className="mt-6"
        onClick={_handleDecodeHero}
        disabled={!seed || isFetching}
      >
        Preview
      </Button>

      {hero && <HeroViewer heroes={[hero]} />}
    </Box>
  );
};

export default PreviewHeroBySeed;
