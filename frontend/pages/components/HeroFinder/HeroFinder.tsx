import React, { useState } from "react";

/**
 * Dependencies
 */
import { decodeToHeroes, getAccountNFTS } from "../../../core/bhero";
import { Hero } from "../../../core/models/hero";

/**
 * Components
 */
import AddressFinder from "../../shared/components/AddressFinder/AddressFinder";
import Alert from "../../shared/components/Alert";
import Box from "../../shared/components/Box";
import Button from "../../shared/components/Button";
import HeroViewer from "../../shared/components/HeroViewer";
import Input from "../../shared/components/Input";

const HeroFinder: React.FC = () => {
  const [address, setAddress] = useState<string>("");

  const [isFetching, setIsFetching] = useState(false);
  const [heroes, setHeroes] = useState<Hero[] | undefined>();
  const [error, setError] = useState<string>("");

  const _handleAccountChange = (event: React.FormEvent<HTMLInputElement>) => {
    setAddress(event.currentTarget.value);
  };

  const _handleFetchNFTS = async (e: React.FormEvent<HTMLButtonElement>) => {
    try {
      setHeroes(undefined);
      setIsFetching(true);

      const nfts = await getAccountNFTS(address);
      const heroes = decodeToHeroes(nfts);

      setHeroes(heroes);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsFetching(false);
    }
  };

  const disabled = !address || isFetching;

  return (
    <>
      <AddressFinder className="mt-6" onAddressFound={setAddress} />

      <Box className="mt-10">
        {error && <Alert type="error" message={error} />}

        <Input
          id={"address"}
          label="Get account NFTs"
          value={address}
          onChange={_handleAccountChange}
          placeholder="0x..."
          disabled={isFetching}
        />

        <Button onClick={_handleFetchNFTS} disabled={disabled}>
          Fetch account NFTs
        </Button>

        {heroes && <HeroViewer heroes={heroes} />}
      </Box>
    </>
  );
};

export default HeroFinder;
